"use client";

import { Check, CircleHelp, EyeOff, X, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { useT } from "@/lib/i18n";
import { arrowGeometry, pathOf, polygonOf, squareCenter, squareRect } from "@/lib/mentor/geometry";
import type { ShapeColor, Shapes, SignKind, Sq } from "@/lib/mentor/model";

/**
 * Цвета стрелок и кружков тренера. Каждый цвет — ещё и своя линия (сплошная, пунктир, точки): смысл не держится
 * на одном оттенке, красное и зелёное различает и ребёнок, который их путает. Под цветной линией — белая
 * «обводка»: на тёмной клетке видна она (4,95 : 1), на светлой — сама линия (4,4–5,9 : 1).
 */
export const SHAPE_STYLE: Record<ShapeColor, { stroke: string; dash?: string }> = {
  G: { stroke: "#15803d" },
  R: { stroke: "#b91c1c", dash: "0.28 0.16" },
  B: { stroke: "#1d4ed8" },
  Y: { stroke: "#c2410c", dash: "0.01 0.22" },
};

export const SIGN_ICON: Record<SignKind, { icon: LucideIcon; color: string }> = {
  tick: { icon: Check, color: "#15803d" },
  cross: { icon: X, color: "#b91c1c" },
  ask: { icon: CircleHelp, color: "#1d4ed8" },
};

/**
 * Слой доски тренера поверх клеток: стрелки, кружки, знаки «верно / ошибка / вопрос», начало стрелки, которую
 * сейчас рисуют, и «шторка» на время раздумья. Нажатия проходят сквозь слой к клеткам — кроме шторки.
 */
export function MentorOverlay({
  shapes,
  orientation,
  pending,
  present,
  curtain,
  onCloseCurtain,
}: {
  shapes: Shapes;
  orientation: "white" | "black";
  pending: { sq: Sq; c: ShapeColor } | null;
  present: boolean;
  curtain: boolean;
  onCloseCurtain: () => void;
}) {
  const t = useT();
  const core = present ? 0.2 : 0.16;
  const casing = core + 0.12;
  return (
    <>
      <svg viewBox="0 0 8 8" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden data-mentor-svg>
        {shapes.rings.map((r) => {
          const [cx, cy] = squareCenter(r.sq, orientation);
          const st = SHAPE_STYLE[r.c];
          return (
            <g key={`${r.sq}${r.c}`} data-mentor-ring={r.sq} data-color={r.c} className="mentor-pop">
              <circle cx={cx} cy={cy} r={0.42} fill="none" stroke="#fff" strokeWidth={0.17} />
              <circle
                cx={cx}
                cy={cy}
                r={0.42}
                fill="none"
                stroke={st.stroke}
                strokeWidth={0.09}
                strokeDasharray={st.dash}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        {shapes.arrows.map((a) => {
          const g = arrowGeometry(a.from, a.to, orientation, { headLength: present ? 0.55 : 0.5 });
          const st = SHAPE_STYLE[a.c];
          const shaft = pathOf(g.shaft);
          const head = polygonOf(g.head);
          return (
            <g key={`${a.from}${a.to}${a.c}`} data-mentor-arrow={`${a.from}${a.to}`} data-color={a.c}>
              <path
                d={shaft}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={casing}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="mentor-draw"
                data-mentor-casing
              />
              <polygon
                points={head}
                fill="#fff"
                stroke="#fff"
                strokeWidth={0.12}
                strokeLinejoin="round"
                className="mentor-appear"
              />
              <path
                d={shaft}
                fill="none"
                stroke={st.stroke}
                strokeWidth={core}
                strokeDasharray={st.dash}
                strokeLinejoin="round"
                strokeLinecap={st.dash ? "round" : "butt"}
                opacity={0.95}
                className="mentor-appear"
                data-mentor-core
              />
              <polygon points={head} fill={st.stroke} opacity={0.95} className="mentor-appear" />
            </g>
          );
        })}
        {pending &&
          (() => {
            const [cx, cy] = squareCenter(pending.sq, orientation);
            return (
              <g data-mentor-pending={pending.sq}>
                <circle cx={cx} cy={cy} r={0.44} fill="none" stroke="#fff" strokeWidth={0.16} />
                <circle
                  cx={cx}
                  cy={cy}
                  r={0.44}
                  fill="none"
                  stroke={SHAPE_STYLE[pending.c].stroke}
                  strokeWidth={0.08}
                  strokeDasharray="0.18 0.12"
                />
              </g>
            );
          })()}
      </svg>
      {Object.entries(shapes.signs).map(([sq, kind]) => {
        if (!kind) return null;
        const box = squareRect(sq, orientation);
        const { icon: Glyph, color } = SIGN_ICON[kind];
        const style: CSSProperties = {
          left: `${box.left + box.size * 0.56}%`,
          top: `${box.top + box.size * 0.03}%`,
          width: `${box.size * 0.41}%`,
          height: `${box.size * 0.41}%`,
        };
        return (
          <span
            key={sq}
            aria-hidden
            data-mentor-sign={sq}
            data-kind={kind}
            className="mentor-pop absolute grid place-items-center rounded-full bg-white shadow-[0_0_0_2px_#1d2140]"
            style={style}
          >
            <Glyph className="h-[78%] w-[78%]" style={{ color }} strokeWidth={3} />
          </span>
        );
      })}
      {curtain && (
        <button
          type="button"
          data-mentor-curtain-layer
          onClick={onCloseCurtain}
          // Enter и пробел нажимают саму шторку, а не уходят к доске под ней.
          onKeyDown={(e) => e.stopPropagation()}
          className="mentor-fade pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-[3%] bg-[#1d2140] px-[6%] text-center text-white"
        >
          <EyeOff aria-hidden className="h-[14%] w-[14%]" strokeWidth={2.25} />
          <span className="text-[min(9cqw,4.5rem)] leading-tight font-black">{t("Подумайте!", "Oʻylab koʻring!")}</span>
          <span className="text-[min(3.6cqw,1.5rem)] font-bold text-white/85">
            {t("Нажмите, чтобы открыть доску", "Taxtani ochish uchun bosing")}
          </span>
        </button>
      )}
    </>
  );
}
