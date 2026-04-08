/**
 * Application Constants
 */

const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

const PROGRESS_MILESTONES = {
  TWENTY_FIVE: 25,
  FIFTY: 50,
  SEVENTY_FIVE: 75,
  HUNDRED: 100,
};

const ISSUE_STATUS = {
  OPEN: 'open',
  IN_REVIEW: 'inReview',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

const ISSUE_TYPES = {
  WRONG_ANSWER: 'wrongAnswer',
  MISSING_CONTENT: 'missingContent',
  PLATFORM_BUG: 'platformBug',
  OTHER: 'other',
};

const NOTIFICATION_CHANNELS = {
  IN_APP: 'inApp',
  EMAIL: 'email',
};

const NOTIFICATION_STATUS = {
  QUEUED: 'queued',
  SENT: 'sent',
  FAILED: 'failed',
  READ: 'read',
};

const NOTIFICATION_TYPES = {
  PROGRESS_UPDATE: 'progressUpdate',
  MILESTONE_REACHED: 'milestoneReached',
  ISSUE_RESOLVED: 'issueResolved',
  NEW_ANSWER: 'newAnswer',
  SUBJECT_UPDATE: 'subjectUpdate',
  ACCOUNT_ACTION: 'accountAction',
};

const QUIZ_ATTEMPT_STATUS = {
  IN_PROGRESS: 'inProgress',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
};

const EXAM_QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multipleChoice',
  SHORT_ANSWER: 'shortAnswer',
  ESSAY: 'essay',
};

module.exports = {
  ROLES,
  USER_STATUS,
  PROGRESS_MILESTONES,
  ISSUE_STATUS,
  ISSUE_TYPES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPES,
  QUIZ_ATTEMPT_STATUS,
  EXAM_QUESTION_TYPES,
};
