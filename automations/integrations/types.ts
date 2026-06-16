/**
 * What: The integration interfaces - the read-side ports a recipe uses to learn what's happening
 *       in a client's real tools (booking system, POS/CRM, accounting, review platforms).
 * Why: Recipes must not know whether bookings come from Jane, Fresha, or Square. They depend on
 *       these narrow interfaces; concrete adapters (one per vendor) implement them. That is what
 *       lets the same recipe ship to a salon on Fresha and a clinic on Jane unchanged.
 * How: Each source exposes a few intention-revealing async queries returning plain domain objects,
 *       every one of which carries a Contact so the engine can message the right person.
 * From Where: TheSkillCorner automation-engine build, 2026-06 (ports for content/services.ts tools).
 * When: 2026-06; add a method only when a recipe genuinely needs it.
 */

import type { Contact, IsoTimestamp } from "../core/types";

export type AppointmentStatus = "booked" | "completed" | "cancelled" | "no_show";

export interface Appointment {
  id: string;
  contact: Contact;
  startAt: IsoTimestamp;
  service?: string;
  staff?: string;
  location?: string;
  status: AppointmentStatus;
}

export interface Invoice {
  id: string;
  contact: Contact;
  number: string;
  /** Amount owed in major currency units (e.g. dollars), not cents. */
  amount: number;
  currency: string;
  issuedAt: IsoTimestamp;
  dueAt: IsoTimestamp;
  status: "open" | "paid" | "void";
  payLink?: string;
}

export interface Lead {
  id: string;
  contact: Contact;
  createdAt: IsoTimestamp;
  source?: string;
  message?: string;
  /** Raw answers captured at intake, available to qualification logic. */
  fields?: Record<string, string>;
}

export interface LapsedCustomer {
  id: string;
  contact: Contact;
  lastVisitAt: IsoTimestamp;
  visits?: number;
  topService?: string;
}

export interface Review {
  id: string;
  platform: "google" | "yelp" | "facebook" | "other";
  author?: string;
  rating: number;
  text: string;
  createdAt: IsoTimestamp;
  contact?: Contact;
}

/** Booking/calendar system (Cal.com, Jane, Fresha, Square Appointments, Jobber...). */
export interface CalendarSource {
  /** Appointments starting between now and now+withinDays, status "booked". */
  upcomingAppointments(now: IsoTimestamp, withinDays: number): Promise<Appointment[]>;
  /** Appointments completed at or after `since`. Drives review requests. */
  completedAppointments(since: IsoTimestamp): Promise<Appointment[]>;
  /** Appointments marked no_show at or after `since`. Drives rebooking. */
  missedAppointments(since: IsoTimestamp): Promise<Appointment[]>;
  /** True if the contact has any future booked appointment - the win-back exclusion check. */
  hasUpcomingFor(contactId: string, now: IsoTimestamp): Promise<boolean>;
}

/** Accounting/payments system (QuickBooks, Xero, Stripe, Jobber, Jane). */
export interface PaymentsSource {
  /** Invoices that are issued, unpaid, and past or near due. */
  openInvoices(now: IsoTimestamp): Promise<Invoice[]>;
  /** Live paid check used to halt a dunning ladder the moment money arrives. */
  isPaid(invoiceId: string): Promise<boolean>;
}

/** CRM / customer database (HubSpot, Clio, Mailchimp, the POS customer table). */
export interface CrmSource {
  /** Leads created at or after `since`. Drives the instant responder. */
  newLeads(since: IsoTimestamp): Promise<Lead[]>;
  /** Customers whose last visit is older than `inactiveDays`. Drives win-back. */
  lapsedCustomers(now: IsoTimestamp, inactiveDays: number): Promise<LapsedCustomer[]>;
}

/** Review platforms (Google Business Profile, Yelp, Facebook). */
export interface ReviewsSource {
  /** Reviews posted at or after `since`. Drives drafted responses + alerting. */
  newReviews(since: IsoTimestamp): Promise<Review[]>;
}

/** The bundle of integrations available to a client's automations. All optional. */
export interface Integrations {
  calendar?: CalendarSource;
  payments?: PaymentsSource;
  crm?: CrmSource;
  reviews?: ReviewsSource;
}
