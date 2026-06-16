/**
 * What: In-memory implementations of every integration port, backed by a plain dataset.
 * Why: Two jobs. (1) Tests and the demo run the entire engine end-to-end against deterministic
 *       data, so "ready to monetize" is provable with `npm test` and no vendor accounts. (2) It is
 *       the reference adapter: a real Jane/Fresha/QuickBooks adapter just has to satisfy the same
 *       interfaces these classes do. Swapping data sources never touches a recipe.
 * How: One class per port, each filtering an injected array by the query's time/criteria. Pure
 *       reads; nothing mutates the dataset. InMemoryIntegrations bundles them for convenience.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { diffMillis } from "../core/duration";
import type { IsoTimestamp } from "../core/types";
import type {
  Appointment,
  CalendarSource,
  CrmSource,
  Integrations,
  Invoice,
  LapsedCustomer,
  Lead,
  PaymentsSource,
  Review,
  ReviewsSource,
} from "./types";

export interface MemoryDataset {
  appointments?: readonly Appointment[];
  invoices?: readonly Invoice[];
  leads?: readonly Lead[];
  customers?: readonly LapsedCustomer[];
  reviews?: readonly Review[];
}

const DAY_MS = 86_400_000;

export class MemoryCalendar implements CalendarSource {
  constructor(private readonly appointments: readonly Appointment[]) {}

  async upcomingAppointments(now: IsoTimestamp, withinDays: number): Promise<Appointment[]> {
    const horizon = withinDays * DAY_MS;
    return this.appointments.filter((a) => {
      if (a.status !== "booked") return false;
      const delta = diffMillis(now, a.startAt);
      return delta > 0 && delta <= horizon;
    });
  }

  async completedAppointments(since: IsoTimestamp): Promise<Appointment[]> {
    return this.appointments.filter(
      (a) => a.status === "completed" && diffMillis(since, a.startAt) >= 0,
    );
  }

  async missedAppointments(since: IsoTimestamp): Promise<Appointment[]> {
    return this.appointments.filter(
      (a) => a.status === "no_show" && diffMillis(since, a.startAt) >= 0,
    );
  }

  async hasUpcomingFor(contactId: string, now: IsoTimestamp): Promise<boolean> {
    return this.appointments.some(
      (a) => a.contact.id === contactId && a.status === "booked" && diffMillis(now, a.startAt) > 0,
    );
  }
}

export class MemoryPayments implements PaymentsSource {
  constructor(private readonly invoices: readonly Invoice[]) {}

  async openInvoices(_now: IsoTimestamp): Promise<Invoice[]> {
    return this.invoices.filter((i) => i.status === "open");
  }

  async isPaid(invoiceId: string): Promise<boolean> {
    return this.invoices.some((i) => i.id === invoiceId && i.status === "paid");
  }
}

export class MemoryCrm implements CrmSource {
  constructor(
    private readonly leads: readonly Lead[],
    private readonly customers: readonly LapsedCustomer[],
  ) {}

  async newLeads(since: IsoTimestamp): Promise<Lead[]> {
    return this.leads.filter((l) => diffMillis(since, l.createdAt) >= 0);
  }

  async lapsedCustomers(now: IsoTimestamp, inactiveDays: number): Promise<LapsedCustomer[]> {
    const threshold = inactiveDays * DAY_MS;
    return this.customers.filter((c) => diffMillis(c.lastVisitAt, now) >= threshold);
  }
}

export class MemoryReviews implements ReviewsSource {
  constructor(private readonly reviews: readonly Review[]) {}

  async newReviews(since: IsoTimestamp): Promise<Review[]> {
    return this.reviews.filter((r) => diffMillis(since, r.createdAt) >= 0);
  }
}

/** Build a full Integrations bundle from a dataset; omit a source by leaving its array empty. */
export function inMemoryIntegrations(data: MemoryDataset): Integrations {
  return {
    calendar: new MemoryCalendar(data.appointments ?? []),
    payments: new MemoryPayments(data.invoices ?? []),
    crm: new MemoryCrm(data.leads ?? [], data.customers ?? []),
    reviews: new MemoryReviews(data.reviews ?? []),
  };
}
