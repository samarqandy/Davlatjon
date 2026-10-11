import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ANIM_ASSETS, DOTLOTTIE_WEB_VERSION, RIVE_RUNTIME_VERSION } from "@/lib/anim/assets";

const root = process.cwd();
const pkgVersion = (name: string): string =>
  JSON.parse(readFileSync(join(root, "node_modules", name, "package.json"), "utf8")).version;

describe("файлы анимации", () => {
  it("флаг available совпадает с тем, что лежит в public/ — не объявляем несуществующие файлы", () => {
    for (const [name, asset] of Object.entries(ANIM_ASSETS)) {
      expect(existsSync(join(root, "public", asset.src)), `${name}: ${asset.src}`).toBe(asset.available);
    }
  });
  it("адреса файлов лежат в public/animations/", () => {
    for (const asset of Object.values(ANIM_ASSETS)) expect(asset.src.startsWith("/animations/")).toBe(true);
  });
});

describe("WASM-движки со своего домена", () => {
  it("версии в коде совпадают с установленными пакетами (иначе движок и среда исполнения разойдутся)", () => {
    expect(RIVE_RUNTIME_VERSION).toBe(pkgVersion("@rive-app/canvas-lite"));
    expect(DOTLOTTIE_WEB_VERSION).toBe(pkgVersion("@lottiefiles/dotlottie-web"));
  });
  it("обе библиотеки зафиксированы точной версией (без ^), чтобы wasm не поехал при обновлении", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    for (const name of ["@rive-app/react-canvas-lite", "@lottiefiles/dotlottie-react"]) {
      expect(pkg.dependencies[name]).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });
});
