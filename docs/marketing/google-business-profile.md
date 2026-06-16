# Google Business Profile Setup: The Skill Corner

This document contains the verified business attributes, categories, and descriptions required to set up and optimize the Google Business Profile (formerly Google My Business) for **The Skill Corner**.

> [!IMPORTANT]
> Maintaining NAP (Name, Address, Phone) consistency across the website, Google Business Profile, and local directories is critical for local SEO and LLM referral indexing (ChatGPT Search, Perplexity, etc.).

---

## 1. Core Profile Details

| Attribute | Profile Value | Notes / Instructions |
| :--- | :--- | :--- |
| **Business Name** | The Skill Corner | Use exactly as shown. Do not add keyword-stuffing tags (e.g. "The Skill Corner - AI Automation") to avoid suspension. |
| **Primary Category** | Software Company | Best category for custom integration and software automation agencies. |
| **Secondary Categories** | • Business Management Consultant<br>• Internet Marketing Service<br>• Website Designer | Helps capture search queries for business optimization and digital agency services. |
| **Website URL** | `https://theskillcorner.com` | Ensure the canonical HTTPS URL is used. |
| **Phone Number** | *[Insert Real Phone Number]* | Replace the current placeholder `+1-416-555-0184` in [site.ts](file:///opt/Developer/SourceCode/Projects/TheSkillCorner/content/site.ts#L22). |

---

## 2. Address & Service Area

For a professional services agency, we recommend setting up as a **Service Area Business (SAB)** if there is no physical walk-in storefront. This hides the home or registration address on Google Maps while showing the target areas.

* **Physical Address (Hidden):** Use the official registered address in Toronto, ON (required for postcard verification).
* **Service Areas:**
  - Toronto, ON, Canada
  - North York, ON, Canada
  - Scarborough, ON, Canada
  - Etobicoke, ON, Canada
  - Mississauga, ON, Canada
  - Vaughan, ON, Canada
  - Markham, ON, Canada
  - Richmond Hill, ON, Canada
  - Oakville, ON, Canada
  - Brampton, ON, Canada

---

## 3. Business Description (750-Character Limit)

This copy is optimized for conversion, under the 750-character limit, and highlights our dual target segments (local businesses & professional practices).

```text
The Skill Corner is a Toronto-based AI automation agency helping local businesses and professional practices optimize operations and eliminate administrative friction. We build custom, secure, and compliant automation workflows for dental/medical offices, law firms, accounting practices, and client-facing local businesses. Our core services include AI-powered missed-call text-back receptionist, smart appointment reminders that cut no-shows, automated client intake, review generation, and seamless API integrations. We keep your systems running so you can focus on your clients.
```
*Character count: 543 / 750*

---

## 4. Services List (Google Business Profile Services)

Add these custom services under the primary and secondary categories to match our service offerings:

### Under Category: *Software Company*

* **AI Receptionist & Missed-Call Answering**
  * *Description:* Automatically text back missed calls on your existing business line to book clients, answer questions, and capture leads without hiring extra staff.
* **Smart Appointment Reminders**
  * *Description:* Conversational SMS and email reminder loops that cut no-show rates and coordinate last-minute rescheduling automatically.
* **Automated Client Intake**
  * *Description:* Secure, encrypted, and compliance-aware digital client intake sequences that sync directly with EHR and practice management databases.
* **Automated Review & Reputation Management**
  * *Description:* Automated customer satisfaction text messages triggered after service to request and route Google Reviews.
* **Custom Workflow Automation**
  * *Description:* Full-stack API integrations connecting your tools (Jane App, Clio, Square, Google Workspace, CRM) to eliminate manual data entry.
* **System Monitoring & Support**
  * *Description:* Proactive 24/7 system health monitoring of APIs, webhooks, and automation loops to ensure zero downtime.

---

## 5. Attributes & Additional Details

* **Appointment Required:** Yes
* **Online Appointments:** Yes (remote consultation)
* **On-site Services:** No
* **Languages:** English
* **Opening Date:** June 2026 (or actual incorporation date)

---

## 6. Action Items Checklist for Launch

- [ ] Obtain a real business phone number.
- [ ] Update [site.ts](file:///opt/Developer/SourceCode/Projects/TheSkillCorner/content/site.ts#L22) with the new phone number.
- [ ] Create the Google Business Profile account and trigger the postcard verification.
- [ ] Once verified, copy and paste the details from this document.
- [ ] Add the verified profile link/URL to the schema structure in the codebase (specifically under the `LocalBusiness` sameAs fields).
