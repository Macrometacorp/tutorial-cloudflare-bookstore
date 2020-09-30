const Router = require('./router')
const init = require('./init')
const jsc8 = require('jsc8')
const { queries } = require('./c8qls')
const { uuid } = require('@cfworker/uuid')

const initObj = {
  headers: { 'content-type': 'application/json' },
}

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
  console.log(`-->${request.url}`)
  const splitUrl = request.url.split('/')
  let bindValue = splitUrl[splitUrl.length - 1]

  if (request.method === 'GET' && bindValue.includes('?')) {
    // has query param
    const queryParam = bindValue.split('?')[1].split('=')
    bindValue = { [queryParam[0]]: queryParam[1] }
  }

  if (request.method === 'POST') {
    bindValue = await request.json()
  }
  const { query, bindVars } = queries(c8qlKey, bindValue)
  const result = await client.executeQuery(query, bindVars)
  const body = JSON.stringify(result)
  return new Response(body, initObj)
}

async function signupHandler(request) {
  const { username, password } = await request.json()

  const myText = new TextEncoder().encode(password)

  const myDigest = await crypto.subtle.digest(
    {
      name: 'SHA-256',
    },
    myText, // The data you want to hash as an ArrayBuffer
  )
  const passwordHash = new TextDecoder('utf-8').decode(myDigest)
  const customerId = uuid()
  const { query, bindVars } = queries('signup', {
    username,
    passwordHash,
    customerId,
  })
  const result = await client.executeQuery(query, bindVars)
  const body = JSON.stringify(result)
  return new Response(body, initObj)
}

async function signinHandler(request) {
  const { username, password } = await request.json()
  const myText = new TextEncoder().encode(password)
  const myDigest = await crypto.subtle.digest(
    {
      name: 'SHA-256',
    },
    myText, // The data you want to hash as an ArrayBuffer
  )
  const passwordHash = new TextDecoder('utf-8').decode(myDigest)

  const { query, bindVars } = queries('signin', {
    username,
    passwordHash,
  })
  const result = await client.executeQuery(query, bindVars)
  const body = JSON.stringify(result)
  return new Response(body, initObj)
}

async function handleRequest(request) {
  const r = new Router()

  // init
  r.post('.*/init', (request) => initHandler(request))

  r.post('.*/signup', (request) => signupHandler(request))

  r.post('.*/signin', (request) => signinHandler(request))

  // ListBooks
  r.get('.*/books*', (request) => handler(request, 'ListBooks'))
  // GetBook
  r.get('.*/books/b[0-9]+', (request) => handler(request, 'GetBook'))

  // ListItemsInCart
  r.get('.*/cart', (request) => handler(request, 'ListItemsInCart'))
  // AddToCart
  r.post('.*/cart', (request) => handler(request, 'AddToCart'))
  // UpdateCart
  r.put('.*/cart', (request) => handler(request, 'UpdateCart'))
  // RemoveFromCart
  r.delete('.*/cart', (request) => handler(request, 'RemoveFromCart'))
  // GetCartItem
  r.get('.*/cart/c[0-9]+', (request) => handler(request, 'GetCartItem'))

  // ListOrders
  r.get('.*/orders', (request) => handler(request, 'ListOrders'))
  // Checkout
  r.post('.*/orders', (request) => handler(request, 'Checkout'))

  // GetBestSellers
  r.get('.*/bestsellers', (request) => handler(request, 'GetBestSellers'))

  // GetRecommendations
  r.get('.*/recommendations', (request) =>
    handler(request, 'GetRecommendations'),
  )
  // GetRecommendationsByBook
  r.get('.*/recommendations/r[0-9]+', (request) =>
    handler(request, 'GetRecommendationsByBook'),
  )

  // Search
  r.get('.*/search', (request) => handler(request, 'Search'))

  // r.get('/demos/router/foo', (request) => fetch(request)) // return the response from the origin

  r.get('/', () => new Response('Hello worker!')) // return a default message for the root route

  const resp = await r.route(request)
  return resp
}
