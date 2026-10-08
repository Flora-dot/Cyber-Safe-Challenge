export type PhishQ = { round: 1; id: string; from: string; subject: string; time: string; body: string[]; cta?: string; attachment?: string; clues: string[]; lesson: string };
export type ScenarioQ = { round: 2; id: string; prompt: string; detail: string; options: string[]; correct: number; explanation: string };
export type Question = PhishQ | ScenarioQ;

export const phishOptions = ["Report it", "Click the link", "Reply to the sender", "Ignore it"];
export const PHISH_CORRECT = 0; // "Report it"

export const questions: Question[] = [
  { round: 1, id: "p1", from: "Microsoft 365 Support <security@micr0soft-365-support.com>", subject: "URGENT: Your account will be suspended", time: "8:02 AM",
    body: ["Dear user,", "We detected a problem with your account. Verify your account within 24 hours or it will be suspended permanently."], cta: "Verify account now",
    clues: ["Sender domain is micr0soft-365-support.com, not microsoft.com", "Urgent threat of suspension", "Generic greeting instead of your name", "Link asks you to sign in from an email"],
    lesson: "Go to the service directly instead of using links in unexpected emails." },
  { round: 1, id: "p2", from: "David Okafor (CEO) <david.okafor.ceo@gmail.com>", subject: "Quick favour - urgent", time: "10:41 AM",
    body: ["Are you at your desk? I'm in a meeting and can't talk.", "I need you to buy 5 gift cards (₦100,000 each) for a client today. Send me the codes here. I'll reimburse you."],
    clues: ["The CEO is writing from a personal Gmail address", "Urgent, secretive request", "Gift cards are a classic scam payment", "Asks you to bypass normal payment approval"],
    lesson: "Always verify unusual financial requests through another trusted channel." },
  { round: 1, id: "p3", from: "HR Department <hr-payroll@company-hrportal.net>", subject: "Updated employee compensation document", time: "2:15 PM",
    body: ["Please review your updated employee compensation document before the end of the day."], attachment: "Compensation_Update_2026.html.zip",
    clues: ["Unexpected attachment about pay, which creates curiosity", "Sender domain is not your company's", "Attachment is a zipped web file, not a normal document", "Pressure to open it today"],
    lesson: "Be cautious with unexpected attachments, even when they look like HR or payroll." },
  { round: 1, id: "p4", from: "IT Security <alerts@secure-itdesk-help.com>", subject: "Suspicious activity on your account", time: "7:48 AM",
    body: ["We noticed unusual sign-ins to your account.", "To protect it, reply to this email with your current password so we can verify your identity."],
    clues: ["Legitimate IT teams never ask for your password", "Asks you to reply with credentials", "External look-alike domain", "Fear-based wording"],
    lesson: "Legitimate IT/security teams should not ask employees to send passwords." },
  { round: 1, id: "p5", from: "Mr. A. Bello <a.bello@meridian-capital-partners.co>", subject: "Urgent: transfer before market close", time: "11:20 AM",
    body: ["Please send me the full holdings and contact details for our shared client account today.", "Also process a ₦25m transfer to the new account below before close. I'm travelling, so please don't call."],
    clues: ["Asks for confidential client data by email", "Discourages you from calling to confirm", "New account details with a deadline", "Domain doesn't match the client record"],
    lesson: "Verify unusual requests before sharing confidential information or taking action." },
  { round: 2, id: "s1", prompt: "You receive an MFA notification.", detail: "You aren't trying to log in.", options: ["Approve it", "Ignore it", "Report it to IT/Security", "Ask a colleague what they would do"], correct: 2,
    explanation: "An unexpected MFA request may mean someone has your password and is trying to get in. Report it immediately." },
  { round: 2, id: "s2", prompt: "You find an unknown USB drive in the office.", detail: "It's labelled 'Salary Q3'.", options: ["Plug it in to find the owner", "Report it, don't plug it in", "Take it home", "Leave it where it is"], correct: 1,
    explanation: "USB drives can carry malware. Never plug it into a work computer. Hand it to IT/Security." },
  { round: 2, id: "s3", prompt: "Someone claiming to be IT asks for your password.", detail: "They say they need it to fix a problem on your laptop.", options: ["Share it, they're from IT", "Share it but change it later", "Do not provide it. Verify through an official channel", "Ask them to email you the request"], correct: 2,
    explanation: "IT never needs your password. Verify the request through a known, official channel." },
  { round: 2, id: "s4", prompt: "You accidentally send a confidential document to the wrong person.", detail: "You've just noticed the mistake.", options: ["Report it immediately", "Hope they don't open it", "Quietly send a corrected copy", "Delete it from Sent Items"], correct: 0,
    explanation: "Report right away. Fast reporting lets the team limit damage. Hiding it makes things worse." },
  { round: 2, id: "s5", prompt: "You're leaving your desk for a meeting.", detail: "You'll be gone about 20 minutes.", options: ["Leave it, it's only 20 minutes", "Turn the monitor off", "Lock your computer", "Ask a colleague to watch it"], correct: 2,
    explanation: "Lock your screen every time (Windows + L). It takes one second." },
];

