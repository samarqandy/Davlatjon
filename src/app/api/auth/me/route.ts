import type { NextRequest } from "next/server";
import { authConfig, availableProviders } from "@/lib/server/config";
import { sessionFrom } from "@/lib/server/request";

/** Кто вошёл и какие способы входа включены на этом сайте. */
export async function GET(request: NextRequest) {
  const cfg = authConfig();
  const providers = availableProviders(cfg);
  const user = providers.google || providers.telegram ? sessionFrom(request, cfg) : null;
  return Response.json(
    { user: user ? { name: user.name, provider: user.provider } : null, providers },
    { headers: { "Cache-Control": "no-store" } },
  );
}
