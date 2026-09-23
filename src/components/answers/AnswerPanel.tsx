"use client";

import { RobotPuzzle } from "@/components/robot/RobotPuzzle";
import type { Task } from "@/content/types";
import { AssignAnswer, ChoiceAnswer, OrderAnswer } from "./ChoiceAnswers";
import { FieldsAnswer } from "./FieldsAnswer";
import { GraphPuzzle } from "./GraphPuzzle";
import { MagicSquarePuzzle, PartitionPuzzle, SymmetryPuzzle } from "./GridPuzzles";
import { MagicTrianglePuzzle } from "./MagicTrianglePuzzle";
import { ExpressionsPuzzle, OpenAnswer, RulesAnswer, SignsPuzzle } from "./NumberPuzzles";

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
  }
}

/** Интерактивные задачи, где поле для ответа — это и есть рисунок (робот, симметрия…). */
export function isWorkbench(task: Task): boolean {
  return ["robot", "symmetry", "graph", "magicSquare", "signs", "partition", "magicTriangle", "expressions"].includes(
    task.answer.kind,
  );
}
