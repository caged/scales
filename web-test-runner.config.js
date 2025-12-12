// web-test-runner.config.js
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  nodeResolve: {
    exportConditions: ['default', 'module', 'import']
  },
  plugins: [esbuildPlugin({ ts: false, js: true, target: 'auto' })],
  browsers: [
    playwrightLauncher({ product: 'chromium' })
  ],
};

