<div align="center">

![Pretty Snap](https://raw.githubusercontent.com/kangabru/pretty-snap/readme/preview.jpg)
<br/>

# [![Pretty Snap](https://raw.githubusercontent.com/kangabru/pretty-snap/readme/logo-sm.png)](https://prettysnap.app)

Awesome editing apps to make your screenshots look 🔥

</div>

## 👋 Introduction

This is the full source code [Pretty Snap](https://prettysnap.app) which includes two free editing apps:
- Pretty Annotate: Communicate ideas clearly by annotating images
- Pretty Background: Add beautiful backgrounds to images to make them pop

---

## 🍕 Develop
Get started without external APIs. Access on [localhost:1234](http://localhost:1234/).

```sh
npm install
npm start
```

Read the [`architecture.md`](architecture.md) file for detailed info about the code base and how everything works.

### (Optional) Unsplash API

<details>
  <summary>Click to expand</summary>

Pretty Snap uses the [Unsplash API](https://unsplash.com/developers) to get images and [Cloudflare Workers](https://workers.cloudflare.com/) to proxy API requests signed with an Unsplash access key.

Both service provide a generous free tier which you can use for development and production.

**Setup Unsplash:**
1. [Create an Unsplash app](https://unsplash.com/oauth/applications)
1. Copy the Unsplash `Access Key` value

*Note: Requests are limited to 50 per hour until your API key is approved for production*

**Setup a Cloudflare worker:**
1. [Create a Cloudflare worker](https://workers.cloudflare.com/)
1. Manually paste [`cloudflare/worker.js`](cloudflare/worker.js) code into the online console
1. Open the worker's settings and add this environment variable:
    |Variable Name|Value|
    |---|---|
    |`ACCESS_KEY`|*The Unsplash `Access Key` value* from the previous step|

**Test the API**
1. Open the Cloudflare worker's online console
1. Append `/api/search?query=nature` to the generated url
1. Run the request
1. A 200 response with Unsplash JSON data should display

**Use the API**
1. Copy the generated base url of your Cloudflare worker
    - e.g. `https://<prefix>.<user>.workers.dev`
1. Create a `.env` file (you can use `.env.example` as a template)
1. Set the value of `URL_API` to the worker's url
    - e.g. `URL_API=https://<prefix>.<user>.workers.dev`
1. Set the value of `DEV_USE_API` to `true` or remove it completely
1. Delete the Parcel generated `.cache` folder
1. Rebuild the app

</details>

---

## 🌍 Deploy

Pretty Snap is deployed statically and uses the Cloudflare worker as an API.

1. Deploy statically via a provider like [Netlify](https://www.netlify.com/).
1. Set the build command to `npm run build` and output directory to `dist`
1. Set the environment variable `URL_API` to the Cloudflare work base url
    - The `DEV_USE_API` variable can be ignored

### (Optional) Use the API on the same domain

<details>
  <summary>Click to expand</summary>

Cloudflare allows workers to run on the same domain even when hosted on an external server.
1. Open the Cloudflare `DNS` tab and configure DNS as follows:
    |Type|Name|Content|TTL|Proxy status|
    |:--:|:--:|:-----:|:-:|:----------:|
    |CNAME| `some-domain.com` |`<subdomain>.netlify.app`|Auto|Proxied|
    |CNAME| `www` |`some-domain.com`|Auto|Proxied|
1. Open the Cloudflare `Workers` tab and add the following route
    |Route|Worker|
    |-----|------|
    |`*some-domain.com/api*`|`<select your worker>`|

Pretty Snap should still render when visiting `some-domain.com` but XHR requests to `some-domain.com/api` will now hit the worker. You now have a server and API running on the same domain but hosted in 2 locations 🤯

</details>

---

## 🐼 Sponsors

<div align="center">

[![Panda Snap logo](https://raw.githubusercontent.com/kangabru/pretty-snap/readme/panda.jpg)](https://pandasnap.io/)

Design faster by 'snapping' images to create a personal design collection.

It's the best design orientated snipping tool - it's free too!

[🐼 Visit Panda Snap](https://pandasnap.io/)

</div>
