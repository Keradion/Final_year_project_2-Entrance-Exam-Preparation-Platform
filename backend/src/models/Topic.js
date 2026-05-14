const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ==================================================================================
 * Topic Schema
 * ==================================================================================
 *
 * This schema defines the structure for a 'Topic' in the database. A topic is a
 * specific section of content within a 'Chapter'. For example, "Solving Linear
 * Equations" could be a topic in the "Algebra" chapter.
 *
 * ==================================================================================
 *
 * @property {String} topicName
 *   - The name of the topic. This is required for identification.
 *
 * @property {String} topicDescription
 *   - An optional, brief summary of what the topic covers.
 *
 * @property {Array<String>} topicObjectives
 *   - A list of learning objectives for the topic. For example:
 *     ["Understand the concept of a variable", "Solve for x in a simple equation"].
 *   - This helps students understand the goals of the topic. It's an array of strings.
 *
 * @property {mongoose.Schema.Types.ObjectId} chapter
 *   - A reference to the 'Chapter' document this topic belongs to.
 *   - This is a required field, as a topic must be part of a chapter.
 *   - `ref: 'Chapter'` creates the link to the Chapter model.
 *   - `index: true` is added for performance, as we will often fetch all topics for a given chapter.
 *
 * @property {Date} created_at
 *   - The timestamp for when the topic was created.
 *
 * @property {Date} updated_at
 *   - The timestamp for when the topic was last updated.
 */
const topicSchema = new Schema(
  {
    topicName: {
      type: String,
      required: [true, 'Topic name is required.'],
      trim: true,
    },
    topicDescription: {
      type: String,
      trim: true,
    },
    topicObjectives: [
      {
        type: String,
        trim: true,
      },
    ],
    chapter: {
      type: Schema.Types.ObjectId,
      ref: 'Chapter', // Establishes a direct link to the Chapter model
      required: true,
      index: true, // Improves query performance when finding topics by chapter
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
 * The schema is compiled into a 'Topic' model, providing the interface for all
 * database operations related to topics.
 */
const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