export type Choice = { label: string; next?: string; end?: { good: boolean; title: string; text: string; points: number } };
export type Step = { time: string; text: string; ask: string; choices: Choice[] };

export const round3Start = "start";
export const round3: Record<string, Step> = {
  start: { time: "9:07 AM", text: "You receive an email saying your Microsoft 365 account will be suspended unless you verify your credentials immediately.", ask: "What do you do?",
    choices: [
      { label: "Click the link", next: "clicked" },
      { label: "Report the email", end: { good: true, title: "Attack stopped", text: "You reported it before anyone clicked. IT blocked the sender and warned your colleagues.", points: 50 } },
      { label: "Reply asking whether it's legitimate", next: "replied" },
    ] },
  replied: { time: "9:09 AM", text: "The attacker replies: 'Yes, it's official. Please verify using the link below.'", ask: "What now?",
    choices: [
      { label: "Click the link", next: "clicked" },
      { label: "Report the email", end: { good: true, title: "Contained", text: "Replying told the attacker your address is active, but you reported before giving anything away.", points: 30 } },
    ] },
  clicked: { time: "9:11 AM", text: "You clicked the link and entered your password. The page looked real, but it wasn't.", ask: "What should you do now?",
    choices: [
      { label: "Delete the email", next: "late" },
      { label: "Change your password and report the incident", end: { good: true, title: "Damage limited", text: "Your fast report let IT reset sessions and block the attacker before they got far.", points: 30 } },
      { label: "Ignore it", next: "late" },
      { label: "Continue working", next: "late" },
    ] },
  late: { time: "11:40 AM", text: "The attacker is now inside your mailbox, reading your email and sending messages to your contacts as you.", ask: "IT calls about unusual sign-ins. What do you do?",
    choices: [
      { label: "Tell IT everything and change your password now", end: { good: true, title: "Late, but contained", text: "Reporting late meant more damage, but IT could still lock the account and warn contacts.", points: 20 } },
      { label: "Say it's probably nothing", end: { good: false, title: "Account takeover", text: "One small decision led to stolen credentials, and then to a full account takeover. Every hour matters.", points: 0 } },
    ] },
};

export const resultLevels = [
  { min: 120, title: "Security Champion", note: "You spot threats and act fast." },
  { min: 90, title: "Security Aware", note: "Strong instincts. A few gaps to close." },
  { min: 60, title: "Keep Learning", note: "You know the basics. Review the lessons." },
  { min: 0, title: "Security Training Recommended", note: "Retake the challenge and read each explanation." },
];
export const remember = ["Think before you click.", "Never share your password.", "Verify unusual requests.", "Report suspicious activity quickly.", "Lock your computer when you step away."];
