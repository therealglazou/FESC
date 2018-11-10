/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * The Original Code is FESC, the Front-End SCSS Compiler.
 * Original author: Daniel Glazman
 */

import {FESCToken} from "./FESCToken.js";

/**
 * Class for the SCSS scanner
 */
export class FESCScanner {

  get CSS_ESCAPE() { return '\\'; }

  get IS_HEX_DIGIT()  { return 1; }
  get START_IDENT()   { return 2; }
  get IS_IDENT()      { return 4; }
  get IS_WHITESPACE() { return 8; }

  get W()   { return this.IS_WHITESPACE; }
  get I()   { return this.IS_IDENT; }
  get S()   { return this.START_IDENT; }
  get SI()  { return this.IS_IDENT | this.START_IDENT; }
  get XI()  { return this.IS_IDENT | this.IS_HEX_DIGIT; }
  get XSI() { return this.IS_IDENT | this.START_IDENT | this.IS_HEX_DIGIT; }

  get LEX_TABLE() {
    const W = this.W;
    const I = this.I;
    const S = this.S;
    const SI = this.SI;
    const XI = this.XI;
    const XSI = this.XSI;

    return [
     //                                     TAB LF      FF  CR
        0,  0,  0,  0,  0,  0,  0,  0,  0,  W,  W,  0,  W,  W,  0,  0,
     //
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
     // SPC !   "   #   $   %   &   '   (   )   *   +   ,   -   .   /
        W,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  I,  0,  0,
     // 0   1   2   3   4   5   6   7   8   9   :   ;   <   =   >   ?
        XI, XI, XI, XI, XI, XI, XI, XI, XI, XI, 0,  0,  0,  0,  0,  0,
     // @   A   B   C   D   E   F   G   H   I   J   K   L   M   N   O
        0,  XSI,XSI,XSI,XSI,XSI,XSI,SI, SI, SI, SI, SI, SI, SI, SI, SI,
     // P   Q   R   S   T   U   V   W   X   Y   Z   [   \   ]   ^   _
        SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0,  S,  0,  0,  SI,
     // `   a   b   c   d   e   f   g   h   i   j   k   l   m   n   o
        0,  XSI,XSI,XSI,XSI,XSI,XSI,SI, SI, SI, SI, SI, SI, SI, SI, SI,
     // p   q   r   s   t   u   v   w   x   y   z   {   |   }   ~
        SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0,  0,  0,  0,  0,
     //
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
     //
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
     //     ¡   ¢   £   ¤   ¥   ¦   §   ¨   ©   ª   «   ¬   ­   ®   ¯
        0,  SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
     // °   ±   ²   ³   ´   µ   ¶   ·   ¸   ¹   º   »   ¼   ½   ¾   ¿
        SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
     // À   Á   Â   Ã   Ä   Å   Æ   Ç   È   É   Ê   Ë   Ì   Í   Î   Ï
        SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
     // Ð   Ñ   Ò   Ó   Ô   Õ   Ö   ×   Ø   Ù   Ú   Û   Ü   Ý   Þ   ß
        SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
     // à   á   â   ã   ä   å   æ   ç   è   é   ê   ë   ì   í   î   ï
        SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
     // ð   ñ   ò   ó   ô   õ   ö   ÷   ø   ù   ú   û   ü   ý   þ   ÿ
        SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI
  ]; }

  get HEX_VALUES() {
    return {
      "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
      "a": 10, "b": 11, "c": 12, "d": 13, "e": 14, "f": 15
    };
  }

  /**
   * @constructor
   * @param {string} aString - the string to scan
   */
  constructor(aString) {
    // preserve the string to scan
    this.mString = aString;
    // init the position
    this.mPos = 0;
    // and clobber the array of preserved positions
    this.mPreservedPos = [];
  }

  /**
   * Getter for the current scanning position in the string
   *
   * @return {number}
   */
  get currentPosition() {
    return this.mPos;
  }

  /**
   * Setter for the current scanning position in the string
   *
   * @param {number}
   */
  set currentPosition(aVal) {
    this.mPos = aVal;
  }

