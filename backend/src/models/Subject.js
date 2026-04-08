const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ==================================================================================
 * Subject Schema
 * ==================================================================================
 *
 * This schema defines the structure for a 'Subject' in the database. A subject
 * represents a course or area of study, such as 'Mathematics' or 'Physics'.
 *
 * ==================================================================================
 *
 * @property {String} subjectName
 *   - The name of the subject.
 *   - It's a required field because every subject must have a name for identification.
 *   - `trim: true` is used to remove any leading or trailing whitespace, ensuring data consistency.
 *
 * @property {String} subjectDescription
 *   - A brief description of what the subject covers.
 *   - This is optional and provides additional context for students and teachers.
 *
 * @property {String} gradeLevel
 *   - The academic grade level this subject is intended for (e.g., "Grade 12").
 *   - This is required to help users filter and find relevant content.
 *
 * @property {mongoose.Schema.Types.ObjectId} teacher
 *   - A reference to the 'User' who is assigned to manage this subject.
 *   - This creates a direct link to a document in the 'users' collection.
 *   - It's crucial for implementing role-based access control, allowing only the assigned
 *     teacher (or an admin) to modify the subject's content.
 *   - This field is optional (`required: false`) because a subject might be created by an
 *     administrator before a teacher is assigned to it.
 *
 * @property {Date} created_at
 *   - The timestamp when the subject was created.
 *   - `default: Date.now` automatically sets this value on creation.
 *
 * @property {Date} updated_at
 *   - The timestamp when the subject was last updated.
 *   - This is managed by the `timestamps` option below.
 */
const subjectSchema = new Schema(
  {
    subjectName: {
      type: String,
      required: [true, 'Subject name is required.'],
      trim: true,
    },
    subjectDescription: {
      type: String,
      trim: true,
    },
    gradeLevel: {
      type: String,
      required: [true, 'Grade level is required.'],
      trim: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Creates a reference to the User model
      required: false, // A teacher can be assigned later
    },
  },
  {
    /**
     * The `timestamps` option automatically adds `createdAt` and `updatedAt` fields
     * to the schema. This is a Mongoose feature that helps track when documents
     * are created and modified without needing to manage it manually.
     */
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

/**
 * ==================================================================================
 * Model Export
 * ==================================================================================
 *
 * The schema is compiled into a Mongoose model. A model is a constructor that
 * allows you to create, read, update, and delete documents of a specific type
 * from the MongoDB database.
 *
 * The first argument, 'Subject', is the singular name of the model. Mongoose
 * will automatically look for a collection with the plural, lowercased version
 * of this name (i.e., 'subjects').
 */
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
