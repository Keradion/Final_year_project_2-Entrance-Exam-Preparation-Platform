const mongoose = require('mongoose');
const crypto = require('crypto');

const notificationSchema = new mongoose.Schema(
  {
    notificationID: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
    },
    readAt: {
      type: Date,
      default: null,
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

notificationSchema.pre('save', function (next) {
  if (!this.notificationID) {
    this.notificationID = `NID-${crypto.randomBytes(6).toString('hex')}`;
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