  /**
   * Getter for the maximum position in the string to scan
   *
   * @return {number}
   */
  get maxPosition() {
    return this.mString.length;
  }

  /**
   * Getter for the part of the string already scanned
   *
   * @return {string}
   */
  get alreadyScanned() {
    return this.mString.substr(0, this.currentPosition);
  }

  /**
   * Preserve the current position in a stack
   */
  preserveState() {
    this.mPreservedPos.push(this.mPos);
  }

  /**
   * Restore the current position from the top of a stack
   */
  restoreState() {
    if (this.mPreservedPos.length) {
      this.mPos = this.mPreservedPos.pop();
    }
  }

  /**
   * Forget the top of the position preservation stack
   */
  forgetState() {
    if (this.mPreservedPos.length) {
      this.mPreservedPos.pop();
    }
  }

  /**
   * Read a character from the string to scan. Returns a codepoint or -1.
   * Increments the scanning position
   *
   * @return {string|number}
   */
  read() {
    if (this.currentPosition < this.maxPosition) {
      const c = this.mString.charAt(this.currentPosition);
      this.currentPosition = this.currentPosition + 1;
      return c;
    }
    return -1;
  }

  /**
   * Read a character from the string to scan. Returns a codepoint or -1.
   * Does NOT increment the scanning position
   *
   * @return {string|number}
   */
  peek() {
    if (this.currentPosition < this.maxPosition)
      return this.mString.charAt(this.currentPosition);
    return -1;
  }

  /**
   * Returns true if the first char of the string argument is a hex digit
   *
   * @param {string} c - a string containing at least one character
   * @return {boolean}
   */
  isHexDigit(c) {
    var code = c.charCodeAt(0);
    return (code < 256 && (this.LEX_TABLE[code] & this.IS_HEX_DIGIT) != 0);
  }

  /**
   * Returns true if the first char of the string argument can be the start
   * of an identifier
   *
   * @param {string} c - a string containing at least one character
   * @return {boolean}
   */
  isIdentStart(c) {
    var code = c.charCodeAt(0);
    return (code >= 256 || (this.LEX_TABLE[code] & this.START_IDENT) != 0);
  }

  /**
   * Returns true if the two char arguments can be the first chars of an
   * identifier. Allows -- for user-defined identifiers.
   *
   * @param {string} aFirstChar - a string containing at least one character
   * @param {string} aSecondChar - a string containing at least one character
   * @return {boolean}
   */
  startsWithIdent(aFirstChar, aSecondChar) {
    if (aFirstChar == "-"
        && aSecondChar == "-"
        && this.currentPosition + 1 < this.maxPosition
        && this.isIdentStart(this.mString.charAt(this.currentPosition + 1)))
      return true;

    return this.isIdentStart(aFirstChar)
           || (aFirstChar == "-" && this.isIdentStart(aSecondChar));
  }

  /**
   * Returns true if the first char of the string argument can be a char
   * of an identifier after the first one
   *
   * @param {string} c - a string containing at least one character
   * @return {boolean}
   */
  isIdent(c) {
    var code = c.charCodeAt(0);
    return (code >= 256 || (this.LEX_TABLE[code] & this.IS_IDENT) != 0);
  }

  /**
   * Decrease the scanning position by 1
   */
  pushback() {
    this.currentPosition = this.currentPosition - 1;
  }

  /**
   * Scans a hexadecimal value until hexadecimal digits are found.
   *
   * @return {FESCToken}
   */
  nextHexValue() {
    var c = this.read();
    if (c == -1 || !this.isHexDigit(c))
      return new FESCToken(FESCToken.NULL_TYPE, null);
    var s = c;
    c = this.read();
    while (c != -1 && this.isHexDigit(c)) {
      s += c;
      c = this.read();
    }
    if (c != -1)
      this.pushback();
    return new FESCToken(FESCToken.HEX_TYPE, s);
  }

