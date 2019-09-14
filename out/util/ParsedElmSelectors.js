'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ParsedElmSelectors =
/*#__PURE__*/
function () {
  function ParsedElmSelectors() {
    _classCallCheck(this, ParsedElmSelectors);

    for (var _len = arguments.length, elmSelectors = new Array(_len), _key = 0; _key < _len; _key++) {
      elmSelectors[_key] = arguments[_key];
    }

    this.elmSelectors = elmSelectors;
  }

  _createClass(ParsedElmSelectors, [{
    key: "value",
    value: function value() {
      return this.parseElmSelectors();
    }
  }, {
    key: "parseElmSelectors",
    value: function parseElmSelectors() {
      var _this = this;

      var elms = [];
      this.elmSelectors.forEach(function (elmSelector) {
        if (elmSelector) {
          elmSelector = elmSelector.trim();

          if (new RegExp(/^#(\S+)$/g).test(elmSelector)) {
            elms.push(document.getElementById(elmSelector.split('#')[1]));
          } else if (new RegExp(/^\.(\S+)$/g).test(elmSelector)) {
            _this.pushElms(elms, document.getElementsByClassName(elmSelector.split('.')[1]));
          } else if (new RegExp(/^(\S+)$/g).test(elmSelector)) {
            _this.pushElms(elms, document.getElementsByTagName(elmSelector));
          }
        }
      });
      return elms;
    }
  }, {
    key: "pushElms",
    value: function pushElms(elms, elmsToPush) {
      for (var i = 0; i < elmsToPush.length; i++) {
        elms.push(elmsToPush[i]);
      }
    }
  }]);

  return ParsedElmSelectors;
}();

module.exports = ParsedElmSelectors;
