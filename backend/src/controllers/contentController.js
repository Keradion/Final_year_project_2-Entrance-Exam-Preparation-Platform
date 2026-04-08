const contentService = require('../services/contentService');
const mongoose = require('mongoose');
const { Subject, Chapter, Topic, User, Progress } = require('../models');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService');

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
  async notifyStudentsOfSubjectUpdate(subjectId, title, message) {
    const subject = await Subject.findById(subjectId).select('subjectName');
    if (!subject) {
      return;
    }

    const chapters = await Chapter.find({ subject: subjectId }).select('_id').lean();
    if (!chapters.length) {
      return;
    }

    const chapterIds = chapters.map((chapter) => chapter._id);
    const topics = await Topic.find({ chapter: { $in: chapterIds } }).select('_id').lean();
    if (!topics.length) {
      return;
    }

    const topicIds = topics.map((topic) => topic._id);
    const studentIds = await Progress.distinct('studentId', { topicId: { $in: topicIds } });
    if (!studentIds.length) {
      return;
    }

    const students = await User.find({
      _id: { $in: studentIds },
      role: 'student',
      status: 'active',
    })
      .select('_id email firstName')
      .lean();

    await Promise.all(
      students.map(async (student) => {
        await notificationService.sendNotification(student._id, title, message);
        if (student.email) {
          await emailService.sendEmail(
            student.email,
            `${subject.subjectName} update`,
            `Hi ${student.firstName || 'Student'},\n\n${message}`
          );
        }
      })
    );
  }

  // ==================================================================================
  // Chapter Handlers
  // ==================================================================================

  /**
   * Handles the request to create a new chapter.
   * The subject ID is expected in the request body.
   */
  async createChapter(req, res, next) {
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
      await this.notifyStudentsOfSubjectUpdate(
        resolvedSubjectId,
        'Subject content updated',
        `A new chapter "${chapter.chapterName}" was added.`
      );
      res.status(201).json(chapter);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to get all chapters for a specific subject.
   * The subject ID is expected as a URL parameter.
   */
  async getChaptersBySubject(req, res, next) {
    try {
      const { subjectId } = req.params;

      if (!isValidObjectId(subjectId)) {
        return res.status(400).json({ message: 'Invalid subject id format.' });
      }

      const chapters = await contentService.getChaptersBySubject(subjectId);
      res.status(200).json(chapters);
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
  async createTopic(req, res, next) {
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
  }

  /**
   * Handles the request to get all topics for a specific chapter.
   * The chapter ID is expected as a URL parameter.
   */
  async getTopicsByChapter(req, res, next) {
    try {
      const { chapterId } = req.params;

      if (!isValidObjectId(chapterId)) {
        return res.status(400).json({ message: 'Invalid chapter id format.' });
      }

      const topics = await contentService.getTopicsByChapter(chapterId);
      res.status(200).json(topics);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to get a single topic by ID.
   */
  async getTopicById(req, res, next) {
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
  async updateTopic(req, res, next) {
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
  async deleteTopic(req, res, next) {
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
  }

  /**
   * Handles the request to search for topics by title.
   * The search query is expected in the query string (e.g., /topics/search?q=algebra).
   */
  async searchTopics(req, res, next) {
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
  async addConceptToTopic(req, res, next) {
    try {
      const { topicId } = req.params;

      if (!isValidObjectId(topicId)) {
        return res.status(400).json({ message: 'Invalid topic id format.' });
      }

      if (!req.body?.content) {
        return res.status(400).json({ message: 'content is required.' });
      }

      const concept = await contentService.addConceptToTopic(req.body, topicId);
      const topicDoc = await Topic.findById(topicId).select('chapter');
      if (topicDoc?.chapter) {
        const chapterDoc = await Chapter.findById(topicDoc.chapter).select('subject');
        if (chapterDoc?.subject) {
          await this.notifyStudentsOfSubjectUpdate(
            chapterDoc.subject,
            'Subject content updated',
            'A new concept page was added under a topic.'
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
  async addVideoToTopic(req, res, next) {
    try {
      const { topicId } = req.params;

      if (!isValidObjectId(topicId)) {
        return res.status(400).json({ message: 'Invalid topic id format.' });
      }

      if (!req.body?.videoUrl) {
        return res.status(400).json({ message: 'videoUrl is required.' });
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
  async getConceptsByTopic(req, res, next) {
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
  async getConceptById(req, res, next) {
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
  async updateConcept(req, res, next) {
    try {
      const { conceptId } = req.params;

      if (!isValidObjectId(conceptId)) {
        return res.status(400).json({ message: 'Invalid concept id format.' });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is required for update.' });
      }

      const concept = await contentService.updateConcept(conceptId, req.body);
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
            'A concept page was updated.'
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
  async deleteConcept(req, res, next) {
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
  async getVideosByTopic(req, res, next) {
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
  async getVideoById(req, res, next) {
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
  async updateVideo(req, res, next) {
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
  async deleteVideo(req, res, next) {
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
