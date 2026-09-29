/** Имя ребёнка: как записывается, как показывается на двух языках и как попадает в тексты. */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  cleanChildName,
  fillName,
  latinize,
  nameFor,
  namesFor,
  personalize,
  uzSuffix,
  NAME_TOKEN,
} from "@/lib/childName";
import { allDays, WEEKS } from "@/content/program";
import { guideFor, localizeDay, localizeWeek } from "@/content/uz";
import { GUIDE } from "@/content/guide";
import { sanitize } from "@/lib/state";
import { mergeStates, sameProgress } from "@/lib/sync";

describe("запись имени", () => {
  it("лишнее убирается, длина ограничена, строчные буквы становятся заглавными", () => {
    expect(cleanChildName("  анна  ")).toBe("Анна");
    expect(cleanChildName("aziz   karimov")).toBe("Aziz Karimov");
    expect(cleanChildName("Мария-Луиза")).toBe("Мария-Луиза");
    expect(cleanChildName("{Ali}*_#")).toBe("Ali");
    expect(cleanChildName("Ali2024 🙂")).toBe("Ali");
    expect(cleanChildName("🙂 123")).toBeUndefined();
    expect(cleanChildName(42)).toBeUndefined();
    expect(cleanChildName("А".repeat(40))).toHaveLength(24);
  });

  it("узбекские апострофы приводятся к правильным знакам", () => {
    expect(cleanChildName("O'tkir")).toBe("Oʻtkir");
    expect(cleanChildName("To‘lqin")).toBe("Toʻlqin");
    expect(cleanChildName("Ma'ruf")).toBe("Maʼruf");
  });

  it("кириллица — латиницей для узбекского интерфейса", () => {
    expect(latinize("Шерзод")).toBe("Sherzod");
    expect(latinize("Ўткир")).toBe("Oʻtkir");
    expect(latinize("Қодир")).toBe("Qodir");
    expect(latinize("Ғайрат")).toBe("Gʻayrat");
    expect(latinize("Елена")).toBe("Yelena");
    expect(latinize("Юлия")).toBe("Yuliya");
    expect(latinize("Чингиз")).toBe("Chingiz");
  });

  it("какое имя показывать", () => {
    expect(nameFor("ru", {})).toBe("Друг");
    expect(nameFor("uz", {})).toBe("Doʻst");
    expect(nameFor("ru", { childName: "Шерзод" })).toBe("Шерзод");
    expect(nameFor("uz", { childName: "Шерзод" })).toBe("Sherzod");
    expect(nameFor("uz", { childName: "Шерзод", childNameUz: "Sherzodbek" })).toBe("Sherzodbek");
    expect(nameFor("uz", { childName: "Aziz" })).toBe("Aziz");
    expect(namesFor("ru", {})).toEqual({ name: "Друг", child: "ребёнок" });
    expect(namesFor("uz", { childName: "Aziz" })).toEqual({ name: "Aziz", child: "Aziz" });
  });
});

describe("имя в текстах", () => {
  it("узбекские окончания: меняется только дательный падеж после k и q", () => {
    expect(uzSuffix("Otabek", "ga")).toBe("Otabekka");
    expect(uzSuffix("Ortiq", "ga")).toBe("Ortiqqa");
    expect(uzSuffix("Anvar", "ga")).toBe("Anvarga");
    expect(uzSuffix("Togʻ", "ga")).toBe("Togʻga");
    expect(uzSuffix("Otabek", "ning")).toBe("Otabekning");
    expect(uzSuffix("Anvar", "da")).toBe("Anvarda");
  });

  it("метки заменяются; в начале предложения — с большой буквы; чужие фигурные скобки не трогаются", () => {
    expect(fillName("Salom, {name}! {name:ga} sovgʻa.", "Bek")).toBe("Salom, Bek! Bekka sovgʻa.");
    expect(fillName("{child} nimani yechadi?", { name: "Doʻst", child: "farzandingiz" })).toBe(
      "Farzandingiz nimani yechadi?",
    );
    expect(fillName("Как думает {child}.", { name: "Друг", child: "ребёнок" })).toBe("Как думает ребёнок.");
    expect(fillName("Множество {x} и {1, 2}", "Анна")).toBe("Множество {x} и {1, 2}");
  });

  it("целый объект: без меток — тот же объект, с метками — один и тот же результат", () => {
    const names = { name: "Анна", child: "Анна" };
    const plain = { a: "текст", b: ["x", { c: 1 }] };
    expect(personalize(plain, "ru", names)).toBe(plain);
    const day = { title: "День", body: [{ text: "{name} считает" }, { text: "без имени" }] };
    const once = personalize(day, "ru", names);
    expect(once).toEqual({ title: "День", body: [{ text: "Анна считает" }, { text: "без имени" }] });
    expect(personalize(day, "ru", names)).toBe(once);
    expect(once.body[1]).toBe(day.body[1]);
    expect(personalize(day, "ru", { name: "Bek", child: "Bek" }).body[0].text).toBe("Bek считает");
  });
});

