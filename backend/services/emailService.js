// const nodemailer = require("nodemailer");

// // Create transporter with optimized Gmail settings
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//     tls: {
//       rejectUnauthorized: false,
//       minVersion: "TLSv1.2",
//     },
//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000,
//   });
// };

// const transporter = createTransporter();

// // Verify email service on startup
// setTimeout(() => {
//   transporter.verify((error, success) => {
//     if (error) {
//       console.error("❌ Email service initialization failed:", error.message);
//     } else {
//       console.log("✅ Email service initialized successfully");
//     }
//   });
// }, 3000);

// /**
//  * Send OTP verification email
//  * @param {string} email - Recipient email address
//  * @param {string} otp - 6-digit OTP code
//  * @param {number} retries - Number of retry attempts
//  * @returns {Promise<boolean>} Success status
//  */
// const sendEmailOTP = async (email, otp, retries = 3) => {
//   const currentYear = new Date().getFullYear();

//   const mailOptions = {
//     from: `"BookBalcony - RAO DevStudio" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "🔐 Password Reset Verification Code",
//     html: `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Password Reset Verification</title>
//       </head>
//       <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
//         <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
//           <tr>
//             <td style="padding: 40px 20px;">
//               <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
//                 <!-- Header -->
//                 <tr>
//                   <td style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 48px 40px; text-align: center; border-radius: 16px 16px 0 0;">
//                     <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
//                       <tr>
//                         <td style="text-align: center;">
//                           <div style="font-size: 48px; margin-bottom: 16px;">📚</div>
//                           <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">BookBalcony</h1>
//                           <p style="margin: 8px 0 0 0; font-size: 14px; color: #1a1a1a; font-weight: 500; letter-spacing: 1px;">YOUR TRUSTED BOOKSTORE</p>
//                         </td>
//                       </tr>
//                     </table>
//                   </td>
//                 </tr>

//                 <!-- Content -->
//                 <tr>
//                   <td style="padding: 48px 40px;">
//                     <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      
//                       <!-- Greeting -->
//                       <tr>
//                         <td style="padding-bottom: 24px;">
//                           <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Password Reset Request</h2>
//                         </td>
//                       </tr>

//                       <!-- Message -->
//                       <tr>
//                         <td style="padding-bottom: 32px;">
//                           <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
//                             Hello,<br><br>
//                             We received a request to reset your password. To proceed with resetting your password, please use the verification code below.
//                           </p>
//                         </td>
//                       </tr>

//                       <!-- OTP Box -->
//                       <tr>
//                         <td style="padding-bottom: 32px;">
//                           <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #fbbf24; border-radius: 12px;">
//                             <tr>
//                               <td style="padding: 32px; text-align: center;">
//                                 <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; color: #92400e; text-transform: uppercase; letter-spacing: 1.5px;">VERIFICATION CODE</p>
//                                 <p style="margin: 0; font-size: 40px; font-weight: 700; color: #78350f; letter-spacing: 12px; font-family: 'Courier New', monospace; user-select: all; -webkit-user-select: all; -moz-user-select: all; -ms-user-select: all;">${otp}</p>
//                                 <p style="margin: 16px 0 8px 0; font-size: 14px; color: #92400e; font-weight: 500;">⏱ Valid for 10 minutes</p>
//                                 <p style="margin: 8px 0 0 0; font-size: 12px; color: #92400e; font-style: italic;">💡 Tap the code above to select and copy</p>
//                               </td>
//                             </tr>
//                           </table>
//                         </td>
//                       </tr>

//                       <!-- Info Message -->
//                       <tr>
//                         <td style="padding-bottom: 32px;">
//                           <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #6b7280;">
//                             Enter this code on the password reset page to continue. If you did not request a password reset, please ignore this email and your account will remain secure.
//                           </p>
//                         </td>
//                       </tr>

