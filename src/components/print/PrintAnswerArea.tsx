import { RiverScene } from "@/components/answers/CrossingPuzzle";
import { GraphMap } from "@/components/answers/GraphPuzzle";
import { PartitionGridView, SymmetryGrid } from "@/components/answers/GridPuzzles";
import { HanoiBoard } from "@/components/answers/HanoiPuzzle";
import { Bucket } from "@/components/answers/JugsPuzzle";
import { TriangleBoard } from "@/components/answers/MagicTrianglePuzzle";
import { NumberLine } from "@/components/answers/PerformerPuzzle";
import { SudokuPrint } from "@/components/answers/SudokuPuzzle";
import { WallBoard } from "@/components/answers/WallLab";
import { RobotBoard } from "@/components/robot/RobotBoard";
import { TableVisual } from "@/components/visuals/numbers";
import { PolyominoVisual, ShapeIcon } from "@/components/visuals/shapes";
import type { Option, RobotPuzzle, Task } from "@/content/types";
import { hanoiStart } from "@/lib/hanoi";
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
  const map = parseMap(puzzle.map);
  if (puzzle.mode === "paths") {
    return (
      <div className="space-y-2">
        <p>Нарисуй каждый путь на отдельном поле:</p>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: puzzle.pathsCount ?? 6 }, (_, i) => (
            <div key={i} className="w-[26mm]">
              <RobotBoard map={map} cell={26} />
            </div>
          ))}
        </div>
        <p>
          Всего коротких путей: <Line w={16} />
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
            <p>Моя программа:</p>
            <Boxes count={boxes} />
            <p>
              Команд в программе: <Line w={14} />
            </p>
          </>
        )}
        {puzzle.mode === "trace" && (
          <p>
            Робот найдёт: <Line w={40} />
          </p>
        )}
        {puzzle.mode === "debug" && (
          <>
            <p>
              Робот врезается на шаге № <Line w={12} />
            </p>
            <p>
              Исправленная программа: <Boxes count={puzzle.program?.length ?? 7} />
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/** Место для ответа на бумаге — своё для каждого типа задачи. */
export function PrintAnswerArea({ task }: { task: Task }) {
  const a = task.answer;
  switch (a.kind) {
    case "fields":
      return (
        <div className="flex flex-wrap gap-x-8 gap-y-2.5">
          {a.fields.map((f) => (
            <span key={f.id} className="whitespace-nowrap">
              {f.label} <Line w={f.type === "number" ? 18 : 22} /> {f.type === "number" && f.suffix}
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
            Самый быстрый путь: <Line w={80} />
          </p>
          <p>
            Время: <Line w={16} /> {a.puzzle.unit}
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
          <p>Нарисуй разные разрезы:</p>
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
              Правило {i}: <Line w={70} /> Следующее число: <Line w={14} />
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
            {p.emoji} {p.name} умеет:{" "}
            {p.commands.map((c, i) => (
              <b key={i} className="mr-2">
                {commandLabel(c)} ({commandName(c)})
              </b>
            ))}
            · начало — <b>{p.start}</b>, цель — <b>{p.target}</b>.
          </p>
          {p.line && (
            <div className="max-w-[170mm]">
              <NumberLine puzzle={p} values={[p.start]} />
            </div>
          )}
          <p>
            Моя программа: <Boxes count={Math.min(p.optimal + 4, 16)} size={9} />
          </p>
          <p>
            Числа по дороге: <Line w={110} />
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
          <TableVisual head={["Колец", "1", "2", "3", "4"]} rows={[["Ходов", "", "", "", ""]]} />
        </div>
      );
    case "crossing":
      return (
        <div className="space-y-2">
          <div className="max-w-[120mm]">
            <RiverScene puzzle={a.puzzle} />
          </div>
          <TableVisual
            head={["№", "Кто в лодке", "Куда: → или ←"]}
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
                <span className="text-[9pt] font-bold">{c} л</span>
              </div>
            ))}
          </div>
          <TableVisual
            head={["№", "Что делаю", `Ведро на ${a.capacities[0]} л`, `Ведро на ${a.capacities[1]} л`]}
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
  }
}
