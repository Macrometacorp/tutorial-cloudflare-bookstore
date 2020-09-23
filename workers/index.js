const Router = require('./router')
const init = require('./init')
const jsc8 = require('jsc8')
const { queries } = require('./c8qls')

const client = new jsc8({
  url: 'https://abhishek.eng3.macrometa.io',
  apiKey:
    'demo.cloudflare.2lcagsrrw0DPLBI3GFpFYPVPVxJUsUhxJjNqOyOy2kErc197oD3brnhi0BUNVEvxcd6f2d',
  agent: fetch,
})

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function initHandler(request) {
  let res
  const initObj = {
    headers: { 'content-type': 'application/json' },
  }

  try {
    await init(client)
    res = { code: '200', message: 'Init successful' }
  } catch (e) {
    res = e
  } finally {
    return new Response(JSON.stringify(res), initObj)
  }
}

async function handler(request, c8qlKey) {
  const init = {
    headers: { 'content-type': 'application/json' },
  }
  const splitUrl = request.url.split('/')
  const bindValue = splitUrl[splitUrl.length - 1]
  const { query, bindVars } = queries(c8qlKey, bindValue)
  const result = await client.executeQuery(query, bindVars)
  const body = JSON.stringify(result)
  return new Response(body, init)
}

async function handleRequest(request) {
  const r = new Router()

  // init
  r.post('.*/init', (request) => initHandler(request))

  // Books
  // ListBooks
  r.get('.*/books', (request) => handler(request, 'LIST_BOOKS'))
  // GetBook
  r.get('.*/books/b[0-9]+', (request) => handler(request, 'GET_BOOK'))

  // Cart
  // ListItemsInCart
  r.get('.*/cart', (request) => handler(request))
  // AddToCart
  r.post('.*/cart', (request) => handler(request))
  // UpdateCart
  r.put('.*/cart', (request) => handler(request))
  // RemoveFromCart
  r.delete('.*/cart', (request) => handler(request))
  // GetCartItem
  r.get('.*/cart/c[0-9]+', (request) => handler(request))

  // Orders
  // ListOrders
  r.get('.*/orders', (request) => handler(request))
  // Checkout
  r.post('.*/orders', (request) => handler(request))

  // Best Sellers
  // GetBestSellers
  r.get('.*/bestsellers', (request) => handler(request))

  // Recommendations
  // GetRecommendations
  r.get('.*/recommendations', (request) => handler(request))
  // GetRecommendationsByBook
  r.get('.*/recommendations/r[0-9]+', (request) => handler(request))

  // Search
  r.get('.*/search', (request) => handler(request))

  // r.get('/demos/router/foo', (request) => fetch(request)) // return the response from the origin

  r.get('/', () => new Response('Hello worker!')) // return a default message for the root route

  const resp = await r.route(request)
  return resp
}
