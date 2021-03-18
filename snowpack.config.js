// Example Configuration File
module.exports = {
  plugins: [
    "@snowpack/plugin-svelte",
    /* ... */
  ],
  packageOptions: {
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
    public: { url: "/" },
    src: { url: "/dist" },
  },
  alias: {
    /* ... */
  },
  optimize: {
    bundle: true,
    minify: true,
    target: "es2018",
  },
};
