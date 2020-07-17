# JSON Magic 

This little tool allows you to easily make sense of JSON data. 

Click [HERE](https://dexterlabora.github.io/json-magic/) for instant demo

## Features

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
npm run
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

This project was intentionally built minimal (using CDNs), so that it could run in any environment and easily hacked.

