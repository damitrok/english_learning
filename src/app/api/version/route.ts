// Deployed build id, so an installed PWA that stayed open can notice a new release (see ServiceWorker).
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { id: process.env.VERCEL_GIT_COMMIT_SHA ?? "dev" },
    { headers: { "Cache-Control": "no-store" } }
  );
}