//                       <!-- Security Alert -->
//                       <tr>
//                         <td style="padding-bottom: 32px;">
//                           <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px;">
//                             <tr>
//                               <td style="padding: 24px;">
//                                 <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #991b1b;">🛡️ Security Guidelines</p>
//                                 <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
//                                   <tr>
//                                     <td style="padding: 4px 0;">
//                                       <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #7f1d1d;">• Never share this code with anyone</p>
//                                     </td>
//                                   </tr>
//                                   <tr>
//                                     <td style="padding: 4px 0;">
//                                       <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #7f1d1d;">• BookBalcony will never ask for your OTP</p>
//                                     </td>
//                                   </tr>
//                                   <tr>
//                                     <td style="padding: 4px 0;">
//                                       <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #7f1d1d;">• This code expires after 10 minutes</p>
//                                     </td>
//                                   </tr>
//                                   <tr>
//                                     <td style="padding: 4px 0;">
//                                       <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #7f1d1d;">• Secure your account if you didn't request this</p>
//                                     </td>
//                                   </tr>
//                                 </table>
//                               </td>
//                             </tr>
//                           </table>
//                         </td>
//                       </tr>

//                       <!-- Divider -->
//                       <tr>
//                         <td style="padding: 24px 0;">
//                           <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
//                             <tr>
//                               <td style="border-top: 1px solid #e5e7eb;"></td>
//                             </tr>
//                           </table>
//                         </td>
//                       </tr>

//                       <!-- Support Section -->
//                       <tr>
//                         <td style="text-align: center;">
//                           <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 500; color: #374151;">Need Help?</p>
//                           <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280;">Our support team is here to assist you 24/7</p>
//                           <a href="mailto:support@bookbalcony.com" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">Contact Support</a>
//                         </td>
//                       </tr>

//                     </table>
//                   </td>
//                 </tr>

//                 <!-- Footer -->
//                 <tr>
//                   <td style="background-color: #111827; padding: 40px; text-align: center; border-radius: 0 0 16px 16px;">
//                     <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      
//                       <!-- Brand -->
//                       <tr>
//                         <td style="padding-bottom: 16px;">
//                           <p style="margin: 0; font-size: 20px; font-weight: 700; color: #fbbf24;">BookBalcony</p>
//                         </td>
//                       </tr>

//                       <!-- Tagline -->
//                       <tr>
//                         <td style="padding-bottom: 24px;">
//                           <p style="margin: 0; font-size: 13px; color: #9ca3af;">Discover, Read, and Explore</p>
//                         </td>
//                       </tr>

//                       <!-- Divider -->
//                       <tr>
//                         <td style="padding-bottom: 24px;">
//                           <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
//                             <tr>
//                               <td style="border-top: 1px solid #374151;"></td>
//                             </tr>
//                           </table>
//                         </td>
//                       </tr>

//                       <!-- Links -->
//                       <tr>
//                         <td style="padding-bottom: 24px;">
//                           <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
//                             <tr>
//                               <td style="text-align: center;">
//                                 <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px; border-right: 1px solid #4b5563;">Privacy Policy</a>
//                                 <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px; border-right: 1px solid #4b5563;">Terms of Service</a>
//                                 <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px; border-right: 1px solid #4b5563;">Help Center</a>
//                                 <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px;">Contact</a>
//                               </td>
//                             </tr>
//                           </table>
//                         </td>
//                       </tr>

//                       <!-- Info Text -->
//                       <tr>
//                         <td style="padding-bottom: 20px;">
//                           <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #6b7280;">
//                             This is an automated security message from BookBalcony.<br>
//                             Please do not reply to this email.
//                           </p>
//                         </td>
//                       </tr>

//                       <!-- Copyright -->
//                       <tr>
//                         <td style="padding-top: 20px; border-top: 1px solid #374151;">
//                           <p style="margin: 0; font-size: 11px; color: #4b5563;">
//                             © ${currentYear} BookBalcony. All Rights Reserved.<br>
//                             Developed with ❤️ by <span style="color: #fbbf24; font-weight: 600;">RAO DevStudios</span>
//                           </p>
//                         </td>
//                       </tr>

//                     </table>
//                   </td>
//                 </tr>

//               </table>
//             </td>
//           </tr>
//         </table>
//       </body>
//       </html>
//     `,
//     text: `
// BookBalcony - Password Reset Verification

// Hello,

// We received a request to reset your password. Please use the verification code below to proceed.

// YOUR VERIFICATION CODE: ${otp}

// This code will expire in 10 minutes.

// SECURITY GUIDELINES:
// • Never share this code with anyone
// • BookBalcony will never ask for your OTP
// • This code expires after 10 minutes
// • Secure your account if you didn't request this

// Need help? Contact us at support@bookbalcony.com

// ---

// BookBalcony
// Discover, Read, and Explore

