const { Chapter, Topic, Concept, Video, Subject } = require('../models');

/**
 * ==================================================================================
 * Content Service
 * ==================================================================================
 *
 * This service is responsible for the business logic related to the hierarchical
 * structure of learning content: Chapters, Topics, Concepts, and Videos. It's
 * designed to be used primarily by teachers to structure their subjects and by
 * students to access the content.
 *
 * Why a separate ContentService?
 * - Organization: It groups all the logic for managing the actual learning materials
 *   (chapters, topics, etc.) in one place, separate from the higher-level subject
 *   management (which is in SubjectService).
 * - Clarity: It makes the codebase easier to understand. When you need to change
 *   how topics are created, you know to look in `contentService.js`.
 *
 * ==================================================================================
 */
class ContentService {
  // ==================================================================================
  // Chapter Management
  // ==================================================================================

  /**
   * Creates a new chapter within a subject.
   * FR-17: The system shall allow a teacher to structure a subject by adding chapters.
   *
   * @param {object} chapterData - Data for the new chapter (e.g., { chapterName, chapterDescription }).
   * @param {string} subjectId - The ID of the subject this chapter belongs to.
   * @returns {Promise<object>} The newly created chapter document.
   */
  async createChapter(chapterData, subjectId) {
    // We first ensure the parent subject exists to prevent creating orphaned chapters.
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      throw { status: 404, message: 'Subject not found.' };
    }

    const chapter = new Chapter({
      ...chapterData,
      subject: subjectId, // Explicitly link the chapter to its parent subject.
    });

