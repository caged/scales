export default class FretBoard {
  get tuning() {
    return this.tuning
  }

  set tuning(value) {
    this.tuning = value
  }
}
// export default function () {
//   function scale() {}

//   scale.tuning = function (tuning) {
//     return arguments.length ? tuning : 'EADGBE'
//   }

//   scale.frets = function (frets) {
//     return arguments.length ? frets : 24
//   }

//   return scale
// }
