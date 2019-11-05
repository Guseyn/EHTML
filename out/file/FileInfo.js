'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileInfo = function FileInfo(name, size, type, content, lastModifiedDate) {
  _classCallCheck(this, FileInfo);

  this.name = name;
  this.size = size;
  this.type = type;
  this.content = content;
  this.lastModifiedDate = lastModifiedDate;
};

module.exports = FileInfo;
