const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ==================================================================================
 * Chapter Schema
 * ==================================================================================
 *
 * This schema defines the structure for a 'Chapter' in the database. A chapter
 * is a major section within a 'Subject', used to organize content logically.
 * For example, "Chapter 1: Algebra" in a Mathematics subject.
 *
 * ==================================================================================
 *
 * @property {String} chapterName
 *   - The name of the chapter.
 *   - This is a required field for clear identification.
 *   - `trim: true` ensures that names like "  Chapter 1" and "Chapter 1  " are stored cleanly as "Chapter 1".
 *
 * @property {String} chapterDescription
 *   - A brief, optional summary of the chapter's content and learning goals.
 *
 * @property {mongoose.Schema.Types.ObjectId} subject
 *   - This is a crucial field that creates a parent-child relationship with the 'Subject' model.
 *   - It stores the ID of the subject this chapter belongs to.
 *   - `ref: 'Subject'` tells Mongoose that this ID points to a document in the 'subjects' collection.
 *   - `required: true` enforces that every chapter *must* be associated with a subject. A chapter cannot exist on its own.
 *   - `index: true` creates a database index on this field. This is a performance optimization. Since we will frequently query for all chapters belonging to a specific subject, an index makes these lookups much faster.
 *
 * @property {Date} created_at
 *   - The timestamp for when the chapter was created.
 *
 * @property {Date} updated_at
 *   - The timestamp for when the chapter was last updated.
 */
const chapterSchema = new Schema(
  {
    chapterName: {
      type: String,
      required: [true, 'Chapter name is required.'],
      trim: true,
    },
    chapterDescription: {
      type: String,
      trim: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject', // Establishes a direct link to the Subject model
      required: true,
      index: true, // Improves query performance when finding chapters by subject
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
 * The schema is compiled into a 'Chapter' model, which provides the interface
 * for all database operations related to chapters.
 */
const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
