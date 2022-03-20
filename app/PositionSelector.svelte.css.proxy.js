// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".selected.svelte-f90a33 {--tw-bg-opacity: 1;background-color: rgb(88 28 135 / var(--tw-bg-opacity));--tw-text-opacity: 1;color: rgb(255 255 255 / var(--tw-text-opacity))\n}.surrounding.svelte-f90a33 {--tw-bg-opacity: 1;background-color: rgb(229 231 235 / var(--tw-bg-opacity))\n}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}