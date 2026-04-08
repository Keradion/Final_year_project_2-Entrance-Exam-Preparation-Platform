const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ==================================================================================
 * Video Schema
 * ==================================================================================
 *
 * This schema defines the structure for a 'Video' in the database. A video
 * represents a video learning resource associated with a specific 'Topic'.
 *
 * ==================================================================================
 *
 * @property {String} videoUrl
 *   - The URL of the video. This could be a link to a YouTube video, a Vimeo video,
 *     or a video file hosted on a CDN.
 *   - It is required, as the primary purpose of this document is to point to a video.
 *
 * @property {Number} videoDuration
 *   - The duration of the video in seconds.
 *   - This is an optional field that can be useful for displaying the video length
 *     to the user on the frontend without needing to load the video player first.
 *
 * @property {mongoose.Schema.Types.ObjectId} topic
 *   - A reference to the 'Topic' document this video is associated with.
 *   - This is a required field, ensuring that every video is part of a topic.
 *   - `ref: 'Topic'` creates the link to the Topic model.
 *   - `index: true` is used for performance optimization, as we will often
 *     query for all videos related to a specific topic.
 *
 * @property {Date} created_at
 *   - The timestamp for when the video was added.
 *
 * @property {Date} updated_at
 *   - The timestamp for when the video was last updated.
 */
const videoSchema = new Schema(
  {
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required.'],
      trim: true,
    },
    videoDuration: {
      type: Number, // Duration in seconds
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic', // Establishes a direct link to the Topic model
      required: true,
      index: true, // Improves query performance when finding videos by topic
    },
  },
  {
    /**
     * The `timestamps` option automatically adds and manages `created_at` and `updated_at`
     * fields, which is standard practice for tracking data lifecycle.
     */
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

/**
 * ==================================================================================
 * Model Export
 * ==================================================================================
 *
 * The schema is compiled into a 'Video' model, providing the interface for all
 * database operations related to videos.
 */
const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
