module.exports = {
  content: ["./public/app/*.{html,js,svelte}"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
