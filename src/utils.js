// Split an array into a chunk, starting over at the beginning if the
// length exceeds the length of the array
//
// arr - The array to operate on
// start - starting index
// len - length of chunk
const chunk = (list, start, len) => {
  start = start % list.length;
  const arr = [...list];
  if (start + len <= arr.length) return arr.slice(start, start + len);

  const len2 = start + len - arr.length;
  return [arr.slice(start, start + len), arr.slice(0, len2)].flat();
};

const rotate = (arr, offset) => {
  const items = arr.slice();
  const els = items.splice(offset);
  return [...els, ...items];
};

const xmlns = "http://www.w3.org/2000/xmlns/";
const xlinkns = "http://www.w3.org/1999/xlink";
const svgns = "http://www.w3.org/2000/svg";
function serialize(svg) {
  svg = svg.cloneNode(true);
  const fragment = window.location.href + "#";
  const walker = document.createTreeWalker(
    svg,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );
  while (walker.nextNode()) {
    for (const attr of walker.currentNode.attributes) {
      if (attr.value.includes(fragment)) {
        attr.value = attr.value.replace(fragment, "#");
      }
    }
  }
  svg.setAttributeNS(xmlns, "xmlns", svgns);
  svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
  const serializer = new window.XMLSerializer();
  const string = serializer.serializeToString(svg);
  return new Blob([string], { type: "image/svg+xml" });
}

const getSVGFile = (el, name) => {
  var svgBlob = serialize(el);
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = `${name || Date.now()}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

export { partition, chunk, rotate, getSVGFile };
