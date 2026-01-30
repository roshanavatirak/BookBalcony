// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../routes/userAuth');
// const NotifySubscriber = require('../models/notifySubscriberSchema');
// const User = require('../models/user'); // Adjust path as per your project structure

// // =====================================================
// // 📧 NOTIFY-ME ENDPOINT
// // =====================================================
// /**
//  * @route   POST /api/v1/services/notify-me
//  * @desc    Register user for service launch notification
//  * @access  Public
//  */
// router.post('/notify-me', async (req, res) => {
//   try {
//     const { email, name, timestamp, userType } = req.body;

//     // ✅ Validation
//     if (!email || !email.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email is required',
//         error: 'VALIDATION_ERROR'
//       });
//     }

//     // Email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid email format',
//         error: 'INVALID_EMAIL'
//       });
//     }

//     // ✅ Check if email already exists
//     const existingSubscriber = await NotifySubscriber.findOne({ 
//       email: email.toLowerCase().trim() 
//     });

//     if (existingSubscriber) {
//       return res.status(200).json({
//         success: true,
//         message: 'You are already subscribed!',
//         data: {
//           email: existingSubscriber.email,
//           subscribedAt: existingSubscriber.createdAt,
//           alreadySubscribed: true
//         }
//       });
//     }

//     // ✅ Create new subscriber
//     const newSubscriber = new NotifySubscriber({
//       email: email.toLowerCase().trim(),
//       name: name?.trim() || 'Anonymous',
//       userType: userType || 'Customer',
//       timestamp: timestamp || new Date().toISOString(),
//       status: 'active',
//       notified: false,
//       ipAddress: req.ip || req.connection.remoteAddress,
//       userAgent: req.get('user-agent')
//     });

//     await newSubscriber.save();

//     // ✅ Send confirmation email (optional - implement if needed)
//     // await sendConfirmationEmail(email, name);

//     console.log('✅ New subscriber registered:', email);

//     return res.status(201).json({
//       success: true,
//       message: 'Successfully registered for launch notification! 🎉',
//       data: {
//         email: newSubscriber.email,
//         name: newSubscriber.name,
//         subscribedAt: newSubscriber.createdAt
//       }
//     });

//   } catch (error) {
//     console.error('❌ Notify-Me Error:', error);
    
//     // Handle duplicate email error
//     if (error.code === 11000) {
//       return res.status(200).json({
//         success: true,
//         message: 'You are already subscribed!',
//         error: 'DUPLICATE_EMAIL'
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: 'Failed to register for notifications. Please try again later.',
//       error: 'SERVER_ERROR',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // =====================================================
// // 📊 GET ALL SUBSCRIBERS (Admin Only)
// // =====================================================
// /**
//  * @route   GET /api/v1/services/subscribers
//  * @desc    Get all notify-me subscribers
//  * @access  Private/Admin
//  */
// router.get('/subscribers', authenticateToken, async (req, res) => {
//   try {
//     // ✅ Check if user is admin
//     const user = await User.findById(req.headers.id);
    
//     if (!user || user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. Admin only.',
//         error: 'FORBIDDEN'
//       });
//     }

//     const subscribers = await NotifySubscriber.find()
//       .sort({ createdAt: -1 })
//       .select('-__v');

//     const stats = {
//       total: subscribers.length,
//       sellers: subscribers.filter(s => s.userType === 'Seller').length,
//       customers: subscribers.filter(s => s.userType === 'Customer').length,
//       notified: subscribers.filter(s => s.notified).length,
//       pending: subscribers.filter(s => !s.notified).length,
//       active: subscribers.filter(s => s.status === 'active').length,
//       unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length
//     };

//     return res.status(200).json({
//       success: true,
//       message: 'Subscribers fetched successfully',
//       data: subscribers,
//       stats
//     });

//   } catch (error) {
//     console.error('❌ Get Subscribers Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch subscribers',
//       error: 'SERVER_ERROR'
//     });
//   }
// });

// // =====================================================
// // 📊 GET SUBSCRIBER STATS (Admin Only)
// // =====================================================
// /**
//  * @route   GET /api/v1/services/subscribers/stats
//  * @desc    Get subscriber statistics
//  * @access  Private/Admin
//  */
// router.get('/subscribers/stats', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.headers.id);
    