    await chapter.save();
    return chapter;
  }

  /**
   * Retrieves all chapters for a given subject.
   * FR-06: The system shall allow students to view and access all content.
   *
   * @param {string} subjectId - The ID of the subject.
   * @returns {Promise<Array<object>>} A list of chapters for the specified subject.
   */
  async getChaptersBySubject(subjectId) {
    return await Chapter.find({ subject: subjectId }).sort({ created_at: 1 });
  }

  // ==================================================================================
  // Topic Management
  // ==================================================================================

  /**
   * Creates a new topic within a chapter.
   * FR-17: The system shall allow a teacher to structure a subject by adding topics.
   *
   * @param {object} topicData - Data for the new topic.
   * @param {string} chapterId - The ID of the chapter this topic belongs to.
   * @returns {Promise<object>} The newly created topic document.
   */
  async createTopic(topicData, chapterId) {
    // Ensure the parent chapter exists.
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      throw { status: 404, message: 'Chapter not found.' };
    }

    const topic = new Topic({
      ...topicData,
      chapter: chapterId, // Link the topic to its parent chapter.
    });

    await topic.save();
    return topic;
  }

  /**
   * Retrieves all topics for a given chapter.
   * FR-06: The system shall allow students to view and access all content.
   *
   * @param {string} chapterId - The ID of the chapter.
   * @returns {Promise<Array<object>>} A list of topics for the specified chapter.
   */
  async getTopicsByChapter(chapterId) {
    return await Topic.find({ chapter: chapterId }).sort({ created_at: 1 });
  }

  /**
   * Retrieves a topic by its ID.
   *
   * @param {string} topicId - The topic ID.
   * @returns {Promise<object|null>} Topic document or null.
   */
  async getTopicById(topicId) {
    return await Topic.findById(topicId);
  }

  /**
   * Updates a topic by its ID.
   *
   * @param {string} topicId - The topic ID.
   * @param {object} updateData - Fields to update.
   * @returns {Promise<object|null>} Updated topic document or null.
   */
  async updateTopic(topicId, updateData) {
    return await Topic.findByIdAndUpdate(topicId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Deletes a topic by its ID.
   *
   * @param {string} topicId - The topic ID.
   * @returns {Promise<object|null>} Deleted topic document or null.
   */
  async deleteTopic(topicId) {
    return await Topic.findByIdAndDelete(topicId);
  }

  /**
   * Searches for topics by their title.
   * FR-12: The system shall allow students to navigate subjects and search for topics by title.
   *
   * @param {string} query - The search term.
   * @returns {Promise<Array<object>>} A list of matching topics.
   */
  async searchTopicsByTitle(query) {
    // Using a regular expression with the 'i' flag allows for case-insensitive searching.
    // For example, searching for "algebra" will match "Algebra", "ALGEBRA", etc.
    return await Topic.find({ topicName: { $regex: query, $options: 'i' } });
  }

  // ==================================================================================
  // Content Management (Concepts & Videos)
  // ==================================================================================

  /**
   * Adds a concept page to a topic.
   * FR-18: The system shall allow a teacher to add and manage content under each topic.
   *
   * @param {object} conceptData - The content of the concept page.
   * @param {string} topicId - The ID of the topic this concept belongs to.
   * @returns {Promise<object>} The newly created concept document.
   */
  async addConceptToTopic(conceptData, topicId) {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      throw { status: 404, message: 'Topic not found.' };
    }

    const concept = new Concept({
      ...conceptData,
      topic: topicId,
    });

    await concept.save();
    return concept;
  }

  /**
   * Adds a video resource to a topic.
   * FR-18: The system shall allow a teacher to add and manage content under each topic.
   *
   * @param {object} videoData - The data for the video (e.g., { videoUrl, videoDuration }).
   * @param {string} topicId - The ID of the topic this video belongs to.
   * @returns {Promise<object>} The newly created video document.
   */
  async addVideoToTopic(videoData, topicId) {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      throw { status: 404, message: 'Topic not found.' };
    }

    const video = new Video({
      ...videoData,
      topic: topicId,
    });

    await video.save();
    return video;
  }

  /**
   * Retrieves all concepts for a given topic.
   *
   * @param {string} topicId - The ID of the topic.
   * @returns {Promise<Array<object>>} A list of concepts.
   */
  async getConceptsByTopic(topicId) {
    return await Concept.find({ topic: topicId });
  }

  /**
   * Retrieves a concept by its ID.
   *
   * @param {string} conceptId - The concept ID.
   * @returns {Promise<object|null>} Concept document or null.
   */
  async getConceptById(conceptId) {
    return await Concept.findById(conceptId);
  }

  /**
   * Updates a concept by its ID.
   *
   * @param {string} conceptId - The concept ID.
   * @param {object} updateData - Fields to update.
   * @returns {Promise<object|null>} Updated concept document or null.
   */
  async updateConcept(conceptId, updateData) {
    return await Concept.findByIdAndUpdate(conceptId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Deletes a concept by its ID.
   *
   * @param {string} conceptId - The concept ID.
   * @returns {Promise<object|null>} Deleted concept document or null.
   */
  async deleteConcept(conceptId) {
    return await Concept.findByIdAndDelete(conceptId);
  }

  /**
   * Retrieves all videos for a given topic.
   *
   * @param {string} topicId - The ID of the topic.
   * @returns {Promise<Array<object>>} A list of videos.
   */
  async getVideosByTopic(topicId) {
    return await Video.find({ topic: topicId });
  }

  /**
   * Retrieves a video by its ID.
   *
   * @param {string} videoId - The video ID.
   * @returns {Promise<object|null>} Video document or null.
   */
  async getVideoById(videoId) {
    return await Video.findById(videoId);
  }

  /**
   * Updates a video by its ID.
   *
   * @param {string} videoId - The video ID.
   * @param {object} updateData - Fields to update.
   * @returns {Promise<object|null>} Updated video document or null.
   */
  async updateVideo(videoId, updateData) {
    return await Video.findByIdAndUpdate(videoId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Deletes a video by its ID.
   *
   * @param {string} videoId - The video ID.
   * @returns {Promise<object|null>} Deleted video document or null.
   */
  async deleteVideo(videoId) {
    return await Video.findByIdAndDelete(videoId);
  }
}

// Export a singleton instance.
module.exports = new ContentService();
