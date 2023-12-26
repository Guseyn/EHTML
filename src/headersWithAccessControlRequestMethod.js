module.exports = (headers, method) => {
  headers['Access-Control-Request-Method'] = method || 'GET'
  return headers
}