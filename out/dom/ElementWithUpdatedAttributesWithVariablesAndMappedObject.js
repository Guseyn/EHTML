'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./../string/exports'),
    StringWithMappedObjectAndAppliedVariables = _require.StringWithMappedObjectAndAppliedVariables;

var attributesForNotApplying = ['data-list-to-iterate', 'data-condition-to-display'];

var ElementWithUpdatedAttributesWithVariablesAndMappedObject =
/*#__PURE__*/
function () {
  function ElementWithUpdatedAttributesWithVariablesAndMappedObject(element, obj, objName) {
    _classCallCheck(this, ElementWithUpdatedAttributesWithVariablesAndMappedObject);

    this.element = element;
    this.obj = obj;
    this.objName = objName;
  }

  _createClass(ElementWithUpdatedAttributesWithVariablesAndMappedObject, [{
    key: "value",
    value: function value() {
      if (this.element.getAttribute) {
        for (var i = 0; i < this.element.attributes.length; i++) {
          var attrName = this.element.attributes[i].name;
          var attrValue = this.element.attributes[i].value;

          if (this.isForApplying(this.element, attrName)) {
            this.element.setAttribute(attrName, new StringWithMappedObjectAndAppliedVariables(attrValue, this.obj, this.objName).value());
            this.handleDataTextAndValueAttributes(this.element, attrName);
          } else {
            this.handleDataTextAndValueAttributes(this.element, attrName);
          }
        }
      }

      return this.element;
    }
  }, {
    key: "handleDataTextAndValueAttributes",
    value: function handleDataTextAndValueAttributes(element, attrName) {
      if (attrName === 'data-text') {
        this.handleDataTextAttribute(this.element);
      } else if (attrName === 'data-value') {
        this.handleDataValueAttribute(this.element);
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
      return /\$\{([^${}]+)\}/g.test(element.getAttribute(attrName));
    }
  }, {
    key: "isForApplying",
    value: function isForApplying(element, attrName) {
      return attributesForNotApplying.indexOf(attrName) === -1 && this.hasParamsInAttributeToApply(element, attrName);
    }
  }]);

  return ElementWithUpdatedAttributesWithVariablesAndMappedObject;
}();

module.exports = ElementWithUpdatedAttributesWithVariablesAndMappedObject;
