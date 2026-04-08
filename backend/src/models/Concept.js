const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ==================================================================================
 * Concept Schema
 * ==================================================================================
 *
 * This schema defines the structure for a 'Concept' in the database. A concept
 * represents a piece of textual learning material, like a page in a textbook,
 * that explains a specific idea within a 'Topic'.
 *
 * ==================================================================================
 *
 * @property {String} content
 *   - The main body of the concept explanation. This will likely store rich text
 *     or Markdown content that can be rendered on the frontend.
 *   - It is required because a concept page must have content.
 *
 * @property {String} contentImageUrl
 *   - An optional URL for an image that accompanies the concept text. This could
 *     be a diagram, chart, or illustrative photo.
 *
 * @property {mongoose.Schema.Types.ObjectId} topic
 *   - A reference to the 'Topic' document this concept belongs to.
 *   - This is a required field, ensuring that every concept is part of a topic.
 *   - `ref: 'Topic'` creates the link to the Topic model.
 *   - `index: true` is used for performance optimization, as we will often
 *     query for all concepts related to a specific topic.
 *
 * @property {Date} created_at
 *   - The timestamp for when the concept was created.
 *
 * @property {Date} updated_at
 *   - The timestamp for when the concept was last updated.
 */
const conceptSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Concept content is required.'],
    },
    contentImageUrl: {
      type: String,
      trim: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic', // Establishes a direct link to the Topic model
      required: true,
      index: true, // Improves query performance when finding concepts by topic
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
 * The schema is compiled into a 'Concept' model, providing the interface for all
 * database operations related to concepts.
 */
const Concept = mongoose.model('Concept', conceptSchema);

module.exports = Concept;
