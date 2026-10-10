/** Адрес сайта для ссылок в поиске и при пересылке (превью в Telegram и мессенджерах). */
export const SITE_URL = (process.env.APP_URL ?? "https://www.parvozedu.uz").replace(/\/$/, "");

/** Как связаться с владельцем сайта — показывается на странице о конфиденциальности, если задано (NEXT_PUBLIC_CONTACT). */
export const CONTACT = process.env.NEXT_PUBLIC_CONTACT?.trim() || "";
