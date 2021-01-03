// Split an array into a chunk, starting over at the beginning if the
// length exceeds the length of the array
//
// arr - The array to operate on
// start - starting index
// len - length of chunk
const chunk = (list, start, len) => {
  const arr = [...list]
  if (start + len <= arr.length) return arr.slice(start, start + len)

  const len2 = start + len - arr.length
  return [arr.slice(start, start + len), arr.slice(0, len2)].flat()
}

const rotate = (arr, offset) => {
  const items = arr.slice()
  const els = items.splice(offset)
  return [...els, ...items]
}

export { chunk, rotate }
