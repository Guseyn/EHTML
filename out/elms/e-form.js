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

var HTMLTunedElement = require('./../global-objects/HTMLTunedElement');

var _require = require('@page-libs/cutie'),
    browserified = _require.browserified;

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _browserified = browserified(require('@cuties/object')),
    CreatedOptions = _browserified.CreatedOptions;

var _browserified2 = browserified(require('@cuties/json')),
    ParsedJSON = _browserified2.ParsedJSON,
    StringifiedJSON = _browserified2.StringifiedJSON;

var ParsedElmSelectors = require('./../objects/ParsedElmSelectors');

var FileInfo = require('./../objects/FileInfo');

var EForm =
/*#__PURE__*/
function (_HTMLTunedElement) {
  _inherits(EForm, _HTMLTunedElement);

  function EForm() {
    _classCallCheck(this, EForm);

    return _possibleConstructorReturn(this, _getPrototypeOf(EForm).call(this));
  }

  _createClass(EForm, [{
    key: "attributesWithStorageVariables",
    value: function attributesWithStorageVariables() {
      return ['data-request-url', 'data-request-headers'];
    }
  }, {
    key: "supportedActions",
    value: function supportedActions() {
      return ['redirect', 'saveToLocalStorage', 'saveToMemoryStorage', 'innerHTML', 'addHTMLTo', 'applyValuesToChildNodes', 'hideElms', 'showElms', 'disableElms', 'enableElms', 'changeElmsClassName'];
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var inputs = this.getElementsByTagName('input');
      var fileInputs = this.filteredFileInputs(inputs);
      var selects = this.getElementsByTagName('select');
      var textareas = this.getElementsByTagName('textarea');
      var localStorageValues = this.getElementsByTagName('e-local-storage-value');
      var memoryStorageValues = this.getElementsByTagName('e-memory-storage-value');
      var requestButton = new ParsedElmSelectors(this.getAttribute('data-request-button-id')).value()[0];
      var requestBody = {};
      this.tuneFileInputs(fileInputs, requestButton);
      requestButton.addEventListener('click', function () {
        _this.retrievedValuesFromInputsForRequestBody(inputs, requestBody);

        _this.retrievedValuesFromSelectsForRequestBody(selects, requestBody);

        _this.retrievedValuesFromTextareasForRequestBody(textareas, requestBody);

        _this.retrievedValuesFromLocalStorageForRequestBody(localStorageValues, requestBody);

        _this.retrievedValuesFromMemoryStorageForRequestBody(memoryStorageValues, requestBody);

        _this.appliedActions(new ParsedJSON(new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', _this.getAttribute('data-request-url'), 'headers', new ParsedJSON(_this.getAttribute('data-request-headers') || '{}'), 'method', 'POST'), new StringifiedJSON(requestBody))))).call();
      });
    }
  }, {
    key: "retrievedValuesFromInputsForRequestBody",
    value: function retrievedValuesFromInputsForRequestBody(inputs, requestBody) {
      for (var index = 0; index < inputs.length; index++) {
        var input = inputs[index];

        if (!input.name) {
          throw new Error("input ".concat(input, " has no name"));
        }

        if (input.type.toLowerCase() === 'radio') {
          if (input.checked) {
            requestBody[input.name] = input.value;
          }
        } else if (input.type.toLowerCase() === 'checkbox') {
          requestBody[input.name] = input.checked;
        } else if (input.type.toLowerCase() === 'file') {
          requestBody[input.name] = input.filesInfo;
        } else {
          requestBody[input.name] = input.value;
        }
      }
    }
  }, {
    key: "retrievedValuesFromSelectsForRequestBody",
    value: function retrievedValuesFromSelectsForRequestBody(selects, requestBody) {
      for (var index = 0; index < selects.length; index++) {
        var select = selects[index];

        if (!select.name) {
          throw new Error("select ".concat(select, " has no name"));
        }

        requestBody[select.name] = select.value;
      }
    }
  }, {
    key: "retrievedValuesFromTextareasForRequestBody",
    value: function retrievedValuesFromTextareasForRequestBody(textareas, requestBody) {
      for (var index = 0; index < textareas.length; index++) {
        var textarea = textareas[index];

        if (!textarea.name) {
          throw new Error("textarea ".concat(textarea, " has no name"));
        }

        requestBody[textarea.name] = textarea.value;
      }
    }
  }, {
    key: "retrievedValuesFromLocalStorageForRequestBody",
    value: function retrievedValuesFromLocalStorageForRequestBody(localStorageValues, requestBody) {
      for (var index = 0; index < localStorageValues.length; index++) {
        var localStorageValue = localStorageValues[index];

        if (!localStorageValue.name) {
          throw new Error("localStorageValue ".concat(localStorageValue, " has no name"));
        }

        requestBody[localStorageValue.name] = localStorageValue.value();
      }
    }
  }, {
    key: "retrievedValuesFromMemoryStorageForRequestBody",
    value: function retrievedValuesFromMemoryStorageForRequestBody(memoryStorageValues, requestBody) {
      for (var index = 0; index < memoryStorageValues.length; index++) {
        var memoryStorageValue = memoryStorageValues[index];

        if (!memoryStorageValue.name) {
          throw new Error("memoryStorageValue ".concat(memoryStorageValue, " has no name"));
        }

        requestBody[memoryStorageValue.name] = memoryStorageValue.value();
      }
    }
  }, {
    key: "tuneFileInputs",
    value: function tuneFileInputs(fileInputs, requestButton) {
      for (var index = 0; index < fileInputs.length; index++) {
        this.tuneFileInput(fileInputs[index], requestButton);
      }
    }
  }, {
    key: "tuneFileInput",
    value: function tuneFileInput(fileInput, requestButton) {
      var _this2 = this;

      fileInput.addEventListener('change', function () {
        _this2.readFilesContentForRequestBody(fileInput, requestButton);
      });
    }
  }, {
    key: "readFilesContentForRequestBody",
    value: function readFilesContentForRequestBody(fileInput, requestButton) {
      fileInput.filesInfo = [];

      for (var index = 0; index < fileInput.files.length; index++) {
        this.readFileContentForRequestBody(fileInput, requestButton, index);
      }
    }
  }, {
    key: "readFileContentForRequestBody",
    value: function readFileContentForRequestBody(fileInput, requestButton, index) {
      var file = fileInput.files[index];
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadstart = function () {
        requestButton.setAttribute('disabled', true);
      };

      reader.onload = function () {
        fileInput.filesInfo[index] = new FileInfo(file.name, file.size, file.type, reader.result, file.lastModifiedDate);
        requestButton.removeAttribute('disabled');
      };

      reader.onabort = function () {
        requestButton.removeAttribute('disabled');
      };

      reader.onprogress = function () {};

      reader.onerror = function () {
        throw new Error("cound not read file ".concat(file.name));
      };
    }
  }, {
    key: "filteredFileInputs",
    value: function filteredFileInputs(inputs) {
      var fileInputs = {
        length: 0
      };

      for (var index = 0; index < inputs.length; index++) {
        if (inputs[index].type.toLowerCase() === 'file') {
          fileInputs[fileInputs.length] = inputs[index];
          fileInputs.length += 1;
        }
      }

      return fileInputs;
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['data-request-url', 'data-request-headers', 'data-request-button-id', 'data-actions'];
    }
  }]);

  return EForm;
}(HTMLTunedElement);

module.exports = EForm;
