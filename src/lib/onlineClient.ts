"use client";

/** Браузерная сторона игры по сети: запросы к /api/play, опрос сервера, тексты ошибок. */
import { useEffect, useRef, useState } from "react";
import type { T } from "./lang";

export interface ApiResult<V> {
  ok: boolean;
  status: number;
  data: V & { error?: string };
}

export async function api<V = Record<string, unknown>>(path: string, body?: unknown): Promise<ApiResult<V>> {
  try {
    const res = await fetch(path, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as V & { error?: string };
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: "network" } as V & { error?: string } };
  }
}

/**
 * Повторяет запрос каждые `ms`, пока вкладка видна (в фоне — реже). Ответ кладёт в состояние;
 * `reload()` делает запрос сразу — после своего действия.
 */
export function usePoll<V>(
  load: () => Promise<V | null>,
  ms: number,
  enabled = true,
): { data: V | null; reload: () => void; set: (value: V) => void } {
  const [data, setData] = useState<V | null>(null);
  const loadRef = useRef(load);
  const kick = useRef<() => void>(() => undefined);
  useEffect(() => {
    loadRef.current = load;
  });
  useEffect(() => {
    if (!enabled) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = async () => {
      clearTimeout(timer);
      const next = await loadRef.current();
      if (stopped) return;
      if (next !== null) setData(next);
      timer = setTimeout(run, document.hidden ? Math.max(ms * 4, 8000) : ms);
    };
    kick.current = () => void run();
    void run();
    const onVisible = () => !document.hidden && void run();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [ms, enabled]);
  return { data, reload: () => kick.current(), set: setData };
}

/** Код ошибки сервера → понятная фраза для ребёнка. */
export function errorText(code: string | undefined, t: T): string {
  switch (code) {
    case "network":
      return t(
        "Нет связи. Проверь интернет и попробуй ещё раз.",
        "Aloqa yoʻq. Internetni tekshirib, qayta urinib koʻr.",
      );
    case "invalid-name":
      return t(
        "Имя: от 3 до 16 знаков — латинские буквы, цифры и «_», первая — буква.",
        "Ism: 3 dan 16 gacha belgi — lotin harflari, raqamlar va «_», birinchisi harf boʻlsin.",
      );
    case "reserved-name":
    case "bad-name":
      return t("Такое имя нельзя. Придумай другое.", "Bunday ism mumkin emas. Boshqasini oʻylab top.");
    case "taken":
      return t("Это имя уже занято. Придумай другое.", "Bu ism band. Boshqasini oʻylab top.");
    case "no-user":
      return t("Такого игрока не нашлось.", "Bunday oʻyinchi topilmadi.");
    case "short":
      return t("Введи хотя бы 3 буквы имени.", "Ismning kamida 3 ta harfini kirit.");
    case "self":
      return t("Это же ты 🙂", "Bu axir oʻzing 🙂");
    case "already":
      return t("Вы уже друзья.", "Siz allaqachon doʻstsiz.");
    case "blocked":
      return t("С этим игроком связаться нельзя.", "Bu oʻyinchi bilan bogʻlanib boʻlmaydi.");
    case "limit":
      return t(
        "Слишком много сразу. Сначала закончи что-нибудь из начатого.",
        "Birdaniga juda koʻp. Avval boshlanganlarning birortasini tugat.",
      );
    case "off":
      return t(
        "Игра по сети выключена: у тебя или у друга. Родитель может включить её в настройках.",
        "Onlayn oʻyin oʻchirilgan: sendan yoki doʻstingdan. Ota-ona uni sozlamalarda yoqishi mumkin.",
      );
    case "chat-off":
      return t(
        "Переписка выключена: у тебя или у друга. Родитель может включить её в настройках.",
        "Yozishma oʻchirilgan: sendan yoki doʻstingdan. Ota-ona uni sozlamalarda yoqishi mumkin.",
      );
    case "not-friends":
      return t("Сначала нужно подружиться.", "Avval doʻst boʻlish kerak.");
    case "rate":
      return t("Слишком часто. Подожди минутку.", "Juda tez-tez. Bir daqiqa kut.");
    case "link":
      return t("Ссылки и названия сайтов писать нельзя.", "Havola va sayt nomlarini yozish mumkin emas.");
    case "contact":
      return t("Номера телефонов и почту писать нельзя.", "Telefon raqami va pochtani yozish mumkin emas.");
    case "word":
      return t("Так писать нельзя. Давай по-доброму!", "Bunday yozish mumkin emas. Mehr bilan yozaylik!");
    case "empty":
      return t("Напиши что-нибудь.", "Biror narsa yoz.");
    case "illegal":
      return t("Так ходить нельзя.", "Bunday yurib boʻlmaydi.");
    case "not-your-turn":
      return t("Сейчас ход соперника.", "Hozir raqib yuradi.");
    case "not-active":
      return t("Партия уже закончена.", "Partiya allaqachon tugagan.");
    case "conflict":
      return t("Попробуй ещё раз.", "Yana urinib koʻr.");
    case "cannot-abort":
      return t("Отменить можно только в самом начале.", "Bekor qilish faqat boshida mumkin.");
    default:
      return t("Что-то пошло не так. Попробуй ещё раз.", "Nimadir xato ketdi. Yana urinib koʻr.");
  }
}
