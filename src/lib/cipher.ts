/** Шифр Цезаря: каждая буква сдвигается по алфавиту на shift мест (по кругу). */

export const RU_ALPHABET = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

export function shiftLetter(ch: string, shift: number, alphabet = RU_ALPHABET): string {
  const i = alphabet.indexOf(ch);
  if (i < 0) return ch;
  const n = alphabet.length;
  return alphabet[(((i + shift) % n) + n) % n];
}

export function encode(text: string, shift: number, alphabet = RU_ALPHABET): string {
  return [...text].map((ch) => shiftLetter(ch, shift, alphabet)).join("");
}

export function decode(text: string, shift: number, alphabet = RU_ALPHABET): string {
  return encode(text, -shift, alphabet);
}
