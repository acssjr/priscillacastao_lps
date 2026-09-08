import { z } from "zod";

export const OfferKeySchema = z.enum(["individual", "dupla", "grupo-workshop"]);
export type OfferKey = z.infer<typeof OfferKeySchema>;

const ImageSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(8),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const RichSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
});

const TestimonialSchema = z.object({
  name: z.string().min(2),
  quote: z.string().min(20),
  verified: z.boolean(),
});

export const LandingCampaignSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  route: z.string().startsWith("/"),
  meta: z.object({
    title: z.string().min(20),
    description: z.string().min(50),
    ogAlt: z.string().min(8),
  }),
  navigation: z.array(z.object({ label: z.string().min(1), target: z.string().startsWith("#") })).min(3),
  hero: RichSectionSchema.extend({
    titleHighlight: z.string().min(1),
    image: ImageSchema,
    cta: z.string().min(2),
    ctaNote: z.object({
      lead: z.string().min(5),
      bridge: z.string().min(5),
      details: z.string().min(5),
    }),
    location: z.string().min(2),
  }).refine((hero) => hero.title.includes(hero.titleHighlight), {
    message: "Hero title must contain its highlighted text",
    path: ["titleHighlight"],
  }),
  recognition: RichSectionSchema,
  method: RichSectionSchema.extend({
    pillars: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })).length(3),
    image: ImageSchema,
  }),
  proof: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    poster: ImageSchema,
    status: z.enum(["verified", "demonstration"]),
    testimonials: z.array(TestimonialSchema).min(2).max(4),
    cta: z.string().min(2),
  }).superRefine((proof, context) => {
    if (proof.status === "verified" && proof.testimonials.some((testimonial) => !testimonial.verified)) {
      context.addIssue({ code: "custom", message: "Verified proof cannot contain demonstration testimonials" });
    }
  }),
  formats: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    note: z.string().min(10),
    alternative: z.object({
      key: z.literal("grupo-workshop"),
      title: z.string().min(1),
      cta: z.string().min(2),
    }),
  }),
  offers: z.array(z.object({
    key: z.enum(["individual", "dupla"]),
    title: z.string().min(1),
    audience: z.string().min(1),
    body: z.string().min(1),
    primary: z.boolean(),
    cta: z.string().min(2),
  })).length(2),
  about: RichSectionSchema.extend({ image: ImageSchema }),
  process: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    steps: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })).length(5),
  }),
  faq: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(5).max(8),
  }),
  closing: RichSectionSchema.extend({ cta: z.string().min(2) }),
  whatsapp: z.object({
    phone: z.literal("5575981234176"),
    messages: z.record(OfferKeySchema, z.string().min(20)),
  }),
});

export type LandingCampaign = z.infer<typeof LandingCampaignSchema>;
