# Launch Checklist

Work top to bottom; the site is deployable at every step, but leads only flow once the
webhook is set.

## 1. Domain & hosting

- [ ] Import the repo into Vercel (zero config - framework auto-detected)
- [ ] Add the production domain in Vercel and update DNS
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the final `https://` domain (drives canonical URLs, sitemap, JSON-LD)
- [ ] Verify `https://<domain>/sitemap.xml` and `/robots.txt` after first deploy

## 2. Cal.com

- [ ] Create the "Automation audit" event type (30 min) on Cal.com
- [ ] Set `NEXT_PUBLIC_CAL_LINK` (format: `username/event-slug`)
- [ ] Book a test appointment through `/book` end to end
- [ ] Set up event reminders/buffers inside Cal.com

## 3. Lead webhook

- [ ] Create a catch hook in Zapier / Make / n8n
- [ ] Set `LEAD_WEBHOOK_URL`
- [ ] Route by `lead_source` and `segment` into your CRM / sheet / inbox
- [ ] Build the ROI-report email step: when `lead_source = roi_calculator`, send a
      templated email using `roi_hours_per_week`, `roi_hourly_cost`, `roi_annual_cost`
- [ ] Build the checklist delivery step: when `lead_source` is `checklist_page` or
      `exit_intent`, send the checklist email
- [ ] Submit one test lead per form: contact, checklist, exit-intent modal, quick
      widget, ROI capture - confirm all five arrive with correct `segment`

## 4. Checklist email

- [x] Write the Automation Opportunities Checklist content (25 items) - see
      `docs/automation-opportunities-checklist.md`
- [ ] Add it to the webhook's checklist delivery step (section 3) as the email body or
      template
- [ ] Submit a test lead on `/checklist` and confirm the checklist email arrives

## 5. Analytics

- [ ] Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (or `NEXT_PUBLIC_GA_ID` - Plausible wins if both are set)
- [ ] Confirm `cta_clicked` and `lead_captured` events arrive with `location` and `segment` properties
- [ ] Set up a conversion goal on `lead_captured`

## 6. Content placeholders to replace

- [ ] Pricing anchors in `content/site.ts` (currently: local "From $395/month";
      practice "$7,500 - $25,000" + support "from $750/month") - confirm real numbers
- [ ] Contact email and phone in `content/site.ts` (phone is a 555 placeholder)
- [ ] Founder bio specifics and photo (`content/about.ts`, add `/public/founder.jpg`
      and swap the placeholder block in `app/about/page.tsx`)
- [ ] "Recent builds" entries in `content/proof.ts` - keep only ones that reflect real
      work; replace with named testimonials as permissions arrive
- [ ] Review the industries; trim or extend `content/industries.ts`

## 7. OG image & polish

- [ ] Create a 1200x630 OG image and add it as `app/opengraph-image.png` (Next picks it
      up automatically) or reference it in `app/layout.tsx` metadata
- [ ] Run Lighthouse on `/` and one `/for/*` page - targets: performance 90+,
      accessibility 100
- [ ] Test at 360px width: sticky bar, widget, calculator sliders, forms
- [ ] Test exit-intent modal (desktop: move cursor out the top of the viewport; fires
      once per session)
- [ ] Spot-check segment behavior: choose "local business" on home, confirm practice
      pricing never appears on the home page afterward (and vice versa)
