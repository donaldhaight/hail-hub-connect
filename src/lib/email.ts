// Email lane — currently stubbed. Once a Lovable email domain is verified,
// swap the body of `sendEmail` to call `sendLovableEmail` from `@lovable.dev/email-js`.
// No template writing needed at that point.

export type EmailTemplate =
  | { kind: "founder_notification"; briefingRequest: { id: string; name: string; email: string; organization: string; title: string; interest: string; context?: string | null } }
  | { kind: "applicant_auto_reply"; to: string; name: string }
  | { kind: "insider_invitation"; to: string; name: string; acceptUrl: string; expiresAt: string }
  | { kind: "founder_new_insider_message"; dossierSlug: string; sectionHeading: string | null; body: string; authorId: string }
  | { kind: "insider_reply_posted"; to: string; dossierSlug: string; sectionHeading: string | null; body: string };

export async function sendEmail(_template: EmailTemplate): Promise<{ sent: boolean; reason?: string }> {
  // Stubbed until a Lovable email domain is configured.
  // The template is fully-formed above — activation is a one-liner.
  return { sent: false, reason: "email_domain_not_configured" };
}

export function renderTemplate(t: EmailTemplate): { subject: string; text: string } {
  switch (t.kind) {
    case "founder_notification": {
      const r = t.briefingRequest;
      return {
        subject: `New briefing request from ${r.name} at ${r.organization}`,
        text: [
          `${r.name} (${r.title}, ${r.organization}) requested a private briefing.`,
          `Interest: ${r.interest}`,
          `Email: ${r.email}`,
          r.context ? `\nContext:\n${r.context}` : "",
          `\nReview: /admin/inbox`,
        ].join("\n"),
      };
    }
    case "applicant_auto_reply":
      return {
        subject: "Your briefing request has been received",
        text: `${t.name},\n\nThank you for your request. It is reviewed by the founder personally. If a briefing is appropriate you will hear from us within seven business days.\n\n— ClaimStore Briefing Room\n\nConfidential Working Concept — Not an Offering.`,
      };
    case "insider_invitation":
      return {
        subject: "Qualified insider access — ClaimStore Briefing Room",
        text: `${t.name},\n\nYou have been invited to the Qualified Insider Room. This single-use link expires ${t.expiresAt}.\n\n${t.acceptUrl}\n\nSign in with this email to activate access.\n\n— ClaimStore Briefing Room\n\nConfidential Working Concept — Not an Offering.`,
      };
    case "founder_new_insider_message":
      return {
        subject: `New insider message on dossier ${t.dossierSlug}`,
        text: [
          `An insider posted a new message on dossier "${t.dossierSlug}"${t.sectionHeading ? ` (section: ${t.sectionHeading})` : ""}.`,
          "",
          t.body,
          "",
          `Review: /admin/inbox`,
        ].join("\n"),
      };
    case "insider_reply_posted":
      return {
        subject: `Founder replied on dossier ${t.dossierSlug}`,
        text: [
          `The founder replied to the discussion on dossier "${t.dossierSlug}"${t.sectionHeading ? ` (section: ${t.sectionHeading})` : ""}.`,
          "",
          t.body,
          "",
          `— ClaimStore Briefing Room`,
        ].join("\n"),
      };
  }
}
