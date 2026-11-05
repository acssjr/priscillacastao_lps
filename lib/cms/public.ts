import { getCampaign, type CampaignId } from "@/content/landing-pages/registry";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import type { BookingSettings } from "@/lib/booking-settings";
import { getBookingSettings } from "@/lib/scheduling-service";
import { DEFAULT_INSTAGRAM_URL, DEFAULT_WHATSAPP_PHONE } from "@/lib/whatsapp";
import { publicContent } from "./store";

export async function publishedCampaign(id: CampaignId): Promise<LandingCampaign> {
  const [values, bookingSettings] = await Promise.all([
    publicContent(),
    getBookingSettings(),
  ]);
  const base = values[id] || getCampaign(id);

  const phone =
    base.whatsapp.phone !== DEFAULT_WHATSAPP_PHONE
      ? base.whatsapp.phone
      : bookingSettings.whatsappPhone || base.whatsapp.phone;

  const instagram =
    base.instagram && base.instagram !== DEFAULT_INSTAGRAM_URL
      ? base.instagram
      : bookingSettings.instagramUrl || base.instagram || DEFAULT_INSTAGRAM_URL;

  return {
    ...base,
    instagram,
    whatsapp: {
      ...base.whatsapp,
      phone,
    },
  };
}

export async function resolvePublicContact(): Promise<
  BookingSettings & {
    whatsappPhone: string;
    instagramUrl: string;
  }
> {
  const [bookingSettings, values] = await Promise.all([
    getBookingSettings(),
    publicContent(),
  ]);
  const cmsZero = values["forro-do-zero"] || getCampaign("forro-do-zero");

  const whatsappPhone =
    bookingSettings.whatsappPhone !== DEFAULT_WHATSAPP_PHONE
      ? bookingSettings.whatsappPhone
      : cmsZero.whatsapp.phone || DEFAULT_WHATSAPP_PHONE;

  const instagramUrl =
    bookingSettings.instagramUrl !== DEFAULT_INSTAGRAM_URL
      ? bookingSettings.instagramUrl
      : cmsZero.instagram || DEFAULT_INSTAGRAM_URL;

  return {
    ...bookingSettings,
    whatsappPhone,
    instagramUrl,
  };
}
