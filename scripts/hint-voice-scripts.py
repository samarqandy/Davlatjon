#!/usr/bin/env python3
"""Сценарии озвучки подсказок: текст подсказки → то, что говорит диктор.

  python3 scripts/hint-voice-scripts.py HINTS.json OUT.json [OVERRIDES.json]

HINTS.json — {"ru": {"w1d1t1": [5 подсказок]}, "uz": {...}} (его пишет `WRITE_HINT_DUMP=HINTS.json npx vitest run tests/voice.test.ts`).
OUT.json — список {"key": "ru:hint:w1d1t1-0", "lang", "id", "script"}; OVERRIDES.json — {"ru:hint:w1d1t1-0": "готовый текст"} для тех подсказок,
которые нельзя прочитать автоматически (имя ребёнка в тексте, картинки в тексте). Правила — как у остальных записей (docs/…, INSTRUCTIONS):
математика словами, без символов разметки, по-узбекски числа словами и апостроф «'».
"""
import json
import re
import sys

UZ_ONES = ["nol", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"]
UZ_TENS = ["", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to'qson"]


def uz_number(n: int) -> str:
    if n < 10:
        return UZ_ONES[n]
    if n < 100:
        return (UZ_TENS[n // 10] + (" " + UZ_ONES[n % 10] if n % 10 else "")).strip()
    if n < 1000:
        head = ("bir" if n // 100 == 1 else UZ_ONES[n // 100]) + " yuz"
        return (head + (" " + uz_number(n % 100) if n % 100 else "")).strip()
    head = ("bir" if n // 1000 == 1 else uz_number(n // 1000)) + " ming"
    return (head + (" " + uz_number(n % 1000) if n % 1000 else "")).strip()


def uz_ordinal(n: int) -> str:
    w = uz_number(n)
    return w + ("nchi" if w[-1] in "aeiou" else "inchi")


DIR = {
    "ru": {"→": "вправо", "←": "влево", "↑": "вверх", "↓": "вниз"},
    "uz": {"→": "o'ngga", "←": "chapga", "↑": "yuqoriga", "↓": "pastga"},
}
WORDS = {
    "ru": {"+": "плюс", "−": "минус", "×": "умножить на", "÷": "разделить на", "=": "равно", "chain": "потом", "etc": "и так далее",
           "box": "пустая клетка", "blank": "пропуск", "check": "галочка", "cross": "крестик", "unknown": "неизвестное число", "howmany": "сколько"},
    "uz": {"+": "qo'shish", "−": "ayirish", "×": "ko'paytirish", "÷": "bo'lish", "=": "teng", "chain": "keyin", "etc": "va hokazo",
           "box": "bo'sh katak", "blank": "bo'sh joy", "check": "belgi", "cross": "xoch belgisi", "unknown": "noma'lum son", "howmany": "nechta"},
}


def convert(text: str, lang: str) -> str:
    w = WORDS[lang]
    s = text
    s = s.replace("ʻ", "'").replace("ʼ", "'").replace("’", "'")
    s = s.replace("**", "").replace("*", "").replace("`", "")

    # Ряд одних стрелок: «→ → ↑ → … » — направления через запятую.
    def run(m: re.Match) -> str:
        body = m.group(0)
        words = [DIR[lang][c] for c in body if c in DIR[lang]]
        return ", ".join(words) + (", " + w["etc"] if "…" in body else "")

    s = re.sub(r"(?:[→←↑↓]\s*){2,}(?:…)?", run, s)

    # Одиночная стрелка: между числами/выражениями или названиями — «потом», иначе — направление.
    out = []
    for i, ch in enumerate(s):
        if ch in DIR[lang]:
            left = "".join(out).rstrip()
            lt = re.split(r"\s+", left)[-1] if left else ""
            rest = s[i + 1 :].lstrip()
            rt = re.split(r"\s+", rest)[0] if rest else ""
            strip = lambda t: re.sub(r"^[(\[«]+|[)\].,:;!?»]+$", "", t)
            numeric = bool(re.search(r"[\d?+−×÷]", lt + rt))
            names = bool(re.match(r"[A-ZА-ЯЁ]", strip(lt)) and re.match(r"[A-ZА-ЯЁ]", strip(rt)))
            out.append(f" {w['chain'] if ch == '→' and (numeric or names) else DIR[lang][ch]} ")
        else:
            out.append(ch)
    s = "".join(out)

    # Пункты «а)», «б)» — так их называют вслух.
    letters = {"ru": {"а": "а", "б": "бэ", "в": "вэ", "г": "гэ"}, "uz": {"a": "a", "b": "be", "c": "se", "d": "de"}}[lang]
    s = re.sub(r"(?<![\w])([" + "".join(letters) + r"])\)", lambda m: letters[m.group(1)], s)
    s = s.replace("☐", f" {w['box']} ").replace("□", f" {w['box']} ")
    s = s.replace("✓", w["check"]).replace("✗", w["cross"])
    s = re.sub(r"(?<![\w])_(?:\s*_)*(?![\w])", w["blank"], s)

    # Знаки действий.
    s = s.replace("−", f" {w['−']} ").replace("×", f" {w['×']} ").replace("÷", f" {w['÷']} ")
    s = re.sub(r"\s*\+\s*", f" {w['+']} ", s)
    s = re.sub(r"(?<=\d)\s+-\s+(?=\d)", f" {w['−']} ", s)
    s = re.sub(r"(?<!\w)-(?=\d)", f"{w['−']} ", s)
    s = re.sub(r"\s*=\s*", f" {w['=']} ", s)
    # «= ?» — «равно сколько?»; «?» среди действий — неизвестное число.
    s = re.sub(rf"({re.escape(w['='])})\s+\?", rf"\1 {w['howmany']}?", s)
    ops = "|".join(re.escape(x) for x in (w["+"], w["−"], w["×"], w["÷"], w["chain"], w["="]))
    s = re.sub(rf"({ops})\s+\?", rf"\1 {w['unknown']}", s)
    s = re.sub(rf"(?<![\w?])\?\s+(?=({ops}))", f"{w['unknown']} ", s)
    if lang == "uz":
        s = uz_digits(s)
    s = re.sub(r"«\s+", "«", s)
    s = re.sub(r"\s+»", "»", s)
    s = re.sub(r"\s+([,.:;?!)])", r"\1", s)
    s = re.sub(r"\(\s+", "(", s)
    s = re.sub(r"\s{2,}", " ", s).strip()
    return s


def uz_digits(s: str) -> str:
    def ordinal(m: re.Match) -> str:
        return uz_ordinal(int(m.group(1))) + " " + m.group(2)
    # «2-kun» → «ikkinchi kun»; «5-» перед пробелом оставляем числом.
    s = re.sub(r"(\d+)-(?=[A-Za-z'])", lambda m: uz_ordinal(int(m.group(1))) + " ", s)
    s = re.sub(r"(\d+)-(?=\s|$)", lambda m: uz_number(int(m.group(1))) + " ", s)
    # Время «17:30» → «o'n yetti o'ttiz», «8:00» → «sakkiz».
    s = re.sub(
        r"(\d{1,2}):(\d{2})",
        lambda m: uz_number(int(m.group(1))) + (" " + uz_number(int(m.group(2))) if int(m.group(2)) else ""),
        s,
    )
    # «5 ta» → «beshta», «1 ta» → «bitta».
    def counted(m: re.Match) -> str:
        n = int(m.group(1))
        w = "bitta" if n == 1 else uz_number(n) + "ta"
        return w
    s = re.sub(r"(\d+)\s+ta\b", counted, s)
    s = re.sub(r"\d+", lambda m: uz_number(int(m.group(0))), s)
    # Падежные частицы после числа пишутся слитно: «besh ni» → «beshni», «o'n ga» → «o'nga».
    s = re.sub(r"\b(nol|bir|ikki|uch|to'rt|besh|olti|yetti|sakkiz|to'qqiz|o'n|yigirma|o'ttiz|qirq|ellik|oltmish|yetmish|sakson|to'qson|yuz|ming)\s+(ni|ga|ning|dan|da|siz)\b", r"\1\2", s)
    return s


def main() -> None:
    hints = json.load(open(sys.argv[1]))
    over = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else {}
    items = []
    review = []
    for lang in ("ru", "uz"):
        for tid, rungs in hints[lang].items():
            for n, text in enumerate(rungs):
                key = f"{lang}:hint:{tid}-{n}"
                script = over.get(key) or convert(text, lang)
                if "{" in script or "`" in script or "*" in script or "_" in script:
                    review.append(key)
                items.append({"key": key, "lang": lang, "id": f"{tid}-{n}", "script": script, "source": text})
    json.dump(items, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
    print(len(items), "scripts;", len(review), "need an override:", *review[:40])


if __name__ == "__main__":
    main()
