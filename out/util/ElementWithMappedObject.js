'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('@page-libs/cutie'),
    AsyncObject = _require.AsyncObject;

var StringWithMappedObject = require('./StringWithMappedObject');

var ElementWithMappedObject =
/*#__PURE__*/
function () {
  function ElementWithMappedObject(element, obj, objNameAttribute) {
    _classCallCheck(this, ElementWithMappedObject);

    this.element = element;
    this.obj = obj;
    this.objNameAttribute = objNameAttribute;
  }

  _createClass(ElementWithMappedObject, [{
    key: "value",
    value: function value() {
      if (this.element) {
        var objName = this.element.getAttribute(this.objNameAttribute);

        if (!objName) {
          throw new Error("element #".concat(this.element.getAttribute('id'), " must have attribute ").concat(this.objNameAttribute, " for applying values to child nodes, so you can know what object it encapsulates"));
        }

        var OBJ = {};
        OBJ[objName] = this.obj;
        return this.mapObjToChildren(this.element, OBJ, objName);
      }

      throw new Error("element is ".concat(this.element, " in mapObjToElm"));
    }
  }, {
    key: "mapObjToChildren",
    value: function mapObjToChildren(element, obj, objName) {
      var _this = this;

      element.childNodes.forEach(function (child) {
        if (child.nodeName === 'E-FOR-EACH') {
          var list = JSON.parse(new StringWithMappedObject(child.getAttribute('data-list-to-iterate'), obj, objName).value());
          child.apply(list);
        }

        if (child.getAttribute) {
          for (var i = 0; i < child.attributes.length; i++) {
            var attrName = child.attributes[i].name;
            var attrValue = child.attributes[i].value;

            _this.commonMappingObjToChildren(child, attrName, attrValue, obj, objName);
          }
        } // TODO: apply to applied e-for-each as well


        _this.mapObjToChildren(child, obj, objName);
      });
      return element;
    }
  }, {
    key: "commonMappingObjToChildren",
    value: function commonMappingObjToChildren(child, attrName, attrValue, obj, objName) {
      if (attrName !== 'data-actions-on-response' && attrName !== 'data-list-to-iterate') {
        this.mapObjToAttribute(child, attrName, attrValue, obj, objName);

        if (attrName === 'data-text') {
          if (!this.hasParamsInAttributeToApply(child, 'data-text')) {
            this.insertTextIntoElm(child, child.getAttribute('data-text'));
            child.removeAttribute('data-text');
          }
        } else if (attrName === 'data-value') {
          if (!this.hasParamsInAttributeToApply(child, 'data-value')) {
            child.value = child.getAttribute('data-value');
            child.removeAttribute('data-value');
          }
        }
      }
    }
  }, {
    key: "insertTextIntoElm",
    value: function insertTextIntoElm(element, text) {
      var textNode = document.createTextNode(text);

      if (element.childNodes.length === 0) {
        element.appendChild(textNode);
      } else {
        element.insertBefore(textNode, element.childNodes[0]);
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
}();

module.exports = ElementWithMappedObject;
