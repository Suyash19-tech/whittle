import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  console.log('Testing Resend with key:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Whittle <onboarding@resend.dev>',
      to: ['delivered@resend.dev'], // Resend testing address
      subject: 'Diagnostic Test',
      html: '<p>Testing Whittle Email System</p>',
    });

    if (error) {
      console.error('❌ Resend Error:', error);
    } else {
      console.log('✅ Success! Email sent ID:', data?.id);
    }
  } catch (err) {
    console.error('💥 Crash:', err);
  }
}

test();
