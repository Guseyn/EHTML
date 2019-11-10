'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./../string/exports'),
    StringWithMappedObjectAndAppliedVariables = _require.StringWithMappedObjectAndAppliedVariables;

var ElementWithUpdatedAttributesWithVariablesAndMappedObject = require('./ElementWithUpdatedAttributesWithVariablesAndMappedObject');

var DocumentFragmentWithAttributes = require('./DocumentFragmentWithAttributes');

var ElementWithMappedObjectAndAppliedVariables =
/*#__PURE__*/
function () {
  function ElementWithMappedObjectAndAppliedVariables(element, obj, objNameAttribute) {
    _classCallCheck(this, ElementWithMappedObjectAndAppliedVariables);

    this.element = element;
    this.obj = obj;
    this.objNameAttribute = objNameAttribute;
  }

  _createClass(ElementWithMappedObjectAndAppliedVariables, [{
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
        _this.mapObjToChildren(new ElementWithUpdatedAttributesWithVariablesAndMappedObject(child, obj, objName).value(), obj, objName);

        if (_this.isEForEach(child)) {
          _this.activateEForEach(child, obj, objName, _this.objNameAttribute);
        } else if (_this.isEIf(child)) {
          _this.activateEIf(child, obj, objName, _this.objNameAttribute);
        }
      });
    }
  }, {
    key: "isEForEach",
    value: function isEForEach(element) {
      return element.nodeName.toLowerCase() === 'template' && element.getAttribute('is').toLowerCase() === 'e-for-each';
    }
  }, {
    key: "isEIf",
    value: function isEIf(element) {
      return element.nodeName.toLowerCase() === 'template' && element.getAttribute('is').toLowerCase() === 'e-if';
    }
  }, {
    key: "activateEForEach",
    value: function activateEForEach(element, obj, objName, objNameAttribute) {
      var _this2 = this;

      var list = JSON.parse(new StringWithMappedObjectAndAppliedVariables(element.getAttribute('data-list-to-iterate'), obj, objName).value());
      var fragment = new DocumentFragmentWithAttributes(document.createDocumentFragment(), [{
        name: objNameAttribute,
        value: objName
      }]);
      list.forEach(function (item, index) {
        item.index = index + 1;
        var itemFragment = new DocumentFragmentWithAttributes(element.content.cloneNode(true), _this2.itemFragmentAttributesForEForEach(element, objNameAttribute, objName));
        fragment.appendChild(new ElementWithMappedObjectAndAppliedVariables(itemFragment, item, 'data-item-name').value());
      });
      element.parentNode.replaceChild(new ElementWithMappedObjectAndAppliedVariables(fragment, obj[objName], objNameAttribute).value(), element);
    }
  }, {
    key: "itemFragmentAttributesForEForEach",
    value: function itemFragmentAttributesForEForEach(element, objNameAttribute, objName) {
      var attrs = [];

      for (var i = 0; i < element.attributes.length; i++) {
        attrs.push({
          name: element.attributes[i].name,
          value: element.attributes[i].value
        });
      }

      attrs.push({
        name: objNameAttribute,
        value: objName
      });
      return attrs;
    }
  }, {
    key: "activateEIf",
    value: function activateEIf(element, obj, objName, objNameAttribute) {
      var toDisplay = new StringWithMappedObjectAndAppliedVariables(element.getAttribute('data-condition-to-display'), obj, objName).value();

      if (toDisplay === 'true') {
        var fragment = new DocumentFragmentWithAttributes(element.content.cloneNode(true), [{
          name: objNameAttribute,
          value: objName
        }]);
        element.parentNode.replaceChild(new ElementWithMappedObjectAndAppliedVariables(fragment, obj[objName], objNameAttribute).value(), element);
      }
    }
  }]);

  return ElementWithMappedObjectAndAppliedVariables;
}();

module.exports = ElementWithMappedObjectAndAppliedVariables;
