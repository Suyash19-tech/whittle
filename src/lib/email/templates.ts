/**
 * Email Templates for Whittle
 * Minimal, premium, fintech-style HTML templates.
 */

export const getLeadEmailHtml = (name: string, savings: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #334155; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; }
    .logo { color: #0ea5e9; font-weight: 700; font-size: 20px; margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    p { margin-bottom: 16px; }
    .savings-card { background: #f0f9ff; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; border: 1px solid #bae6fd; }
    .savings-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #0369a1; letter-spacing: 0.05em; margin-bottom: 4px; }
    .savings-value { font-size: 32px; font-weight: 700; color: #0c4a6e; }
    .footer { margin-top: 32px; padding-top: 16px; border-t: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Whittle</div>
    <h1>Audit Saved</h1>
    <p>Hi ${name},</p>
    <p>Your AI stack audit has been successfully saved to your profile. Based on your current tool configuration, we've identified significant optimization opportunities.</p>
    
    <div class="savings-card">
      <div class="savings-label">Potential Monthly Savings</div>
      <div class="savings-value">$${savings.toLocaleString()}</div>
    </div>

    <p>Our team at Credex may reach out shortly to discuss how we can help you implement these savings and further optimize your engineering spend.</p>
    
    <p>Best,<br>The Whittle Team</p>
    
    <div class="footer">
      &copy; ${new Date().getFullYear()} Whittle. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const getConsultationEmailHtml = (name: string, savings: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #334155; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; }
    .logo { color: #0ea5e9; font-weight: 700; font-size: 20px; margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    p { margin-bottom: 16px; }
    .savings-card { background: #f0fdfa; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; border: 1px solid #ccfbf1; }
    .savings-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #0f766e; letter-spacing: 0.05em; margin-bottom: 4px; }
    .savings-value { font-size: 32px; font-weight: 700; color: #134e4a; }
    .footer { margin-top: 32px; padding-top: 16px; border-t: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Whittle</div>
    <h1>Consultation Request Received</h1>
    <p>Hi ${name},</p>
    <p>Thank you for booking a consultation with Credex. We've received your request and a specialist will reach out to you within one business day to confirm your time.</p>
    
    <div class="savings-card">
      <div class="savings-label">Target Monthly Savings</div>
      <div class="savings-value">$${savings.toLocaleString()}</div>
    </div>

    <p>We're looking forward to helping you streamline your AI stack and unlock these savings.</p>
    
    <p>Best,<br>The Whittle Team</p>
    
    <div class="footer">
      &copy; ${new Date().getFullYear()} Whittle. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
