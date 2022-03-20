/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    src: "/",
  },
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
  alias: {
    /* ... */
  },
  optimize: {
    bundle: true,
    minify: true,
  },
};
