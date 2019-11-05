'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DocumentFragmentWithAttributes = function DocumentFragmentWithAttributes(fragment, attributes) {
  _classCallCheck(this, DocumentFragmentWithAttributes);

  fragment = fragment || document.createDocumentFragment();
  fragment.attributes = attributes || [];

  fragment.setAttribute = function (name, value) {
    var isSet = false;

    for (var i = 0; i < fragment.attributes.length; i++) {
      if (fragment.attributes[i].name === name) {
        fragment.attributes[i].value = value;
        isSet = true;
        break;
      }
    }

    if (!isSet) {
      fragment.attributes.push({
        name: name,
        value: value
      });
    }
  };

  fragment.getAttribute = function (name) {
    for (var i = 0; i < fragment.attributes.length; i++) {
      if (fragment.attributes[i].name === name) {
        return fragment.attributes[i].value;
      }
    }

    return null;
  };

  return fragment;
};

module.exports = DocumentFragmentWithAttributes;
