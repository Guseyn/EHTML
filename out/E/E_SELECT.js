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

var E_SELECT =
/*#__PURE__*/
function (_E) {
  _inherits(E_SELECT, _E);

  function E_SELECT(node) {
    _classCallCheck(this, E_SELECT);

    return _possibleConstructorReturn(this, _getPrototypeOf(E_SELECT).call(this, node));
  }

  _createClass(E_SELECT, [{
    key: "activate",
    value: function activate() {
      this.replaceWithSelect();
      var value = this.node.getAttribute('value');

      for (var index = 0; index < this.node.options.length; index++) {
        var item = this.node.options.item(index);

        if (item.value === value) {
          this.node.selectedIndex = index;
          break;
        }
      }
    }
  }, {
    key: "replaceWithSelect",
    value: function replaceWithSelect() {
      var select = document.createElement('select');
      select.setAttribute('data-e-select', 'true');

      for (var i = 0; i < this.node.attributes.length; i++) {
        select.setAttribute(this.node.attributes[i].name, this.node.attributes[i].value);
      }

      while (this.node.firstChild) {
        var child = this.node.removeChild(this.node.firstChild);
        select.appendChild(child);
      }

      this.node.parentNode.replaceChild(select, this.node);
      this.node = select;
    }
  }]);

  return E_SELECT;
}(E);

module.exports = E_SELECT;
