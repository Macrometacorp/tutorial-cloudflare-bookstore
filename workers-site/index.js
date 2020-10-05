import {
  getAssetFromKV,
  mapRequestToAsset,
} from "@cloudflare/kv-asset-handler";
const Router = require("./router");
const init = require("./init");
const jsc8 = require("jsc8");
const { queries } = require("./c8qls");
const { uuid } = require("@cfworker/uuid");
/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */

// ABHISHEK
const DEBUG = true;

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        })
      );
    }
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});

async function handleAssetEvent(event) {
  const url = new URL(event.request.url);
  let options = {};

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      };
    }
    return await getAssetFromKV(event, options);
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: (req) =>
            new Request(`${new URL(req.url).origin}/404.html`, req),
        });

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        });
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 });
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return (request) => {
    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request);
    let url = new URL(defaultAssetKey.url);

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, "/");

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey);
  };
}

////////////////////

const CUSTOMER_ID_HEADER = "x-customer-id";

const optionsObj = {
  headers: {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  },
};

const client = new jsc8({
  url: "https://abhishek.eng3.macrometa.io",
  apiKey:
    "demo.cloudflare.2lcagsrrw0DPLBI3GFpFYPVPVxJUsUhxJjNqOyOy2kErc197oD3brnhi0BUNVEvxcd6f2d",
  agent: fetch,
});

const getLastPathParam = (request) => {
  const splitUrl = request.url.split("/");
  return splitUrl[splitUrl.length - 1];
};

const executeQuery = async (c8qlKey, bindValue) => {
  const { query, bindVars } = queries(c8qlKey, bindValue);
  let result;
  try {
    result = await client.executeQuery(query, bindVars);
  } catch (err) {
    result = err;
  }
  return result;
};

const getCustomerId = (request) => request.headers.get(CUSTOMER_ID_HEADER);

async function initHandler(request) {
  let res;

  try {
    await init(client);
    res = { code: "200", message: "Init successful" };
  } catch (e) {
    res = e;
  } finally {
    return new Response(JSON.stringify(res), optionsObj);
  }
}

async function booksHandler(request, c8qlKey) {
  let bindValue = getLastPathParam(request);
  if (c8qlKey === "ListBooks" && bindValue.includes("?category=")) {
    const queryParam = bindValue.split("?")[1].split("=");
    bindValue = { [queryParam[0]]: queryParam[1] };
  }
  const result = await executeQuery(c8qlKey, bindValue);
  const body = JSON.stringify(result);
  return new Response(body, optionsObj);
}

async function cartHandler(request, c8qlKey) {
  const customerId = getCustomerId(request);
  // ABHISHEK: re-route to signup/signin?
  let body = { error: true, code: 400, message: "Customer Id not provided" };
  if (customerId) {
    let bindValue = { customerId };
    let requestBody;
    if (request.method !== "GET") {
      requestBody = await request.json();
      bindValue = { ...bindValue, ...requestBody };
    } else if (c8qlKey === "GetCartItem") {
      bindValue = { ...bindValue, bookId: getLastPathParam(request) };
    }
    body = await executeQuery(c8qlKey, bindValue);
  }
  return new Response(JSON.stringify(body), optionsObj);
}

async function ordersHandler(request, c8qlKey) {
  const customerId = getCustomerId(request);
  let body = { error: true, code: 400, message: "Customer Id not provided" };
  if (customerId) {
    let bindValue = { customerId };
    if (c8qlKey === "Checkout") {
      // ABHISHEK: aws has books[] also.
      // I don't see the point as all items in the cart have to be moved
      bindValue = { ...bindValue, orderId: uuid(), orderDate: Date.now() };
    }
    body = await executeQuery(c8qlKey, bindValue);
  }
  return new Response(JSON.stringify(body), optionsObj);
}

async function bestSellersHandler(request, c8qlKey) {}

async function recommendationsHandler(request, c8qlKey) {}

async function searchHandler(request, c8qlKey) {}

async function signupHandler(request) {
  const { username, password } = await request.json();

  const encodedPassword = new TextEncoder().encode(password);

  const digestedPassword = await crypto.subtle.digest(
    {
      name: "SHA-256",
    },
    encodedPassword // The data you want to hash as an ArrayBuffer
  );
  const passwordHash = new TextDecoder("utf-8").decode(digestedPassword);
  const customerId = uuid();
  const result = await executeQuery("signup", {
    username,
    passwordHash,
    customerId,
  });
  const body = JSON.stringify(result);
  return new Response(body, optionsObj);
}

async function signinHandler(request) {
  const { username, password } = await request.json();
  const encodedPassword = new TextEncoder().encode(password);
  const digestedPassword = await crypto.subtle.digest(
    {
      name: "SHA-256",
    },
    encodedPassword // The data you want to hash as an ArrayBuffer
  );
  const passwordHash = new TextDecoder("utf-8").decode(digestedPassword);
  const result = await executeQuery("signin", {
    username,
    passwordHash,
  });
  let message = "User not found";
  let status = 404;
  if (result.length) {
    message = result;
    status = 200;
  }
  const body = JSON.stringify({ message });
  return new Response(body, { status, ...optionsObj });
}

async function whoAmIHandler(request) {
  const customerId = getCustomerId(request);
  let message = "Not logged In";
  let status = 500;
  if (customerId !== "null" && customerId) {
    message = customerId;
    status = 200;
  }
  return new Response(JSON.stringify({ message }), { status, ...optionsObj });
}

async function handleEvent(event) {
  const { request } = event;
  const r = new Router();

  r.post(".*/init", (request) => initHandler(request));

  r.get(".*/whoami", (request) => whoAmIHandler(request));

  r.post(".*/signup", (request) => signupHandler(request));

  r.post(".*/signin", (request) => signinHandler(request));

  r.get(".*/books*", (request) => booksHandler(request, "ListBooks"));
  r.get(".*/books/b[0-9]+", (request) => booksHandler(request, "GetBook"));

  r.get(".*/cart", (request) => cartHandler(request, "ListItemsInCart"));
  r.get(".*/cart/b[0-9]+", (request) => cartHandler(request, "GetCartItem"));
  r.post(".*/cart", (request) => cartHandler(request, "AddToCart"));
  r.put(".*/cart", (request) => cartHandler(request, "UpdateCart"));
  r.delete(".*/cart", (request) => cartHandler(request, "RemoveFromCart"));

  r.get(".*/orders", (request) => ordersHandler(request, "ListOrders"));
  // add all books from the Cart table to the Orders table
  // remove all entries from the Cart table for the requested customer ID
  r.post(".*/orders", (request) => ordersHandler(request, "Checkout"));

  r.get(".*/bestsellers", (request) =>
    bestSellersHandler(request, "GetBestSellers")
  );

  r.get(".*/recommendations", (request) =>
    recommendationsHandler(request, "GetRecommendations")
  );
  r.get(".*/recommendations/r[0-9]+", (request) =>
    recommendationsHandler(request, "GetRecommendationsByBook")
  );

  r.get(".*/search", (request) => searchHandler(request, "Search"));

  // ABHISHEK: remove this later
  r.get("/test", () => new Response(`Hello worker!`)); // return a default message for the root route

  r.get("/.*", () => handleAssetEvent(event));

  const resp = await r.route(request);
  return resp;
}
