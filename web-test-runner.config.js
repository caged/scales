// web-test-runner.config.js

// NOTE: For now, NODE_ENV needs to be set to "test" for Snowpack
// to build test files properly. We hope to remove this limitation
// in a future release.
process.env.NODE_ENV = 'test'

module.exports = {
  plugins: [require('@snowpack/web-test-runner-plugin')()],
}
