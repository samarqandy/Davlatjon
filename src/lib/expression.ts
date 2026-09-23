/**
 * Маленький безопасный вычислитель выражений для «сломанного калькулятора».
 * Поддерживает целые числа, +, −, ×, скобки. Никакого eval.
 */

export type EvalResult = { ok: true; value: number } | { ok: false; error: string };

type Token = { t: "num"; v: number } | { t: "op"; v: "+" | "-" | "*" } | { t: "(" } | { t: ")" };

export function normalizeExpression(input: string): string {
  return input
    .replace(/[−–—]/g, "-")
    .replace(/[×xх·*]/gi, "*")
    .replace(/\s+/g, "");
}

function tokenize(src: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < src.length && /[0-9]/.test(src[j])) j++;
      tokens.push({ t: "num", v: Number(src.slice(i, j)) });
      i = j;
    } else if (ch === "+" || ch === "-" || ch === "*") {
      tokens.push({ t: "op", v: ch });
      i++;
    } else if (ch === "(") {
      tokens.push({ t: "(" });
      i++;
    } else if (ch === ")") {
      tokens.push({ t: ")" });
      i++;
    } else {
      return null;
    }
  }
  return tokens;
}

export function evaluate(input: string): EvalResult {
  const src = normalizeExpression(input);
  if (!src) return { ok: false, error: "Пустое выражение" };
  if (src.length > 60) return { ok: false, error: "Слишком длинное выражение" };
  const tokens = tokenize(src);
  if (!tokens) return { ok: false, error: "Непонятный символ" };
  let pos = 0;

  const peek = () => tokens[pos];
  const peekOp = (...ops: string[]) => {
    const tok = tokens[pos];
    return tok?.t === "op" && ops.includes(tok.v) ? tok.v : null;
  };

  function parseExpr(): number | null {
    let left = parseTerm();
    if (left === null) return null;
    let op = peekOp("+", "-");
    while (op) {
      pos++;
      const right = parseTerm();
      if (right === null) return null;
      left = op === "+" ? left + right : left - right;
      op = peekOp("+", "-");
    }
    return left;
  }

  function parseTerm(): number | null {
    let left = parseFactor();
    if (left === null) return null;
    while (peekOp("*")) {
      pos++;
      const right = parseFactor();
      if (right === null) return null;
      left = left * right;
    }
    return left;
  }

  function parseFactor(): number | null {
    const tok = peek();
    if (!tok) return null;
    if (tok.t === "num") {
      pos++;
      return tok.v;
    }
    if (tok.t === "(") {
      pos++;
      const v = parseExpr();
      if (v === null || peek()?.t !== ")") return null;
      pos++;
      return v;
    }
    return null;
  }

  const value = parseExpr();
  if (value === null || pos !== tokens.length) return { ok: false, error: "Выражение записано не до конца" };
  return { ok: true, value };
}

export function usesForbidden(input: string, forbidden: string[]): boolean {
  return forbidden.some((d) => input.includes(d));
}

/** Красивая запись: 60-10 → «60 − 10». */
export function prettyExpression(input: string): string {
  return normalizeExpression(input)
    .replace(/\+/g, " + ")
    .replace(/-/g, " − ")
    .replace(/\*/g, " × ")
    .replace(/\s+/g, " ")
    .trim();
}
