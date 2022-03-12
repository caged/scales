/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    "@snowpack/plugin-postcss",
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
    baseUrl: "./",
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
  },
};
