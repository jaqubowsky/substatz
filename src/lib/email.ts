import { transporter } from "@/server/mailer";

const colors = {
  primary: "#dd8244",
  primaryDark: "#c7723a",
  primaryLight: "#ec9158",

  background: "#f9f9f9",
  cardBackground: "#ffffff",
  highlightBackground: "#f9f3e8",
  subtleBackground: "#f7f9fc",

  textDark: "#4a3928",
  textMedium: "#6d5c46",
  textLight: "#8c7b65",
  textWhite: "#ffffff",

  border: "#e8dcc6",

  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
};

const styles = {
  emailContainer: `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 0;
    background-color: ${colors.background};
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  `,

  header: `
    background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark});
    color: ${colors.textWhite};
    padding: 30px 20px;
    text-align: center;
  `,

  content: `
    background-color: ${colors.cardBackground};
    padding: 30px;
    border-radius: 0 0 12px 12px;
  `,

  button: `
    background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark});
    color: ${colors.textWhite};
    padding: 14px 32px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: bold;
    display: inline-block;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    border: none;
    font-size: 16px;
    letter-spacing: 0.5px;
  `,

  highlightBox: `
    background-color: ${colors.highlightBackground};
    border-left: 4px solid ${colors.primary};
    padding: 15px;
    border-radius: 6px;
    margin: 20px 0;
  `,

  footer: `
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid ${colors.border};
    color: ${colors.textMedium};
    font-size: 14px;
  `,

  featureBox: `
    margin: 25px 0;
    padding: 20px;
    background: linear-gradient(135deg, ${colors.highlightBackground}, ${colors.subtleBackground});
    border-radius: 10px;
  `,

  linkText: `
    color: ${colors.primary};
    text-decoration: none;
  `,

  checkmark: `
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: ${colors.primary};
    color: ${colors.textWhite};
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
    margin-right: 10px;
  `,

  codeBox: `
    word-break: break-all;
    padding: 12px;
    background-color: ${colors.subtleBackground};
    border-radius: 6px;
    font-size: 14px;
    color: ${colors.textDark};
    border: 1px solid ${colors.border};
  `,
};

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.AUTH_URL}/api/auth/verify-email?token=${verificationToken}`;

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
      <div style="${styles.emailContainer}">
        <div style="${styles.header}">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">Welcome to SubscriptEase!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your subscription management just got easier</p>
        </div>

        <div style="${styles.content}">
          <h2 style="color: ${colors.textDark}; margin-top: 0;">Hey ${
      name || "there"
    } 👋</h2>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">Thanks for signing up! We're excited to have you on board. Just one quick step to get your account up and running:</p>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${verificationUrl}" style="${styles.button}">
              <span>✓</span> Verify My Email
            </a>
          </div>

          <div style="${styles.highlightBox}">
            <p style="margin: 0; font-size: 15px; color: ${colors.textDark};">
              <strong>Quick tip:</strong> After verification, you can start adding your subscriptions right away. We'll help you keep track of everything in one place!
            </p>
          </div>

          <p style="font-size: 14px; color: ${
            colors.textMedium
          };">Or copy this link if you prefer:</p>
          <p style="${styles.codeBox}">${verificationUrl}</p>

          <p style="font-size: 14px; color: ${
            colors.textMedium
          }; font-style: italic;">This link works for 24 hours. After that, you'll need to request a new one.</p>

          <div style="margin: 30px 0; padding: 20px; background-color: ${
            colors.highlightBackground
          }; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 16px; color: ${
              colors.textDark
            };">Got questions? We're here to help!</p>
            <p style="margin: 0; font-size: 15px; color: ${
              colors.textMedium
            };">Just hit reply - we're real humans and we'll get back to you quickly!</p>
          </div>

          <div style="${styles.footer}">
            <p style="color: ${
              colors.textMedium
            };">Cheers,<br><strong>The SubscriptEase Team</strong></p>

            <div style="margin-top: 20px; text-align: center;">
              <a href="${
                process.env.AUTH_URL
              }" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Website</a>
              <a href="${
                process.env.AUTH_URL
              }/help" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Help Center</a>
              <a href="${
                process.env.AUTH_URL
              }/contact" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Contact Us</a>
            </div>

            <p style="font-size: 12px; margin-top: 20px; text-align: center; color: ${
              colors.textLight
            };">© ${new Date().getFullYear()} SubscriptEase. All rights reserved.</p>
          </div>
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
      <div style="${styles.emailContainer}">
        <div style="${styles.header}">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">You're all set! 🎉</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your SubscriptEase account is ready</p>
        </div>

        <div style="${styles.content}">
          <h2 style="color: ${
            colors.textDark
          }; margin-top: 0;">Hey ${name}! 🙌</h2>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">Awesome! Your email is verified and your account is ready to roll.</p>

          <div style="${styles.featureBox}">
            <p style="margin: 0 0 15px 0; font-size: 16px; color: ${
              colors.textDark
            };">We built SubscriptEase because, like you, we were tired of losing track of all those monthly subscriptions. Now you can see everything in one place - no more surprise charges!</p>

            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="${styles.checkmark}">✓</span>
              <span style="color: ${
                colors.textDark
              };">Track all your subscriptions in one place</span>
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="${styles.checkmark}">✓</span>
              <span style="color: ${
                colors.textDark
              };">Get reminders before payments are due</span>
            </div>

            <div style="display: flex; align-items: center;">
              <span style="${styles.checkmark}">✓</span>
              <span style="color: ${
                colors.textDark
              };">See your total monthly subscription costs</span>
            </div>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.AUTH_URL}/login" style="${styles.button}">
              Log In & Get Started
            </a>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">Ready to take it for a spin? Just log in and add your first subscription. It takes less than a minute.</p>

          <div style="${styles.highlightBox}">
            <p style="margin: 0; font-size: 15px; color: ${colors.textDark};">
              <strong>Pro tip:</strong> Start by adding your most expensive subscriptions first - they're usually the ones worth keeping the closest eye on!
            </p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">Need any help getting started? Just reply to this email - I'm happy to walk you through it.</p>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">Looking forward to helping you save some money!</p>

          <div style="${styles.footer}">
            <p style="color: ${
              colors.textMedium
            };">Cheers,<br><strong>The SubscriptEase Team</strong></p>

            <div style="margin-top: 20px; text-align: center;">
              <a href="${
                process.env.AUTH_URL
              }" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Website</a>
              <a href="${
                process.env.AUTH_URL
              }/help" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Help Center</a>
              <a href="${
                process.env.AUTH_URL
              }/contact" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Contact Us</a>
            </div>

            <p style="font-size: 12px; margin-top: 20px; text-align: center; color: ${
              colors.textLight
            };">© ${new Date().getFullYear()} SubscriptEase. All rights reserved.</p>
          </div>
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
  const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${resetToken}`;

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
      <div style="${styles.emailContainer}">
        <div style="${styles.header}">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">Password Reset</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Let's get you back into your account</p>
        </div>

        <div style="${styles.content}">
          <h2 style="color: ${colors.textDark}; margin-top: 0;">Hey ${
      name || "there"
    } 👋</h2>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">Forgot your password? No worries - it happens to everyone!</p>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="${styles.button}">
              Reset My Password
            </a>
          </div>

          <p style="font-size: 14px; color: ${
            colors.textMedium
          };">Or use this link:</p>
          <p style="${styles.codeBox}">${resetUrl}</p>

          <div style="${styles.highlightBox}">
            <p style="margin: 0; font-size: 15px; color: ${colors.textDark};">
              <strong>Security note:</strong> This link is only good for the next hour for security reasons. If you didn't request this, you can safely ignore this email. Your account is still secure.
            </p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">Need help? Just reply to this email and we'll get right back to you.</p>

          <div style="${styles.footer}">
            <p style="color: ${
              colors.textMedium
            };">Cheers,<br><strong>The SubscriptEase Team</strong></p>

            <div style="margin-top: 20px; text-align: center;">
              <a href="${
                process.env.AUTH_URL
              }" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Website</a>
              <a href="${
                process.env.AUTH_URL
              }/help" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Help Center</a>
              <a href="${
                process.env.AUTH_URL
              }/contact" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Contact Us</a>
            </div>

            <p style="font-size: 12px; margin-top: 20px; text-align: center; color: ${
              colors.textLight
            };">© ${new Date().getFullYear()} SubscriptEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendSubscriptionThankYouEmail(
  email: string,
  name: string
) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Thank you for upgrading to SubscriptEase Premium!",
    text: `Hey ${name || "there"},

Thank you for upgrading to SubscriptEase Premium! Your payment has been successfully processed, and your account has been upgraded.

With your premium subscription, you now have access to:
- Unlimited subscription tracking
- Advanced analytics and insights
- Priority customer support
- Early access to new features

Your dashboard has been updated with all premium features. Log in now to explore everything that's available to you.

If you have any questions about your subscription or need help with any features, just reply to this email - we're here to help!

Thanks for supporting SubscriptEase. We're committed to making subscription management easier for you.

Cheers,
The SubscriptEase Team`,
    html: `
      <div style="${styles.emailContainer}">
        <div style="${styles.header}">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">Welcome to Premium! 🎉</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your SubscriptEase account has been upgraded</p>
        </div>

        <div style="${styles.content}">
          <h2 style="color: ${colors.textDark}; margin-top: 0;">Hey ${
      name || "there"
    } 👋</h2>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">
            Thank you for upgrading to SubscriptEase Premium! Your payment has been successfully processed, and your account has been upgraded.
          </p>

          <div style="${styles.featureBox}">
            <p style="margin: 0 0 15px 0; font-size: 16px; color: ${
              colors.textDark
            };">
              With your premium subscription, you now have access to:
            </p>

            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="${styles.checkmark}">✓</span>
              <span style="color: ${
                colors.textDark
              };">Unlimited subscription tracking</span>
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="${styles.checkmark}">✓</span>
              <span style="color: ${
                colors.textDark
              };">Advanced analytics and insights</span>
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="${styles.checkmark}">✓</span>
              <span style="color: ${
                colors.textDark
              };">Priority customer support</span>
            </div>

            <div style="display: flex; align-items: center;">
              <span style="${styles.checkmark}">✓</span>
              <span style="color: ${
                colors.textDark
              };">Early access to new features</span>
            </div>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.AUTH_URL}/dashboard" style="${
      styles.button
    }">
              Explore Premium Features
            </a>
          </div>

          <div style="${styles.highlightBox}">
            <p style="margin: 0; font-size: 15px; color: ${colors.textDark};">
              <strong>Pro tip:</strong> Try out the new analytics section to get insights on your subscription spending patterns and discover potential savings!
            </p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">
            Your dashboard has been updated with all premium features. Log in now to explore everything that's available to you.
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">
            If you have any questions about your subscription or need help with any features, just reply to this email - we're here to help!
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">
            Thanks for supporting SubscriptEase. We're committed to making subscription management easier for you.
          </p>

          <div style="${styles.footer}">
            <p style="color: ${
              colors.textMedium
            };">Cheers,<br><strong>The SubscriptEase Team</strong></p>

            <div style="margin-top: 20px; text-align: center;">
              <a href="${
                process.env.AUTH_URL
              }" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Website</a>
              <a href="${
                process.env.AUTH_URL
              }/help" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Help Center</a>
              <a href="${
                process.env.AUTH_URL
              }/contact" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Contact Us</a>
            </div>

            <p style="font-size: 12px; margin-top: 20px; text-align: center; color: ${
              colors.textLight
            };">
              © ${new Date().getFullYear()} SubscriptEase. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendPaymentFailedEmail(email: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Action Required: Payment Failed for SubscriptEase Premium",
    text: `Hey there,

