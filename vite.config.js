import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    optimizeDeps: {
      force: true,
      include: ["three-loader"],
    },
    build: {
      commonjsOptions: { include: ["three-loader"] },
    },
    resolve: {
      preserveSymlinks: true,
    },
    server: {
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    },
  };
});
