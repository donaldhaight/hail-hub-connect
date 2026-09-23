// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      // ADR-030: venture domains serve their own Door from this platform.
      allowedHosts: [
        "claimstore.com",
        "www.claimstore.com",
        "buddyclaim.com",
        "www.buddyclaim.com",
        "kimosabe.ai",
        "www.kimosabe.ai",
        "selfinsurity.com",
        "www.selfinsurity.com",
        "rrcausa.com",
        "www.rrcausa.com",
        "marketapplications.io",
        "www.marketapplications.io",
      ],
    },
  },
});
