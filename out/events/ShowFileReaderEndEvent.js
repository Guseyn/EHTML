'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowFileReaderEndEvent = function ShowFileReaderEndEvent(progressBar, filesRead, filesLength) {
  _classCallCheck(this, ShowFileReaderEndEvent);

  if (progressBar) {
    return function () {
      filesRead.count += 1;

      if (filesRead.count === filesLength) {
        progressBar.style.display = 'none';
      } else {
        progressBar.value = 0;
      }
    };
  }

  return function () {};
};

module.exports = ShowFileReaderEndEvent;
