'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('@cuties/object'),
    TheSameObjectWithValue = _require.TheSameObjectWithValue;

var ParsedActions = require('./../util/ParsedActions');

var BuiltAsyncTreeByParsedActions = require('./../util/BuiltAsyncTreeByParsedActions');

var AppliedActionsOnResponse = function AppliedActionsOnResponse(tagName, objName, obj, headersName, headers, statusCodeName, statusCode, actions) {
  _classCallCheck(this, AppliedActionsOnResponse);

  var resObj = {};
  return new TheSameObjectWithValue(resObj, objName, obj).after(new TheSameObjectWithValue(resObj, headersName, headers).after(new TheSameObjectWithValue(resObj, statusCodeName, statusCode).after(new BuiltAsyncTreeByParsedActions(new ParsedActions(actions, tagName, resObj, objName, headersName, statusCodeName).value()).value())));
};

module.exports = AppliedActionsOnResponse;
