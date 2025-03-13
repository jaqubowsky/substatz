import { transporter } from "@/server/mailer";

const emailStyle = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const headerStyle = `
  background-color: oklch(65% 0.25 60);
  color: oklch(98% 0.02 90);
  padding: 20px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  margin: -20px -20px 20px -20px;
`;

const buttonStyle = `
  background-color: oklch(65% 0.25 60);
  color: oklch(98% 0.02 90);
  padding: 12px 28px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
`;

const footerStyle = `
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid oklch(85% 0.05 60);
  color: oklch(50% 0.05 65);
  font-size: 14px;
`;

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Just one click to get started with SubscriptEase",
    text: `Hey ${name || "there"},

Thanks for signing up with us! Just need a quick email verification so we can keep your account secure.

Here's your verification link:
${verificationUrl}

This link works for 24 hours. After that, you'll need to request a new one.

Got questions? Just hit reply - we're real humans and we'll get back to you quickly!

Cheers,
The SubscriptEase Team`,
    html: `
      <div style="${emailStyle}">
        <div style="${headerStyle}">
          <h1 style="margin: 0;">SubscriptEase</h1>
        </div>

        <h2>Hey ${name || "there"},</h2>

        <p>Thanks for signing up with us! Just need a quick email verification so we can keep your account secure.</p>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${verificationUrl}" style="${buttonStyle}">Verify My Email</a>
        </div>

        <p>Or copy this link if you prefer:</p>
        <p style="word-break: break-all; padding: 10px; background-color: oklch(95% 0.04 70); border-radius: 4px; font-size: 14px;">${verificationUrl}</p>

        <p>This link works for 24 hours. After that, you'll need to request a new one.</p>

        <p>Got questions? Just hit reply - we're real humans and we'll get back to you quickly!</p>

        <div style="${footerStyle}">
          <p>Cheers,<br>The SubscriptEase Team</p>
          <p style="font-size: 12px; margin-top: 15px;">© ${new Date().getFullYear()} SubscriptEase</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "You're in! Welcome to SubscriptEase",
    text: `Hey ${name}!

Awesome! Your email is verified and your account is ready to roll.

We built SubscriptEase because, like you, we were tired of losing track of all those monthly subscriptions. Now you can see everything in one place - no more surprise charges!

Ready to take it for a spin? Just log in and add your first subscription. It takes less than a minute.

Need any help getting started? Just reply to this email - I'm happy to walk you through it.

Looking forward to helping you save some money!

Cheers,
The SubscriptEase Team`,
    html: `
      <div style="${emailStyle}">
        <div style="${headerStyle}">
          <h1 style="margin: 0;">SubscriptEase</h1>
        </div>

        <h2>Hey ${name}!</h2>

        <p>Awesome! Your email is verified and your account is ready to roll.</p>

        <p>We built SubscriptEase because, like you, we were tired of losing track of all those monthly subscriptions. Now you can see everything in one place - no more surprise charges!</p>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${
            process.env.NEXTAUTH_URL
          }/login" style="${buttonStyle}">Log In Now</a>
        </div>

        <p>Ready to take it for a spin? Just log in and add your first subscription. It takes less than a minute.</p>

        <p>Need any help getting started? Just reply to this email - I'm happy to walk you through it.</p>

        <p>Looking forward to helping you save some money!</p>

        <div style="${footerStyle}">
          <p>Cheers,<br>The SubscriptEase Team</p>
          <p style="font-size: 12px; margin-top: 15px;">© ${new Date().getFullYear()} SubscriptEase</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your SubscriptEase password",
    text: `Hey ${name || "there"},

Forgot your password? No worries - it happens to everyone!

Here's a link to set up a new password:
${resetUrl}

This link is only good for the next hour for security reasons.

If you didn't request this, you can safely ignore this email. Your account is still secure.

Need help? Just reply to this email.

Cheers,
The SubscriptEase Team`,
    html: `
      <div style="${emailStyle}">
        <div style="${headerStyle}">
          <h1 style="margin: 0;">SubscriptEase</h1>
        </div>

        <h2>Hey ${name || "there"},</h2>

        <p>Forgot your password? No worries - it happens to everyone!</p>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" style="${buttonStyle}">Reset My Password</a>
        </div>

        <p>Or use this link:</p>
        <p style="word-break: break-all; padding: 10px; background-color: oklch(95% 0.04 70); border-radius: 4px; font-size: 14px;">${resetUrl}</p>

        <p>This link is only good for the next hour for security reasons.</p>

        <p>If you didn't request this, you can safely ignore this email. Your account is still secure.</p>

        <p>Need help? Just reply to this email.</p>

        <div style="${footerStyle}">
          <p>Cheers,<br>The SubscriptEase Team</p>
          <p style="font-size: 12px; margin-top: 15px;">© ${new Date().getFullYear()} SubscriptEase</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
