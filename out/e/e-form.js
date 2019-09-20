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
    browserified = _require.browserified,
    as = _require.as;

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _browserified = browserified(require('@cuties/object')),
    CreatedOptions = _browserified.CreatedOptions;

var _browserified2 = browserified(require('@cuties/json')),
    ParsedJSON = _browserified2.ParsedJSON,
    StringifiedJSON = _browserified2.StringifiedJSON;

var AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse');

var EnabledElements = require('./../async/EnabledElements');

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

      var requestButton = new ParsedElmSelectors(this.getAttribute('data-request-button')).value()[0];
      var uploadProgressBar = new ParsedElmSelectors(this.getAttribute('data-upload-progress-bar')).value()[0];
      var progressBar = new ParsedElmSelectors(this.getAttribute('data-progress-bar')).value()[0];
      this.tuneFileInputs(this.filteredFileInputs(this.getElementsByTagName('input')), requestButton);

      if (requestButton) {
        requestButton.addEventListener('click', function () {
          requestButton.disabled = true;

          var requestBody = _this.requestBody();

          new ParsedJSON(new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', _this.getAttribute('data-request-url'), 'headers', new ParsedJSON(_this.getAttribute('data-request-headers') || '{}'), 'method', _this.getAttribute('data-request-method') || 'POST', 'uploadProgressEvent', _this.showProgress(uploadProgressBar), 'progressEvent', _this.showProgress(progressBar)), new StringifiedJSON(requestBody)))).as('RESPONSE').after(new EnabledElements([requestButton]).after(new AppliedActionsOnResponse(_this.tagName, _this.getAttribute('data-response-object-name'), _this.getAttribute('data-actions-on-response'), _this.supportedActions(), as('RESPONSE')))).call();
        });
      }

      this.prepareProgressBar(uploadProgressBar);
      this.prepareProgressBar(progressBar);
    }
  }, {
    key: "requestBody",
    value: function requestBody() {
      var inputs = this.getElementsByTagName('input');
      var selects = this.getElementsByTagName('select');
      var textareas = this.getElementsByTagName('textarea');
      var localStorageValues = this.getElementsByTagName('e-local-storage-value');
      var memoryStorageValues = this.getElementsByTagName('e-memory-storage-value');
      var requestBody = {};
      this.retrievedValuesFromInputsForRequestBody(inputs, requestBody);
      this.retrievedValuesFromSelectsForRequestBody(selects, requestBody);
      this.retrievedValuesFromTextareasForRequestBody(textareas, requestBody);
      this.retrievedValuesFromLocalStorageForRequestBody(localStorageValues, requestBody);
      this.retrievedValuesFromMemoryStorageForRequestBody(memoryStorageValues, requestBody);
      return requestBody;
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

      var readProgressBar = new ParsedElmSelectors(fileInput.getAttribute('data-read-progress-bar')).value()[0];
      this.prepareProgressBar(readProgressBar);
      fileInput.addEventListener('change', function () {
        _this2.readFilesContentForRequestBody(fileInput, requestButton, readProgressBar);
      });
    }
  }, {
    key: "readFilesContentForRequestBody",
    value: function readFilesContentForRequestBody(fileInput, requestButton, readProgressBar) {
      fileInput.filesInfo = [];

      for (var index = 0; index < fileInput.files.length; index++) {
        this.readFileContentForRequestBody(fileInput, requestButton, readProgressBar, index);
      }
    }
  }, {
    key: "readFileContentForRequestBody",
    value: function readFileContentForRequestBody(fileInput, requestButton, readProgressBar, index) {
      var file = fileInput.files[index];
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadstart = function () {
        if (requestButton) {
          requestButton.setAttribute('disabled', true);
        }
      };

      reader.onload = function () {
        fileInput.filesInfo[index] = new FileInfo(file.name, file.size, file.type, reader.result, file.lastModifiedDate);

        if (requestButton) {
          requestButton.removeAttribute('disabled');
        }
      };

      reader.onabort = function () {
        if (requestButton) {
          requestButton.removeAttribute('disabled');
        }
      };

      reader.onprogress = this.showProgress(readProgressBar);
      reader.onloadend = this.hideProgress(readProgressBar);

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
  }, {
    key: "prepareProgressBar",
    value: function prepareProgressBar(progressBar) {
      if (progressBar) {
        progressBar.max = 100;
        progressBar.value = 0;
        progressBar.style.display = 'none';
      }
    }
  }, {
    key: "showProgress",
    value: function showProgress(progressBar) {
      if (progressBar) {
        return function (event) {
          if (event.lengthComputable) {
            progressBar.style.display = '';
            var percentComplete = parseInt(event.loaded / event.total * 100);
            progressBar.value = percentComplete;
          }
        };
      }

      return function () {};
    }
  }, {
    key: "hideProgress",
    value: function hideProgress(progressBar) {
      if (progressBar) {
        return function () {
          progressBar.style.display = 'none';
        };
      }

      return function () {};
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['data-request-url', 'data-request-method', 'data-request-headers', 'data-request-button', 'data-upload-progress-bar', 'data-progress-bar', 'data-response-object-name', 'data-actions-on-response'];
    }
  }]);

  return EForm;
}(E);

window.customElements.define('e-form', EForm);
module.exports = EForm;
