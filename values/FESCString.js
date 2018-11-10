/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

/**
 * Class for SCSS strings
 */
export class FESCString {

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
    return aDelimitor + this.string + aDelimitor;
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
    if (!(aStr instanceof FESCString))
      throw "FESCString.unquote: ArgumentError: " + aStr.toString() + " is not a string";

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
    if (!(aStr instanceof FESCString))
      throw "FESCString.quote: ArgumentError: " + aStr.toString() + " is not a string";

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
    if (!(aStr instanceof FESCString))
      throw "FESCString.str_length: ArgumentError: " + aStr.toString() + " is not a string";

    aStr._checkQuotes();
    if (aStr.isQuoted)
      return new FESCNumber(aStr.string.length - 2, "");

    return new FESCNumber(aStr.string.length, "");
  }

  /**
   * Inserts a string into another one at requested index
   *
   * @param {FESCString} aStr - the source string
   * @param {FESCString} aToBeInserted - the string to insert
   * @param {FESCNumber} aIndex - the requested insertion index
   * @return {FESCString}
   */
  static str_insert(aStr, aToBeInserted, aIndex) {
    if (!(aStr instanceof FESCString))
      throw "FESCString.str_insert: ArgumentError: " + aStr.toString() + " is not a string";

    if (!(aToBeInserted instanceof FESCString))
      throw "FESCString.str_insert: ArgumentError: " + aToBeInserted.toString() + " is not a string";

    if (!(aIndex instanceof FESCNumber)
        || aIndex.value != Math.floor(aIndex.value)
        || aIndex.unit != "")
      throw "FESCString.str_insert: ArgumentError: " + aIndex + " is not a valid integer index";

    const str          = FESCString.unquote(aStr);
    const toBeInserted = FESCString.unquote(aToBeInserted);
    let   index        = aIndex.value;

    if (index < 0)
      index = str.string.length - aIndex;
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
   *
   * @param {FESCString} aStr - the source string
   * @param {FESCString} aNeedle - the string to search
   * @return {FESCNumber|FESCNull}
   */
  static str_index(aStr, aNeedle) {
    if (!(aStr instanceof FESCString))
      throw "FESCString.str_index: ArgumentError: " + aStr.toString() + " is not a string";

    if (!(aNeedle instanceof FESCString))
      throw "FESCString.str_index: ArgumentError: " + aNeedle.toString() + " is not a string";

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
   *
   * @param {FESCString} aStr - the source string
   * @return {FESCString}
   */
  static to_upper_case(aStr) {
    if (!(aStr instanceof FESCString))
      throw "FESCString.to_upper_case: ArgumentError: " + aStr.toString() + " is not a string";

    return new FESCString(aStr.string.toUpperCase(), aStr.isQuoted, aStr.quote);
  }

  /**
   * Returns a upper-case version of the argument string
   *
   * @param {FESCString} aStr - the source string
   * @return {FESCString}
   */
  static to_lower_case(aStr) {
    if (!(aStr instanceof FESCString))
      throw "FESCString.to_lower_case: ArgumentError: " + aStr.toString() + " is not a string";

    return new FESCString(aStr.string.toLowerCase(), aStr.isQuoted, aStr.quote);
  }

  static str_slice(aStr, aStart, aEnd) {
    // TODO
  }
}
