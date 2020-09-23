const Router = require('./router')
const jsc8 = require('jsc8')
const { queries } = require('./c8qls')

const client = new jsc8({
  url: 'https://abhishek.eng3.macrometa.io',
  apiKey:
    'demo.abhishekcloudflare.aVp4jskYhpZXaxLUoE5ktj5CT0dUzI3YYQC87FRwUlwMcFqLWsFK36qrzW5bIfBD93c189',
  agent: fetch,
})

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handler(request, c8qlKey) {
  const init = {
    headers: { 'content-type': 'application/json' },
  }
  const result = await client.executeQuery(queries[c8qlKey]())
  const body = JSON.stringify(result)
  return new Response(body, init)
}

async function handleRequest(request) {
  const r = new Router()
  // Books
  // ListBooks
  r.get('.*/books', () => handler(request, "LIST_BOOKS"))
  // GetBook
  r.get('.*/books/[0-9]+', (request) => handler(request, 'GET_BOOK'))

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
  r.get('.*/cart/[0-9]+', (request) => handler(request))

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
  r.get('.*/recommendations/[0-9]+', (request) => handler(request))

  // Search
  r.get('.*/search', (request) => handler(request))

  // r.get('/demos/router/foo', (request) => fetch(request)) // return the response from the origin

  r.get('/', () => new Response('Hello worker!')) // return a default message for the root route

  const resp = await r.route(request)
  return resp
}
