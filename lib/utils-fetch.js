/* global XMLHttpRequest */
var utils = {}

utils.defaultRequest = function (method, requestUrl, headers, content, callback, options) {
  options = options || {}

  var withCredentials = true

  if ('withCredentials' in options) {
    withCredentials = options.withCredentials
  }

  // support require module compatible function call
  if (typeof method === 'object') {
    callback = requestUrl
    requestUrl = method.url
    headers = method.headers
    content = method.body
    method = method.method
    withCredentials = 'withCredentials' in method ? method.withCredentials : true
  }

  return fetch(requestUrl, {
    body: content,
    credentials: withCredentials ? 'include' : 'omit',
    headers: headers,
    method: method
  })
  .then(function (response) {
    return response.text().then(function (body) {
      return Promise.resolve(response, body)
    })
  })
  .then(function (response, body) {
    var headerKeys = response.headers.keys()
    var resHeaders = {}
    var iter = false
    do {
      iter = headerKeys.next()
      resHeaders[iter.value.toLowerCase()] = response.headers.get(iter.value)
    } while(!iter.done)

    callback && callback(response.status, resHeaders, body)

    return resolve({
      statusCode: response.status,
      headers: resHeaders,
      content: body
    })
  })
}

utils.corsProxyRequest = function (proxyUrl, method, requestUrl, headers, content, callback) {
  var url = proxyUrl + '?url=' + encodeURIComponent(requestUrl)

  return utils.defaultRequest(method, url, headers, content, callback)
}

utils.mixin = function (rdf) {
  rdf.defaultRequest = utils.defaultRequest
  rdf.corsProxyRequest = utils.corsProxyRequest
}

module.exports = utils.mixin