//     if (!user || user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. Admin only.',
//         error: 'FORBIDDEN'
//       });
//     }

//     const total = await NotifySubscriber.countDocuments();
//     const active = await NotifySubscriber.countDocuments({ status: 'active' });
//     const sellers = await NotifySubscriber.countDocuments({ userType: 'Seller' });
//     const customers = await NotifySubscriber.countDocuments({ userType: 'Customer' });
//     const notified = await NotifySubscriber.countDocuments({ notified: true });

//     // Get last 7 days signups
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//     const recentSignups = await NotifySubscriber.countDocuments({
//       createdAt: { $gte: sevenDaysAgo }
//     });

//     return res.status(200).json({
//       success: true,
//       data: {
//         total,
//         active,
//         sellers,
//         customers,
//         notified,
//         pending: total - notified,
//         recentSignups
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get Subscriber Stats Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch subscriber stats',
//       error: 'SERVER_ERROR'
//     });
//   }
// });

// // =====================================================
// // 🗑️ DELETE SUBSCRIBER
// // =====================================================
// /**
//  * @route   DELETE /api/v1/services/subscribers/:id
//  * @desc    Delete a subscriber
//  * @access  Private/Admin
//  */
// router.delete('/subscribers/:id', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.headers.id);
    
//     if (!user || user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. Admin only.',
//         error: 'FORBIDDEN'
//       });
//     }

//     const subscriber = await NotifySubscriber.findByIdAndDelete(req.params.id);

//     if (!subscriber) {
//       return res.status(404).json({
//         success: false,
//         message: 'Subscriber not found',
//         error: 'NOT_FOUND'
//       });
//     }

//     console.log('✅ Subscriber deleted:', subscriber.email);

//     return res.status(200).json({
//       success: true,
//       message: 'Subscriber deleted successfully',
//       data: subscriber
//     });

//   } catch (error) {
//     console.error('❌ Delete Subscriber Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to delete subscriber',
//       error: 'SERVER_ERROR'
//     });
//   }
// });

// // =====================================================
// // 📧 UNSUBSCRIBE ENDPOINT
// // =====================================================
// /**
//  * @route   POST /api/v1/services/unsubscribe
//  * @desc    Unsubscribe from notifications
//  * @access  Public
//  */
// router.post('/unsubscribe', async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email || !email.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email is required',
//         error: 'VALIDATION_ERROR'
//       });
//     }

//     const subscriber = await NotifySubscriber.findOneAndUpdate(
//       { email: email.toLowerCase().trim() },
//       { 
//         status: 'unsubscribed', 
//         unsubscribedAt: new Date() 
//       },
//       { new: true }
//     );

//     if (!subscriber) {
//       return res.status(404).json({
//         success: false,
//         message: 'Email not found in our records',
//         error: 'NOT_FOUND'
//       });
//     }

//     console.log('✅ User unsubscribed:', email);

//     return res.status(200).json({
//       success: true,
//       message: 'Successfully unsubscribed from notifications',
//       data: {
//         email: subscriber.email,
//         unsubscribedAt: subscriber.unsubscribedAt
//       }
//     });

//   } catch (error) {
//     console.error('❌ Unsubscribe Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to unsubscribe',
//       error: 'SERVER_ERROR'
//     });
//   }
// });

// // =====================================================
// // 📧 RESUBSCRIBE ENDPOINT
// // =====================================================
// /**
//  * @route   POST /api/v1/services/resubscribe
//  * @desc    Resubscribe to notifications
//  * @access  Public
//  */
// router.post('/resubscribe', async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email || !email.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email is required',
//         error: 'VALIDATION_ERROR'
//       });
//     }

//     const subscriber = await NotifySubscriber.findOneAndUpdate(
//       { email: email.toLowerCase().trim() },
//       { 
//         status: 'active', 
//         unsubscribedAt: null 
//       },
//       { new: true }
//     );

//     if (!subscriber) {
//       return res.status(404).json({
//         success: false,
//         message: 'Email not found in our records',
//         error: 'NOT_FOUND'
//       });
//     }

//     console.log('✅ User resubscribed:', email);

//     return res.status(200).json({
//       success: true,
//       message: 'Successfully resubscribed to notifications',
//       data: {
//         email: subscriber.email,
//         status: subscriber.status
//       }
//     });

