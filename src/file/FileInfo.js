'use strict'

class FileInfo {
  constructor (name, size, type, content, lastModifiedDate) {
    this.name = name
    this.size = size
    this.type = type
    this.content = content
    this.lastModifiedDate = lastModifiedDate
  }
}

module.exports = FileInfo
