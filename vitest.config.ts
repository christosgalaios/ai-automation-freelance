import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'demos/*/src/**/*.test.ts',
      'demos/*/tests/**/*.test.ts',
      'tools/proposal-gen/src/**/*.test.ts',
      'tools/proposal-gen/tests/**/*.test.ts',
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