describe("имя в прогрессе и между устройствами", () => {
  it("имя чистится при загрузке и сохраняется", () => {
    const s = sanitize({ settings: { childName: "  анна ", childNameAt: 5 } });
    expect(s.settings.childName).toBe("Анна");
    expect(s.settings.childNameAt).toBe(5);
    expect(sanitize({}).settings.childName).toBeUndefined();
  });

  it("пустое имя не затирает записанное; из двух записанных побеждает более позднее", () => {
    const named = { settings: { childName: "Aziz", childNameAt: 10 } };
    expect(mergeStates({}, named).settings.childName).toBe("Aziz");
    expect(mergeStates(named, {}).settings.childName).toBe("Aziz");
    const renamed = { settings: { childName: "Bek", childNameAt: 20 } };
    expect(mergeStates(named, renamed).settings.childName).toBe("Bek");
    expect(mergeStates(renamed, named).settings.childName).toBe("Bek");
  });

  it("смена имени — повод синхронизировать, а звуки доски — нет (это настройка устройства)", () => {
    const a = sanitize({ settings: { childName: "Aziz" } });
    expect(sameProgress(a, sanitize({ settings: { childName: "Bek" } }))).toBe(false);
    expect(sameProgress(a, sanitize({ settings: { childName: "Aziz", boardSounds: false } }))).toBe(true);
  });
});

describe("в исходниках не осталось имени Давлатжона", () => {
  const root = path.join(process.cwd(), "src");
  const files = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? files(p) : /\.(ts|tsx)$/.test(e.name) ? [p] : [];
    });

  it("имя встречается только в названии платформы (brand.ts) и технических ключах хранилища", () => {
    const found: string[] = [];
    for (const f of files(root)) {
      if (f.endsWith(path.join("lib", "brand.ts"))) continue;
      const text = fs.readFileSync(f, "utf8").replace(/davlatjon-(lab|progress)/g, "");
      text.split("\n").forEach((line, i) => {
        if (/давлатжон|davlatjon/i.test(line)) found.push(`${path.relative(root, f)}:${i + 1}`);
      });
    }
    expect(found).toEqual([]);
  });

  it("метки в текстах записаны правильно", () => {
    const bad: string[] = [];
    for (const f of files(path.join(root, "content"))) {
      const text = fs.readFileSync(f, "utf8");
      for (const m of text.matchAll(/\{(name|child)[^}]*\}/g)) {
        const ok = new RegExp(`^${NAME_TOKEN.source}$`).test(m[0]);
        const suffixInRu = !f.endsWith(".uz.ts") && m[0].includes(":");
        if (!ok || suffixInRu) bad.push(`${path.relative(root, f)}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("если в русском тексте есть имя, то и в узбекском тоже", () => {
    const has = (x: string) => /\{(name|child)/.test(x);
    const missing: string[] = [];
    const walk = (ru: unknown, uz: unknown, at: string) => {
      if (typeof ru === "string") {
        if (has(ru) && !(typeof uz === "string" && has(uz))) missing.push(at);
      } else if (ru && typeof ru === "object" && uz && typeof uz === "object")
        for (const k of Object.keys(ru)) walk((ru as never)[k], (uz as never)[k], `${at}.${k}`);
    };
    for (const d of allDays()) walk(d, localizeDay(d, "uz"), d.id);
    for (const w of WEEKS) walk(w.review, localizeWeek(w, "uz").review, `week${w.number}.review`);
    walk(GUIDE, guideFor("uz"), "guide");
    expect(missing).toEqual([]);
  });
});
