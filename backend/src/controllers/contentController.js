const contentService = require('../services/contentService');
const mongoose = require('mongoose');
const { Chapter, Topic } = require('../models');
const { notifyStudentsOfSubjectUpdate } = require('../services/contentNotificationService');
const appCache = require('../services/appCache');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

/**
 * ==================================================================================
 * Content Controller
 * ==================================================================================
 *
 * This controller handles all HTTP requests for the content hierarchy below subjects,
 * including Chapters, Topics, Concepts, and Videos. It acts as the entry point
 * for any API calls related to managing or retrieving learning materials.
 *
 * ==================================================================================
 */
class ContentController {
  notifyStudentsOfSubjectUpdate = async (subjectId, title, message) => {
    await notifyStudentsOfSubjectUpdate(subjectId, title, message);
  };

  // ==================================================================================
  // Chapter Handlers
  // ==================================================================================

  /**
   * Handles the request to create a new chapter.
   * The subject ID is expected in the request body.
   */
  createChapter = async (req, res, next) => {
    try {
      const { subjectId, subject, ...chapterData } = req.body;
      const resolvedSubjectId = subjectId || subject;

      if (!resolvedSubjectId) {
        return res.status(400).json({ message: 'Subject ID is required.' });
      }

      if (!isValidObjectId(resolvedSubjectId)) {
        return res.status(400).json({ message: 'Invalid subject id format.' });
      }

      if (!chapterData?.chapterName) {
        return res.status(400).json({ message: 'chapterName is required.' });
      }

      const chapter = await contentService.createChapter(chapterData, resolvedSubjectId);
      await appCache.invalidateChaptersForSubject(resolvedSubjectId);
      await this.notifyStudentsOfSubjectUpdate(
        resolvedSubjectId,
        'Subject content updated',
        `A new chapter "${chapter.chapterName}" was added.`
      );
      res.status(201).json(chapter);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the request to get all chapters for a specific subject.
   * The subject ID is expected as a URL parameter.
   */
  getChaptersBySubject = async (req, res, next) => {
    try {
      const { subjectId } = req.params;

      if (!isValidObjectId(subjectId)) {
        return res.status(400).json({ message: 'Invalid subject id format.' });
      }

      const chapters = await appCache.readThrough(
        appCache.chaptersBySubjectKey(subjectId),
        appCache.TTL_CONTENT,
        () => contentService.getChaptersBySubject(subjectId)
      );
      res.status(200).json(chapters);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to get a single chapter by ID.
   */
  getChapterById = async (req, res, next) => {
    try {
      const { chapterId } = req.params;

      if (!isValidObjectId(chapterId)) {
        return res.status(400).json({ message: 'Invalid chapter id format.' });
      }

      const chapter = await contentService.getChapterById(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found.' });
      }

      res.status(200).json(chapter);
    } catch (error) {
      next(error);
    }
  }

  // ==================================================================================
  // Topic Handlers
  // ==================================================================================

  /**
   * Handles the request to create a new topic.
   * The chapter ID is expected in the request body.
   */
  createTopic = async (req, res, next) => {
    try {
      const { chapterId, chapter, ...topicData } = req.body;
      const resolvedChapterId = chapterId || chapter;

      if (!resolvedChapterId) {
        return res.status(400).json({ message: 'Chapter ID is required.' });
      }

      if (!isValidObjectId(resolvedChapterId)) {
        return res.status(400).json({ message: 'Invalid chapter id format.' });
      }

      if (!topicData?.topicName) {
        return res.status(400).json({ message: 'topicName is required.' });
      }

      const topic = await contentService.createTopic(topicData, resolvedChapterId);
      await appCache.invalidateTopicsForChapter(resolvedChapterId);
      const chapterDoc = await Chapter.findById(resolvedChapterId).select('subject');
      if (chapterDoc?.subject) {
        await this.notifyStudentsOfSubjectUpdate(
          chapterDoc.subject,
          'Subject content updated',
          `A new topic "${topic.topicName}" was added.`
        );
      }
      res.status(201).json(topic);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the request to update a chapter by ID.
   */
  updateChapter = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid chapter id format.' });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is required for update.' });
      }

      const chapter = await contentService.updateChapter(id, req.body);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found.' });
      }
      if (chapter.subject) {
        await appCache.invalidateChaptersForSubject(chapter.subject);
      }
      res.status(200).json(chapter);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the request to delete a chapter by ID.
   */
  deleteChapter = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid chapter id format.' });
      }

      const chapter = await contentService.deleteChapter(id);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found.' });
      }
      if (chapter.subject) {
        await appCache.invalidateChapterSubtree(String(chapter.subject), id);
      }
      res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the request to get all topics for a specific chapter.
   * The chapter ID is expected as a URL parameter.
   */
  getTopicsByChapter = async (req, res, next) => {
    try {
      const { chapterId } = req.params;

      if (!isValidObjectId(chapterId)) {
        return res.status(400).json({ message: 'Invalid chapter id format.' });
      }

      const topics = await appCache.readThrough(
        appCache.topicsByChapterKey(chapterId),
        appCache.TTL_CONTENT,
        () => contentService.getTopicsByChapter(chapterId)
      );
      res.status(200).json(topics);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to get a single topic by ID.
   */
  getTopicById = async (req, res, next) => {
    try {
      const { topicId } = req.params;

      if (!isValidObjectId(topicId)) {
        return res.status(400).json({ message: 'Invalid topic id format.' });
      }

      const topic = await contentService.getTopicById(topicId);
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found.' });
      }
      res.status(200).json(topic);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to update a topic by ID.
   */
  updateTopic = async (req, res, next) => {
    try {
      const { topicId } = req.params;

      if (!isValidObjectId(topicId)) {
        return res.status(400).json({ message: 'Invalid topic id format.' });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is required for update.' });
      }

      const topic = await contentService.updateTopic(topicId, req.body);
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found.' });
      }
      await appCache.invalidateTopicsForChapter(topic.chapter);
      const chapterDoc = await Chapter.findById(topic.chapter).select('subject');
      if (chapterDoc?.subject) {
        await this.notifyStudentsOfSubjectUpdate(
          chapterDoc.subject,
          'Subject content updated',
          `Topic "${topic.topicName}" was updated.`
        );
      }
      res.status(200).json(topic);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to delete a topic by ID.
   */
  deleteTopic = async (req, res, next) => {
    try {
      const { topicId } = req.params;

      if (!isValidObjectId(topicId)) {
        return res.status(400).json({ message: 'Invalid topic id format.' });
      }

      const existingTopic = await Topic.findById(topicId).select('chapter topicName');
      const topic = await contentService.deleteTopic(topicId);
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found.' });
      }
      if (existingTopic?.chapter) {
        await appCache.invalidateTopicsForChapter(existingTopic.chapter);
      }
      if (existingTopic?.chapter) {
        const chapterDoc = await Chapter.findById(existingTopic.chapter).select('subject');
        if (chapterDoc?.subject) {
          await this.notifyStudentsOfSubjectUpdate(
            chapterDoc.subject,
            'Subject content updated',
            `Topic "${existingTopic.topicName}" was removed.`
          );
        }
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the request to search for topics by title.
   * The search query is expected in the query string (e.g., /topics/search?q=algebra).
   */
  searchTopics = async (req, res, next) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Search query is required.' });
      }
      const topics = await contentService.searchTopicsByTitle(q);
      res.status(200).json(topics);
    } catch (error) {
      next(error);
    }
  }

  // ==================================================================================
  // Content Handlers (Concepts & Videos)
  // ==================================================================================

  /**
   * Handles the request to add a concept to a topic.
   * The topic ID is expected as a URL parameter.
   */
  addConceptToTopic = async (req, res, next) => {
    try {
      const { topicId } = req.params;

      if (!isValidObjectId(topicId)) {
        return res.status(400).json({ message: 'Invalid topic id format.' });
      }

      if (!req.body?.content || !req.body?.title) {
        return res.status(400).json({ message: 'Title and content are required.' });
      }

      const conceptData = {
        title: req.body.title,
        content: req.body.content,
      };

      if (req.file) {
        conceptData.contentImageUrl = `/uploads/concepts/${req.file.filename}`;
      }

      const concept = await contentService.addConceptToTopic(conceptData, topicId);
      const topicDoc = await Topic.findById(topicId).select('chapter');
      if (topicDoc?.chapter) {
        const chapterDoc = await Chapter.findById(topicDoc.chapter).select('subject');
        if (chapterDoc?.subject) {
          await this.notifyStudentsOfSubjectUpdate(
            chapterDoc.subject,
            'Subject content updated',
            `A new concept page "${concept.title}" was added.`
          );
        }
      }
      res.status(201).json(concept);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to add a video to a topic.
   * The topic ID is expected as a URL parameter.
   */
  addVideoToTopic = async (req, res, next) => {
    try {
      const { topicId } = req.params;

      if (!isValidObjectId(topicId)) {
        return res.status(400).json({ message: 'Invalid topic id format.' });
      }

      if (!req.body?.videoUrl) {
        return res.status(400).json({ message: 'videoUrl is required.' });
      }

      if (!req.body?.title) {
        return res.status(400).json({ message: 'title is required.' });
      }

      const video = await contentService.addVideoToTopic(req.body, topicId);
      const topicDoc = await Topic.findById(topicId).select('chapter');
      if (topicDoc?.chapter) {
        const chapterDoc = await Chapter.findById(topicDoc.chapter).select('subject');
        if (chapterDoc?.subject) {
          await this.notifyStudentsOfSubjectUpdate(
            chapterDoc.subject,
            'Subject content updated',
            'A new video was added under a topic.'
          );
        }
      }
      res.status(201).json(video);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to get all concepts for a topic.
   */
  getConceptsByTopic = async (req, res, next) => {
    try {
      const { topicId } = req.params;

      if (!isValidObjectId(topicId)) {
        return res.status(400).json({ message: 'Invalid topic id format.' });
      }

      const concepts = await contentService.getConceptsByTopic(topicId);
      res.status(200).json(concepts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to get a concept by ID.
   */
  getConceptById = async (req, res, next) => {
    try {
      const { conceptId } = req.params;

      if (!isValidObjectId(conceptId)) {
        return res.status(400).json({ message: 'Invalid concept id format.' });
      }

      const concept = await contentService.getConceptById(conceptId);
      if (!concept) {
        return res.status(404).json({ message: 'Concept not found.' });
      }
      res.status(200).json(concept);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to update a concept by ID.
   */
  updateConcept = async (req, res, next) => {
    try {
      const { conceptId } = req.params;

      if (!isValidObjectId(conceptId)) {
        return res.status(400).json({ message: 'Invalid concept id format.' });
      }

      const updateData = { ...req.body };
      if (req.file) {
        updateData.contentImageUrl = `/uploads/concepts/${req.file.filename}`;
      }

      const concept = await contentService.updateConcept(conceptId, updateData);
      if (!concept) {
        return res.status(404).json({ message: 'Concept not found.' });
      }
      const topicDoc = await Topic.findById(concept.topic).select('chapter');
      if (topicDoc?.chapter) {
        const chapterDoc = await Chapter.findById(topicDoc.chapter).select('subject');
        if (chapterDoc?.subject) {
          await this.notifyStudentsOfSubjectUpdate(
            chapterDoc.subject,
            'Subject content updated',
            `Concept page "${concept.title}" was updated.`
          );
        }
      }
      res.status(200).json(concept);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to delete a concept by ID.
   */
  deleteConcept = async (req, res, next) => {
    try {
      const { conceptId } = req.params;

      if (!isValidObjectId(conceptId)) {
        return res.status(400).json({ message: 'Invalid concept id format.' });
      }

      const concept = await contentService.getConceptById(conceptId);
      const deletedConcept = await contentService.deleteConcept(conceptId);
      if (!deletedConcept) {
        return res.status(404).json({ message: 'Concept not found.' });
      }
      if (concept?.topic) {
        const topicDoc = await Topic.findById(concept.topic).select('chapter');
        if (topicDoc?.chapter) {
          const chapterDoc = await Chapter.findById(topicDoc.chapter).select('subject');
          if (chapterDoc?.subject) {
            await this.notifyStudentsOfSubjectUpdate(
              chapterDoc.subject,
              'Subject content updated',
              'A concept page was removed.'
            );
          }
        }
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to get all videos for a topic.
   */
  getVideosByTopic = async (req, res, next) => {
    try {
      const { topicId } = req.params;

      if (!isValidObjectId(topicId)) {
        return res.status(400).json({ message: 'Invalid topic id format.' });
      }

      const videos = await contentService.getVideosByTopic(topicId);
      res.status(200).json(videos);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to get a video by ID.
   */
  getVideoById = async (req, res, next) => {
    try {
      const { videoId } = req.params;

      if (!isValidObjectId(videoId)) {
        return res.status(400).json({ message: 'Invalid video id format.' });
      }

      const video = await contentService.getVideoById(videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found.' });
      }
      res.status(200).json(video);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to update a video by ID.
   */
  updateVideo = async (req, res, next) => {
    try {
      const { videoId } = req.params;

      if (!isValidObjectId(videoId)) {
        return res.status(400).json({ message: 'Invalid video id format.' });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is required for update.' });
      }

      const video = await contentService.updateVideo(videoId, req.body);
      if (!video) {
        return res.status(404).json({ message: 'Video not found.' });
      }
      const topicDoc = await Topic.findById(video.topic).select('chapter');
      if (topicDoc?.chapter) {
        const chapterDoc = await Chapter.findById(topicDoc.chapter).select('subject');
        if (chapterDoc?.subject) {
          await this.notifyStudentsOfSubjectUpdate(
            chapterDoc.subject,
            'Subject content updated',
            'A video resource was updated.'
          );
        }
      }
      res.status(200).json(video);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to delete a video by ID.
   */
  deleteVideo = async (req, res, next) => {
    try {
      const { videoId } = req.params;

      if (!isValidObjectId(videoId)) {
        return res.status(400).json({ message: 'Invalid video id format.' });
      }

      const video = await contentService.getVideoById(videoId);
      const deletedVideo = await contentService.deleteVideo(videoId);
      if (!deletedVideo) {
        return res.status(404).json({ message: 'Video not found.' });
      }
      if (video?.topic) {
        const topicDoc = await Topic.findById(video.topic).select('chapter');
        if (topicDoc?.chapter) {
          const chapterDoc = await Chapter.findById(topicDoc.chapter).select('subject');
          if (chapterDoc?.subject) {
            await this.notifyStudentsOfSubjectUpdate(
              chapterDoc.subject,
              'Subject content updated',
              'A video resource was removed.'
            );
          }
        }
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

// Export a singleton instance of the controller.
module.exports = new ContentController();