// Privacy Policy | Terms of Service | Help Center | Contact

// This is an automated security message from BookBalcony.
// Please do not reply to this email.

// © ${currentYear} BookBalcony. All Rights Reserved.
// Developed with ❤️ by RAO DevStudios
//     `,
//   };

//   // Retry logic with exponential backoff
//   for (let attempt = 0; attempt <= retries; attempt++) {
//     try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log(`✅ OTP email sent successfully to ${email}`);
//       return true;
//     } catch (error) {
//       console.error(`❌ Email sending failed (attempt ${attempt + 1}/${retries + 1}):`, error.message);

//       if (attempt === retries) {
//         if (error.code === "EAUTH") {
//           throw new Error("Email authentication failed. Please verify your credentials.");
//         } else if (error.code === "ESOCKET" || error.code === "ETIMEDOUT") {
//           throw new Error("Email service temporarily unavailable. Please try again later.");
//         } else if (error.responseCode === 535) {
//           throw new Error("Email authentication error. Please contact support.");
//         } else {
//           throw new Error("Unable to send verification email. Please try again.");
//         }
//       }

//       // Exponential backoff
//       await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
//     }
//   }
// };

// module.exports = { sendEmailOTP };


const nodemailer = require("nodemailer");

// Create transporter with optimized Gmail settings
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

const transporter = createTransporter();

// Verify email service on startup
setTimeout(() => {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email service initialization failed:", error.message);
    } else {
      console.log("✅ Email service initialized successfully");
    }
  });
}, 3000);

/**
 * Send OTP verification email
 */
