import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const appealData = await req.json();
    const { name, email, phone, reason, message, accountStatus, submittedAt } = appealData;

    // Email template for admin notification
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
          🚨 Account ${accountStatus === 'banned' ? 'Unban' : 'Recovery'} Appeal
        </h2>
        
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #991b1b; margin-top: 0;">Appeal Details</h3>
          <p><strong>Account Status:</strong> ${accountStatus.toUpperCase()}</p>
          <p><strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}</p>
        </div>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">User Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">Appeal Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Admin Actions</h3>
          <p>Please review this appeal and take appropriate action:</p>
          <ul>
            <li>Log into the admin dashboard to review the user's account</li>
            <li>Check the reason for the original ${accountStatus === 'banned' ? 'ban' : 'deletion'}</li>
            <li>Respond to the user within 24-48 hours</li>
            <li>If approved, ${accountStatus === 'banned' ? 'unban' : 'restore'} the account</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            PropertyManager Admin System<br>
            This is an automated notification from the appeal system.
          </p>
        </div>
      </div>
    `;

    // Email template for user confirmation
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
          ✅ Appeal Submitted Successfully
        </h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for submitting your account ${accountStatus === 'banned' ? 'unban' : 'recovery'} appeal. We have received your request and it is now under review.</p>

        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">Appeal Summary</h3>
          <p><strong>Account Status:</strong> ${accountStatus.toUpperCase()}</p>
          <p><strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}</p>
          <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">What Happens Next?</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Our admin team will review your appeal within 24-48 hours</li>
            <li>We will investigate the circumstances of your account ${accountStatus}</li>
            <li>You will receive an email with our decision</li>
            <li>If approved, your account will be ${accountStatus === 'banned' ? 'unbanned' : 'restored'} immediately</li>
          </ul>
        </div>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Your Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; font-style: italic;">"${message}"</p>
        </div>

        <p>If you have any additional information or questions, please reply to this email.</p>
        
        <p>Best regards,<br>PropertyManager Support Team</p>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            PropertyManager - Complete Landlord Management Solution<br>
            This is an automated confirmation email.
          </p>
        </div>
      </div>
    `;

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@propertymanager.com';
    
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'PropertyManager Appeals <appeals@propertymanager.com>',
          to: [adminEmail],
          subject: `🚨 Account ${accountStatus === 'banned' ? 'Unban' : 'Recovery'} Appeal - ${name}`,
          html: adminEmailHtml,
        });

        // Send confirmation email to user
        await resend.emails.send({
          from: 'PropertyManager Support <support@propertymanager.com>',
          to: [email],
          subject: `Appeal Submitted - Account ${accountStatus === 'banned' ? 'Unban' : 'Recovery'} Request`,
          html: userEmailHtml,
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Continue even if email fails - the appeal is still recorded
      }
    }

    // Store appeal in database (optional - you can add this later)
    // For now, we'll just log it
    console.log('Appeal submitted:', {
      name,
      email,
      phone,
      reason,
      accountStatus,
      submittedAt,
      message: message.substring(0, 100) + '...'
    });

    return NextResponse.json({ 
      message: 'Appeal submitted successfully',
      appealId: `APPEAL_${Date.now()}`,
      estimatedResponse: '24-48 hours'
    });

  } catch (error) {
    console.error('Appeal submission error:', error);
    return NextResponse.json({ 
      message: 'Failed to submit appeal. Please try again.' 
    }, { status: 500 });
  }
}