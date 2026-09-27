/**
 * Картинки энциклопедии: файлы на месте, лицензии свободные, подписи по-русски,
 * а ссылки из партий, ленты истории, чемпионов и дебютов ведут на существующие картинки.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { RECORDS, TIMELINE, UZBEK_CHESS, WOMEN_CHAMPIONS, WORLD_CHAMPIONS } from "@/content/chess/encyclopedia";
import { FAMOUS_GAMES } from "@/content/chess/games";
import { CHESS_IMAGES, chessImage, imageCredit } from "@/content/chess/images";
import { OPENINGS } from "@/content/chess/openings";

const PUBLIC = path.join(process.cwd(), "public");
/** Общественное достояние, CC0, CC BY, CC BY-SA — и ничего другого. */
const FREE = /^(pd|cc0|cc-by(-sa)?)(-|$)/;

describe("картинки энциклопедии", () => {
  it("файлы на месте, уменьшены и не тяжёлые", () => {
    expect(CHESS_IMAGES.length).toBeGreaterThanOrEqual(45);
    for (const img of CHESS_IMAGES) {
      for (const f of [img.file, img.thumb]) {
        const full = path.join(PUBLIC, f);
        expect(fs.existsSync(full), f).toBe(true);
        expect(fs.statSync(full).size, f).toBeLessThan(300 * 1024);
      }
      expect(img.width, img.id).toBeGreaterThan(0);
      expect(img.height, img.id).toBeGreaterThan(0);
      expect(Math.max(img.width, img.height), img.id).toBeLessThanOrEqual(960);
    }
    const ids = CHESS_IMAGES.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...ids].sort());
  });

  it("только свободные лицензии — с автором, лицензией и ссылкой на источник", () => {
    for (const img of CHESS_IMAGES) {
      expect(FREE.test(img.licenseCode), `${img.id}: ${img.licenseCode}`).toBe(true);
      expect(img.source, img.id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File(:|%3A)/);
      if (img.attributionRequired) {
        expect(img.author, img.id).not.toBe("");
        expect(img.licenseUrl, img.id).toMatch(/^https:\/\/creativecommons\.org\//);
        expect(imageCredit(img), img.id).toContain(img.author);
        expect(imageCredit(img), img.id).toContain(img.license);
      }
    }
  });

  it("у каждой картинки — подпись и описание по-русски", () => {
    for (const img of CHESS_IMAGES) {
      expect(img.caption, img.id).not.toBe(img.title);
      expect(img.alt.length, img.id).toBeGreaterThan(10);
      for (const text of [img.caption, img.alt]) {
        expect(/[А-Яа-яЁё]/.test(text), `${img.id}: ${text}`).toBe(true);
        expect(text.match(/[А-Яа-яЁё]+[A-Za-z]+[А-Яа-яЁё]*|[A-Za-z]+[А-Яа-яЁё]+/g), `${img.id}: ${text}`).toBeNull();
        expect(/ {2,}| [,.!?:;]/.test(text), `${img.id}: ${text}`).toBe(false);
      }
    }
  });

  it("ссылки из содержимого ведут на существующие картинки, и каждая картинка где-то нужна", () => {
    const refs: [string, string | undefined][] = [];
    for (const g of FAMOUS_GAMES) for (const id of g.pictures ?? []) refs.push([`партия ${g.id}`, id]);
    for (const t of TIMELINE) refs.push([`лента ${t.title}`, t.image]);
    for (const c of [...WORLD_CHAMPIONS, ...WOMEN_CHAMPIONS]) refs.push([`чемпион ${c.name}`, c.image]);
    for (const p of UZBEK_CHESS.people) refs.push([`Узбекистан ${p.name}`, p.image]);
    for (const r of RECORDS) refs.push([`рекорд ${r.title}`, r.image]);
    for (const o of OPENINGS) refs.push([`дебют ${o.id}`, o.image]);
    for (const [where, id] of refs) if (id) expect(chessImage(id), `${where} → ${id}`).toBeDefined();

    for (const g of FAMOUS_GAMES.filter((g) => g.year)) expect(g.pictures?.length, g.id).toBeGreaterThan(0);
    for (const c of [...WORLD_CHAMPIONS, ...WOMEN_CHAMPIONS]) expect(c.image, c.name).toBeDefined();
    for (const p of UZBEK_CHESS.people) expect(p.image, p.name).toBeDefined();
    expect(TIMELINE.filter((t) => t.image).length).toBeGreaterThanOrEqual(12);

    const used = new Set(refs.map(([, id]) => id).filter(Boolean));
    used.add("polgar");
    for (const img of CHESS_IMAGES) expect(used.has(img.id), `${img.id} нигде не используется`).toBe(true);
  });
});
