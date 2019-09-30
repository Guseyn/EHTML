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

var _require = require('@page-libs/cutie'),
    AsyncObject = _require.AsyncObject;

var StringWithMappedObject = require('./../util/StringWithMappedObject');

var ElementWithMappedObject =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(ElementWithMappedObject, _AsyncObject);

  function ElementWithMappedObject(element, obj, objName) {
    _classCallCheck(this, ElementWithMappedObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(ElementWithMappedObject).call(this, element, obj, objName));
  }

  _createClass(ElementWithMappedObject, [{
    key: "syncCall",
    value: function syncCall() {
      var _this = this;

      return function (element, obj, objName) {
        if (element) {
          var _objName = element.getAttribute('data-response-object-name');

          if (!_objName) {
            throw new Error("elm #".concat(element.getAttribute('id'), " must have attribute data-response-object-name for applying values to child nodes, so you can know what object it encapsulates"));
          }

          var OBJ = {};
          OBJ[_objName] = obj;
          return _this.mapObjToChildren(element, OBJ, _objName);
        }

        throw new Error("element is ".concat(element, " in mapObjToElm"));
      };
    }
  }, {
    key: "mapObjToChildren",
    value: function mapObjToChildren(element, obj, objName) {
      var _this2 = this;

      element.childNodes.forEach(function (child) {
        if (child.getAttribute) {
          for (var i = 0; i < child.attributes.length; i++) {
            var attrName = child.attributes[i].name;
            var attrValue = child.attributes[i].value;

            if (attrName !== 'data-actions-on-response') {
              _this2.mapObjToAttribute(child, attrName, attrValue, obj, objName);

              if (attrName === 'data-text') {
                if (!_this2.hasParamsInAttributeToApply(child, 'data-text')) {
                  _this2.insertTextIntoElm(child, child.getAttribute('data-text'));

                  child.removeAttribute('data-text');
                }
              } else if (attrName === 'data-value') {
                if (!_this2.hasParamsInAttributeToApply(child, 'data-value')) {
                  child.value = child.getAttribute('data-value');
                  child.removeAttribute('data-value');
                }
              }
            }
          }

          _this2.mapObjToChildren(child, obj, objName);
        }
      });
      return element;
    }
  }, {
    key: "insertTextIntoElm",
    value: function insertTextIntoElm(elm, text) {
      var textNode = document.createTextNode(text);

      if (elm.childNodes.length === 0) {
        elm.appendChild(textNode);
      } else {
        elm.insertBefore(textNode, elm.childNodes[0]);
      }
    }
  }, {
    key: "mapObjToAttribute",
    value: function mapObjToAttribute(element, attrName, attrValue, obj, objName) {
      element.setAttribute(attrName, new StringWithMappedObject(element.getAttribute(attrName), obj, objName).value());
    }
  }, {
    key: "hasParamsInAttributeToApply",
    value: function hasParamsInAttributeToApply(element, attrName) {
      return /\$\{([^{}\s]+)\}/g.test(element.getAttribute(attrName));
    }
  }]);

  return ElementWithMappedObject;
}(AsyncObject);

module.exports = ElementWithMappedObject;
