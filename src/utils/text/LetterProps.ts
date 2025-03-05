import type { LetterProperties, Vector3, Vector4 } from '@/types'

/**
 *
 */
export default function LetterProps(
  this: LetterProperties,
  o?: number,
  sw?: number,
  sc?: string,
  fc?: string,
  m?: number | string,
  p?: number
) {
  this.o = o
  this.sw = sw
  this.sc = sc
  this.fc = fc
  this.m = m
  this.p = p
  this._mdf = {
    fc: !!fc,
    m: true,
    o: true,
    p: true,
    sc: !!sc,
    sw: !!sw,
  }
}

LetterProps.prototype.update = function (
  o: number,
  sw: number,
  sc: Vector3 | Vector4,
  fc: Vector3 | Vector4,
  m: number,
  p: number | number[]
) {
  this._mdf.o = false
  this._mdf.sw = false
  this._mdf.sc = false
  this._mdf.fc = false
  this._mdf.m = false
  this._mdf.p = false
  let updated = false

  if (this.o !== o) {
    this.o = o
    this._mdf.o = true
    updated = true
  }
  if (this.sw !== sw) {
    this.sw = sw
    this._mdf.sw = true
    updated = true
  }
  if (this.sc !== sc) {
    this.sc = sc
    this._mdf.sc = true
    updated = true
  }
  if (this.fc !== fc) {
    this.fc = fc
    this._mdf.fc = true
    updated = true
  }
  if (this.m !== m) {
    this.m = m
    this._mdf.m = true
    updated = true
  }
  if (
    Array.isArray(p) &&
    p.length &&
    (this.p[0] !== p[0] ||
      this.p[1] !== p[1] ||
      this.p[4] !== p[4] ||
      this.p[5] !== p[5] ||
      this.p[12] !== p[12] ||
      this.p[13] !== p[13])
  ) {
    this.p = p
    this._mdf.p = true
    updated = true
  }
  return updated
}
