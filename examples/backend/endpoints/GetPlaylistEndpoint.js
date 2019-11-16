'use strict'

const { Delayed } = require('@cuties/async')
const { Endpoint } = require('@cuties/rest')
const { EndedResponse, ResponseWithWrittenHead } = require('@cuties/http')
const { StringifiedJSON } = require('@cuties/json')
const { CreatedOptions } = require('@cuties/object')

const playlist = {
  'title': 'My playlist ♥',
  'photo': '/../images/guitar.svg',
  'songs': [
    {
      'title': 'Nantes',
      'artist': 'Beirut',
      'album': 'The Flying Club Cup',
      'link': 'https://genius.com/Beirut-nantes-lyrics'
    },
    {
      'title': 'My Kind Of Woman',
      'artist': 'Mac DeMarco',
      'album': '2',
      'link': 'https://genius.com/Mac-demarco-my-kind-of-woman-lyrics'
    },
    {
      'title': 'Black Treacle',
      'artist': 'Arctic Monkeys',
      'album': 'Suck It And See',
      'link': 'https://genius.com/Arctic-monkeys-black-treacle-lyrics'
    },
    {
      'title': 'Swing Low',
      'artist': 'The Kooks',
      'album': 'Let\'s Go Sunshine',
      'link': 'https://genius.com/The-kooks-swing-low-lyrics'
    },
    {
      'title': 'Seen It All',
      'artist': 'Jake Bugg',
      'album': 'Jake Bugg',
      'link': 'https://genius.com/Jake-bugg-seen-it-all-lyrics'
    }
  ]
}

class GetPlaylistEndpoint extends Endpoint {
  constructor (regexp, type) {
    super(regexp, type)
  }

  body (request, response) {
    return new Delayed(
      null, 650
    ).after(
      new EndedResponse(
        new ResponseWithWrittenHead(
          response, 200, 'ok',
          new CreatedOptions(
            'Content-Type', 'application/json'
          )
        ),
        new StringifiedJSON(playlist)
      )
    )
  }
}

module.exports = GetPlaylistEndpoint
