// web-test-runner.config.js
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: {
    exportConditions: ['default', 'module', 'import']
  },
  plugins: [esbuildPlugin({ ts: false, js: true, target: 'auto' })],
};