  /**
   * Scans a CSS escape sequence. Returns a string.
   *
   * @return {string}
   */
  gatherEscape() {
    var c = this.peek();
    if (c == -1)
      return "";
    if (this.isHexDigit(c)) {
      var code = 0;
      for (var i = 0; i < 6; i++) {
        c = this.read();
        if (this.isHexDigit(c))
          code = code * 16 + this.HEX_VALUES[c.toLowerCase()];
        else if (!this.isHexDigit(c) && !this.isWhiteSpace(c)) {
          this.pushback();
          break;
        }
        else
          break;
      }
      if (i == 6) {
        c = this.peek();
        if (this.isWhiteSpace(c))
          this.read();
      }
      return String.fromCharCode(code);
    }
    c = this.read();
    if (c != "\n")
      return c;
    return "";
  }

  /**
   * Scans an identifier. Returns a string.
   *
   * @return {string}
   */
  gatherIdent(c) {
    var s = "";
    if (c == this.CSS_ESCAPE)
      s += this.gatherEscape();
    else
      s += c;
    c = this.read();
    while (c != -1
           && (this.isIdent(c) || c == this.CSS_ESCAPE)) {
      if (c == this.CSS_ESCAPE)
        s += this.gatherEscape();
      else
        s += c;
      c = this.read();
    }
    if (c != -1)
      this.pushback();
    return s;
  }

  /**
   * Parses an identifier and returns a token
   *
   * @return {FESCToken}
   */
  parseIdent(c) {
    var value = this.gatherIdent(c);
    var nextChar = this.peek();
    if (nextChar == "(") {
      value += this.read();
      return new FESCToken(FESCToken.FUNCTION_TYPE, value);
    }
    return new FESCToken(FESCToken.IDENT_TYPE, value);
  }

  /**
   * Returns true if the first char of the string argument is a digit
   *
   * @param {string} c - a string containing at least one character
   * @return {boolean}
   */
  isDigit(c) {
    return (c >= '0') && (c <= '9');
  }

  /**
   * Parses a one-line comment already starting with // and returns a token
   *
   * @param {string} c - a character
   * @return {FESCToken}
   */
  parseOneLineComment(c) {
    let s = c;
    while ((c = this.read()) != -1) {
      if (c == "\n" || c == "\r" || c == "\f") {
        break;
      }
      s += c;
    }
    return new FESCToken(FESCToken.ONE_LINE_COMMENT_TYPE, s);
  }

  /**
   * Parses a one-line comment already starting with /* and returns a token
   *
   * @param {string} c - a character
   * @return {FESCToken}
   */
  parseComment(c) {
    var s = c;
    while ((c = this.read()) != -1) {
      s += c;
      if (c == "*") {
        c = this.read();
        if (c == -1)
          break;
        if (c == "/") {
          s += c;
          break;
        }
        this.pushback();
      }
    }
    return new FESCToken(FESCToken.COMMENT_TYPE, s);
  }

  /**
   * Parses a number or number immediately followed by a unit
   *
   * @param {string} c - a character
   * @return {FESCToken}
   */
  parseNumber(c) {
    var s = c;
    var foundDot = false;
    while ((c = this.read()) != -1) {
      if (c == ".") {
        if (foundDot)
          break;
        else {
          s += c;
          foundDot = true;
        }
      } else if (this.isDigit(c))
        s += c;
      else
        break;
    }

    if (c != -1 && this.startsWithIdent(c, this.peek())) { // DIMENSION
      var unit = this.gatherIdent(c);
      s += unit;
      return new FESCToken(FESCToken.DIMENSION_TYPE, s, unit);
    }
    else if (c == "%") {
      s += "%";
      return new FESCToken(FESCToken.PERCENTAGE_TYPE, s);
    }
    else if (c != -1)
      this.pushback();
    return new FESCToken(FESCToken.NUMBER_TYPE, s);
  }

