# JSON Magic 

This little tool allows you to easily make sense of JSON data. 

## Demos

- [PWA - Full Features](https://meraki-micro-services.ew.r.appspot.com/)

- [Simple HTML prototype version](https://dexterlabora.github.io/json-magic/)


## Features

- Transform JSON data on the fly
- Generates nested HTML tables
- Export data in CSV/JSON/HTML

### Vue Web 
App that can run using just an index.html file. 

### Node Server 

If the index.html file is run via the server, it can be sent data dynamically.

- Web App host
- API Proxy Server
- Websocket Server
- Webhook Server

## Install 

```
git clone https://github.com/dexterlabora/json-magic.git
cd json-magic/node
npm install
npm run start
```


Running

```

 Application Started 

APP address on      http://localhost:3000
Webhook API address    http://localhost:3000/webhook
Websocket address   ws://localhost:3000

```

#### Inputs
- Raw text (copy/paste)
- File input
- 3rd party API request (requires proxy server)
- websocket (requires websocket server)

#### Outputs
- JSONata Query tool
- Nested HTML table output
- Various download options


### Built With

- Vue
- Vuetify
- JSONata
- tableify
- vue-prism

This project was intentionally built minimal using CDNs for a few components.

# JSON Magic - PWA w/ OpenAPI Tools

This is an advanced version of this tool, which is a deployable Progressive Web App. It includes it's own backend Express server and can be easily deployed to Google App Engine.

[Read More](nuxt/README.md)