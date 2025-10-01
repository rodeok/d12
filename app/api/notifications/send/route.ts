import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { to, subject, html, type = "email" } = await req.json();

    if (type === "email") {
      const { data, error } = await resend.emails.send({
        from: "Landlord Management <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ data }, { status: 200 });
    }

    if (type === "sms") {
      // TODO: implement Twilio later
      return NextResponse.json(
        { message: "SMS notification would be sent here" },
        { status: 200 }
      );
    }

    // ✅ Default return for invalid types
    return NextResponse.json(
      { error: "Invalid notification type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { message: "Error sending notification" },
      { status: 500 }
    );
  }
}