//   } catch (error) {
//     console.error('❌ Resubscribe Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to resubscribe',
//       error: 'SERVER_ERROR'
//     });
//   }
// });

// // =====================================================
// // 📊 GET LAUNCH STATISTICS
// // =====================================================
// /**
//  * @route   GET /api/v1/services/launch-stats
//  * @desc    Get launch statistics and countdown info
//  * @access  Public
//  */
// router.get('/launch-stats', async (req, res) => {
//   try {
//     const launchDate = new Date('2026-02-15T00:00:00');
//     const now = new Date();
//     const diff = launchDate - now;

//     const totalSubscribers = await NotifySubscriber.countDocuments({ status: 'active' });

//     const stats = {
//       launchDate: launchDate.toISOString(),
//       isLaunched: diff <= 0,
//       daysRemaining: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
//       totalSubscribers,
//       countdown: {
//         days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
//         hours: Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
//         minutes: Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))),
//         seconds: Math.max(0, Math.floor((diff % (1000 * 60)) / 1000))
//       }
//     };

//     return res.status(200).json({
//       success: true,
//       message: 'Launch stats fetched successfully',
//       data: stats
//     });

//   } catch (error) {
//     console.error('❌ Launch Stats Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch launch stats',
//       error: 'SERVER_ERROR'
//     });
//   }
// });

// // =====================================================
// // 📧 MARK AS NOTIFIED (Admin Only)
// // =====================================================
// /**
//  * @route   POST /api/v1/services/mark-notified
//  * @desc    Mark subscribers as notified
//  * @access  Private/Admin
//  */
// router.post('/mark-notified', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.headers.id);
    
//     if (!user || user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. Admin only.',
//         error: 'FORBIDDEN'
//       });
//     }

//     const result = await NotifySubscriber.updateMany(
//       { status: 'active', notified: false },
//       { 
//         notified: true, 
//         notifiedAt: new Date(),
//         status: 'notified'
//       }
//     );

//     console.log('✅ Marked subscribers as notified:', result.modifiedCount);

//     return res.status(200).json({
//       success: true,
//       message: `Successfully marked ${result.modifiedCount} subscribers as notified`,
//       data: {
//         modifiedCount: result.modifiedCount
//       }
//     });

//   } catch (error) {
//     console.error('❌ Mark Notified Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to mark subscribers as notified',
//       error: 'SERVER_ERROR'
//     });
//   }
// });

// // =====================================================
// // 📧 EXPORT SUBSCRIBERS (Admin Only)
// // =====================================================
// /**
//  * @route   GET /api/v1/services/export-subscribers
//  * @desc    Export all subscribers as CSV
//  * @access  Private/Admin
//  */
// router.get('/export-subscribers', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.headers.id);
    
//     if (!user || user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. Admin only.',
//         error: 'FORBIDDEN'
//       });
//     }

//     const subscribers = await NotifySubscriber.find()
//       .sort({ createdAt: -1 })
//       .lean();

//     // Convert to CSV format
//     const csvHeader = 'Email,Name,User Type,Status,Notified,Subscribed At,Notified At\n';
//     const csvRows = subscribers.map(sub => {
//       return `${sub.email},${sub.name},${sub.userType},${sub.status},${sub.notified},${new Date(sub.createdAt).toLocaleString()},${sub.notifiedAt ? new Date(sub.notifiedAt).toLocaleString() : 'N/A'}`;
//     }).join('\n');

//     const csv = csvHeader + csvRows;

//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', `attachment; filename=subscribers-${Date.now()}.csv`);
    
//     return res.status(200).send(csv);

//   } catch (error) {
//     console.error('❌ Export Subscribers Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to export subscribers',
//       error: 'SERVER_ERROR'
//     });
//   }
// });

// // =====================================================
// // ✅ HEALTH CHECK
// // =====================================================
// /**
//  * @route   GET /api/v1/services/health
//  * @desc    Check if services routes are working
//  * @access  Public
//  */
// router.get('/health', (req, res) => {
//   return res.status(200).json({
//     success: true,
//     message: 'Services API is running',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//     endpoints: {
//       notifyMe: 'POST /api/v1/services/notify-me',
//       subscribers: 'GET /api/v1/services/subscribers (Admin)',
//       stats: 'GET /api/v1/services/subscribers/stats (Admin)',
//       launchStats: 'GET /api/v1/services/launch-stats',
//       unsubscribe: 'POST /api/v1/services/unsubscribe',
//       health: 'GET /api/v1/services/health'
//     }
//   });
// });


