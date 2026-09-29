"use client";

import { useState } from "react";
import { ChildNameField } from "@/components/ChildNameField";
import { Button } from "@/components/ui";
import { cleanChildName } from "@/lib/childName";
import { useT } from "@/lib/i18n";
import { setChildName, useHydrated, useStore } from "@/lib/store";

/**
 * Для тех, кто начал заниматься до того, как Лаборатория стала спрашивать имя:
 * просьба назваться. Не мешает заниматься — просто карточка сверху, исчезает, как только имя есть.
 */
export function ChildNameBanner() {
  const t = useT();
  const hydrated = useHydrated();
  const show = useStore((s) => s.welcomed === true && !s.settings.childName);
  const [name, setName] = useState("");
  if (!hydrated || !show) return null;
  const save = () => cleanChildName(name) && setChildName(name);
  return (
    <section
      className="rounded-3xl border-2 border-brand/30 bg-brand-soft/60 p-5"
      aria-label={t("Как тебя зовут?", "Isming nima?")}
      data-name-banner
    >
      <ChildNameField
        value={name}
        onChange={setName}
        onEnter={save}
        label={t("👋 Давай познакомимся! Как тебя зовут?", "👋 Keling, tanishaylik! Isming nima?")}
        hint={t(
          "Лаборатория будет обращаться к тебе по имени, а в задачах героем станешь ты.",
          "Laboratoriya senga ismingni aytib murojaat qiladi, masalalarning qahramoni esa oʻzing boʻlasan.",
        )}
      />
      <Button className="mt-2" disabled={!cleanChildName(name)} onClick={save}>
        {t("Сохранить", "Saqlash")}
      </Button>
    </section>
  );
}
