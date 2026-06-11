/**
 * What: The 25 checklist items grouped by category with their respective time savings.
 * Why: Keeps the interactive checklist and data structures clean, typed, and easy to modify.
 * How: Exported typed array of ChecklistCategory containing ChecklistItem.
 * From Where: docs/automation-opportunities-checklist.md, 2026-06.
 */

export interface ChecklistItem {
  id: number;
  task: string;
  automation: string;
  minHours: number;
  maxHours: number;
  hoursDisplay: string;
}

export interface ChecklistCategory {
  title: string;
  items: ChecklistItem[];
}

export const checklistData: readonly ChecklistCategory[] = [
  {
    title: "Phone & inquiries",
    items: [
      {
        id: 1,
        task: 'Answering routine calls ("Are you open? How much? Where are you?")',
        automation: "An AI receptionist answers 24/7 with your real answers, in your tone.",
        minHours: 4,
        maxHours: 6,
        hoursDisplay: "4-6",
      },
      {
        id: 2,
        task: "Returning missed calls and voicemails",
        automation:
          "Every call gets answered live, so there's nothing to return - after-hours callers get booked, not dumped to voicemail.",
        minHours: 2,
        maxHours: 3,
        hoursDisplay: "2-3",
      },
      {
        id: 3,
        task: "Replying to website and contact-form inquiries",
        automation:
          'An instant reply answers their question and includes a booking link - within a minute, not "by end of day".',
        minHours: 2,
        maxHours: 4,
        hoursDisplay: "2-4",
      },
      {
        id: 4,
        task: "Answering the same questions by text and email",
        automation:
          "An FAQ assistant trained on your actual answers handles the repeats; only new questions reach you.",
        minHours: 2,
        maxHours: 3,
        hoursDisplay: "2-3",
      },
      {
        id: 5,
        task: "Qualifying new leads (what they need, insurance, budget, timeline)",
        automation: "Intake questions get asked automatically before a human ever picks up.",
        minHours: 2,
        maxHours: 3,
        hoursDisplay: "2-3",
      },
      {
        id: 6,
        task: "Taking messages and routing them to the right person",
        automation:
          "Calls and messages get tagged by topic and sent to the right inbox - no more sticky notes.",
        minHours: 1,
        maxHours: 2,
        hoursDisplay: "1-2",
      },
    ],
  },
  {
    title: "Booking & reminders",
    items: [
      {
        id: 7,
        task: 'The "does Tuesday at 2 work?" scheduling back-and-forth',
        automation:
          "A self-serve booking link synced to your real calendar - clients pick a slot themselves.",
        minHours: 3,
        maxHours: 5,
        hoursDisplay: "3-5",
      },
      {
        id: 8,
        task: "Sending appointment reminders",
        automation:
          "Automatic text + email reminders at 48 hours and 2 hours out - the single biggest no-show killer.",
        minHours: 1,
        maxHours: 2,
        hoursDisplay: "1-2",
      },
      {
        id: 9,
        task: "Handling reschedules and cancellations",
        automation: "The reminder includes a reschedule link; the freed slot reopens on its own.",
        minHours: 1,
        maxHours: 2,
        hoursDisplay: "1-2",
      },
      {
        id: 10,
        task: "Filling last-minute openings",
        automation:
          "A waitlist automatically offers the freed slot to the next person who wanted it.",
        minHours: 1,
        maxHours: 1,
        hoursDisplay: "1",
      },
      {
        id: 11,
        task: "Chasing no-shows to rebook",
        automation:
          'An automatic "life happens - grab a new time here" message goes out the same day.',
        minHours: 1,
        maxHours: 1,
        hoursDisplay: "1",
      },
    ],
  },
  {
    title: "Paperwork & intake",
    items: [
      {
        id: 12,
        task: "New client / patient intake forms on a clipboard",
        automation: "Digital forms go out at booking; answers are waiting before they walk in.",
        minHours: 2,
        maxHours: 3,
        hoursDisplay: "2-3",
      },
      {
        id: 13,
        task: "Re-typing form answers into your software",
        automation:
          "Form fields flow straight into your CRM or practice software - typed once, by the client.",
        minHours: 2,
        maxHours: 4,
        hoursDisplay: "2-4",
      },
      {
        id: 14,
        task: "Sending and chasing signatures on documents",
        automation: "E-sign requests send themselves and politely nag until signed.",
        minHours: 1,
        maxHours: 2,
        hoursDisplay: "1-2",
      },
      {
        id: 15,
        task: "Writing routine documents (quotes, engagement letters, treatment plans)",
        automation: "Templates fill themselves from the intake answers; you review and send.",
        minHours: 2,
        maxHours: 3,
        hoursDisplay: "2-3",
      },
      {
        id: 16,
        task: "Invoicing and chasing late payments",
        automation:
          "Invoices fire when the work is done; reminders chase themselves so you never have the awkward call.",
        minHours: 2,
        maxHours: 3,
        hoursDisplay: "2-3",
      },
      {
        id: 17,
        task: "Logging jobs, cases, or visits into a spreadsheet",
        automation:
          "Records create themselves from the calendar and forms - the spreadsheet stays current without you.",
        minHours: 1,
        maxHours: 2,
        hoursDisplay: "1-2",
      },
      {
        id: 18,
        task: "Collecting insurance or eligibility details up front",
        automation:
          "Verification questions live in the intake form and flag problems before the appointment, not at the front desk.",
        minHours: 1,
        maxHours: 2,
        hoursDisplay: "1-2",
      },
    ],
  },
  {
    title: "Reviews, reputation & social",
    items: [
      {
        id: 19,
        task: "Asking happy customers for reviews",
        automation:
          "An automatic text after the visit with a direct review link - asked every time, not just when you remember.",
        minHours: 1,
        maxHours: 2,
        hoursDisplay: "1-2",
      },
      {
        id: 20,
        task: "Responding to reviews",
        automation: "Replies get drafted for you in your voice; you press approve.",
        minHours: 1,
        maxHours: 1,
        hoursDisplay: "1",
      },
      {
        id: 21,
        task: "Keeping an eye on what's said about you online",
        automation:
          "Mentions get monitored; you're only alerted when something actually needs you.",
        minHours: 1,
        maxHours: 1,
        hoursDisplay: "1",
      },
      {
        id: 22,
        task: "Posting routine social updates",
        automation:
          "A month of posts drafted and scheduled in one sitting instead of a nightly scramble.",
        minHours: 2,
        maxHours: 3,
        hoursDisplay: "2-3",
      },
      {
        id: 23,
        task: "Sending the monthly newsletter",
        automation:
          "Drafted from what already happened in your business that month; you edit, it sends.",
        minHours: 1,
        maxHours: 2,
        hoursDisplay: "1-2",
      },
      {
        id: 24,
        task: 'Re-engaging past customers ("it\'s been 6 months since your last visit")',
        automation:
          "Recall and win-back messages go out on a schedule, automatically personalized.",
        minHours: 1,
        maxHours: 2,
        hoursDisplay: "1-2",
      },
      {
        id: 25,
        task: "Thanking people who refer you",
        automation: "A thank-you triggers automatically the moment a referral books.",
        minHours: 1,
        maxHours: 1,
        hoursDisplay: "1",
      },
    ],
  },
] as const;