// router.get('/my-subscriptions', authenticateToken, async (req, res) => {
//   try {
//     const { email } = req.query;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email parameter is required',
//         error: 'VALIDATION_ERROR'
//       });
//     }

//     // Find all subscriptions for this email
//     const subscriptions = await NotifySubscriber.find({
//       email: email.toLowerCase().trim()
//     }).sort({ createdAt: -1 });

//     if (subscriptions.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: 'No subscriptions found',
//         data: []
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Subscriptions fetched successfully',
//       data: subscriptions,
//       count: subscriptions.length
//     });

//   } catch (error) {
//     console.error('❌ Get My Subscriptions Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch subscriptions',
//       error: 'SERVER_ERROR'
//     });
//   }
// });


// module.exports = router;


const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../routes/userAuth');
const NotifySubscriber = require('../models/notifySubscriberSchema');
const User = require('../models/user');

// =====================================================
// 📧 NOTIFY-ME ENDPOINT (REQUIRES AUTHENTICATION)
// =====================================================
router.post('/notify-me', authenticateToken, async (req, res) => {
  try {
    const { email, userType } = req.body;
    const userId = req.headers.id;

    console.log('📧 NOTIFY-ME REQUEST:', { email, userId });

    // ✅ Get user details from database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please login again.',
        error: 'USER_NOT_FOUND'
      });
    }

    // ✅ Validate that email matches user's email
    const userEmail = user.email.toLowerCase().trim();
    const inputEmail = email ? email.toLowerCase().trim() : userEmail;

    if (inputEmail !== userEmail) {
      return res.status(403).json({
        success: false,
        message: 'You can only subscribe with your registered email address',
        error: 'EMAIL_MISMATCH',
        data: {
          yourEmail: userEmail,
          attemptedEmail: inputEmail
        }
      });
    }

    const name = user.username || 'User';

    // ✅ Check if email already exists for this user
    const existingSubscriber = await NotifySubscriber.findOne({ 
      email: userEmail,
      userId: userId
    });

    console.log('🔍 Existing subscriber check:', existingSubscriber ? 'FOUND' : 'NOT FOUND');

    if (existingSubscriber) {
      console.log('📋 Existing subscription status:', existingSubscriber.status);
      
      // If unsubscribed, resubscribe them
      if (existingSubscriber.status === 'unsubscribed') {
        existingSubscriber.status = 'active';
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();

        console.log('✅ User resubscribed:', userEmail);

        return res.status(200).json({
          success: true,
          message: 'Welcome back! You have been resubscribed. 🎉',
          data: {
            email: existingSubscriber.email,
            name: existingSubscriber.name,
            userId: existingSubscriber.userId,
            subscribedAt: existingSubscriber.createdAt,
            resubscribed: true
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'You are already subscribed!',
        data: {
          email: existingSubscriber.email,
          name: existingSubscriber.name,
          userId: existingSubscriber.userId,
          subscribedAt: existingSubscriber.createdAt,
          alreadySubscribed: true
        }
      });
    }

    // ✅ Create new subscriber with user details
    const newSubscriber = new NotifySubscriber({
      email: userEmail,
      name: name.trim(),
      userId: userId,
      userType: userType || (user.role === 'seller' ? 'Seller' : 'Customer'),
      timestamp: new Date().toISOString(),
      status: 'active',
      notified: false,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });

    await newSubscriber.save();

    console.log('✅ New subscriber registered:', userEmail, 'User ID:', userId);

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for launch notification! 🎉',
      data: {
        email: newSubscriber.email,
        name: newSubscriber.name,
        userId: newSubscriber.userId,
        subscribedAt: newSubscriber.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Notify-Me Error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed!',
        error: 'DUPLICATE_EMAIL'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to register for notifications. Please try again later.',
      error: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// =====================================================
// 📧 NEWSLETTER SUBSCRIPTION (PUBLIC - for homepage)
// =====================================================
router.post('/newsletter-subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    console.log('📧 NEWSLETTER-SUBSCRIBE REQUEST:', { email, name });

    // ✅ Validation
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
        error: 'VALIDATION_ERROR'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        error: 'INVALID_EMAIL'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // ✅ Check if this email is already registered with a user account
    const existingUser = await User.findOne({ email: cleanEmail });
    
    if (existingUser) {
      console.log('👤 Found existing user account for:', cleanEmail);
      
      // Check if they have a subscription
      const existingSubscription = await NotifySubscriber.findOne({
        email: cleanEmail,
        userId: existingUser._id
      });

      if (existingSubscription) {
        console.log('📋 Found existing subscription, status:', existingSubscription.status);
        
        if (existingSubscription.status === 'unsubscribed') {
          existingSubscription.status = 'active';
          existingSubscription.unsubscribedAt = null;
          await existingSubscription.save();

          console.log('✅ Resubscribed existing user');

          return res.status(200).json({
            success: true,
            message: 'Welcome back! You have been resubscribed. 🎉',
            data: {
              email: existingSubscription.email,
              resubscribed: true
            }
          });
        }

        return res.status(200).json({
          success: true,
          message: 'You are already subscribed!',
          data: {
            email: existingSubscription.email,
            alreadySubscribed: true
          }
        });
      }

      // Create subscription linked to their account
      const newSubscriber = new NotifySubscriber({
        email: cleanEmail,
        name: existingUser.username || name?.trim() || 'Newsletter Subscriber',
        userId: existingUser._id,
        userType: existingUser.role === 'seller' ? 'Seller' : 'Customer',
        timestamp: new Date().toISOString(),
        status: 'active',
        notified: false,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent')
      });

      await newSubscriber.save();

      console.log('✅ Newsletter subscriber (existing user):', cleanEmail, 'userId:', existingUser._id);

      return res.status(201).json({
        success: true,
        message: 'Successfully subscribed to our newsletter! 🎉',
        data: {
          email: newSubscriber.email,
          linkedToAccount: true
        }
      });
    }

    // ✅ For non-registered users, check if email already subscribed
    const existingSubscriber = await NotifySubscriber.findOne({ 
      email: cleanEmail,
      userId: null // Newsletter-only subscribers without account
    });

    if (existingSubscriber) {
      console.log('📋 Found newsletter-only subscription, status:', existingSubscriber.status);
      
      if (existingSubscriber.status === 'unsubscribed') {
        existingSubscriber.status = 'active';
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();

        return res.status(200).json({
          success: true,
          message: 'Welcome back! You have been resubscribed. 🎉',
          data: {
            email: existingSubscriber.email,
            resubscribed: true
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'You are already subscribed!',
        data: {
          email: existingSubscriber.email,
          alreadySubscribed: true
        }
      });
    }

    // ✅ Create new newsletter-only subscriber
    const newSubscriber = new NotifySubscriber({
      email: cleanEmail,
      name: name?.trim() || 'Newsletter Subscriber',
      userId: null, // No user account linked
      userType: 'Customer',
      timestamp: new Date().toISOString(),
      status: 'active',
      notified: false,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });

    await newSubscriber.save();

    console.log('✅ New newsletter subscriber (no account):', cleanEmail);

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter! 🎉',
      data: {
        email: newSubscriber.email,
        subscribedAt: newSubscriber.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Newsletter Subscribe Error:', error);
    
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed!',
        error: 'DUPLICATE_EMAIL'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.',
      error: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// =====================================================
// 📊 GET MY SUBSCRIPTIONS (REQUIRES AUTHENTICATION)
// =====================================================
router.get('/my-subscriptions', authenticateToken, async (req, res) => {
  try {
    const { email } = req.query;
    const userId = req.headers.id;

    console.log('🔍 MY-SUBSCRIPTIONS REQUEST:', { email, userId });

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required',
        error: 'VALIDATION_ERROR'
      });
    }

    // ✅ Verify user owns this email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const userEmail = user.email.toLowerCase().trim();
    const requestedEmail = email.toLowerCase().trim();

    console.log('📧 Email comparison:', { userEmail, requestedEmail });

    if (userEmail !== requestedEmail) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own subscriptions',
        error: 'FORBIDDEN'
      });
    }

    // ✅ Find ALL subscriptions for this user (by email OR userId)
    // This handles both old subscriptions (without userId) and new ones (with userId)
    const subscriptions = await NotifySubscriber.find({
      $or: [
        { email: userEmail, userId: userId },
        { email: userEmail, userId: null }
      ]
    }).sort({ createdAt: -1 });

    console.log(`📋 Found ${subscriptions.length} subscription(s) for ${userEmail}`);
    
    if (subscriptions.length > 0) {
      console.log('Subscription details:', subscriptions.map(s => ({
        email: s.email,
        userId: s.userId,
        status: s.status,
        createdAt: s.createdAt
      })));
    }

    return res.status(200).json({
      success: true,
      message: subscriptions.length > 0 ? 'Subscriptions fetched successfully' : 'No subscriptions found',
      data: subscriptions,
      count: subscriptions.length
    });

  } catch (error) {
    console.error('❌ Get My Subscriptions Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: 'SERVER_ERROR'
    });
  }
});