const sendEmailOTP = async (email, otp, retries = 3) => {
  const currentYear = new Date().getFullYear();

  const mailOptions = {
    from: `"BookBalcony - RAO DevStudio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Password Reset Verification Code",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 48px 40px; text-align: center; border-radius: 16px 16px 0 0;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📚</div>
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">BookBalcony</h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #1a1a1a; font-weight: 500; letter-spacing: 1px;">YOUR TRUSTED BOOKSTORE</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 48px 40px;">
                    <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #111827;">Password Reset Request</h2>
                    
                    <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                      Hello,<br><br>
                      We received a request to reset your password. To proceed with resetting your password, please use the verification code below.
                    </p>

                    <!-- OTP Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #fbbf24; border-radius: 12px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 32px; text-align: center;">
                          <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; color: #92400e; text-transform: uppercase; letter-spacing: 1.5px;">VERIFICATION CODE</p>
                          <p style="margin: 0; font-size: 40px; font-weight: 700; color: #78350f; letter-spacing: 12px; font-family: 'Courier New', monospace;">${otp}</p>
                          <p style="margin: 16px 0 0 0; font-size: 14px; color: #92400e; font-weight: 500;">⏱ Valid for 10 minutes</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.6; color: #6b7280;">
                      If you did not request a password reset, please ignore this email and your account will remain secure.
                    </p>

                    <!-- Support Section -->
                    <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 500; color: #374151;">Need Help?</p>
                      <a href="mailto:support@bookbalcony.com" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">Contact Support</a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 40px; text-align: center; border-radius: 0 0 16px 16px;">
                    <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #fbbf24;">BookBalcony</p>
                    <p style="margin: 0 0 24px 0; font-size: 13px; color: #9ca3af;">Discover, Read, and Explore</p>
                    <p style="margin: 0; font-size: 11px; color: #4b5563;">
                      © ${currentYear} BookBalcony. All Rights Reserved.<br>
                      Developed with ❤️ by <span style="color: #fbbf24; font-weight: 600;">RAO DevStudios</span>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error(`❌ Email sending failed (attempt ${attempt + 1}/${retries + 1}):`, error.message);
      if (attempt === retries) {
        throw new Error("Unable to send verification email. Please try again.");
      }
      await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
};

/**
 * Send seller application approval email
 */
const sendSellerApprovalEmail = async (sellerData) => {
  const currentYear = new Date().getFullYear();
  const { email, fullName, businessName } = sellerData;

  const mailOptions = {
    from: `"BookBalcony Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎉 Congratulations! Your Seller Application Has Been Approved",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header with celebration -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 40px; text-align: center; border-radius: 16px 16px 0 0;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Welcome to BookBalcony!</h1>
                    <p style="margin: 12px 0 0 0; font-size: 16px; color: #d1fae5; font-weight: 500;">Your seller application has been approved</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 48px 40px;">
                    
                    <!-- Greeting -->
                    <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827;">Dear ${fullName},</h2>
                    
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                      We are thrilled to inform you that your seller application for <strong style="color: #059669;">${businessName || 'your business'}</strong> has been approved! 🌟
                    </p>

                    <!-- Success Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border: 2px solid #10b981; border-radius: 12px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 32px;">
                          <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #065f46; text-align: center;">✅ You're now an official BookBalcony seller!</p>
                          <p style="margin: 0; font-size: 14px; color: #065f46; text-align: center; line-height: 1.6;">
                            Start uploading your books and reach thousands of readers across the country
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Next Steps -->
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827;">🚀 Next Steps:</h3>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 16px; background-color: #f9fafb; border-left: 4px solid #fbbf24; border-radius: 8px; margin-bottom: 12px;">
                          <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">1. Complete Your Profile</p>
                          <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">Add your business details, bank information, and pickup address</p>
                        </td>
                      </tr>
                      <tr><td style="height: 12px;"></td></tr>
                      <tr>
                        <td style="padding: 16px; background-color: #f9fafb; border-left: 4px solid #fbbf24; border-radius: 8px; margin-bottom: 12px;">
                          <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">2. Upload Your First Product</p>
                          <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">Start adding books with detailed descriptions and competitive pricing</p>
                        </td>
                      </tr>
                      <tr><td style="height: 12px;"></td></tr>
                      <tr>
                        <td style="padding: 16px; background-color: #f9fafb; border-left: 4px solid #fbbf24; border-radius: 8px;">
                          <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">3. Start Selling</p>
                          <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">Manage orders, track sales, and grow your business</p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="http://localhost:3000/seller/dashboard" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1a1a1a; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);">
                        Go to Seller Dashboard
                      </a>
                    </div>

                    <!-- Support Info -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin-top: 32px;">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">💡 Seller Resources</p>
                          <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.6;">
                            • <strong>Seller Guide:</strong> Learn best practices for successful selling<br>
                            • <strong>Support Team:</strong> Available 24/7 at support@bookbalcony.com<br>
                            • <strong>Community:</strong> Join our seller community for tips and networking
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <div style="margin: 32px 0; border-top: 1px solid #e5e7eb;"></div>

                    <!-- Thank You -->
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                      Thank you for choosing BookBalcony as your selling platform. We're excited to have you on board and look forward to your success!
                    </p>
                    
                    <p style="margin: 24px 0 0 0; font-size: 16px; color: #111827;">
                      <strong>Happy Selling! 📚</strong><br>
                      <span style="color: #6b7280;">The BookBalcony Team</span>
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 40px; text-align: center; border-radius: 0 0 16px 16px;">
                    <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #fbbf24;">BookBalcony</p>
                    <p style="margin: 0 0 24px 0; font-size: 13px; color: #9ca3af;">Discover, Read, and Explore</p>
                    <div style="margin-bottom: 24px;">
                      <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px; border-right: 1px solid #4b5563;">Seller Dashboard</a>
                      <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px; border-right: 1px solid #4b5563;">Help Center</a>
                      <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px;">Contact Support</a>
                    </div>
                    <p style="margin: 0; font-size: 11px; color: #4b5563;">
                      © ${currentYear} BookBalcony. All Rights Reserved.<br>
                      Developed with ❤️ by <span style="color: #fbbf24; font-weight: 600;">RAO DevStudios</span>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Seller approval email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send approval email:", error.message);
    throw error;
  }
};

/**
 * Send seller application rejection email
 */
