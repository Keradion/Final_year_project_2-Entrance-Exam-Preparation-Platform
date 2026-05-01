const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    role: { type: String, default: 'student' },
    stream: { type: String },
    gradeLevel: { type: String },
    profileImage: { type: String },
    verificationCode: { type: String, required: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 24 hours
  },
  { timestamps: true }
);

// Auto-delete expired pending users
pendingUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PendingUser', pendingUserSchema);
