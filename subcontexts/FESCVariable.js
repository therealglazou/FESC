/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

/**
 * Class for SCSS variables
 */
export class FESCVariable {

  /**
   * @constructor
   * @param {string} aName - the name of the variable
   */
  constructor(aName) {
    this.type = FESCContext.VARIABLE_CONTEXT;
    this.name = aName;
    // we need a storage array for values
    this.mValues = [];
  }

  /**
   * Add a value to the values of the variable
   *
   * @param {*} aValue - the value to add
   */
  addValue(aValue) {
    this.mValues.push(aValue);
  }

  /**
   * Getter for the values of the variable
   */
  get values() {
    return this.mValues;
  }
}