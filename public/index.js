"use strict";
import { frets, scale, tnps, getSVGFile } from "./dist/index";

const fb = frets(["D2", "A2", "D3", "G3", "B3", "E4"]);
const notes = fb.notes();
const sn = scale("D minor");
console.log(tnps(notes, sn));
