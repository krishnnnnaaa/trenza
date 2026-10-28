import { PolicySectionData } from "@/types/types";
import { PolicyReveal } from "./PolicyReveal";


// Reference layout: big olive number on the left, heading + content aligned to its right, thin dividers.
export function PolicySections({ sections }: { sections: PolicySectionData[] }) {
  return (
    <div className="mt-6">
      {sections.map((section, index) => (
        <PolicyReveal key={section.id} delay={Math.min(index * 45, 360)}>
          <section
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="scroll-mt-24 border-t border-[#E3DFD8] py-7"
          >
          <div className="flex gap-3 sm:gap-5">
            <span aria-hidden="true" className="w-9 shrink-0 font-serif text-2xl leading-8 text-[#454F45]/70 sm:w-10">
              {section.number}
            </span>
            <div className="min-w-0 flex-1">
              <h2 id={`${section.id}-heading`} className="font-serif text-2xl font-normal leading-8 text-[#17181A]">
                {section.title}
              </h2>
              <div className="mt-3 flex flex-col gap-3">{section.content}</div>
            </div>
          </div>
          </section>
        </PolicyReveal>
      ))}
    </div>
  );
}