const prod = false

/**
 * Routing class used to help with navigating between pages
 * for our site.
 * @author William Chung <wchung@ucsd.edu>, Noah Teshima <nteshima@ucsd.edu>
 */
class Router {
  /**
     * Constructor used to create a URL from the current page location.
     * @param {Object[]} params Rest parameter reference containing information
     * for creating the relevant route. If no argument is provided, we initialize
     * the corresponding URL with the href of the current page. Otherwise,
     * we assume the first argument is a URL reference containing the
     * URL to use for navigation.
     */
  constructor (...params) {
    switch (params.length) {
      case 0:
        this._url = new URL(window.location.href)
        break
      case 1:
        this._url = params[0]
        break
    }
  }

  /**
     * Sets the URL to use for navigation or parameter parsing.
     * @param {URL} url URL object containing the
     * URL to use for navigation.
     */
  set url (url) {
    this._url = url
  }

  /**
     * @returns {URL} URL object containing the
     * URL to use for navigation.
     */
  get url () {
    return this._url
  }

  /**
     * Subroutine of Router which changes the page's href
     * to the value of the field url
     */
  navigate () {
    window.location.href = this.toString()
  }

  /**
     * @return {String} String representation of the Router object
     */
  toString () {
    return `${this._url.origin}${this._url.pathname}${this._url.search}`
  }
}

/**
 * Constant field containing all the routes for our bullet journal.
 */
const ROUTES = {
  index: '/index.html',
  search: '/search.html',
  collections: '/collection.html',
  'collection-edit': '/collection-edit.html',
  daily: '/daily.html',
  weekly: '/weekly.html'
}
const prefix = (prod) ? '/cse110-SP21-group7' : '/source'
for (const route in ROUTES) {
  ROUTES[route] = `${prefix}${ROUTES[route]}`
}

export { Router, ROUTES }