// =====================================================
// 📧 UNSUBSCRIBE ENDPOINT
// =====================================================
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('🚫 UNSUBSCRIBE REQUEST:', { email });

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
        error: 'VALIDATION_ERROR'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const subscriber = await NotifySubscriber.findOneAndUpdate(
      { email: cleanEmail },
      { 
        status: 'unsubscribed', 
        unsubscribedAt: new Date() 
      },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our records',
        error: 'NOT_FOUND'
      });
    }

    console.log('✅ User unsubscribed:', cleanEmail);

    return res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from notifications',
      data: {
        email: subscriber.email,
        unsubscribedAt: subscriber.unsubscribedAt
      }
    });

  } catch (error) {
    console.error('❌ Unsubscribe Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe',
      error: 'SERVER_ERROR'
    });
  }
});

// =====================================================
// 📧 RESUBSCRIBE ENDPOINT
// =====================================================
router.post('/resubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('✅ RESUBSCRIBE REQUEST:', { email });

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
        error: 'VALIDATION_ERROR'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const subscriber = await NotifySubscriber.findOneAndUpdate(
      { email: cleanEmail },
      { 
        status: 'active', 
        unsubscribedAt: null 
      },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our records',
        error: 'NOT_FOUND'
      });
    }

    console.log('✅ User resubscribed:', cleanEmail);

    return res.status(200).json({
      success: true,
      message: 'Successfully resubscribed to notifications',
      data: {
        email: subscriber.email,
        status: subscriber.status
      }
    });

  } catch (error) {
    console.error('❌ Resubscribe Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resubscribe',
      error: 'SERVER_ERROR'
    });
  }
});

