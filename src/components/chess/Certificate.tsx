"use client";

import { Lock, Printer } from "lucide-react";
import Link from "next/link";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { Button, ButtonLink, ProgressBar, Icon } from "@/components/ui";
import { CHESS_LEVELS, chessLevelHref } from "@/content/chess";
import { rankEarnedAt } from "@/lib/certificate";
import { nameFor } from "@/lib/childName";
import { useTitleTranslation } from "@/lib/docTitle";
import { useLang, useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { useHydrated, useStore } from "@/lib/store";
import { useChessPart } from "@/lib/useChess";
import { LEVELS } from "@/content/chess/parts/levels";
import { PieceIcon } from "./ChessBoard";
import { CertificateSheet } from "./CertificateSheet";

/**
 * Сертификат о звании — лист A4 (альбомный) с именем ребёнка, званием и датой.
 * Пока звание не получено, вместо листа — сколько упражнений осталось.
 */
export function CertificateView({ levelId }: { levelId: string }) {
  const t = useT();
  const lang = useLang();
  const hydrated = useHydrated();
  const { levels } = useChessPart(LEVELS);
  const index = levels.findIndex((l) => l.id === levelId);
  const level = levels[index];
  useTitleTranslation(`Сертификат «${CHESS_LEVELS[index].name}»`, `«${level.name}» sertifikati`);
  const earnedAt = useStore((s) => rankEarnedAt(level, s));
  const solved = useStore((s) => level.exercises.filter((e) => s.chess[e.id]?.solvedAt).length);
  const hasName = useStore((s) => !!s.settings.childName);
  const name = useStore((s) => nameFor(lang, s.settings));

  if (!hydrated) return <div className="min-h-96" />;

  const back = (
    <Link
      href={chessLevelHref(level.id)}
      className="no-print inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
    >
      ← {t(`Уровень «${level.name}»`, `«${level.name}» darajasi`)}
    </Link>
  );

  if (!earnedAt)
    return (
      <div className="space-y-5">
        {back}
        <section className="rounded-3xl bg-surface p-6 shadow-card" data-certificate="locked">
          <h1 className="text-2xl font-black">
            <Icon icon={Lock} /> {t(`Сертификат «${level.name}» пока закрыт`, `«${level.name}» sertifikati hali yopiq`)}
          </h1>
          <p className="mt-2 text-lg">
            {t(
              `Реши все упражнения уровня — и получишь звание «${level.name}» и сертификат с твоим именем.`,
              `Darajaning hamma mashqlarini yech — «${level.name}» unvoni va isming yozilgan sertifikatni olasan.`,
            )}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <ProgressBar value={solved} max={level.exercises.length} className="flex-1" />
            <span className="font-black tabular-nums">
              {solved}/{level.exercises.length}
            </span>
          </div>
          <ButtonLink href={`${chessLevelHref(level.id)}#exercises`} className="mt-4">
            {t("К упражнениям →", "Mashqlarga →")}
          </ButtonLink>
        </section>
      </div>
    );

  return (
    <div className="space-y-5">
      {back}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">
            <span className="deco" aria-hidden>
              🏅{" "}
            </span>
            {t(`Сертификат «${level.name}»`, `«${level.name}» sertifikati`)}
          </h1>
          <p className="text-muted">
            {t(
              "Распечатай на листе A4 (альбомная ориентация) — и повесь на стену!",
              "A4 varaqqa (albom koʻrinishida) chop et — va devorga osib qoʻy!",
            )}
          </p>
        </div>
        <Button variant="sun" onClick={() => window.print()}>
          <Icon icon={Printer} /> {t("Распечатать", "Chop etish")}
        </Button>
      </div>
      {!hasName && (
        <div className="no-print">
          <ChildNameBanner />
        </div>
      )}

      <CertificateSheet
        icon={
          <PieceIcon
            piece={level.piece}
            className="relative h-[13cqi] w-[13cqi] rounded-full bg-[#f0d9b5] p-[1.2cqi] ring-[0.5cqi] ring-[#d8b46a]"
          />
        }
        name={hasName ? name : " "}
        award={t("получает шахматное звание", "shaxmat unvoniga sazovor boʻldi")}
        title={level.name}
        detail={t(
          `Решены все ${pluralize(level.exercises.length, "упражнение", "упражнения", "упражнений")} уровня ${level.order} из ${levels.length}.`,
          `${levels.length} ta darajadan ${level.order}-darajaning barcha ${level.exercises.length} ta mashqi yechildi.`,
        )}
        earnedAt={earnedAt}
      />
    </div>
  );
}
