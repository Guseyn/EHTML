'use strict'

class ShowFileReaderEndEvent {
  constructor (progressBar, filesRead, filesLength) {
    if (progressBar) {
      return () => {
        filesRead.count += 1
        if (filesRead.count === filesLength) {
          progressBar.style.display = 'none'
        } else {
          progressBar.value = 0
        }
      }
    }
    return () => {}
  }
}

module.exports = ShowFileReaderEndEvent
