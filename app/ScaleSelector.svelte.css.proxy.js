// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".themed.svelte-1g1zel4{--border:1px solid #d1d5db;--borderRadius:0.5rem;--placeholderColor:#6b7280;--height:2.75rem}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}