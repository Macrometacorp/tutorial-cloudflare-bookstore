# Installing workers CLI

There are multiple ways to install the workers CLI. Official docs say it to install via [npm](https://developers.cloudflare.com/workers/learning/getting-started#2-install-the-workers-cli) or [cargo](https://github.com/cloudflare/wrangler#install-with-cargo).
Additionally the binary can also be installed manually. Details of which can be found [here](https://developer.aliyun.com/mirror/npm/package/@granjef3/wrangler) under the `Manual Install` section - I personally have the binaries.

It is advisable to have `npm` installed via `nvm` to avoid getting into issues when installing global packages. Additional details can be found in their [github repo](https://github.com/cloudflare/wrangler#install-with-npm).


# Configuring the project for deployment

## Obtaining your API token
We will need the API token to be able to configure the CLI. Please contact the Ops team for the token, or create your own by following the docs [here](https://developers.cloudflare.com/workers/learning/getting-started#6b-obtaining-your-api-token-or-global-api-key)

## Configuring Wrangler with your credentials
Run `wrangler config` and enter the above API token when asked for. More details can be found [here](https://developers.cloudflare.com/workers/learning/getting-started#6c-configuring-wrangler-with-your-credentials)

## Configuring your project
`wrangler.toml` already has the configurations. This demo is deployed in 3 workers to be on the safer side. We just need to change the `name` in `wrangler.toml` file to publish to these workers.
Workers' name include:
1. qa-bookstore-1
2. qa-bookstore-2
3. qa-bookstore-3

`vars` provides the environment variable we use in the workers itself. They include:
1. `DC_LIST`: for stream app init
2. `C8_URL`: C8 federation URL
3. `C8_API_KEY`: API key of the tenant being used


# Publishing your project
Make sure to run `npm i` on the project's root to install the necessary dependencies.

## Building the UI
If there are changes to the UI code then first run `npm run build` to make the UI build, else you can directly proceed with publishing.

## Publishing
Run `wrangler publish` and it will deploy your worker along with the static files used by the UI.

# Initialising the collections and streamapp
Once the worker is deployed, execute the below curl
```
curl 'https://qa-bookstore-1.macrometadev.workers.dev/api/init'   -H 'authority: qa-bookstore-1.macrometadev.workers.dev'   -H 'sec-ch-ua: "Chromium";v="86", "\"Not\\A;Brand";v="99", "Google Chrome";v="86"'   -H 'x-customer-id: null'   -H 'sec-ch-ua-mobile: ?0'   -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'   -H 'content-type: text/plain;charset=UTF-8'   -H 'accept: */*'   -H 'origin: https://qa-bookstore-1.macrometadev.workers.dev'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://qa-bookstore-1.macrometadev.workers.dev/signup'   -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8'   -H 'cookie: __cfduid=de7d15f3918fe96a07cf5cedffdecba081601555750'   --data-binary '{}'   --compressed
```
This will create all the collections and dummy data for you.
> Note: This will only populate if the collection or stream app is not already present. If it does it wont create the dummy data, even if the collection is empty. So best to delete the collection if you want it to be populated by the curl.

Now login to the tenant and activate the stream app.