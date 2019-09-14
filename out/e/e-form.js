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
    browserified = _require.browserified;

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _browserified = browserified(require('@cuties/object')),
    CreatedOptions = _browserified.CreatedOptions;

var _browserified2 = browserified(require('@cuties/json')),
    ParsedJSON = _browserified2.ParsedJSON,
    StringifiedJSON = _browserified2.StringifiedJSON;

var AppliedActions = require('./../async/AppliedActions');

var ParsedElmSelectors = require('./../util/ParsedElmSelectors');

var FileInfo = require('./../util/FileInfo');

var E = require('./../E');

var EForm =
/*#__PURE__*/
function (_E) {
  _inherits(EForm, _E);

  function EForm() {
    _classCallCheck(this, EForm);

    return _possibleConstructorReturn(this, _getPrototypeOf(EForm).call(this));
  }

  _createClass(EForm, [{
    key: "supportedActions",
    value: function supportedActions() {
      return ['redirect', 'saveToLocalStorage', 'saveToMemoryStorage', 'innerHTML', 'addHTMLTo', 'mapObjToElm', 'hideElms', 'showElms', 'disableElms', 'enableElms', 'changeElmsClassName'];
    }
  }, {
    key: "onRender",
    value: function onRender() {
      var _this = this;

      var inputs = this.getElementsByTagName('input');
      var fileInputs = this.filteredFileInputs(inputs);
      var selects = this.getElementsByTagName('select');
      var textareas = this.getElementsByTagName('textarea');
      var localStorageValues = this.getElementsByTagName('e-local-storage-value');
      var memoryStorageValues = this.getElementsByTagName('e-memory-storage-value');
      var requestButton = new ParsedElmSelectors(this.attr('data-request-button-id')).value()[0];
      var uploadProgressBar = new ParsedElmSelectors(this.attr('data-upload-progress-bar-id')).value()[0];
      var progressBar = new ParsedElmSelectors(this.attr('data-progress-bar-id')).value()[0];
      var requestBody = {};
      this.tuneFileInputs(fileInputs, requestButton);
      requestButton.addEventListener('click', function () {
        _this.retrievedValuesFromInputsForRequestBody(inputs, requestBody);

        _this.retrievedValuesFromSelectsForRequestBody(selects, requestBody);

        _this.retrievedValuesFromTextareasForRequestBody(textareas, requestBody);

        _this.retrievedValuesFromLocalStorageForRequestBody(localStorageValues, requestBody);

        _this.retrievedValuesFromMemoryStorageForRequestBody(memoryStorageValues, requestBody);

        new AppliedActions(_this.tagName, _this.attr('data-object'), _this.attr('data-actions'), _this.supportedActions(), new ParsedJSON(new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', _this.attr('data-request-url'), 'headers', new ParsedJSON(_this.attr('data-request-headers') || '{}'), 'method', _this.attr('data-request-method') || 'POST', 'uploadProgressEvent', uploadProgressBar ? uploadProgressBar.showProgress : function () {}, 'progressEvent', progressBar ? progressBar.showProgress : function () {}), new StringifiedJSON(requestBody))))).call();
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

      reader.onprogress = function () {// TODO
      };

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
      return ['data-request-url', 'data-request-method', 'data-request-headers', 'data-request-button-id', 'data-upload-progress-bar-id', 'data-actions'];
    }
  }]);

  return EForm;
}(E);

window.customElements.define('e-form', EForm);
module.exports = EForm;
