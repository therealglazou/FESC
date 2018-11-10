/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

/**
 * Class for SCSS booleans
 */

export class FESCBoolean {

  /**
   * @constructor
   * @param {*} aValue
   */
  constructor(aValue) {
    this.type = FESCValue.BOOLEAN_VALUE;

    const error = "FESCBoolean: invalid value: " + aValue;
    switch (typeof aValue) {
      case "boolean":
        this.boolean = aValue;
        break;

      case "string":
        switch (aValue.toLowerCase()) {
          case "true":
            this.boolean = true;
            break;
          case "false":
            this.boolean = false;
            break;
          default:
            throw error;
        }
        break;

      case "number":
        if (aValue == 0)
          this.boolean = false;
        else if (aValue == 1)
          this.boolean = true;
        else {
          throw error;
        }
        break;

      default:
        throw error;
    }
  }

  /**
   * Stringifier
   *
   * @return {string}
   */
  toString() {
    return this.boolean ? "true" : "false";
  }

  /**
   * Cloner
   *
   * @return {FESCBoolean}
   */
  clone() {
    return new FESCBoolean(this.boolean);
  }
}
