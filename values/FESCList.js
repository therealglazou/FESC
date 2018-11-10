/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

/**
 * Class for SCSS lists
 */

export class FESCList {

  /*
   * @constructor
   */
  constructor() {
    this.type = FESCValue.LIST_VALUE;
    this.values = [];
  }

  /**
   * Add a value to the list
   *
   * @param {*} aValue - the value to add to the list
   */
  addValue(aValue) {
    this.mValues.push(aValue);
  }

  /**
   * Getter for the values of the list
   *
   * @return {Array}
   */
  get values() {
    return this.mValues;
  }

  /**
   * Stringifier
   */
  toString() {
    let str = "";
    this.values.forEach((aValue, aIndex) => {
      if (aIndex) {
        if (aValue.type == FESCValue.COMMA_SEPARATOR_VALUE)
          str += ",";
        str += " ";
      }
      str += aValue.toString();
    });
    return str;
  }

  /**
   * Cloner
   */
  clone() {
    const res = new FESCList();
    this.values.forEach((aValue) => {
      res.addValue(aValue.clone());
    });
    return res;
  }

  /**
   * Returns the number of values in a list
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#length-instance_method
   *
   * @param {FESCList} aList
   * @return {FESCNumber}
   */
  static length(aList) {
    if (!(aList instanceof FESCList))
      throw "FESCList.length: ArgumentError: " + aList.toString() + " is not a list";

    return new FESCNumber(aList.values.length, "");
  }

  /**
   * Returns the nth value in a list
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#nth-instance_method
   *
   * @param {FESCList} aList
   * @param {FESCNumber} aNumber
   * @return {FESCNumber|FESCNull}
   */
  static nth(aList, aIndex) {
    if (!(aList instanceof FESCList))
      throw "FESCList.nth: ArgumentError: " + aList.toString() + " is not a list";

    if (!(aIndex instanceof FESCNumber)
        || aIndex.value != Math.floor(aIndex.value)
        || aIndex.unit != "")
      throw "FESCList.nth: ArgumentError: " + aIndex + " is not a valid integer index";

    let index = aIndex.value;

    if (index < 0)
      index = aList.length - aIndex;
    else
      index--;

    if (index < 0 || index >= aList.length)
      throw "FESCList.nth: ArgumentError: " + aIndex + " is not a valid integer index";

    return aList.values[index];
  }

  /**
   * Sets the nth value in a list
   * Cf. https://sass-lang.com/documentation/Sass/Script/Functions.html#set_nth-instance_method
   *
   * @param {FESCList} aList
   * @param {FESCNumber} aNumber
   * @param {*} aNewValue
   * @return {FESCNumber|FESCNull}
   */
  static set_nth(aList, aIndex, aNewValue) {
    if (!(aList instanceof FESCList))
      throw "FESCList.nth: ArgumentError: " + aList.toString() + " is not a list";

    if (!(aIndex instanceof FESCNumber)
        || aIndex.value != Math.floor(aIndex.value)
        || aIndex.unit != "")
      throw "FESCList.nth: ArgumentError: " + aIndex + " is not a valid integer index";

    let index = aIndex.value;

    if (index < 0)
      index = aList.length - aIndex;
    else
      index--;

    if (index < 0 || index >= aList.length)
      throw "FESCList.nth: ArgumentError: " + aIndex + " is not a valid integer index";

    const res = aList.clone();
    res.values[index] = aNewValue;
    return res;
  }
}