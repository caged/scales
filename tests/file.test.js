const { test } = require('tape')
const { tnps } = require('../dist')

test('some thing here', (t) => {
  t.ok(tnps.getNotesAtPosition(), 1)
  t.end()
})
