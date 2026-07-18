import { Resend } from "resend";
import env from "../config/env.js";

const resend = new Resend(env.resend.apiKey);
const sender = `${env.resend.senderName} <${env.resend.senderEmail}>`;

async function sendWelcomeEmail(userEmail, userName) {
  try {
    await resend.emails.send({
      from: sender,
      to: userEmail,
      subject: "Welcome to SmartFlow",
      html: `
        <h1>Hello ${userName},</h1>
        <p>Welcome to SmartFlow! Your account has been created successfully.</p>
        <p>SmartFlow is a backend workflow automation engine designed to help small teams manage their projects, track tasks, and automate repetitive workflows seamlessly.</p>
        <p>Best regards,<br>The SmartFlow Team</p>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
}

async function sendTaskAssignedEmail(
  userEmail,
  userName,
  taskName,
  projectName,
  deadline,
  priority,
) {
  try {
    await resend.emails.send({
      from: sender,
      to: userEmail,
      subject: `New Task Assigned: ${taskName}`,
      html: `
        <h1>Hello ${userName},</h1>
        <p>You have been assigned a new task in SmartFlow.</p>
        <hr />
        <p><strong>Task Name:</strong> ${taskName}</p>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Priority Level:</strong> ${priority}</p>
        <p><strong>Deadline:</strong> ${deadline}</p>
        <hr />
        <p>Please log into your dashboard to review and update your progress.</p>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
}

async function sendTaskCompletedEmail(
  managerEmail,
  managerName,
  taskName,
  employeeName,
) {
  try {
    await resend.emails.send({
      from: sender,
      to: managerEmail,
      subject: `Task Completed: ${taskName}`,
      html: `
        <h1>Hello ${managerName},</h1>
        <p>An update has occurred on one of your managed projects.</p>
        <p><strong>Task:</strong> ${taskName}</p>
        <p><strong>Completed By:</strong> ${employeeName}</p>
        <p>The task status has been successfully updated to "Completed".</p>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
}

async function sendWorkflowTriggeredEmail(
  userEmail,
  userName,
  workflowName,
  actionType,
) {
  try {
    await resend.emails.send({
      from: sender,
      to: userEmail,
      subject: `Workflow Triggered: ${workflowName}`,
      html: `
        <h1>Hello ${userName},</h1>
        <p>The SmartFlow automation engine has successfully executed a background rule.</p>
        <p><strong>Workflow:</strong> ${workflowName}</p>
        <p><strong>Action Executed:</strong> ${actionType}</p>
        <p>This automated action was executed without manual intervention based on your team's predefined settings.</p>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
}

export {
  sendWelcomeEmail,
  sendTaskAssignedEmail,
  sendTaskCompletedEmail,
  sendWorkflowTriggeredEmail,
};