const sendSellerRejectionEmail = async (sellerData, reason) => {
  const currentYear = new Date().getFullYear();
  const { email, fullName, businessName } = sellerData;

  const mailOptions = {
    from: `"BookBalcony Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Application Status Update - BookBalcony Seller Program",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0;">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 48px 40px; text-align: center; border-radius: 16px 16px 0 0;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Application Status Update</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 48px 40px;">
                    
                    <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827;">Dear ${fullName},</h2>
                    
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                      Thank you for your interest in becoming a seller on BookBalcony. After careful review of your application for <strong>${businessName || 'your business'}</strong>, we regret to inform you that we are unable to approve your application at this time.
                    </p>

                    <!-- Reason Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #991b1b;">Reason for Rejection:</p>
                          <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.6;">
                            ${reason || 'Your application did not meet our current seller requirements.'}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- What's Next -->
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827;">What You Can Do:</h3>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin-bottom: 12px;">
                          <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e40af;">✓ Review Requirements</p>
                          <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.5;">Carefully review our seller requirements and ensure you meet all criteria</p>
                        </td>
                      </tr>
                      <tr><td style="height: 12px;"></td></tr>
                      <tr>
                        <td style="padding: 16px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin-bottom: 12px;">
                          <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e40af;">✓ Improve Your Application</p>
                          <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.5;">Address the concerns mentioned above before reapplying</p>
                        </td>
                      </tr>
                      <tr><td style="height: 12px;"></td></tr>
                      <tr>
                        <td style="padding: 16px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
                          <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e40af;">✓ Reapply When Ready</p>
                          <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.5;">You're welcome to submit a new application once you've addressed these issues</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Support -->
                    <div style="margin: 32px 0; padding: 24px; background-color: #fef3c7; border-left: 4px solid #fbbf24; border-radius: 8px;">
                      <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #92400e;">Need Help?</p>
                      <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6;">
                        If you have questions about this decision or need clarification on our seller requirements, please don't hesitate to contact our support team at <a href="mailto:support@bookbalcony.com" style="color: #92400e; font-weight: 600;">support@bookbalcony.com</a>
                      </p>
                    </div>

                    <div style="margin: 32px 0; border-top: 1px solid #e5e7eb;"></div>

                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                      We appreciate your interest in BookBalcony and encourage you to reapply once you've had the opportunity to address the concerns outlined above.
                    </p>
                    
                    <p style="margin: 24px 0 0 0; font-size: 16px; color: #111827;">
                      <strong>Best regards,</strong><br>
                      <span style="color: #6b7280;">The BookBalcony Team</span>
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 40px; text-align: center; border-radius: 0 0 16px 16px;">
                    <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #fbbf24;">BookBalcony</p>
                    <p style="margin: 0 0 24px 0; font-size: 13px; color: #9ca3af;">Discover, Read, and Explore</p>
                    <div style="margin-bottom: 24px;">
                      <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px; border-right: 1px solid #4b5563;">Seller Requirements</a>
                      <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px; border-right: 1px solid #4b5563;">Help Center</a>
                      <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px;">Contact Support</a>
                    </div>
                    <p style="margin: 0; font-size: 11px; color: #4b5563;">
                      © ${currentYear} BookBalcony. All Rights Reserved.<br>
                      Developed with ❤️ by <span style="color: #fbbf24; font-weight: 600;">RAO DevStudios</span>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Seller rejection email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send rejection email:", error.message);
    throw error;
  }
};

/**
 * Send seller ban notification email
 */
const sendSellerBanEmail = async (sellerData, reason) => {
  const currentYear = new Date().getFullYear();
  const { email, fullName, businessName } = sellerData;

  const mailOptions = {
    from: `"BookBalcony Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "⚠️ Important: Your Seller Account Has Been Suspended",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 48px 40px; text-align: center; border-radius: 16px 16px 0 0;">
                    <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Account Suspension Notice</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 48px 40px;">
                    
                    <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827;">Dear ${fullName},</h2>
                    
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                      We are writing to inform you that your seller account for <strong>${businessName || 'your business'}</strong> has been temporarily suspended from the BookBalcony platform.
                    </p>

                    <!-- Reason Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #991b1b;">Reason for Suspension:</p>
                          <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.6;">
                            ${reason || 'Violation of our seller terms and conditions.'}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- What This Means -->
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827;">What This Means:</h3>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px; background-color: #f1f5f9; border-left: 4px solid #64748b; border-radius: 8px; margin-bottom: 12px;">
                          <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">
                            • Your products have been temporarily removed from the marketplace<br>
                            • You will not be able to receive new orders<br>
                            • Existing orders must be fulfilled as per our policies<br>
                            • Your seller dashboard access is restricted
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Appeal Process -->
                    <div style="margin: 32px 0; padding: 24px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
                      <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">📧 Appeal This Decision</p>
                      <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.6;">
                        If you believe this suspension was made in error or would like to appeal this decision, please contact our support team at <a href="mailto:support@bookbalcony.com" style="color: #1e40af; font-weight: 600;">support@bookbalcony.com</a> with your account details and explanation within 7 days.
                      </p>
                    </div>

                    <div style="margin: 32px 0; border-top: 1px solid #e5e7eb;"></div>

                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                      We take our community guidelines seriously to ensure a safe and trustworthy marketplace for all users. We appreciate your understanding.
                    </p>
                    
                    <p style="margin: 24px 0 0 0; font-size: 16px; color: #111827;">
                      <strong>Sincerely,</strong><br>
                      <span style="color: #6b7280;">The BookBalcony Trust & Safety Team</span>
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 40px; text-align: center; border-radius: 0 0 16px 16px;">
                    <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #fbbf24;">BookBalcony</p>
                    <p style="margin: 0 0 24px 0; font-size: 13px; color: #9ca3af;">Discover, Read, and Explore</p>
                    <div style="margin-bottom: 24px;">
                      <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px; border-right: 1px solid #4b5563;">Community Guidelines</a>
                      <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px; border-right: 1px solid #4b5563;">Help Center</a>
                      <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; padding: 0 12px;">Contact Support</a>
                    </div>
                    <p style="margin: 0; font-size: 11px; color: #4b5563;">
                      © ${currentYear} BookBalcony. All Rights Reserved.<br>
                      Developed with ❤️ by <span style="color: #fbbf24; font-weight: 600;">RAO DevStudios</span>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Seller ban email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send ban email:", error.message);
    throw error;
  }
};

