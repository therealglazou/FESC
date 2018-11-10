/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

/**
 * Class for SCSS tokens
 */
export class FESCToken {

  static get NULL_TYPE()              { return 0; }

  static get WHITESPACE_TYPE()        { return 1; }
  static get STRING_TYPE()            { return 2; }
  static get COMMENT_TYPE()           { return 3; }
  static get NUMBER_TYPE()            { return 4; }
  static get IDENT_TYPE()             { return 5; }
  static get FUNCTION_TYPE()          { return 6; }
  static get ATRULE_TYPE()            { return 7; }
  static get INCLUDES_TYPE()          { return 8; }
  static get DASHMATCH_TYPE()         { return 9; }
  static get BEGINSMATCH_TYPE()       { return 10; }
  static get ENDSMATCH_TYPE()         { return 11; }
  static get CONTAINSMATCH_TYPE()     { return 12; }
  static get SYMBOL_TYPE()            { return 13; }
  static get DIMENSION_TYPE()         { return 14; }
  static get PERCENTAGE_TYPE()        { return 15; }
  static get HEX_TYPE()               { return 16; }
  static get INCOMPLETE_STRING_TYPE() { return 17; }
  static get ONE_LINE_COMMENT_TYPE()  { return 18; }

  /**
   * @constructor
   * @param {number} aType - the token type
   * @param {string} aValue - the token value
   * @param {string} aUnit - the token unit if the token has one
   */
  constructor(aType, aValue, aUnit) {
    this.type = aType;
    this.value = aValue;
    this.unit = aUnit;
  }

  /**
   * Returns true if the token is not of the NULL_TYPE type
   *
   * @return {boolean}
   */
  isNotNull()
  {
    return this.type != FESCToken.NULL_TYPE;
  }

  /**
   * Returns true if the token is of the given type. An extra equality constraint
   * is possible on the token value
   *
   * @param {number} aType - a token type
   * @param {string} aValue - a optional token value
   * @return {boolean}
   */
  _isOfType(aType, aValue)
  {
    return (this.type == aType && (!aValue || this.value.toLowerCase() == aValue));
  }

  /**
   * Returns true if the token is a WHITESPACE_TYPE type. An extra equality constraint
   * is possible on the token value
   *
   * @param {string} w - a optional token value
   * @return {boolean}
   */
  isWhiteSpace(w)
  {
    return this._isOfType(FESCToken.WHITESPACE_TYPE, w);
  }

  /**
   * Returns true if the token is a STRING_TYPE type.
   *
   * @return {boolean}
   */
  isString()
  {
    return this._isOfType(FESCToken.STRING_TYPE);
  }

  /**
   * Returns true if the token is a COMMENT_TYPE type.
   *
   * @return {boolean}
   */
  isComment()
  {
    return this._isOfType(FESCToken.COMMENT_TYPE);
  }

  /**
   * Returns true if the token is a NUMBER_TYPE type. An extra equality constraint
   * is possible on the token value
   *
   * @param {string} n - a optional token value
   * @return {boolean}
   */
  isNumber(n)
  {
    return this._isOfType(FESCToken.NUMBER_TYPE, n);
  }

  /**
   * Returns true if the token is a SYMBOL_TYPE type. An extra equality constraint
   * is possible on the token value
   *
   * @param {string} n - a optional token value
   * @return {boolean}
   */
  isSymbol(c)
  {
    return this._isOfType(FESCToken.SYMBOL_TYPE, c);
  }

  /**
   * Returns true if the token is a IDENT_TYPE type. An extra equality constraint
   * is possible on the token value
   *
   * @param {string} i - a optional token value
   * @return {boolean}
   */
  isIdent(i)
  {
    return this._isOfType(FESCToken.IDENT_TYPE, i);
  }

  /**
   * Returns true if the token is a FUNCTION_TYPE type. An extra equality constraint
   * is possible on the token value
   *
   * @param {string} f - a optional token value
   * @return {boolean}
   */
  isFunction(f)
  {
    return this._isOfType(FESCToken.FUNCTION_TYPE, f);
  }

