import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, type = 'email' } = await req.json();

    if (type === 'email') {
      const { data, error } = await resend.emails.send({
        from: 'Landlord Management <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ data });
    } else if (type === 'sms') {
      // SMS implementation with Twilio would go here
      // For now, we'll just return success
      return NextResponse.json({ message: 'SMS notification would be sent here' });
    }
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ message: 'Error sending notification' }, { status: 500 });
  }
}