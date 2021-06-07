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

  indexNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    defaultNav(ROUTES.index)
  })

  searchNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    defaultNav(ROUTES.search)
  })

  dailyNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    params.append('timestamp', (new DateConverter()).timestamp)
    defaultNav(ROUTES.daily, params)
  })

  collectionNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    defaultNav(ROUTES.collections)
  })

  weeklyNavButton.addEventListener('click', (event) => {
    event.preventDefault()
    defaultNav(ROUTES.weekly)
  })
})
