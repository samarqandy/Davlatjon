import { RichText } from "@/components/RichText";
import { VisualView } from "@/components/visuals/VisualView";
import type { Block } from "@/content/types";

export function BlockView({ block, print = false }: { block: Block; print?: boolean }) {
  switch (block.type) {
    case "p":
      return (
        <p className="leading-relaxed">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return block.ordered ? (
        <ol className="list-decimal space-y-1 pl-6 marker:font-extrabold marker:text-brand">
          {block.items.map((item) => (
            <li key={item} className="pl-1 leading-relaxed">
              <RichText text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-1">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2 leading-relaxed">
              <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <p
          className={
            print
              ? "text-[0.92em] text-muted italic"
              : "rounded-2xl bg-sun-soft px-4 py-2.5 text-[0.95em] text-[#6b4e0e]"
          }
        >
          {!print && <span aria-hidden>📝 </span>}
          <RichText text={block.text} />
        </p>
      );
    case "visual":
      return (
        <div className={print ? "print-visual" : "py-1"}>
          <VisualView visual={block.visual} print={print} />
        </div>
      );
    case "question":
      return (
        <div className="space-y-2">
          <p className="leading-relaxed">
            <span className="mr-1.5 font-extrabold text-brand">{block.label}</span>
            {block.text && <RichText text={block.text} />}
          </p>
          {block.visual && (
            <div className={print ? "print-visual" : undefined}>
              <VisualView visual={block.visual} print={print} />
            </div>
          )}
        </div>
      );
  }
}
