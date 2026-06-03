const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

/**
 * Cloud Function triggered when a new document is added to the 'contacts' collection in Firestore.
 * It grabs the document fields and triggers an email using nodemailer SMTP.
 * 
 * SETUP STEPS:
 * 1. Initialize Firebase CLI in your project.
 * 2. Configure Cloud Function variables:
 *    firebase functions:config:set email.user="your-gmail-username@gmail.com" email.pass="your-16-character-app-password"
 * 3. Deploy functions using:
 *    firebase deploy --only functions
 */
exports.sendContactEmail = functions.firestore
  .document("contacts/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    const name = data.name || "Anonymous Sender";
    const email = data.email || "No email specified";
    const subject = data.subject || "No subject specified";
    const message = data.message || "Empty message body";
    const timestamp = data.timestamp ? data.timestamp.toDate().toLocaleString() : new Date().toLocaleString();

    console.log(`Processing contact form submission from: ${name} (${email})`);

    // Retrieve settings
    const configUser = functions.config().email ? functions.config().email.user : null;
    const configPass = functions.config().email ? functions.config().email.pass : null;
    
    const senderEmail = configUser || process.env.EMAIL_USER;
    const senderPass = configPass || process.env.EMAIL_PASS;
    const recipientEmail = "singhabbhi08@gmail.com";

    if (!senderEmail || !senderPass) {
      console.warn("Warning: SMTP email credentials are not set in functions:config. Email dispatch skipped.");
      return null;
    }

    // Nodemailer transporter (Gmail service configuration)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: senderPass
      }
    });

    // Blaugrana-styled HTML email template
    const mailOptions = {
      from: `"Abbhi Portfolio Bot" <${senderEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `[Portfolio Connect] ${name}: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1.5px solid #EDBB00; border-radius: 12px; background-color: #001E50; color: #FFFFFF;">
          <div style="text-align: center; border-bottom: 2px solid #A50044; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="color: #FFFFFF; font-size: 1.6rem; text-transform: uppercase; margin: 0; letter-spacing: 0.05em;">[ Abbhi Kumar Singh ]</h1>
            <p style="color: #EDBB00; font-size: 0.9rem; font-weight: bold; margin: 5px 0 0 0; text-transform: uppercase;">New Pitch Connection Request</p>
          </div>
          
          <div style="background-color: #0B2447; border: 1px solid rgba(226,232,240,0.1); border-radius: 8px; padding: 20px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #EDBB00;">Sender:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #EDBB00;">Email:</strong> <a href="mailto:${email}" style="color: #FFFFFF; text-decoration: underline;">${email}</a></p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #EDBB00;">Subject:</strong> ${subject}</p>
            <p style="margin: 0 0 20px 0;"><strong style="color: #EDBB00;">Time Received:</strong> ${timestamp}</p>
            
            <div style="background-color: rgba(2,11,24,0.5); border-left: 4px solid #A50044; padding: 15px; border-radius: 0 6px 6px 0; margin-top: 10px;">
              <p style="margin: 0; font-size: 0.95rem; white-space: pre-wrap; color: #E2E8F0;">${message}</p>
            </div>
          </div>
          
          <div style="margin-top: 25px; border-top: 1px solid rgba(226,232,240,0.1); padding-top: 15px; text-align: center; font-size: 0.75rem; color: #94A3B8;">
            <p style="margin: 0;">This notification is triggered by Cloud Firestore document creation.</p>
            <p style="margin: 5px 0 0 0;">© 2026 Abbhi Kumar Singh. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Success: Email successfully dispatched to ${recipientEmail}`);
      return { success: true };
    } catch (error) {
      console.error("Error dispatching email via Nodemailer:", error);
      return null;
    }
  });
