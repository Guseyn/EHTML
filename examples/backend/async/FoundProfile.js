const profiles = {
  'John': {
    'photo': '/../images/John.svg',
    'name': 'John',
    'email': 'john@email.com',
    'age': 27,
    'country': 'Canada',
    'profession': 'dentist'
  },
  'Amanda': {
    'photo': '/../images/Amanda.svg',
    'name': 'Amanda',
    'email': 'amanda@email.com',
    'age': 24,
    'country': 'Australia',
    'profession': 'race driver'
  }
}

const { AsyncObject } = require('@cuties/cutie')

class FoundProfile extends AsyncObject {
  constructor (name) {
    super(name)
  }

  syncCall () {
    return (name) => {
      return profiles[name] || null
    }
  }
}

module.exports = FoundProfile