  /**
   * Returns true if the token is a ATRULE_TYPE type. An extra equality constraint
   * is possible on the token value
   *
   * @param {string} a - a optional token value
   * @return {boolean}
   */
  isAtRule(a)
  {
    return this._isOfType(FESCToken.ATRULE_TYPE, a);
  }

  /**
   * Returns true if the token is a INCLUDES_TYPE type.
   *
   * @return {boolean}
   */
  isIncludes()
  {
    return this._isOfType(FESCToken.INCLUDES_TYPE);
  }

  /**
   * Returns true if the token is a DASHMATCH_TYPE type.
   *
   * @return {boolean}
   */
  isDashmatch()
  {
    return this._isOfType(FESCToken.DASHMATCH_TYPE);
  }

  /**
   * Returns true if the token is a BEGINSMATCH_TYPE type.
   *
   * @return {boolean}
   */
  isBeginsmatch()
  {
    return this._isOfType(FESCToken.BEGINSMATCH_TYPE);
  }

  /**
   * Returns true if the token is a ENDSMATCH_TYPE type.
   *
   * @return {boolean}
   */
  isEndsmatch()
  {
    return this._isOfType(FESCToken.ENDSMATCH_TYPE);
  }

  /**
   * Returns true if the token is a CONTAINSMATCH_TYPE type.
   *
   * @return {boolean}
   */
  isContainsmatch()
  {
    return this._isOfType(FESCToken.CONTAINSMATCH_TYPE);
  }

  /**
   * Returns true if the token is a SYMBOL_TYPE type. An extra equality constraint
   * is possible on the token value
   *
   * @param {string} c - a optional token value
   * @return {boolean}
   */
  isSymbol(c)
  {
    return this._isOfType(FESCToken.SYMBOL_TYPE, c);
  }

  /**
   * Returns true if the token is a DIMENSION_TYPE type.
   *
   * @return {boolean}
   */
  isDimension()
  {
    return this._isOfType(FESCToken.DIMENSION_TYPE);
  }

  /**
   * Returns true if the token is a PERCENTAGE_TYPE type.
   *
   * @return {boolean}
   */
  isPercentage()
  {
    return this._isOfType(FESCToken.PERCENTAGE_TYPE);
  }

  /**
   * Returns true if the token is a HEX_TYPE type.
   *
   * @return {boolean}
   */
  isHex()
  {
    return this._isOfType(FESCToken.HEX_TYPE);
  }

  /**
   * Returns true if the unit of the token is equal to the parameter
   *
   * @param {string} aUnit - a string containing a unit identifier
   * @return {boolean}
   */
  isDimensionOfUnit(aUnit)
  {
    return (this.isDimension() && this.unit == aUnit);
  }

  /**
   * Returns true if the token is a length
   *
   * @return {boolean}
   */
  isLength()
  {
    return (this.isPercentage() ||
            this.isDimensionOfUnit("em") ||
            this.isDimensionOfUnit("ex") ||
            this.isDimensionOfUnit("ch") ||

            this.isDimensionOfUnit("px") ||

            this.isDimensionOfUnit("vh") ||
            this.isDimensionOfUnit("vw") ||
            this.isDimensionOfUnit("vmin") ||
            this.isDimensionOfUnit("vmax") ||

            this.isDimensionOfUnit("rem") ||

            this.isDimensionOfUnit("cm") ||
            this.isDimensionOfUnit("mm") ||
            this.isDimensionOfUnit("in") ||
            this.isDimensionOfUnit("pc") ||
            this.isDimensionOfUnit("pt"));
  }

  /**
   * Returns true if the token is an angle
   *
   * @return {boolean}
   */
  isAngle()
  {
    return (this.isDimensionOfUnit("deg") ||
            this.isDimensionOfUnit("rad") ||
            this.isDimensionOfUnit("grad"));
  }

}