// =====================================================
// 📊 GET ALL SUBSCRIBERS (Admin Only)
// =====================================================
router.get('/subscribers', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
        error: 'FORBIDDEN'
      });
    }

    const subscribers = await NotifySubscriber.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    const stats = {
      total: subscribers.length,
      sellers: subscribers.filter(s => s.userType === 'Seller').length,
      customers: subscribers.filter(s => s.userType === 'Customer').length,
      notified: subscribers.filter(s => s.notified).length,
      pending: subscribers.filter(s => !s.notified).length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
      withAccount: subscribers.filter(s => s.userId).length,
      newsletterOnly: subscribers.filter(s => !s.userId).length
    };

    return res.status(200).json({
      success: true,
      message: 'Subscribers fetched successfully',
      data: subscribers,
      stats
    });

  } catch (error) {
    console.error('❌ Get Subscribers Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers',
      error: 'SERVER_ERROR'
    });
  }
});

// =====================================================
// 📊 GET SUBSCRIBER STATS (Admin Only)
// =====================================================
router.get('/subscribers/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
        error: 'FORBIDDEN'
      });
    }

    const total = await NotifySubscriber.countDocuments();
    const active = await NotifySubscriber.countDocuments({ status: 'active' });
    const sellers = await NotifySubscriber.countDocuments({ userType: 'Seller' });
    const customers = await NotifySubscriber.countDocuments({ userType: 'Customer' });
    const notified = await NotifySubscriber.countDocuments({ notified: true });
    const withAccount = await NotifySubscriber.countDocuments({ userId: { $ne: null } });
    const newsletterOnly = await NotifySubscriber.countDocuments({ userId: null });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSignups = await NotifySubscriber.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    return res.status(200).json({
      success: true,
      data: {
        total,
        active,
        sellers,
        customers,
        notified,
        pending: total - notified,
        recentSignups,
        withAccount,
        newsletterOnly
      }
    });

  } catch (error) {
    console.error('❌ Get Subscriber Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriber stats',
      error: 'SERVER_ERROR'
    });
  }
});

