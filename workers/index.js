const Router = require('./router')

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

function handler(request) {
  const init = {
    headers: { 'content-type': 'application/json' },
  }
  const body = JSON.stringify({ some: 'json' })
  return new Response(body, init)
}

async function handleRequest(request) {
  const r = new Router()
  // Books
  // ListBooks
  r.get('.*/books', () => new Response('responding for /bar'))
  // GetBook
  r.get('.*/books/*', (request) => handler(request))

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
  r.get('.*/cart/*', (request) => handler(request))

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
  r.get('.*/recommendations/*', (request) => handler(request))

  // Search
  r.get('.*/search', (request) => handler(request))

  // r.get('/demos/router/foo', (request) => fetch(request)) // return the response from the origin

  r.get('/', () => new Response('Hello worker!')) // return a default message for the root route

  const resp = await r.route(request)
  return resp
}
