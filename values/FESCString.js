/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

import {FESCValue} from "./FESCValue.js";
import {FESCNumber} from "./FESCNumber.js";

/**
 * Class for SCSS strings
 */
export class FESCString extends FESCValue {

  /**
   * Constructor
   *
   * @param {string} aStr - a JS string
   * @param {boolean} aIsQuoted - a boolean indicating if the string is quoted
   * @param {string} aQuote - the string delimitor or the empty string
   */
  constructor(aStr, aIsQuoted, aQuote = "") {
    this.type = FESCValue.STRING_VALUE;
    this.string = aStr;
    this.isQuoted = aIsQuoted;
    this.quote = aIsQuoted ? aQuote : "";
    // verify anyway...
    this._checkQuotes();
  }

  /**
   * Stringifier
   *
   * @return {string}
   */
  toString() {
    return this.isQuoted
           ? aDelimitor + this.string + aDelimitor
           : this.string;
  }

  /**
   * Cloner
   *
   * @return {FESCString}
   */
  clone() {
    this._checkQuotes();
    return new FESCString(this.string, this.isQuoted, this.quote);
  }

  static validate(aStr, aCaller) {
    if (!(aStr instanceof FESCString))
      throw aCaller + ": ArgumentError: " + aStr.toString() + " is not a string";
  }

  /**
   * Validates the isQuoted and quote attributes
   */
  _checkQuotes() {
    const str = aStr.string;
    if (str.length >= 2
        && str[0] == str[str.length - 1]
        && (str[0] == "'" || str[0] == '"')) {
      this.isQuoted = true;
      this.quote = str[0];
      return;
    }

    this.isQuoted = false;
    this.quote = "";
  }

  /**
   * Unquotes a string
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#unquote-instance_method
   *
   * @param {FESCString} aStr - a FESC string
   * @return {FESCString}
   */
  static unquote(aStr) {
    FESCString.validate(aStr, "FESCString.unquote");

    aStr._checkQuotes();
    if (aStr.isQuoted) {
      return new FESCString(aStr.string.substr(aStr.string.length - 2), false);
    }

    return new FESCString(aStr.string, false);
  }

  /**
   * Quotes a string
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#quote-instance_method
   *
   * @param {FESCString} aStr - a FESC string
   * @return {FESCString}
   */
  static quote(aStr) {
    FESCString.validate(aStr, "FESCString.quote");

    aStr._checkQuotes();
    if (aStr.isQuoted) {
      return new FESCString(aStr.string, true, aStr.quote);
    }

    return new FESCString('"' + aStr.string + '"', true, '"');
  }

  /**
   * Returns the length of a string
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#str_length-instance_method
   *
   * @param {FESCString} aStr - a FESC string
   * @return {FESCNumber}
   */
  static str_length(aStr) {
    FESCString.validate(aStr, "FESCString.str_length");

    aStr._checkQuotes();
    if (aStr.isQuoted)
      return new FESCNumber(aStr.string.length - 2, "");

    return new FESCNumber(aStr.string.length, "");
  }

  /**
   * Inserts a string into another one at requested index
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#str_insert-instance_method
   *
   * @param {FESCString} aStr - the source string
   * @param {FESCString} aToBeInserted - the string to insert
   * @param {FESCNumber} aIndex - the requested insertion index
   * @return {FESCString}
   */
  static str_insert(aStr, aToBeInserted, aIndex) {
    FESCString.validate(aStr, "FESCString.str_insert");
    FESCString.validate(aToBeInserted, "FESCString.str_insert");
    FESCNumber.validateUnitlessInteger(aIndex, "FESCString.str_insert");

    const str          = FESCString.unquote(aStr);
    const toBeInserted = FESCString.unquote(aToBeInserted);
    let   index        = aIndex.value;

    if (index < 0)
      index = str.string.length - index;
    else
      index--;

    const res = str.string.substr(0, index)
                + toBeInserted.string
                + str.string.substr(index);
    if (aStr.isQuoted) {
      res = aStr.quote + res + aStr.quote;
      return new FESCString(res, true, aStr.quote);
    }

    return new FESCString(res, false);
  }

  /**
   * Returns the position of a string into another one. Returns the
   * a FESCNull if not found.
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#str_index-instance_method
   *
   * @param {FESCString} aStr - the source string
   * @param {FESCString} aNeedle - the string to search
   * @return {FESCNumber|FESCNull}
   */
  static str_index(aStr, aNeedle) {
    FESCString.validate(aStr, "FESCString.str_index");
    FESCString.validate(aNeedle, "FESCString.str_index");

    const str    = FESCString.unquote(aStr);
    const needle = FESCString.unquote(aNeedle);
    const index  = str.string.indexOf(aNeedle);

    if (index == -1) {
      return new FESCNull();
    }

    return new FESCNumber(index + 1, "");
  }

  /**
   * Returns a upper-case version of the argument string
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#to_upper_case-instance_method
   *
   * @param {FESCString} aStr - the source string
   * @return {FESCString}
   */
  static to_upper_case(aStr) {
    FESCString.validate(aStr, "FESCString.to_upper_case");

    return new FESCString(aStr.string.toUpperCase(), aStr.isQuoted, aStr.quote);
  }

  /**
   * Returns a upper-case version of the argument string
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#to_lower_case-instance_method
   *
   * @param {FESCString} aStr - the source string
   * @return {FESCString}
   */
  static to_lower_case(aStr) {
    FESCString.validate(aStr, "FESCString.to_lower_case");

    return new FESCString(aStr.string.toLowerCase(), aStr.isQuoted, aStr.quote);
  }

  /**
   * Extracts a substring from the source string
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#str_slice-instance_method
   *
   * @param {FECSString} aStr - the source string
   * @param {FECSNumber} aStart
   * @param {FECSNumber} aEnd
   * @return {FECSString}
   */
  static str_slice(aStr, aStart, aEnd) {
    FESCString.validate(aStr, "FESCString.str_slice");
    FESCNumber.validateUnitlessInteger(aStart, "FESCString.str_slice")

    if (!aEnd)
      aEnd = new FESCNumber(-1, "");

    FESCNumber.validateUnitlessInteger(aEnd, "FESCString.str_slice")

    const str = FESCString.unquote(aStr);
    let start = aStart.value;
    let end   = aEnd.value;

    if (start < 0)
      start = str.string.length - start;
    else
      start--;

    if (end < 0)
      end = str.string.length - end;
    else
      end--;

    return new FECSString(str.string.substr(start, end), this.isQuoted, this.quote);
  }
}
