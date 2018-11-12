/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

/**
 * Class for SCSS numbers
 */
export class FESCNumber {

  /**
   * Getter for valid units
   *
   * @return {string[]}
   */
  get VALID_UNITS() {
    return [
      "",
      "%",
      "em",
      "ex",
      "cap",
      "ch",
      "ic",
      "rem",
      "lh",
      "rlh",
      "vw",
      "vh",
      "vi",
      "vb",
      "vmin",
      "vmax",
      "deg",
      "grad",
      "rad",
      "turn",
      "s",
      "ms",
      "hz",
      "khz",
      "dpi",
      "dpcm",
      "dppx"
    ];
  }

  /**
   * @constructor
   * @param {number} aNumber
   * @param {string} aUnit
   */
  constructor(aNumber, aUnit) {
    this.type = FESCValue.NUMBER_VALUE;
    this.number = aNumber;
    this.unit = aUnit;
  }

  /**
   * Getter the number part
   *
   * @return {number}
   */
  get number() {
    return this.mNumber;
  }

  /**
   * Setter for the number part
   *
   * @param {number} aVal
   */
  set number(aVal) {
    if (!Number(aVal)) {
      throw "FESCNumber: not a number: " + aVal;
    }

    this.mNumber = parseFloat(aVal);
  }

  /**
   * Getter fo the unit part
   *
   * @return {string}
   */
  get unit() {
    return this.mUnit;
  }

  /**
   * Setter for th unit part
   *
   * @param {string} aVal
   */
  set unit(aVal) {
    if (!this.VALID_UNITS.includes(aVal.toLowerCase()))
      throw "FESCNumber: not a valid unit: " + aUnit;

    this.mUnit = aVal;
  }

  /**
   * Stringifier
   *
   * @return {string}
   */
  toString() {
    return String(this.number) + this.unit;
  }

  /**
   * Cloner
   *
   * @return {FESCNumber}
   */
  clone() {
    return new FESCNumber(this.number, this.unit);
  }

  static validate(aNumber, aCaller) {
    if (!(aNumber instanceof FESCNumber))
      throw aCaller + ": ArgumentError: " + aNumber.toString() + " is not a number";
  }

  static validateUnitless(aNumber, aCaller) {
    if (!(aNumber instanceof FESCNumber)
        || aNumber.unit != "")
      throw aCaller + ": ArgumentError: " + aNumber.toString() + " not a unitless number";
  }

  static validateUnitlessInteger(aNumber, aCaller) {
    if (!(aNumber instanceof FESCNumber)
        || aNumber.value != Math.floor(aNumber.value)
        || aNumber.unit != "")
      throw aCaller + ": ArgumentError: " + aNumber.toString() + " not a unitless integer";
  }

  /**
   * Converts a unitless number into a percentage
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#percentage-instance_method
   *
   * @param {FESCNumber} aNumber - the source number
   * @param {FESCNumber}
   */
  static percentage(aNumber) {
    FESCNumber.validateUnitless(aNumber, "FESCNumber.percentage");

    return new FESCNumber(aNumber.number * 100, "%");
  }

  /**
   * Rounds a number to the nearest interger number
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#round-instance_method
   *
   * @param {FESCNumber} aNumber - the source number
   * @param {FESCNumber}
   */
  static round(aNumber) {
    FESCNumber.validate(aNumber, "FESCNumber.round");

    return new FESCNumber(Math.round(aNumber.number), aNumber.unit);
  }

  /**
   * Rounds a number up to the next interger number
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#ceil-instance_method
   *
   * @param {FESCNumber} aNumber - the source number
   * @param {FESCNumber}
   */
  static ceil(aNumber) {
    FESCNumber.validate(aNumber, "FESCNumber.ceil");

    return new FESCNumber(Math.ceil(aNumber.number), aNumber.unit);
  }

  /**
   * Floors a number up to the previous interger number
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#floor-instance_method
   *
   * @param {FESCNumber} aNumber - the source number
   * @param {FESCNumber}
   */
  static floor(aNumber) {
    FESCNumber.validate(aNumber, "FESCNumber.floor");

    return new FESCNumber(Math.floor(aNumber.number), aNumber.unit);
  }

  /**
   * Returns the abolute value of a number
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#abs-instance_method
   *
   * @param {FESCNumber} aNumber - the source number
   * @param {FESCNumber}
   */
  static abs(aNumber) {
    FESCNumber.validate(aNumber, "FESCNumber.abs");

    return new FESCNumber(Math.abs(aNumber.number), aNumber.unit);
  }

  /**
   * Returns the minimum value of some numbers
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#min-instance_method
   *
   * @param {FESCNumber[]} aNumbers - an array of numbers
   * @param {FESCNumber}
   */
  static min(...aNumbers) {
    aNumbers.forEach((aNumber) => {
      FESCNumber.validate(aNumber, "FESCNumber.min");
      if (aNumber.unit != aNumbers[0].unit)
        throw "FESCNumber.min: ArgumentError: different units";
    });

    const numbers = aNumbers.map(aNumber => aNumber.number);
    return new FESCNumber(Math.min(...numbers), aNumbers[0].unit);
  }

  /**
   * Returns the maximum value of some numbers
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#max-instance_method
   *
   * @param {FESCNumber[]} aNumbers - an array of numbers
   * @param {FESCNumber}
   */
  static max(...aNumbers) {
    aNumbers.forEach((aNumber) => {
      FESCNumber.validate(aNumber, "FESCNumber.max");
      if (aNumber.unit != aNumbers[0].unit)
        throw "FESCNumber.max: ArgumentError: different units";
    });

    const numbers = aNumbers.map(aNumber => aNumber.number);
    return new FESCNumber(Math.max(...numbers), aNumbers[0].unit);
  }

  /**
   * Return a random number
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#random-instance_method
   * 
   * @param {FESCNumber|null} aLimit - optional limit; default is 1 
   */
  static random(aLimit) {
    if (aLimit)
      FESCNumber.validate(aLimit, "FESCNumber.random");

    if (aLimit)
      return new FSCENumber(1 + Math.floor(aLimit.number * Math.random()), "");

    return new FSCENumber(Math.random(), "");
  }
}
