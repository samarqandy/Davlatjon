"use client";

import { RobotPuzzle } from "@/components/robot/RobotPuzzle";
import type { Task } from "@/content/types";
import { AssignAnswer, ChoiceAnswer, OrderAnswer } from "./ChoiceAnswers";
import { CipherPuzzle } from "./CipherPuzzle";
import { CrossingPuzzle } from "./CrossingPuzzle";
import { FieldsAnswer } from "./FieldsAnswer";
import { GraphPuzzle } from "./GraphPuzzle";
import { MagicSquarePuzzle, PartitionPuzzle, SymmetryPuzzle } from "./GridPuzzles";
import { HanoiPuzzle } from "./HanoiPuzzle";
import { JugsPuzzle } from "./JugsPuzzle";
import { MagicTrianglePuzzle } from "./MagicTrianglePuzzle";
import { NimGame } from "./NimGame";
import { ExpressionsPuzzle, OpenAnswer, RulesAnswer, SignsPuzzle } from "./NumberPuzzles";
import { PerformerPuzzle } from "./PerformerPuzzle";
import { ScalesPuzzle } from "./ScalesPuzzle";
import { SudokuPuzzle } from "./SudokuPuzzle";
import { SwapSortPuzzle } from "./SwapSortPuzzle";
import { VennPuzzle } from "./VennPuzzle";
import { WallLab } from "./WallLab";
import { WeightsLab } from "./WeightsLab";

/** Как ребёнок отвечает на задачу — у каждого типа свой инструмент. */
export function AnswerPanel({ task, hintsLeft }: { task: Task; hintsLeft: boolean }) {
  const a = task.answer;
  const id = task.id;
  switch (a.kind) {
    case "fields":
      return <FieldsAnswer taskId={id} fields={a.fields} hintsLeft={hintsLeft} />;
    case "choice":
      return <ChoiceAnswer taskId={id} spec={a} hintsLeft={hintsLeft} />;
    case "assign":
      return <AssignAnswer taskId={id} spec={a} hintsLeft={hintsLeft} />;
    case "order":
      return <OrderAnswer taskId={id} spec={a} hintsLeft={hintsLeft} />;
    case "robot":
      return <RobotPuzzle taskId={id} puzzle={a.puzzle} hintsLeft={hintsLeft} />;
    case "symmetry":
      return <SymmetryPuzzle taskId={id} left={a.left} hintsLeft={hintsLeft} />;
    case "graph":
      return <GraphPuzzle taskId={id} puzzle={a.puzzle} />;
    case "magicSquare":
      return <MagicSquarePuzzle taskId={id} grid={a.grid} answer={a.answer} hintsLeft={hintsLeft} />;
    case "signs":
      return <SignsPuzzle taskId={id} spec={a} hintsLeft={hintsLeft} />;
    case "partition":
      return <PartitionPuzzle taskId={id} size={a.size} distinct={a.distinct} hintsLeft={hintsLeft} />;
    case "magicTriangle":
      return <MagicTrianglePuzzle taskId={id} numbers={a.numbers} sums={a.sums} />;
    case "expressions":
      return <ExpressionsPuzzle taskId={id} target={a.target} forbidden={a.forbidden} />;
    case "rules":
      return <RulesAnswer taskId={id} spec={a} />;
    case "open":
      return <OpenAnswer taskId={id} prompt={a.prompt} />;
    case "performer":
      return <PerformerPuzzle taskId={id} puzzle={a.puzzle} hintsLeft={hintsLeft} />;
    case "hanoi":
      return <HanoiPuzzle taskId={id} disks={a.disks} optimal={a.optimal} />;
    case "crossing":
      return <CrossingPuzzle taskId={id} puzzle={a.puzzle} hintsLeft={hintsLeft} />;
    case "jugs":
      return <JugsPuzzle taskId={id} capacities={a.capacities} target={a.target} optimal={a.optimal} />;
    case "sudoku":
      return <SudokuPuzzle taskId={id} grid={a.grid} box={a.box} hintsLeft={hintsLeft} />;
    case "wallLab":
      return <WallLab taskId={id} numbers={a.numbers} tops={a.tops} />;
    case "venn":
      return (
        <VennPuzzle
          taskId={id}
          sets={a.sets}
          items={a.items}
          correct={a.correct}
          given={a.given}
          hintsLeft={hintsLeft}
        />
      );
    case "scales":
      return <ScalesPuzzle taskId={id} coins={a.coins} weighings={a.weighings} />;
    case "swapSort":
      return <SwapSortPuzzle taskId={id} cards={a.cards} optimal={a.optimal} />;
    case "nim":
      return <NimGame taskId={id} stones={a.stones} take={a.take} />;
    case "cipher":
      return (
        <CipherPuzzle taskId={id} alphabet={a.alphabet} encoded={a.encoded} answer={a.answer} hintsLeft={hintsLeft} />
      );
    case "weightsLab":
      return <WeightsLab taskId={id} sets={a.sets} />;
  }
}

/** Интерактивные задачи, где поле для ответа — это и есть рисунок (робот, симметрия…). */
export function isWorkbench(task: Task): boolean {
  return [
    "robot",
    "symmetry",
    "graph",
    "magicSquare",
    "signs",
    "partition",
    "magicTriangle",
    "expressions",
    "performer",
    "hanoi",
    "crossing",
    "jugs",
    "sudoku",
    "wallLab",
    "venn",
    "scales",
    "swapSort",
    "nim",
    "cipher",
    "weightsLab",
  ].includes(task.answer.kind);
}
