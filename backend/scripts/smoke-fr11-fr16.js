const BASE = process.env.BASE_URL || "http://localhost:5005";
const mongoose = require("mongoose");
const PendingUser = require("../src/models/PendingUser");

async function req(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

function expectStatus(response, expected, label) {
  if (response.status !== expected) {
    throw new Error(`${label} expected ${expected}, got ${response.status}: ${JSON.stringify(response.json)}`);
  }
}

async function registerOrLogin({ role, email, password, firstName, lastName }) {
  const register = await req("/api/auth/register", {
    method: "POST",
    body: { role, email, password, firstName, lastName },
  });

  if (![201, 409].includes(register.status)) {
    throw new Error(`Register failed for ${email}: ${register.status} ${JSON.stringify(register.json)}`);
  }

  // Students/admins may require email verification in this codebase.
  if (register.status === 201 && register.json?.data?.verificationRequired) {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.DATABASE_URL);
    }
    const pending = await PendingUser.findOne({ email }).lean();
    if (!pending?.verificationCode) {
      throw new Error(`Pending user verification code not found for ${email}`);
    }
    const verify = await req("/api/auth/verify-email", {
      method: "POST",
      body: { email, code: pending.verificationCode },
    });
    expectStatus(verify, 200, `Verify email ${email}`);
  }

  const login = await req("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  expectStatus(login, 200, `Login ${email}`);
  return login.json.data;
}

async function main() {
  const ts = Date.now();
  const password = "PassWord1";

  const student = await registerOrLogin({
    role: "student",
    email: `student.${ts}@example.com`,
    password,
    firstName: "Stud",
    lastName: "User",
  });
  const teacher = await registerOrLogin({
    role: "teacher",
    email: `teacher.${ts}@example.com`,
    password,
    firstName: "Teach",
    lastName: "User",
  });
  const admin = await registerOrLogin({
    role: "admin",
    email: `admin.${ts}@example.com`,
    password,
    firstName: "Admin",
    lastName: "User",
  });

  // FR-12: search topics by title
  const topicSearch = await req("/api/content/topics/search?q=math");
  expectStatus(topicSearch, 200, "Topic search");

  // Choose existing topic for FR-16 if available
  const firstTopic = Array.isArray(topicSearch.json) ? topicSearch.json[0] : null;
  const topicId = firstTopic?._id;

  let issueId;
  // FR-14: student submits issue (must belong to a topic)
  if (topicId) {
    const issueCreate = await req("/api/issues", {
      method: "POST",
      token: student.token,
      body: {
        topicId,
        issueDescription: "Explanation is inconsistent for a quiz question",
        issueType: "bug",
      },
    });
    expectStatus(issueCreate, 201, "Issue create");
    issueId = issueCreate.json.data._id;

    const myIssues = await req("/api/issues/me", { token: student.token });
    expectStatus(myIssues, 200, "Get my issues");

    const updateIssue = await req(`/api/issues/${issueId}/status`, {
      method: "PUT",
      token: teacher.token,
      body: { issueStatus: "in-progress", response: "We are reviewing this report." },
    });
    expectStatus(updateIssue, 200, "Update issue status");
  } else {
    console.warn("smoke-fr11-fr16: topic search returned no topics; skipping FR-14 issue flows");
  }

  // FR-15: bookmark add/list/remove
  const bookmarkAdd = await req("/api/bookmarks", {
    method: "POST",
    token: student.token,
    body: { resourceType: "topic", resourceId: topicId || "507f1f77bcf86cd799439011" },
  });
  expectStatus(bookmarkAdd, 201, "Add bookmark");

  const bookmarkList = await req("/api/bookmarks", { token: student.token });
  expectStatus(bookmarkList, 200, "List bookmarks");

  const bookmarkId = bookmarkAdd.json.data._id;
  const bookmarkDelete = await req(`/api/bookmarks/${bookmarkId}`, {
    method: "DELETE",
    token: student.token,
  });
  expectStatus(bookmarkDelete, 200, "Delete bookmark");

  // FR-16: ask question and teacher answers (if topic exists)
  if (topicId) {
    const ask = await req("/api/questions", {
      method: "POST",
      token: student.token,
      body: { topicId, questionText: "Can you explain this concept in another way?" },
    });
    expectStatus(ask, 201, "Ask question");

    const questionId = ask.json.data._id;
    const answer = await req(`/api/questions/${questionId}/answers`, {
      method: "POST",
      token: teacher.token,
      body: { answerText: "Sure. Start from the definition and solve one worked example." },
    });
    expectStatus(answer, 201, "Teacher answer");

    const answerList = await req(`/api/questions/${questionId}/answers`, {
      token: student.token,
    });
    expectStatus(answerList, 200, "Get answers for question");
  } else {
    console.log("No topic found from search; skipped FR-16 ask/answer smoke part.");
  }

  // FR-13: quiz validation endpoint edge case (bad id)
  const quizValidateBadId = await req("/api/quizzes/problems/not-an-id/validate", {
    method: "POST",
    token: student.token,
    body: { submittedAnswer: "A" },
  });
  if (![400, 404].includes(quizValidateBadId.status)) {
    throw new Error(`Unexpected quiz validate response: ${quizValidateBadId.status}`);
  }

  // FR-13: exam validation endpoint edge case (bad id)
  const examValidateBadId = await req("/api/exams/questions/not-an-id/validate", {
    method: "POST",
    token: student.token,
    body: { submittedAnswer: "A" },
  });
  if (![400, 404].includes(examValidateBadId.status)) {
    throw new Error(`Unexpected exam validate response: ${examValidateBadId.status}`);
  }

  // FR-11: in-app notifications endpoint available
  const notifications = await req("/api/notifications", { token: student.token });
  expectStatus(notifications, 200, "Get notifications");

  // Basic admin-only review route
  const reviewIssues = await req("/api/issues", { token: admin.token });
  expectStatus(reviewIssues, 200, "Admin get issues");

  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }

  console.log("FR11-FR16 smoke test passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

