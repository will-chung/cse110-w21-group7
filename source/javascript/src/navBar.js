import { DateConverter } from './utils/DateConverter.js'
import { Router, ROUTES } from './utils/Router.js'
import { IndexedDBWrapper } from './indexedDB/IndexedDBWrapper.js'

document.addEventListener('DOMContentLoaded', (event) => {
  const indexNavButton = document.querySelector('.nav-index')
  const searchNavButton = document.querySelector('.nav-search')
  const dailyNavButton = document.querySelector('.nav-daily')
  const collectionNavButton = document.querySelector('.nav-collection')
  const weeklyNavButton = document.querySelector('.nav-weekly')

  const defaultNav = (route, params = new URLSearchParams()) => {
    const url = new URL(route, location.origin)
    url.search = params
    new Router(url).navigate()
  }

  /**
   * Onclick of the Index button on the NavBar navigates
   * to the Index Page
   */
  indexNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    defaultNav(ROUTES.index)
  })

  /**
   * Onclick of the Search button on the NavBar navigates
   * to the Search Page
   */
  searchNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    defaultNav(ROUTES.search)
  })

  /**
   * Onclick of the Daily Log button on the NavBar navigates
   * to the user's current daily log
   */
  dailyNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    params.append('timestamp', (new DateConverter()).timestamp)
    defaultNav(ROUTES.daily, params)
  })

  /**
   * Onclick of the Collection button on the NavBar navigates
   * to the Collection Page
   */
  collectionNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    defaultNav(ROUTES.collections)
  })

  /**
   * Onclick of the Weekly button on the NavBar navigates
   * to the user's current week page
   */
  weeklyNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    defaultNav(ROUTES.weekly)
  })
})
