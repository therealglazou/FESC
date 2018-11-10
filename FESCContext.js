/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

import {FESCVariable} from "./subcontexts/FESCVariable.js";

/**
 * Class for FESC contexts. Contexts hold the object model for the SCSS sheets.
 */
export class FESCContext {

  static get SELECTOR_CONTEXT()        { return 0; }
  static get NESTED_PROPERTY_CONTEXT() { return 1; }
  static get PROPERTY_CONTEXT()        { return 2; }
  static get VARIABLE_CONTEXT()        { return 3; }
  static get AT_RULE_CONTEXT()         { return 4; }
  static get COMMENT_CONTEXT()         { return 5; }

  /**
   * @constructor
   */
  constructor() {
    this.mSubcontexts = [];
  }

  /**
   * Add a subcontext to the current context
   *
   * @param {FESCContext} aSubcontext - a subcontext to add
   */
  addSubcontext(aSubcontext) {
    if (!(aSubcontext instanceof FESCContext))
      throw "FESCContext.addSubcontext: invalid subcontext";

    this.mSubcontexts.push(aSubcontext);
  }
}
