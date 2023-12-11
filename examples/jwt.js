const crypto = require('crypto')

module.exports = {
  payloadWithExpiration: (payload, minutesFromNow) => {
    const payloadWithExpiration = Object.assign({}, payload)
    let date = new Date()
    date.setMinutes(date.getMinutes() + minutesFromNow)
    payloadWithExpiration.exp = date.getTime()
    return payloadWithExpiration
  },

  base64UrlEncodeJSON: (json) => {
    return Buffer.from(
      JSON.stringify(json)
    ).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  },

  generateSignature: (str, secret) => {
    return crypto
      .createHmac('sha256', secret)
      .update(str)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }
}
