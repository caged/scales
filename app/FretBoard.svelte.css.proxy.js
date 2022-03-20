// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".chord.svelte-1hi8vhn {\n    --tw-bg-opacity: 1;\n    background-color: rgb(236 72 153 / var(--tw-bg-opacity));\n    font-weight: 700;\n    --tw-text-opacity: 1;\n    color: rgb(236 72 153 / var(--tw-text-opacity))\n}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}