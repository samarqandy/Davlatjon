/**
 * Мелочь устройства: ребёнок на первом экране пропустил имя (или закрыл карточку «Как тебя зовут?»).
 * Тогда больше не уговариваем. В прогресс это не пишется — это не данные ребёнка, а удобство.
 */
const KEY = "davlatjon-lab:name-skipped";

export function nameSkipped(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function skipName() {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    // без хранилища карточка просто покажется снова
  }
}
