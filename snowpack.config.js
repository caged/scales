// Example Configuration File
module.exports = {
  plugins: [
    /* ... */
  ],
  installOptions: {
    polyfillNode: true,
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  mount: {
    public: { url: '/' },
    src: { url: '/dist' },
  },
  alias: {
    /* ... */
  },
  experiments: {
    optimize: {
      bundle: true,
      minify: true,
      target: 'es2018',
    },
  },
}
