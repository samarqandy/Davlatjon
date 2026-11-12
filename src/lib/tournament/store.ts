"use client";

/**
 * Турниры организатора — в этом браузере (localStorage), отдельно от прогресса ребёнка: в аккаунт и на сервер
 * они не уходят. Имена участников — чужие личные данные, поэтому хранить их где-то ещё нельзя без согласия.
 * Перенести турнир на другое устройство — файлом (exportTournament / parseTournament).
 */
import { useSyncExternalStore } from "react";
import type { GameResult, TGame, TPlayer, TRound, Tournament, TournamentFormat } from "./types";

const KEY = "davlatjon-lab:tournaments:v1";
const EMPTY: Tournament[] = [];
const FORMATS: TournamentFormat[] = ["roundRobin", "doubleRoundRobin", "swiss", "knockout"];
const RESULTS: GameResult[] = ["1-0", "0-1", "1/2", "+-", "-+"];
/** Больше турниров не храним: самые старые уходят (место в хранилище браузера не бесконечно). */
const MAX_TOURNAMENTS = 50;

let list: Tournament[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const text = (x: unknown, max: number) => (typeof x === "string" ? x.slice(0, max) : "");

/**
 * Турнир из произвольных данных (файл, хранилище): всё лишнее отбрасывается, неполное — не принимается.
 * Файл может прийти откуда угодно, поэтому верим только тому, что проверили.
 */
export function parseTournament(raw: unknown): Tournament | null {
  if (!isObject(raw) || raw.version !== 1) return null;
  const format = FORMATS.find((f) => f === raw.format);
  if (!format || !Array.isArray(raw.players) || !Array.isArray(raw.rounds)) return null;
  const players: TPlayer[] = [];
  const ids = new Set<string>();
  for (const p of raw.players.slice(0, 200)) {
    if (!isObject(p)) return null;
    const id = text(p.id, 40);
    const name = text(p.name, 80).trim();
    if (!id || !name || ids.has(id) || typeof p.seed !== "number") return null;
    ids.add(id);
    players.push({
      id,
      name,
      seed: Math.round(p.seed),
      ...(typeof p.rating === "number" && p.rating > 0 ? { rating: Math.round(p.rating) } : {}),
      ...(typeof p.withdrawnAfter === "number" ? { withdrawnAfter: Math.round(p.withdrawnAfter) } : {}),
      ...(typeof p.joinedRound === "number" ? { joinedRound: Math.round(p.joinedRound) } : {}),
    });
  }
  if (players.length < 2) return null;
  const rounds: TRound[] = [];
  for (const r of raw.rounds.slice(0, 60)) {
    if (!isObject(r) || !Array.isArray(r.games)) return null;
    const games: TGame[] = [];
    for (const g of r.games) {
      if (!isObject(g) || typeof g.white !== "string" || !ids.has(g.white)) return null;
      if (g.black !== null && (typeof g.black !== "string" || !ids.has(g.black))) return null;
      const result = RESULTS.find((x) => x === g.result);
      games.push({
        white: g.white,
        black: g.black as string | null,
        ...(result && g.black !== null ? { result } : {}),
      });
    }
    const notes = Array.isArray(r.notes) ? r.notes.filter((n) => n === "color" || n === "repeatBye") : [];
    rounds.push(notes.length ? { games, notes } : { games });
  }
  const totalRounds = typeof raw.totalRounds === "number" ? Math.round(raw.totalRounds) : rounds.length;
  return {
    version: 1,
    id: text(raw.id, 40) || `t${Date.now().toString(36)}`,
    name: text(raw.name, 120).trim(),
    format,
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
    players,
    rounds,
    totalRounds: Math.max(rounds.length, Math.min(totalRounds, 60)),
    initialColor: raw.initialColor === "b" ? "b" : "w",
    ...(raw.thirdPlace === true ? { thirdPlace: true } : {}),
  };
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    list = Array.isArray(raw) ? raw.map(parseTournament).filter((t): t is Tournament => t !== null) : EMPTY;
  } catch {
    list = EMPTY;
  }
}

function commit(next: Tournament[]) {
  list = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Хранилище недоступно (приватный режим) — турнир живёт до закрытия вкладки.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Все турниры этого устройства, новые сверху. До загрузки страницы — пустой список. */
export function useTournaments(): Tournament[] {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return list;
    },
    () => EMPTY,
  );
}

/** Добавить новый или заменить существующий (по id). */
export function saveTournament(t: Tournament) {
  load();
  const exists = list.some((x) => x.id === t.id);
  commit(exists ? list.map((x) => (x.id === t.id ? t : x)) : [t, ...list].slice(0, MAX_TOURNAMENTS));
}

export function removeTournament(id: string) {
  load();
  commit(list.filter((x) => x.id !== id));
}

export function exportTournament(t: Tournament): string {
  return JSON.stringify(t, null, 2);
}

/** Турнир из файла. Если такой id уже есть, загруженный получает новый — прежний не затирается. */
export function importTournament(json: string): Tournament | null {
  let parsed: Tournament | null = null;
  try {
    parsed = parseTournament(JSON.parse(json));
  } catch {
    return null;
  }
  if (!parsed) return null;
  load();
  const taken = list.some((x) => x.id === parsed.id);
  const t = taken ? { ...parsed, id: `${parsed.id.slice(0, 30)}-${Date.now().toString(36)}` } : parsed;
  saveTournament(t);
  return t;
}

/** Только для тестов: начать с чистого списка. */
export function resetTournamentsForTest() {
  list = EMPTY;
  loaded = false;
}
