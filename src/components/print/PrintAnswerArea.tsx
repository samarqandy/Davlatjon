"use client";

import { CipherBoxes, ShiftTable } from "@/components/answers/CipherPuzzle";
import { RiverScene } from "@/components/answers/CrossingPuzzle";
import { GraphMap } from "@/components/answers/GraphPuzzle";
import { PartitionGridView, SymmetryGrid } from "@/components/answers/GridPuzzles";
import { HanoiBoard } from "@/components/answers/HanoiPuzzle";
import { Bucket } from "@/components/answers/JugsPuzzle";
import { TriangleBoard } from "@/components/answers/MagicTrianglePuzzle";
import { Stones } from "@/components/answers/NimGame";
import { NumberLine } from "@/components/answers/PerformerPuzzle";
import { Coin, CoinScale } from "@/components/answers/ScalesPuzzle";
import { SudokuPrint } from "@/components/answers/SudokuPuzzle";
import { CardRow } from "@/components/answers/SwapSortPuzzle";
import { VennDiagram, type VennChip } from "@/components/answers/VennPuzzle";
import { WallBoard } from "@/components/answers/WallLab";
import { setLabel } from "@/components/answers/WeightsLab";
import { RobotBoard } from "@/components/robot/RobotBoard";
import { TableVisual } from "@/components/visuals/numbers";
import { PolyominoVisual, ShapeIcon } from "@/components/visuals/shapes";
import type { Option, RobotPuzzle, Task, VennRegion } from "@/content/types";
import { hanoiStart } from "@/lib/hanoi";
import { useLang, useT } from "@/lib/i18n";
import { commandLabel, commandName } from "@/lib/performer";
import { parseMap } from "@/lib/robot";

function Line({ w = 34 }: { w?: number }) {
  return <span className="answer-line" style={{ minWidth: `${w}mm` }} />;
}

function Boxes({ count, size = 8 }: { count: number; size?: number }) {
  return (
    <span className="inline-flex flex-wrap gap-[1.2mm] align-middle">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="inline-block rounded-[1mm] border border-ink/60"
          style={{ width: `${size}mm`, height: `${size}mm` }}
        />
      ))}
    </span>
  );
}

function OptionPrint({ option }: { option: Option }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-ink/25 px-2 py-1">
      <span className="inline-block h-[4mm] w-[4mm] rounded-[0.8mm] border border-ink/70" />
      <b>{option.label}</b>
      {option.visual?.type === "shape" && <ShapeIcon shape={option.visual.shape} size={34} />}
      {option.visual?.type === "polyomino" && (
        <PolyominoVisual cells={option.visual.cells} labels={option.visual.labels} size={16} />
      )}
    </span>
  );
}

