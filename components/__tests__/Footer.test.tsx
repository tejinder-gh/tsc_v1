import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Footer } from "../Footer";

describe("Footer Component", () => {
  it("renders all global offices from site.offices", () => {
    const html = renderToStaticMarkup(<Footer />);

    for (const office of site.offices) {
      expect(html).toContain(office.city);
      expect(html).toContain(office.country);
    }
  });

  it("renders direct telephone contact links and email", () => {
    const html = renderToStaticMarkup(<Footer />);

    expect(html).toContain(site.phone);
    expect(html).toContain(site.phoneIndia);
    expect(html).toContain(`mailto:${site.email}`);
  });

  it("renders machine-readable specifications and governance links", () => {
    const html = renderToStaticMarkup(<Footer />);

    expect(html).toContain("/llms.txt");
    expect(html).toContain("/pricing.md");
    expect(html).toContain("/legal/privacy");
    expect(html).toContain("/legal/terms");
  });

  it("renders key systems and digital capabilities directory routes", () => {
    const html = renderToStaticMarkup(<Footer />);

    expect(html).toContain("/what-we-automate");
    expect(html).toContain("/what-we-automate/ai-receptionist");
    expect(html).toContain("/digital-services");
    expect(html).toContain("/digital-services/ai-agent-development");
    expect(html).toContain("/industries");
    expect(html).toContain("/library");
  });
});
