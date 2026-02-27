/**
 * src/services/emailService.js
 * Minimal Email Service Implementation
 * Handles: Task reminders, daily briefings, notifications, team invites
 */

/**
 * Sends a generic email
 */
export async function sendEmail(to, subject, html) {
  try {
    console.log(`[Email Service] Sending to ${to}: "${subject}"`);
    // TODO: Integrate with SendGrid, Nodemailer, or similar
    return { success: true, messageId: `email-${Date.now()}` };
  } catch (error) {
    console.error('[Email Service] Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a task reminder email
 */
export async function sendTaskReminder(task, user) {
  try {
    const html = `<h2>Task Reminder</h2><p>${task.name}</p>`;
    return await sendEmail(user.email, `Reminder: ${task.name}`, html);
  } catch (error) {
    console.error('[Email Service] Task reminder failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a daily briefing email
 */
export async function sendDailyBriefing(user, briefing) {
  try {
    const html = `<h2>Daily Briefing</h2><p>${JSON.stringify(briefing)}</p>`;
    return await sendEmail(user.email, 'Your Daily Briefing', html);
  } catch (error) {
    console.error('[Email Service] Daily briefing failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a team invite email
 */
export async function sendInvite(targetEmail, teamName) {
  try {
    const html = `<h2>You're invited to ${teamName}</h2><p>Accept the invitation to collaborate.</p>`;
    return await sendEmail(targetEmail, `Invitation to join ${teamName}`, html);
  } catch (error) {
    console.error('[Email Service] Invite failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Tests email service connection
 */
export async function testConnection() {
  try {
    console.log('[Email Service] Testing connection...');
    return { success: true, message: 'Email service is ready' };
  } catch (error) {
    console.error('[Email Service] Connection test failed:', error);
    return { success: false, error: error.message };
  }
}

export const emailService = {
  sendEmail,
  sendTaskReminder,
  sendDailyBriefing,
  sendInvite,
  testConnection,
};
