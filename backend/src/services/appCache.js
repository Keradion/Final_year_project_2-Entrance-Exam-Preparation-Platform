/**
 * Application read-through cache on Redis (separate from BullMQ / auth use of Redis).
 *
 * What: Caches JSON payloads for hot GET endpoints (curriculum lists and per-student progress).
 * Why: Many students hit the same subject/chapter/topic trees; dashboards poll progress often.
 *      Serving from Redis cuts MongoDB load and keeps p95 latency stable as usage grows.
 * How: readThrough(fullKey, ttlSeconds, loader) tries GET; on miss runs loader(), SETEX, returns.
 *      Writes invalidate affected keys so admins/teachers see updates without waiting for TTL.
 *      If Redis is down/disabled (getRedisClient() null), loaders run every time — same behaviour as before.
 *
 * Tune via env:
 * - APP_CACHE_PREFIX   default "lms" → keys look like `lms:cache:…`
 * - CACHE_TTL_CONTENT_SEC   default 600 (10 min) for catalogue-style responses
 * - CACHE_TTL_PROGRESS_SEC  default 45 for personalised progress rollups
 */
const { getRedisClient } = require('../config/redis');

const PREFIX = `${process.env.APP_CACHE_PREFIX || 'lms'}:cache`;

const TTL_CONTENT = Number(process.env.CACHE_TTL_CONTENT_SEC || 600);
const TTL_PROGRESS = Number(process.env.CACHE_TTL_PROGRESS_SEC || 45);

function normQuery(v) {
  if (v === undefined || v === null || v === '') return 'all';
  return String(v);
}

function subjectsListKey() {
  return `${PREFIX}:content:subjects`;
}

function subjectByIdKey(subjectId) {
  return `${PREFIX}:content:subject:${subjectId}`;
}

function chaptersBySubjectKey(subjectId) {
  return `${PREFIX}:content:chapters:${subjectId}`;
}

function topicsByChapterKey(chapterId) {
  return `${PREFIX}:content:topics:${chapterId}`;
}

function progressResultsKey(userId, gradeLevel, stream) {
  return `${PREFIX}:prog:${userId}:results:${normQuery(gradeLevel)}:${normQuery(stream)}`;
}

function progressStreakKey(userId, gradeLevel, stream) {
  return `${PREFIX}:prog:${userId}:streak:${normQuery(gradeLevel)}:${normQuery(stream)}`;
}

function progressChaptersKey(userId, subjectId) {
  return `${PREFIX}:prog:${userId}:chapters:${subjectId}`;
}

function progressGradeKey(userId, gradeLevel, stream) {
  return `${PREFIX}:prog:${userId}:grade:${normQuery(gradeLevel)}:${normQuery(stream)}`;
}

function progressSubjectKey(userId, subjectId) {
  return `${PREFIX}:prog:${userId}:subject:${subjectId}`;
}

function progressAllSubjectsKey(userId) {
  return `${PREFIX}:prog:${userId}:subjects:all`;
}

function progressEligibilityKey(userId, topicId) {
  return `${PREFIX}:prog:${userId}:eligibility:${topicId}`;
}

/**
 * @param {string} key
 * @param {number} ttlSeconds
 * @param {() => Promise<any>} loader
 * @param {{ skipEmptyCache?: boolean }} [options]
 */
async function readThrough(key, ttlSeconds, loader, options = {}) {
  const { skipEmptyCache } = options;
  const client = getRedisClient();
  if (!client) {
    return loader();
  }
  try {
    const raw = await client.get(key);
    if (raw !== undefined && raw !== null) {
      const parsed = JSON.parse(raw);
      if (skipEmptyCache && parsed === null) {
        await client.del(key).catch(() => {});
      } else if (!skipEmptyCache || parsed != null) {
        return parsed;
      }
    }

    const data = await loader();
    if (skipEmptyCache && (data === null || data === undefined)) {
      return data;
    }

    await client.setEx(key, Math.max(1, ttlSeconds), JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn('[appCache] readThrough fallback:', err.message);
    return loader();
  }
}

async function delKeys(keys) {
  const client = getRedisClient();
  if (!client || !keys.length) return;
  const uniq = [...new Set(keys.filter(Boolean))];
  if (!uniq.length) return;
  try {
    await client.del(uniq);
  } catch (err) {
    console.warn('[appCache] delKeys:', err.message);
  }
}

async function invalidateSubjectsCatalog() {
  await delKeys([subjectsListKey()]);
}

async function invalidateSubjectRecord(subjectId) {
  if (!subjectId) return;
  const sid = String(subjectId);
  await delKeys([subjectsListKey(), subjectByIdKey(sid), chaptersBySubjectKey(sid)]);
}

async function invalidateChaptersForSubject(subjectId) {
  if (!subjectId) return;
  await delKeys([chaptersBySubjectKey(String(subjectId))]);
}

async function invalidateTopicsForChapter(chapterId) {
  if (!chapterId) return;
  await delKeys([topicsByChapterKey(String(chapterId))]);
}

/** After chapter delete or structure change: refresh chapter list + topic list for that chapter. */
async function invalidateChapterSubtree(subjectId, chapterId) {
  await delKeys([
    chaptersBySubjectKey(String(subjectId)),
    topicsByChapterKey(String(chapterId)),
  ]);
}

async function invalidateUserProgress(userId) {
  const client = getRedisClient();
  if (!client || !userId) return;
  const pattern = `${PREFIX}:prog:${userId}:*`;
  try {
    for await (const key of client.scanIterator({ MATCH: pattern, COUNT: 200 })) {
      await client.del(key);
    }
  } catch (err) {
    console.warn('[appCache] invalidateUserProgress:', err.message);
  }
}

module.exports = {
  TTL_CONTENT,
  TTL_PROGRESS,
  readThrough,
  delKeys,
  subjectsListKey,
  subjectByIdKey,
  chaptersBySubjectKey,
  topicsByChapterKey,
  progressResultsKey,
  progressStreakKey,
  progressChaptersKey,
  progressGradeKey,
  progressSubjectKey,
  progressAllSubjectsKey,
  progressEligibilityKey,
  invalidateSubjectsCatalog,
  invalidateSubjectRecord,
  invalidateChaptersForSubject,
  invalidateTopicsForChapter,
  invalidateChapterSubtree,
  invalidateUserProgress,
};
