/**
 * Routing class used to help with navigating between pages
 * for our site.
 * @author William Chung <wchung@ucsd.edu>, Noah Teshima <nteshima@ucsd.edu>
 */
class Router {
    /**
     * @param {URL} baseURL URL reference containing the
     * base URL to use for navigation. baseURL is intended to be
     * a relative path.
     * @param {URLSearchParams} URLSearchParams object containing the relevant
     * query parameters to use for navigating to the page given by
     * baseURL.
     */
    constructor(baseURL, queryParams) {
        this._baseURL = baseURL
        this._queryParams = queryParams
    }
    /**
     * Sets the baseURL for the Router.
     * @param {URL} baseURL URL object containing the
     * base URL to use for navigation. baseURL is intended to be
     * a relative path
     */
    set baseURL(baseURL) {
        this._baseURL = baseURL
    }
    
    /**
     * @returns {URL} URL object containing the
     * base URL to use for navigation. baseURL is intended to be
     * a relative path.
     */
    get baseURL() {
        return this._baseURL
    }
    
    /**
     * @param {URLSearchParams} URLSearchParams object containing the relevant
     * query parameters to use for navigating to the page given by
     * baseURL.
     */
    set queryParams(queryParams) {
        this._queryParams = queryParams
    }

    /**
     * @returns {URLSearchParams} URLSearchParams object containing
     * the key/value mappings for our query parameters.
     */
    get queryParams() {
        return this._queryParams
    }

    /**
     * @return {String} String representation of the Router object
     */
    toString() {
        return `${this._baseURL}?${this._queryParams}`
    }
}

/**
 * Constant field containing all the routes for our bullet journal.
 */
const ROUTES = {
    index: '/source/html/index.html',
    collections: '/source/html/collection.html',
    'collection-edit': '/source/html/collection-edit.html',
    daily: '/source/html/daily.html',
    weekly: '/source/html/weekly.html'
}

export { Router, ROUTES }

