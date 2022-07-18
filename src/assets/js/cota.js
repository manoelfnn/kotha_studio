// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function (mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.defineMode("vgpp", function () {
    function words(str) {
      var obj = {}, words = str.split(" ");
      for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
      return obj;
    }

    var isOperatorChar = /[+\-*&%=<>!?|\/]/;

    function tokenBase(stream, state) {
      var ch = stream.next();
      if (ch == "#") {
          stream.skipToEnd();
          return "comment";
      }
      if (ch == '"' || ch == "'") {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      }
      if (ch == "/" && stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      }
      if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
        return null;
      }
      if (/\d/.test(ch)) {
        stream.eatWhile(/[\w\.]/);
        return "number";
      }
      if (ch == "/") {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return "comment";
        }
      }
      if (isOperatorChar.test(ch)) {
        stream.eatWhile(isOperatorChar);
        return "palavrasReservadas";
      }
      stream.eatWhile(/[\w\$_áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/);
      var cur = stream.current();
      if (window.global.palavrasReservadas.indexOf(cur.toLowerCase()) > -1) return "palavrasReservadas";
      if (window.global.funcoesDoSistema.indexOf(cur.toLowerCase()) > -1) return "funcoesSistema";
      if (window.global.funcoesDoUsuario.propertyIsEnumerable(cur.toLowerCase())) return "funcoesUsuario";
      if (window.global.variaveisGlobais.propertyIsEnumerable(cur.toLowerCase())) return "variaveisGlobais";
      return "variable";
    }
 
    function tokenString(quote) {
      return function (stream, state) {
        var escaped = false, next, end = false;
        while ((next = stream.next()) != null) {
          if (next == quote && !escaped) { end = true; break; }
          escaped = !escaped && next == "\\";
        }
        if (end || !escaped) state.tokenize = null;
        return "string";
      };
    }

    function tokenComment(stream, state) {
      var maybeEnd = false, ch;
      while (ch = stream.next()) {
        if (ch == "/" && maybeEnd) {
          state.tokenize = null;
          break;
        }
        maybeEnd = (ch == "*");
      }
      return "comment";
    }

    // Interface

    return {
      startState: function () {
        return { tokenize: null };
      },

      token: function (stream, state) {
        if (stream.eatSpace()) return null;
        var style = (state.tokenize || tokenBase)(stream, state);
        if (style == "comment" || style == "meta") return style;
        return style;
      },

      electricChars: "{}"
    };
  });

  CodeMirror.defineMIME("text/x-vgpp", "vgpp");

});
