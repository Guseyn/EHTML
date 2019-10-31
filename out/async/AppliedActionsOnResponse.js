'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('@cuties/object'),
    TheSameObjectWithValue = _require.TheSameObjectWithValue;

var ParsedActions = require('./../util/ParsedActions');

var BuiltAsyncTreeByParsedActions = require('./../util/BuiltAsyncTreeByParsedActions');

var AppliedActionsOnResponse = function AppliedActionsOnResponse(tagName, resName, res, actions) {
  _classCallCheck(this, AppliedActionsOnResponse);

  var resObj = {};
  return new TheSameObjectWithValue(resObj, resName, res).after(new BuiltAsyncTreeByParsedActions(new ParsedActions(actions, tagName, resObj, resName).value()).value());
};

module.exports = AppliedActionsOnResponse;
