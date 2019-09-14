'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('@cuties/object'),
    TheSameObjectWithValue = _require.TheSameObjectWithValue;

var Actions = require('./../util/Actions');

var AppliedActions = function AppliedActions(tagName, objName, actions, supportedActions, obj) {
  _classCallCheck(this, AppliedActions);

  var OBJ = {};
  return new TheSameObjectWithValue(OBJ, objName, obj).after(new Actions(tagName, actions, supportedActions).asAsyncTree(OBJ));
};

module.exports = AppliedActions;
