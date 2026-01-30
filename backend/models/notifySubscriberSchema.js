const mongoose = require('mongoose');

const notifySubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  name: {
    type: String,
    trim: true,
    default: 'Newsletter Subscriber'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  userType: {
    type: String,
    enum: ['Customer', 'Seller', 'Unknown'],
    default: 'Customer'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'notified'],
    default: 'active'
  },
  notified: {
    type: Boolean,
    default: false
  },
  notifiedAt: {
    type: Date
  },
  unsubscribedAt: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// ✅ SINGLE COMPOUND INDEX - One subscription per email+userId combination
// This prevents duplicates for both newsletter-only and authenticated users
notifySubscriberSchema.index(
  { email: 1, userId: 1 }, 
  { unique: true }
);

// Other indexes for faster queries (NOT unique, just for performance)
notifySubscriberSchema.index({ status: 1 });
notifySubscriberSchema.index({ createdAt: -1 });

// Virtual for formatted date
notifySubscriberSchema.virtual('subscribedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual to check if subscriber has account
notifySubscriberSchema.virtual('hasAccount').get(function() {
  return !!this.userId;
});

// Method to check if user can subscribe
notifySubscriberSchema.statics.canSubscribe = async function(email, userId = null) {
  const query = { email: email.toLowerCase(), userId: userId };
  const existing = await this.findOne(query);
  return !existing || existing.status === 'unsubscribed';
};

// Method to get user's active subscriptions
notifySubscriberSchema.statics.getUserSubscriptions = async function(userId) {
  return await this.find({ userId, status: 'active' }).sort({ createdAt: -1 });
};

// Method to find subscription by email
notifySubscriberSchema.statics.findByEmail = async function(email) {
  return await this.findOne({ email: email.toLowerCase() });
};

const NotifySubscriber = mongoose.model('NotifySubscriber', notifySubscriberSchema);

module.exports = NotifySubscriber;