We noticed there was an issue processing your payment for your SubscriptEase Premium subscription.

Your premium subscription benefits are currently on hold until we can successfully process your payment. This could be due to an expired card, insufficient funds, or a change in your payment details.

If you need any assistance or have questions about your subscription, just reply to this email - we're here to help!

Cheers,
The SubscriptEase Team`,
    html: `
      <div style="${styles.emailContainer}">
        <div style="${styles.header}">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">Payment Failed</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Action required for your SubscriptEase subscription</p>
        </div>

        <div style="${styles.content}">
          <h2 style="color: ${
            colors.textDark
          }; margin-top: 0;">Hey there 👋</h2>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">
            We noticed there was an issue processing your payment for your <strong>SubscriptEase Premium</strong> subscription.
          </p>

          <div style="${styles.highlightBox}">
            <p style="margin: 0; font-size: 15px; color: ${colors.textDark};">
              <strong>Important:</strong> Your premium subscription benefits are currently on hold until we can successfully process your payment.
            </p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">
            This could be due to:
          </p>

          <ul style="color: ${
            colors.textDark
          }; font-size: 16px; line-height: 1.6;">
            <li>An expired credit card</li>
            <li>Insufficient funds</li>
            <li>A change in your payment details</li>
            <li>Your bank declining the transaction</li>
          </ul>

          <p style="font-size: 16px; line-height: 1.6; color: ${
            colors.textDark
          };">
            If you need any assistance or have questions about your subscription, just reply to this email - we're here to help!
          </p>

          <div style="${styles.footer}">
            <p style="color: ${
              colors.textMedium
            };">Cheers,<br><strong>The SubscriptEase Team</strong></p>

            <div style="margin-top: 20px; text-align: center;">
              <a href="${
                process.env.AUTH_URL
              }" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Website</a>
              <a href="${
                process.env.AUTH_URL
              }/help" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Help Center</a>
              <a href="${
                process.env.AUTH_URL
              }/contact" style="display: inline-block; margin: 0 10px; ${
      styles.linkText
    }">Contact Us</a>
            </div>

            <p style="font-size: 12px; margin-top: 20px; text-align: center; color: ${
              colors.textLight
            };">
              © ${new Date().getFullYear()} SubscriptEase. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