  /**
   * Parses a string
   *
   * @param {string} c - a character
   * @return {FESCToken}
   */
  parseString(aStop) {
    var s = aStop;
    var previousChar = aStop;
    var c;
    while ((c = this.read()) != -1) {
      if (c == aStop && previousChar != this.CSS_ESCAPE) {
        s += c;
        break;
      }
      else if (c == this.CSS_ESCAPE) {
        c = this.peek();
        if (c == -1)
          break;
        else if (c == "\n" || c == "\r" || c == "\f") {
          d = c;
          c = this.read();
          // special for Opera that preserves \r\n...
          if (d == "\r") {
            c = this.peek();
            if (c == "\n")
              c = this.read();
          }
        }
        else {
          s += this.gatherEscape();
          c = this.peek();
        }
      }
      else if (c == "\n" || c == "\r" || c == "\f") {
        break;
      }
      else
        s += c;

      previousChar = c;
    }
    if (c != aStop)
      return new FESCToken(FESCToken.INCOMPLETE_STRING_TYPE, null);
    return new FESCToken(FESCToken.STRING_TYPE, s);
  }

  /**
   * Returns true if c is a whitespace
   *
   * @param {string} c - a character
   * @return {boolean}
   */
  isWhiteSpace(c) {
    var code = c.charCodeAt(0);
    return code < 256 && (this.LEX_TABLE[code] & this.IS_WHITESPACE) != 0;
  }

  /**
   * Consumes consecutive whitespaces
   *
   * @param {string} c - a character
   */
  eatWhiteSpace(c) {
    var s = c;
    while ((c = this.read()) != -1) {
      if (!this.isWhiteSpace(c))
        break;
      s += c;
    }
    if (c != -1)
      this.pushback();
    return s;
  }

  /**
   * Parses a at-keyword
   *
   * @param {string} c - a character
   * @return {FESCToken}
   */
  parseAtKeyword(c) {
    return new FESCToken(FESCToken.ATRULE_TYPE, this.gatherIdent(c));
  }

  /**
   * Get the next token
   *
   * @return {FESCToken}
   */
  nextToken() {
    var c = this.read();
    if (c == -1)
      return new FESCToken(FESCToken.NULL_TYPE, null);

    if (this.startsWithIdent(c, this.peek()))
      return this.parseIdent(c);

    if (c == '@') {
      var nextChar = this.read();
      if (nextChar != -1) {
        var followingChar = this.peek();
        this.pushback();
        if (this.startsWithIdent(nextChar, followingChar))
          return this.parseAtKeyword(c);
      }
    }

    if (c == "." || c == "+" || c == "-") {
      var nextChar = this.peek();
      if (this.isDigit(nextChar))
        return this.parseNumber(c);
      else if (nextChar == "." && c != ".") {
        firstChar = this.read();
        var secondChar = this.peek();
        this.pushback();
        if (this.isDigit(secondChar))
          return this.parseNumber(c);
      }
    }
    if (this.isDigit(c)) {
      return this.parseNumber(c);
    }

    if (c == "'" || c == '"')
      return this.parseString(c);

    if (this.isWhiteSpace(c)) {
      var s = this.eatWhiteSpace(c);
      
      return new FESCToken(FESCToken.WHITESPACE_TYPE, s);
    }

    if (c == "|" || c == "~" || c == "^" || c == "$" || c == "*") {
      var nextChar = this.read();
      if (nextChar == "=") {
        switch (c) {
          case "~" :
            return new FESCToken(FESCToken.INCLUDES_TYPE, "~=");
          case "|" :
            return new FESCToken(FESCToken.DASHMATCH_TYPE, "|=");
          case "^" :
            return new FESCToken(FESCToken.BEGINSMATCH_TYPE, "^=");
          case "$" :
            return new FESCToken(FESCToken.ENDSMATCH_TYPE, "$=");
          case "*" :
            return new FESCToken(FESCToken.CONTAINSMATCH_TYPE, "*=");
          default :
            break;
        }
      } else if (nextChar != -1)
        this.pushback();
    }

    if (c == "/" && this.peek() == "*")
      return this.parseComment(c);

    if (c == "/" && this.peek() == "/")
      return this.parseOneLineComment(c);

    return new FESCToken(FESCToken.SYMBOL_TYPE, c);
  }
}
