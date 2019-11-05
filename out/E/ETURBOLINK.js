'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var E = require('./E');

var _require = require('./../async-location/exports'),
    TurboRedirected = _require.TurboRedirected;

var _require2 = require('./../async-json/exports'),
    ParsedJSON = _require2.ParsedJSON;

var ETURBOLINK =
/*#__PURE__*/
function (_E) {
  _inherits(ETURBOLINK, _E);

  function ETURBOLINK(node) {
    _classCallCheck(this, ETURBOLINK);

    return _possibleConstructorReturn(this, _getPrototypeOf(ETURBOLINK).call(this, node));
  }

  _createClass(ETURBOLINK, [{
    key: "activate",
    value: function activate() {
      var _this = this;

      this.replaceWithLink();
      this.node.addEventListener('click', function () {
        new TurboRedirected(_this.node.getAttribute('data-href'), new ParsedJSON(_this.node.getAttribute('data-headers') || '{}'), {
          ajaxFavicon: _this.node.getAttribute('data-ajax-favicon'),
          progressBarClassName: _this.node.getAttribute('data-with-progress-bar'),
          progressBarPlace: _this.node.getAttribute('data-progress-bar-place')
        }).call();
      });
    }
  }, {
    key: "replaceWithLink",
    value: function replaceWithLink() {
      var link = document.createElement('a');
      link.setAttribute('data-e-turbolink', 'true');

      for (var i = 0; i < this.node.attributes.length; i++) {
        link.setAttribute(this.node.attributes[i].name, this.node.attributes[i].value);
      }

      while (this.node.firstChild) {
        var child = this.node.removeChild(this.node.firstChild);
        link.appendChild(child);
      }

      this.node.parentNode.replaceChild(link, this.node);
      this.node = link;
    }
  }]);

  return ETURBOLINK;
}(E);

module.exports = ETURBOLINK;
