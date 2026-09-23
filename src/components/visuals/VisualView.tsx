import type { Visual } from "@/content/types";
import { LogicGrid } from "./LogicGrid";
import { ChainVisual, MachineVisual, ReceiptVisual, SequenceVisual, TableVisual } from "./numbers";
import {
  BalanceVisual,
  CalculatorVisual,
  CardsVisual,
  ClockVisual,
  CoordGridVisual,
  DecisionTreeVisual,
  OutfitsVisual,
  PoleVisual,
} from "./scenes";
import {
  ChocolateVisual,
  GridFigureVisual,
  IsoCubesVisual,
  PolyominoVisual,
  ShapesVisual,
  StaircasesVisual,
  TriangleFanVisual,
} from "./shapes";

export function VisualView({ visual, print = false }: { visual: Visual; print?: boolean }) {
  switch (visual.type) {
    case "sequence":
      return <SequenceVisual items={visual.items} print={print} />;
    case "chain":
      return <ChainVisual start={visual.start} steps={visual.steps} end={visual.end} print={print} />;
    case "machine":
      return <MachineVisual rows={visual.rows} print={print} />;
    case "cards":
      return <CardsVisual items={visual.items} />;
    case "shapes":
      return <ShapesVisual items={visual.items} print={print} />;
    case "gridFigure":
      return <GridFigureVisual cols={visual.cols} rows={visual.rows} />;
    case "isoCubes":
      return <IsoCubesVisual heights={visual.heights} />;
    case "balance":
      return <BalanceVisual scales={visual.scales} />;
    case "triangleFan":
      return <TriangleFanVisual lines={visual.lines} />;
    case "receipt":
      return <ReceiptVisual lines={visual.lines} total={visual.total} />;
    case "staircases":
      return <StaircasesVisual count={visual.count} />;
    case "outfits":
      return <OutfitsVisual shirts={visual.shirts} pants={visual.pants} />;
    case "decisionTree":
      return <DecisionTreeVisual first={visual.first} second={visual.second} boxes={visual.boxes} />;
    case "coordGrid":
      return <CoordGridVisual cols={visual.cols} rows={visual.rows} items={visual.items} />;
    case "clock":
      return <ClockVisual time={visual.time} caption={visual.caption} />;
    case "chocolate":
      return <ChocolateVisual cols={visual.cols} rows={visual.rows} />;
    case "pole":
      return <PoleVisual height={visual.height} emoji={visual.emoji} />;
    case "calculator":
      return <CalculatorVisual broken={visual.broken} />;
    case "polyomino":
      return <PolyominoVisual cells={visual.cells} />;
    case "logicGrid":
      return <LogicGrid rows={visual.rows} cols={visual.cols} corner={visual.corner} print={print} />;
    case "table":
      return visual.printOnly && !print ? null : <TableVisual head={visual.head} rows={visual.rows} />;
  }
}
