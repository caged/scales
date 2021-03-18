module.exports = {
  purge: {
    enabled: true,
    content: ["./public/app/*.svelte"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