function RobotPrint({ puzzle }: { puzzle: RobotPuzzle }) {
  const t = useT();
  const map = parseMap(puzzle.map);
  if (puzzle.mode === "paths") {
    return (
      <div className="space-y-2">
        <p>{t("Нарисуй каждый путь на отдельном поле:", "Har bir yoʻlni alohida maydonga chiz:")}</p>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: puzzle.pathsCount ?? 6 }, (_, i) => (
            <div key={i} className="w-[26mm]">
              <RobotBoard map={map} cell={26} />
            </div>
          ))}
        </div>
        <p>
          {t("Всего коротких путей:", "Jami qisqa yoʻllar:")} <Line w={16} />
        </p>
      </div>
    );
  }
  const boxes = Math.min((puzzle.optimal ?? 8) + 4, 22);
  return (
    <div className="flex flex-wrap items-start gap-5">
      <div className="w-[62mm] shrink-0">
        <RobotBoard map={map} legend={puzzle.legend} cell={40} />
      </div>
      <div className="min-w-[70mm] flex-1 space-y-2.5">
        {(puzzle.mode === "build" || puzzle.mode === "collect") && (
          <>
            <p>{t("Моя программа:", "Mening dasturim:")}</p>
            <Boxes count={boxes} />
            <p>
              {t("Команд в программе:", "Dasturdagi buyruqlar soni:")} <Line w={14} />
            </p>
          </>
        )}
        {puzzle.mode === "trace" && (
          <p>
            {t("Робот найдёт:", "Robot topadi:")} <Line w={40} />
          </p>
        )}
        {puzzle.mode === "debug" && (
          <>
            <p>
              {t("Робот врезается на шаге №", "Robot nechanchi qadamda urilib qoladi: №")} <Line w={12} />
            </p>
            <p>
              {t("Исправленная программа:", "Tuzatilgan dastur:")} <Boxes count={puzzle.program?.length ?? 7} />
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/** Место для ответа на бумаге — своё для каждого типа задачи. */
export function PrintAnswerArea({ task }: { task: Task }) {
  const t = useT();
  const lang = useLang();
  const a = task.answer;
  switch (a.kind) {
    case "fields":
      return (
        <div className="flex flex-wrap gap-x-8 gap-y-2.5">
          {a.fields.map((f) => (
            <span key={f.id} className="whitespace-nowrap">
              {f.label} <Line w={f.type === "number" ? 18 : f.type === "text" ? 45 : 22} />{" "}
              {f.type === "number" && f.suffix}
            </span>
          ))}
        </div>
      );
    case "choice":
      return (
        <div className="space-y-1.5">
          <p>{a.prompt}</p>
          <div className="flex flex-wrap gap-2">
            {a.options.map((o) => (
              <OptionPrint key={o.id} option={o} />
            ))}
          </div>
        </div>
      );
    case "assign":
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {a.items.map((i) => (
            <span key={i.id} className="whitespace-nowrap">
              {i.label} → <Line w={a.options.length > 3 ? 14 : 26} />
            </span>
          ))}
        </div>
      );
    case "order":
      return (
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          {a.items.map((_, i) => (
            <span key={i}>
              {i + 1}. <Line w={24} />
            </span>
          ))}
        </div>
      );
    case "robot":
      return <RobotPrint puzzle={a.puzzle} />;
    case "symmetry":
      return <SymmetryGrid left={a.left} cell={26} />;
    case "graph":
      return (
        <div className="space-y-2">
          <div className="max-w-[120mm]">
            <GraphMap puzzle={a.puzzle} />
          </div>
          <p>
            {t("Самый быстрый путь:", "Eng tez yoʻl:")} <Line w={80} />
          </p>
          <p>
            {t("Время:", "Vaqt:")} <Line w={16} /> {a.puzzle.unit}
          </p>
        </div>
      );
    case "magicSquare":
      return (
        <div className="inline-grid grid-cols-3 gap-1">
          {a.grid.flat().map((v, i) => (
            <span
              key={i}
              className="flex h-[15mm] w-[15mm] items-center justify-center rounded-md border-2 border-ink/60 text-2xl font-black"
            >
              {v ?? ""}
            </span>
          ))}
        </div>
      );
    case "signs":
      return (
        <div className="space-y-2.5">
          {a.rows.map((r, ri) => (
            <p key={ri} className="flex flex-wrap items-center gap-2 text-xl font-black">
              {r.numbers.map((n, i) => (
                <span key={i} className="flex items-center gap-2">
                  {n}
                  {i < r.numbers.length - 1 && (
                    <span className="inline-block h-[8mm] w-[8mm] rounded-md border-2 border-ink/60" />
                  )}
                </span>
              ))}
              = {r.result}
            </p>
          ))}
        </div>
      );
    case "partition":
      return (
        <div className="space-y-1.5">
          <p>{t("Нарисуй разные разрезы:", "Har xil usulda kesib koʻrsat:")}</p>
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <PartitionGridView
                key={i}
                grid={Array.from({ length: a.size }, () => Array.from({ length: a.size }, () => 1))}
                cell={18}
              />
            ))}
          </div>
        </div>
      );
    case "magicTriangle":
      return (
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="w-[52mm]">
              <TriangleBoard values={Array(6).fill(null)} />
            </div>
          ))}
        </div>
      );
    case "expressions":
      return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>
              <Line w={40} /> = {a.target}
            </span>
          ))}
        </div>
      );
    case "rules":
      return (
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <p key={i}>
              {t(`Правило ${i}:`, `${i}-qoida:`)} <Line w={70} /> {t("Следующее число:", "Keyingi son:")}{" "}
              <Line w={14} />
            </p>
          ))}
        </div>
      );
    case "open":
      return (
        <div className="space-y-3 pt-1">
          <Line w={170} />
          <Line w={170} />
        </div>
      );
    case "performer": {
      const p = a.puzzle;
      return (
        <div className="space-y-2">
          <p>
            {p.emoji} {p.name} {t("умеет:", "bajara oladi:")}{" "}
            {p.commands.map((c, i) => (
              <b key={i} className="mr-2">
                {commandLabel(c)} ({commandName(c, lang)})
              </b>
            ))}
            · {t("начало", "boshlanish")} — <b>{p.start}</b>, {t("цель", "maqsad")} — <b>{p.target}</b>.
          </p>
          {p.line && (
            <div className="max-w-[170mm]">
              <NumberLine puzzle={p} values={[p.start]} />
            </div>
          )}
          <p>
            {t("Моя программа:", "Mening dasturim:")} <Boxes count={Math.min(p.optimal + 4, 16)} size={9} />
          </p>
          <p>
            {t("Числа по дороге:", "Yoʻldagi sonlar:")} <Line w={110} />
          </p>
        </div>
      );
    }
    case "hanoi":
      return (
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-[70mm] shrink-0">
            <HanoiBoard state={hanoiStart(a.disks)} disks={a.disks} compact />
          </div>
          <TableVisual
            head={[t("Колец", "Halqalar"), "1", "2", "3", "4"]}
            rows={[[t("Ходов", "Yurishlar"), "", "", "", ""]]}
          />
        </div>
      );
    case "crossing":
      return (
        <div className="space-y-2">
          <div className="max-w-[120mm]">
            <RiverScene puzzle={a.puzzle} />
          </div>
          <TableVisual
            head={["№", t("Кто в лодке", "Qayiqda kim"), t("Куда: → или ←", "Qayoqqa: → yoki ←")]}
            rows={Array.from({ length: a.puzzle.optimal + 2 }, (_, i) => [String(i + 1), "", ""])}
          />
        </div>
      );
    case "jugs":
      return (
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex items-end gap-2">
            {a.capacities.map((c, i) => (
              <div key={i} className="flex flex-col items-center">
                <Bucket capacity={c} amount={0} maxCapacity={Math.max(...a.capacities)} showAmount={false} />
                <span className="text-[9pt] font-bold">
                  {c} {t("л", "l")}
                </span>
              </div>
            ))}
          </div>
          <TableVisual
            head={[
              "№",
              t("Что делаю", "Nima qilaman"),
              t(`Ведро на ${a.capacities[0]} л`, `${a.capacities[0]} litrli chelak`),
              t(`Ведро на ${a.capacities[1]} л`, `${a.capacities[1]} litrli chelak`),
            ]}
            rows={Array.from({ length: a.optimal + 2 }, (_, i) => [String(i + 1), "", "", ""])}
          />
        </div>
      );
    case "sudoku":
      return <SudokuPrint grid={a.grid} box={a.box} />;
    case "wallLab":
      return (
        <div className="flex flex-wrap gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <WallBoard key={i} bottom={Array(a.numbers.length).fill(null)} print />
          ))}
        </div>
      );
    case "venn": {
      const regions: Partial<Record<VennRegion, VennChip[]>> = {};
      (a.given ?? []).forEach((g, i) =>
        (regions[g.region] ??= []).push({ id: `given-${i}`, label: g.label, tone: "given" }),
      );
      return (
        <div className="space-y-1.5">
          <p>
            {t("Впиши в круги:", "Doiralarga yozib chiq:")} <b>{a.items.map((i) => i.label).join(", ")}</b>
          </p>
          <div className="w-[120mm]">
            <VennDiagram sets={a.sets} regions={regions} />
          </div>
        </div>
      );
    }
    case "scales":
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-[62mm]">
              <CoinScale left={[]} right={[]} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: a.coins }, (_, i) => (
                <Coin key={i} n={i + 1} size={30} />
              ))}
            </div>
          </div>
          <TableVisual
            head={[
              "№",
              t("Монеты слева", "Chapdagi tangalar"),
              t("Монеты справа", "Oʻngdagi tangalar"),
              t("Что показали весы", "Tarozi nimani koʻrsatdi"),
            ]}
            rows={Array.from({ length: a.weighings + 1 }, (_, i) => [String(i + 1), "", "", ""])}
          />
          <p>
            {t("Фальшивая монета: №", "Qalbaki tanga: №")} <Line w={14} />
          </p>
        </div>
      );
    case "swapSort":
      return (
        <div className="space-y-2">
          <CardRow cards={a.cards} print />
          <p>{t("Записывай ряд после каждого обмена:", "Har bir almashtirishdan keyin qatorni yozib bor:")}</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {Array.from({ length: a.optimal + 1 }, (_, i) => (
              <span key={i} className="flex items-center gap-2">
                {i + 1}. <Boxes count={a.cards.length} size={7} />
              </span>
            ))}
          </div>
          <p>
            {t("Обменов:", "Almashtirishlar soni:")} <Line w={14} />
          </p>
        </div>
      );
    case "nim":
      return (
        <div className="space-y-2">
          <Stones total={a.stones} left={a.stones} print />
          <p>
            {t(
              "Сыграй со взрослым: зачёркивайте камешки по очереди и записывайте ходы.",
              "Kattalar bilan oʻynab koʻr: toshchalarni navbatma-navbat chizib, yurishlarni yozib boringlar.",
            )}
          </p>
          <TableVisual
            head={[
              t("Ход", "Yurish"),
              t("Кто ходил", "Kim yurdi"),
              t("Сколько взял", "Nechta oldi"),
              t("Сколько осталось", "Nechta qoldi"),
            ]}
            rows={Array.from({ length: 8 }, (_, i) => [String(i + 1), "", "", ""])}
          />
        </div>
      );
    case "cipher":
      return (
        <div className="space-y-2.5">
          <CipherBoxes text={a.encoded} print />
          <ShiftTable alphabet={a.alphabet} shift={a.shift} print />
          <p className="flex flex-wrap items-center gap-2">
            {t("Расшифровка:", "Yashirin soʻz:")} <Boxes count={[...a.answer].length} size={9} />
          </p>
        </div>
      );
    case "weightsLab":
      return (
        <div className="space-y-3">
          {a.sets.map((set, i) => (
            <div key={i} className="space-y-1">
              <p className="font-bold">
                {setLabel(set, lang)}.{" "}
                {t(
                  "Обведи грузы, которые получилось уравновесить:",
                  "Muvozanatga keltira olgan yuklaringni doiraga ol:",
                )}
              </p>
              <div className="flex flex-wrap gap-[1.2mm]">
                {Array.from({ length: set.max }, (_, l) => (
                  <span
                    key={l}
                    className="inline-flex h-[8mm] w-[8mm] items-center justify-center rounded-[1mm] border border-ink/60 font-bold"
                  >
                    {l + 1}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <p>
            {t("Что я заметил:", "Nimani payqadim:")} <Line w={130} />
          </p>
        </div>
      );
  }
}