/**
 * Send seller account deletion notification
 */
const sendSellerDeletionEmail = async (sellerData, reason) => {
  const currentYear = new Date().getFullYear();
  const { email, fullName, businessName } = sellerData;

  const mailOptions = {
    from: `"BookBalcony Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Account Deletion Notification - BookBalcony",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 48px 40px; text-align: center; border-radius: 16px 16px 0 0;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🚫</div>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Account Deletion Notice</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 48px 40px;">
                    
                    <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827;">Dear ${fullName},</h2>
                    
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                      We are writing to inform you that your seller account for <strong>${businessName || 'your business'}</strong> has been permanently deleted from the BookBalcony platform.
                    </p>

                    <!-- Warning Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 12px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 24px; text-align: center;">
                          <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #991b1b;">⚠️ This Action Is Permanent</p>
                          <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.6;">
                            Your account and all associated data have been permanently removed from our system
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Reason Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #991b1b;">Reason for Deletion:</p>
                          <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.6;">
                            ${reason || 'Severe violation of our terms of service.'}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- What's Removed -->
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827;">What Has Been Removed:</h3>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px; background-color: #f1f5f9; border-left: 4px solid #64748b; border-radius: 8px;">
                          <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">
                            • All product listings<br>
                            • Seller profile and business information<br>
                            • Order history and transaction records<br>
                            • Access to seller dashboard<br>
                            • All account privileges
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Support -->
                    <div style="margin: 32px 0; padding: 24px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
                      <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">Questions?</p>
                      <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.6;">
                        If you have questions about this action, please contact our support team at <a href="mailto:support@bookbalcony.com" style="color: #1e40af; font-weight: 600;">support@bookbalcony.com</a>. Please note that this decision is final and the account cannot be recovered.
                      </p>
                    </div>

                    <div style="margin: 32px 0; border-top: 1px solid #e5e7eb;"></div>

                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                      We thank you for your time on the BookBalcony platform.
                    </p>
                    
                    <p style="margin: 24px 0 0 0; font-size: 16px; color: #111827;">
                      <strong>Regards,</strong><br>
                      <span style="color: #6b7280;">The BookBalcony Team</span>
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 40px; text-align: center; border-radius: 0 0 16px 16px;">
                    <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #fbbf24;">BookBalcony</p>
                    <p style="margin: 0 0 24px 0; font-size: 13px; color: #9ca3af;">Discover, Read, and Explore</p>
                    <p style="margin: 0; font-size: 11px; color: #4b5563;">
                      © ${currentYear} BookBalcony. All Rights Reserved.<br>
                      Developed with ❤️ by <span style="color: #fbbf24; font-weight: 600;">RAO DevStudios</span>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Seller deletion email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send deletion email:", error.message);
    throw error;
  }
};

module.exports = { 
  sendEmailOTP,
  sendSellerApprovalEmail,
  sendSellerRejectionEmail,
  sendSellerBanEmail,
  sendSellerDeletionEmail
};