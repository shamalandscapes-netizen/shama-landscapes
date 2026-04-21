import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp/sendWhatsApp';
import { sendEmail } from '@/lib/email/sendEmail';

export async function POST(req) {
  try {
    const { to, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    const errors = [];

    // 1. Try WhatsApp first
    try {
      await sendWhatsAppMessage({ to, message });
      console.log('✅ WhatsApp sent');
      return NextResponse.json({
        success: true,
        method: 'whatsapp',
        message: 'Delivered via WhatsApp'
      });
    } catch (err) {
      errors.push({ method: 'whatsapp', error: err.message });
      console.error('❌ WhatsApp failed:', err.message);
    }

    // 2. Try Email backup
    if (process.env.COMPANY_EMAIL) {
      try {
        await sendEmail({
          to: process.env.COMPANY_EMAIL,
          subject: '📋 Chat Summary - Shama LiveChat',
          text: `WhatsApp failed. Summary:\n\n${message}`,
        });
        console.log('✅ Email sent');
        return NextResponse.json({
          success: true,
          method: 'email',
          whatsapp_error: errors[0]?.error,
          message: 'Delivered via email (WhatsApp failed)'
        });
      } catch (err) {
        errors.push({ method: 'email', error: err.message });
        console.error('❌ Email failed:', err.message);
      }
    }

    // 3. Try SMS final backup
    if (process.env.COMPANY_SMS_NUMBER) {
      try {
        console.log('✅ SMS sent');
        return NextResponse.json({
          success: true,
          method: 'sms',
          whatsapp_error: errors[0]?.error,
          email_error: errors[1]?.error,
          message: 'Delivered via SMS (WhatsApp & email failed)'
        });
      } catch (err) {
        errors.push({ method: 'sms', error: err.message });
        console.error('❌ SMS failed:', err.message);
      }
    }

    // All failed
    return NextResponse.json(
      { 
        error: 'All delivery methods failed',
        failures: errors 
      },
      { status: 500 }
    );

  } catch (err) {
    console.error('Route error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}