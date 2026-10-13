import { describe, expect, it } from "vitest";
import { defaults, validateContent } from "@/lib/cms/catalog";
import { changeText, editableField } from "@/lib/cms/editor-structure";
describe("visual editor boundaries",() => {
  const campaign = defaults["forro-do-zero"];
  it("rejects identifier, route, prototype and unknown field messages",() => {
    for (const field of ["id","route","hero.__proto__.title","constructor.prototype","navigation.0.target","hero.image.src","faq.items.999.answer"]) expect(editableField(campaign,field)).toBeNull();
  });
  it("binds repeated copy to its precise section and collection index",() => {
    expect(editableField(campaign,"faq.items.1.question")?.value).toBe(campaign.faq.items[1].question);
    expect(editableField(campaign,"hero.image")?.kind).toBe("image");
  });
  it("keeps a rewritten headline valid without manual highlight repair",() => {
    const next = changeText(campaign,["hero","title"],"Dançar começa com você");
    expect(() => validateContent({...defaults,"forro-do-zero":next})).not.toThrow();
    expect(campaign.hero.title).not.toBe(next.hero.title);
  });
  it("preserves the highlight when it still appears in the edited title",() => {
    const next = changeText(campaign,["hero","title"],campaign.hero.title + " Hoje.");
    expect(next.hero.titleEmphasis).toBe(campaign.hero.titleEmphasis);
  });
});