// =====================================================
// 🗑️ DELETE SUBSCRIBER
// =====================================================
router.delete('/subscribers/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
        error: 'FORBIDDEN'
      });
    }

    const subscriber = await NotifySubscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
        error: 'NOT_FOUND'
      });
    }

    console.log('✅ Subscriber deleted:', subscriber.email);

    return res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully',
      data: subscriber
    });

  } catch (error) {
    console.error('❌ Delete Subscriber Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subscriber',
      error: 'SERVER_ERROR'
    });
  }
});

// =====================================================
// 📊 GET LAUNCH STATISTICS
// =====================================================
router.get('/launch-stats', async (req, res) => {
  try {
    const launchDate = new Date('2026-02-15T00:00:00');
    const now = new Date();
    const diff = launchDate - now;

    const totalSubscribers = await NotifySubscriber.countDocuments({ status: 'active' });

    const stats = {
      launchDate: launchDate.toISOString(),
      isLaunched: diff <= 0,
      daysRemaining: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      totalSubscribers,
      countdown: {
        days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        minutes: Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))),
        seconds: Math.max(0, Math.floor((diff % (1000 * 60)) / 1000))
      }
    };

    return res.status(200).json({
      success: true,
      message: 'Launch stats fetched successfully',
      data: stats
    });

  } catch (error) {
    console.error('❌ Launch Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch launch stats',
      error: 'SERVER_ERROR'
    });
  }
});

// =====================================================
// 📧 MARK AS NOTIFIED (Admin Only)
// =====================================================
router.post('/mark-notified', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
        error: 'FORBIDDEN'
      });
    }

    const result = await NotifySubscriber.updateMany(
      { status: 'active', notified: false },
      { 
        notified: true, 
        notifiedAt: new Date(),
        status: 'notified'
      }
    );

    console.log('✅ Marked subscribers as notified:', result.modifiedCount);

    return res.status(200).json({
      success: true,
      message: `Successfully marked ${result.modifiedCount} subscribers as notified`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('❌ Mark Notified Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark subscribers as notified',
      error: 'SERVER_ERROR'
    });
  }
});

// =====================================================
// 📧 EXPORT SUBSCRIBERS (Admin Only)
// =====================================================
router.get('/export-subscribers', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
        error: 'FORBIDDEN'
      });
    }

    const subscribers = await NotifySubscriber.find()
      .sort({ createdAt: -1 })
      .lean();

    const csvHeader = 'Email,Name,User ID,User Type,Status,Notified,Subscribed At,Notified At\n';
    const csvRows = subscribers.map(sub => {
      return `${sub.email},${sub.name},${sub.userId || 'N/A'},${sub.userType},${sub.status},${sub.notified},${new Date(sub.createdAt).toLocaleString()},${sub.notifiedAt ? new Date(sub.notifiedAt).toLocaleString() : 'N/A'}`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=subscribers-${Date.now()}.csv`);
    
    return res.status(200).send(csv);

  } catch (error) {
    console.error('❌ Export Subscribers Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export subscribers',
      error: 'SERVER_ERROR'
    });
  }
});

// =====================================================
// ✅ HEALTH CHECK
// =====================================================
router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Services API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    endpoints: {
      notifyMe: 'POST /api/v1/services/notify-me (Auth Required)',
      newsletterSubscribe: 'POST /api/v1/services/newsletter-subscribe (Public)',
      mySubscriptions: 'GET /api/v1/services/my-subscriptions (Auth Required)',
      unsubscribe: 'POST /api/v1/services/unsubscribe (Public)',
      resubscribe: 'POST /api/v1/services/resubscribe (Public)',
      subscribers: 'GET /api/v1/services/subscribers (Admin)',
      stats: 'GET /api/v1/services/subscribers/stats (Admin)',
      launchStats: 'GET /api/v1/services/launch-stats',
      health: 'GET /api/v1/services/health'
    }
  });
});

module.exports = router;