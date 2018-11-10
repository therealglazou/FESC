/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

/**
 * Class for SCSS null
 */
export class FESCNull {

  /**
   * @constructor
   */
  constructor() {
    this.type = FESCValue.NULL_VALUE;

  }

  /**
   * Stringifier
   *
   * @return {string}
   */
  toString() {
    return "null";
  }

  /**
   * Cloner
   *
   * @return {FESCNull}
   */
  clone() {
    return new FESCNull();
  }
}
