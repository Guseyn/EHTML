'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringWithMappedObjectAndAppliedVariables = require('./../util/StringWithMappedObjectAndAppliedVariables');

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
      if (this.obj) {
        var objName = this.element.getAttribute(this.objNameAttribute);

        if (!objName) {
          throw new Error("element #".concat(this.element.getAttribute('id'), " must have attribute ").concat(this.objNameAttribute, " for applying values to child nodes, so you can know what object it encapsulates"));
        }

        var obj = {};
        obj[objName] = this.obj;
        this.mapObjToChildren(this.element, obj, objName);
      } else {
        this.mapObjToChildren(this.element);
      }

      return this.element;
    }
  }, {
    key: "mapObjToChildren",
    value: function mapObjToChildren(element, obj, objName) {
      var _this = this;

      element.childNodes.forEach(function (child) {
        if (child.getAttribute) {
          for (var i = 0; i < child.attributes.length; i++) {
            var attrName = child.attributes[i].name;
            var attrValue = child.attributes[i].value;

            _this.mapObjToAttribute(child, attrName, attrValue, obj, objName);
          }
        }

        _this.mapObjToChildren(child, obj, objName);

        if (_this.isEForEach(child)) {
          child.activate(obj, _this.objNameAttribute);
        }
      });
    }
  }, {
    key: "mapObjToAttribute",
    value: function mapObjToAttribute(child, attrName, attrValue, obj, objName) {
      if (this.isForApplying(attrName)) {
        child.setAttribute(attrName, new StringWithMappedObjectAndAppliedVariables(child.getAttribute(attrName), obj, objName).value());

        if (attrName === 'data-text') {
          this.handleDataTextAttribute(child);
        } else if (attrName === 'data-value') {
          this.handleDataValueAttribute(child);
        }
      }
    }
  }, {
    key: "handleDataTextAttribute",
    value: function handleDataTextAttribute(element) {
      if (!this.hasParamsInAttributeToApply(element, 'data-text')) {
        this.insertTextIntoElm(element, element.getAttribute('data-text'));
        element.removeAttribute('data-text');
      }
    }
  }, {
    key: "handleDataValueAttribute",
    value: function handleDataValueAttribute(element) {
      if (!this.hasParamsInAttributeToApply(element, 'data-value')) {
        element.value = element.getAttribute('data-value');
        element.removeAttribute('data-value');
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
    key: "hasParamsInAttributeToApply",
    value: function hasParamsInAttributeToApply(element, attrName) {
      return /\$\{([^{}\s]+)\}/g.test(element.getAttribute(attrName));
    }
  }, {
    key: "isEForEach",
    value: function isEForEach(element) {
      return element.nodeName.toLowerCase() === 'template' && element.getAttribute('is').toLowerCase() === 'e-for-each';
    }
  }, {
    key: "isForApplying",
    value: function isForApplying(attrName) {
      var attributesForNotApplying = ['data-actions-on-response', 'data-list-to-iterate'];
      return attributesForNotApplying.indexOf(attrName) === -1;
    }
  }]);

  return ElementWithMappedObject;
}();

module.exports = ElementWithMappedObject;
