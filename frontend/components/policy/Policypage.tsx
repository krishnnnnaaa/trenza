import { PolicySectionData } from "@/types/types";
import { PolicyHero, PolicyHeroProps } from "./Policyhero";
import { PolicySummary, PolicySummaryProps } from "./Policysummary";
import { PolicyContactBanner, PolicyContactBannerProps } from "./Policycontactbanner";
import { PolicyToc } from "./Policytoc";
import { PolicySections } from "./Policysections";
import { PolicyReveal } from "./PolicyReveal";


interface PolicyPageProps {
  hero: PolicyHeroProps;
  summary: PolicySummaryProps;
  sections: PolicySectionData[];
  banner: PolicyContactBannerProps;
}

// Shared shell for all policy-style pages. Navbar and footer come from the app layout.
export function PolicyPage({ hero, summary, sections, banner }: PolicyPageProps) {
  const tocItems = sections.map(({ id, number, title }) => ({ id, number, title }));

  return (
    <>
      <PolicyHero {...hero} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
          <PolicyReveal delay={100}>
            <PolicyToc items={tocItems} />
          </PolicyReveal>
          <div className="min-w-0">
            <PolicyReveal delay={160}>
              <PolicySummary {...summary} />
            </PolicyReveal>
            <PolicySections sections={sections} />
          </div>
        </div>

        <div className="mt-8 lg:mt-10">
          <PolicyReveal delay={240}>
            <PolicyContactBanner {...banner} />
          </PolicyReveal>
        </div>
      </div>
    </>
  );
}