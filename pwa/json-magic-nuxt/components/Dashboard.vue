<template>
  <v-container class="fill-height" fluid>
    <!-- OAS Dialog -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="oasDialog" max-width="700px" height="700px">
          <input-oas @close="oasDialog = false" @data="onOasData($event)" />
        </v-dialog>
      </v-row>
    </template>

    <!-- Websocket Dialog -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="wsDialog" max-width="700px">
          <input-websocket @close="wsDialog = false" @data="onWebsocketData($event)" />
        </v-dialog>
      </v-row>
    </template>

    <!-- User API Dialog -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="apiDialog" max-width="700px">
          <input-api @close="apiDialog = false" @data="onApiData($event)" />
        </v-dialog>
      </v-row>
    </template>

    <splitpanes class="default-theme">
      <pane min-size="5" size="20">
        <!-- JSON Input  -->
        <v-card width="100%" class="m-2">
          <v-toolbar dense>
            <v-toolbar-title>Input</v-toolbar-title>
            <v-spacer />

            <v-spacer />
            <v-btn icon dark @click="oasDialog=true">
              <v-icon>mdi-api</v-icon>
            </v-btn>
            <v-btn icon dark @click="apiDialog=true">
              <v-icon>mdi-console</v-icon>
            </v-btn>
            <v-btn icon dark @click="wsDialog=true">
              <v-icon>mdi-cloud</v-icon>
            </v-btn>

            <v-file-input
              v-model="form.inputFile"
              dense
              hide-input
              dark
              accept="application/JSON"
              @change="onJsonFileUpload"
            />
          </v-toolbar>

          <v-card>
            <v-card-subtitle dark>
              Type or paste valid JSON data
              <v-btn
                class="ml-2"
                color="grey lighten-2"
                small
                outlined
                @click="onFormatJson()"
              >
                Beautify
              </v-btn>
            </v-card-subtitle>
            <v-card-text style="overflow: auto;">
              <vue-prism-editor
                v-model="form.inputJson"
                language="js"
                style="height:75vh"
                @change="inputValue=form.inputJson"
              />
            </v-card-text>
          </v-card>
        </v-card>
      </pane>
      <pane min-size="5" size="25">
        <!-- JSONata Explorer -->
        <v-card width="100%">
          <v-toolbar dense>
            <v-toolbar-title>JSONata Explorer</v-toolbar-title>

            <v-spacer />
            <v-btn small color="green" tile outlined dark @click="download('query.txt',form.query)">
              <v-icon small>
                mdi-arrow-down-bold
              </v-icon>Query
            </v-btn>
            <v-btn small color="green" tile outlined dark @click="download('result.json',result)">
              <v-icon small>
                mdi-arrow-down-bold
              </v-icon>JSON
            </v-btn>
          </v-toolbar>

          <v-card-subtitle>
            Use any valid
            <a
              href="http://docs.jsonata.org/overview.html"
              target="_blank"
            >JSONata expression.</a>
          </v-card-subtitle>
          <v-card-actions>
            <div style="width:100%">
              <vue-prism-editor v-model="form.query" language="js" class="pl-2" />
            </div>

            <v-btn small color="green" class="ml-2" icon @click="form.query='$'">
              <v-icon>mdi-autorenew</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-card>
              <v-card-subtitle>Select a property to add to JSONata query</v-card-subtitle>
              <v-card-text style="overflow: auto; font-size:.5em">
                <vue-json-pretty
                  id="resultJsonPretty"
                  :data="result"
                  style="height:60vh; "
                  @click="handleResultClick"
                />
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </pane>
      <pane>
        <!-- Results Table -->
        <v-card v-if="result" width="100%">
          <v-toolbar dense>
            <v-toolbar-title>Results</v-toolbar-title>

            <v-spacer />

            <v-btn small color="green" tile outlined dark @click="onExportCsv">
              <v-icon small>
                mdi-arrow-down-bold
              </v-icon>CSV
            </v-btn>
            <v-btn small color="green" tile outlined dark @click="onDownloadTable">
              <v-icon small>
                mdi-arrow-down-bold
              </v-icon>HTML Table
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-simple-table dense fixed-header light>
              <div id="resultTable" ref="resultTable" v-html="tableHtml" />
            </v-simple-table>
          </v-card-text>
        </v-card>
      </pane>
    </splitpanes>
  </v-container>
</template>

<script>
// Vue.component('vue-prism-editor', VuePrismEditor)
//         Vue.component('vue-json-pretty', VueJsonPretty.default)

import VuePrismEditor from 'vue-prism-editor'
import 'prismjs'
import 'prismjs/themes/prism.css'
import VueJsonPretty from 'vue-json-pretty'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import InputWebsocket from './InputWebsocket'
import InputApi from './InputApi'
import InputOas from './InputOas'

const tableify = require('tableify')
const json2csv = require('json2csv')
const jsonata = require('jsonata')
const linkify = require('linkifyjs')
require('linkifyjs/plugins/hashtag')(linkify) // optional
const linkifyHtml = require('linkifyjs/html')

export default {
  name: 'Dashboard',
  components: {
    VuePrismEditor,
    VueJsonPretty,
    Splitpanes,
    Pane,
    InputWebsocket,
    InputApi,
    InputOas

  },
  data: () => ({
    panel: [0, 0],
    example: [
      {
        FirstName: 'Fred',
        Surname: 'Smith',
        Age: 28,
        Address: {
          Street: 'Hursley Park',
          City: 'Winchester',
          Postcode: 'SO21 2JN'
        },
        Phone: [
          {
            type: 'home',
            number: '0203 544 1234'
          },
          {
            type: 'office',
            number: '01962 001234'
          },
          {
            type: 'office',
            number: '01962 001235'
          },
          {
            type: 'mobile',
            number: '077 7700 1234'
          }
        ],
        Email: [
          {
            type: 'work',
            address: ['fred.smith@my-work.com', 'fsmith@my-work.com']
          },
          {
            type: 'home',
            address: ['freddy@my-social.com', 'frederic.smith@very-serious.com']
          }
        ],
        Other: {
          'Over 18 ?': true,
          Misc: null,
          'Alternative.Address': {
            Street: 'Brick Lane',
            City: 'London',
            Postcode: 'E1 6RF'
          }
        }
      },
      {
        FirstName: 'Miles',
        Surname: 'Meraki',
        Age: 28,
        Address: {
          Street: '123 Unicorn Ave',
          City: 'Cloud City',
          Postcode: '99991'
        },
        Phone: [
          {
            type: 'home',
            number: '123 345 345'
          },
          {
            type: 'office',
            number: '3234 123123'
          },
          {
            type: 'office',
            number: '23423 234324'
          },
          {
            type: 'mobile',
            number: '111 23442 123234'
          }
        ],
        Email: [
          {
            type: 'work',
            address: ['miles.meraki@magical.com', 'mmiles@magical.net']
          },
          {
            type: 'home',
            address: [
              'eenhorn@compushare.com',
              'numberOneHorn@very-serious.com'
            ]
          }
        ],
        Other: {
          'Over 18 ?': true,
          Misc: null,
          'Alternative.Address': {
            Street: 'Brick Lane',
            City: 'London',
            Postcode: 'E1 6RF'
          }
        }
      }
    ],
    drawer: false,
    isLoading: false,
    apiDialog: false,
    wsDialog: false,
    oasDialog: false,
    form: {
      inputFile: undefined,
      inputJson: '',
      query: '$'
    },
    socket: null,
    inputValue: {},
    result: [],
    tableFields: []
  }),
  computed: {
    tableHtml () {
      if (!this.result) {
        return
      }
      // const resultWithUrlLinks = this.addUrlLinks(this.result)
      console.log('tableHtml pre-', this.result)
      let adjusted = this.result
      if (Array.isArray(this.result)) {
        adjusted = this.result.map((r) => { if (!r) { r = 'Nothing' } else { return r } })
      }
      const table = `${tableify(adjusted).replace(
        '<table>',
        '<table id="resultTable">'
      )}`
      return this.addUrlLinks(table)
    },

    parsedInput () {
      console.log('computed parsedInput this.inputValue', this.inputValue)
      if (!this.inputValue) { return }
      if (
        !Array.isArray(this.inputValue) &&
        !this.isObject(this.inputValue) &&
        !this.inputValue
      ) {
        return {}
      }
      try {
        return JSON.parse(this.inputValue)
      } catch (e) {
        return e
      }
    }

  },
  watch: {
    'form.query' () {
      this.result = this.generateJsonataResult(
        this.form.query,
        this.parsedInput
      )
      this.updateTableFields(this.result)
    },
    parsedInput () {
      if (!this.parsedInput) { return }
      this.result = this.generateJsonataResult(
        this.form.query,
        this.parsedInput
      )
      this.updateTableFields(this.result)
    }
  },
  created () {
    // this.$vuetify.theme.dark = true;
    console.log('dashboard loading')
    // this.onConnectWebsocket();

    // initialize with example JSON
    this.form.inputJson = JSON.stringify(this.example, null, 4)
    this.inputValue = this.form.inputJson
  },
  methods: {
    addUrlLinks (string) {
      if (!string) { return }
      console.log('addUrlLinks string', string)
      return linkifyHtml(string, {
        defaultProtocol: 'https'
      })

      // const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
      // // var urlRegex = /(https?:\/\/[^\s]+)/g;
      // return string.replace(urlRegex, function (url, b, c) {
      //   const url2 = (c === 'www.') ? 'http://' + url : url
      //   return '<a href="' + url2 + '" target="_blank">' + url + '</a>'
      // })
    },
    onOasData (data) {
      console.log('dash api data', data)
      this.form.inputJson = this.formatJsonString(JSON.stringify(data))
      this.inputValue = this.form.inputJson
    },
    onApiData (data) {
      console.log('dash api data', data)
      this.form.inputJson = this.formatJsonString(JSON.stringify(data))
      this.inputValue = this.form.inputJson
    },
    onWebsocketData (dataString) {
      console.log('dash websocket data', dataString)
      this.form.inputJson = this.formatJsonString(dataString)
      this.inputValue = this.form.inputJson
    },
    onDownloadTable () {
      const css = `
              <style>
                  table,
                  th,
                  td {
                      border: 1px solid rgb(44, 44, 44);
                      border-collapse: collapse;
                  }

                  th,
                  td {
                      padding: 5px;
                  }
              </style>`
      const html = this.tableHtml + css
      this.download(`export_${new Date().toLocaleDateString()}.html`, html)
    },
    generateJsonataResult (query, jsonData) {
      try {
        return jsonata(query).evaluate(jsonData, (error, result) => {
          if (error) {
            console.error('jsonata error', error)
            return error.message
          }

          console.log('Finished with', result)
          return result
        })
      } catch (e) {
        console.log('JSONata expression error', e)
        return e.message
      }
    },
    onJsonFileUpload () {
      console.log('updating JSON with user file upload')
      if (!this.form.inputFile) {
        // this.form.inputJson = "No File Chosen"
        return
      }

      const reader = new FileReader()
      // Use the javascript reader object to load the contents
      // of the file in the v-model prop
      reader.readAsText(this.form.inputFile)
      reader.onload = () => {
        console.log('input being parsed', reader.result)
        this.form.inputJson = reader.result
        this.inputValue = JSON.parse(reader.result)
        console.log('input updated', this.form.inputJson)
      }
    },
    download (filename, data) {
      if (filename.includes('.json')) {
        data = JSON.stringify(data, null, 4)
      }
      const element = document.createElement('a')
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(data)
      )
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
    onExportCsv () {
      try {
        const transforms = [
          json2csv.transforms.flatten({
            objects: true,
            arrays: true
          })
        ]
        const options = {
          flattenArrays: true,
          transforms
        }
        const parser = new json2csv.Parser(options)
        const csv = parser.parse(this.result)
        console.log(csv)
        this.download('result.csv', csv)
      } catch (err) {
        console.error(err)
      }
    },
    copyText () {
      navigator.clipboard.writeText(this.tableHtml)
    },
    isObject (val) {
      return val instanceof Object
    },
    // fetchJson() {
    //   let options = {
    //     method: "get", // ONLY ALLOWING GET METHODS (For now)
    //     url: this.apiForm.url,
    //     headers: {}
    //   };

    //   options.headers[this.apiForm.headerKey] = this.apiForm.headerValue;
    //   console.log("fetchJson", options);
    //   this.isLoading = true;
    //   axios
    //     .post(this.serverOptions.proxyUrl, options)
    //     .then(res => {
    //       console.log("fetchJson ", this.form.url, res);
    //       this.form.inputJson = JSON.stringify(res.data, null, 4);
    //       this.inputValue = res.data;
    //     })
    //     .catch(e => {
    //       console.log("fetch error", JSON.stringify(e));
    //       //this.isLoading = false
    //     })
    //     .finally(() => {
    //       this.isLoading = false;
    //     });
    // },
    updateTableFields (object) {
      if (!object || object == null) { return }
      const keys = Object.keys(object)
      this.tableFields = keys.map((r) => {
        return {
          name: r,
          alias: r
        }
      })
    },
    handleResultClick (value) {
      console.log('handleResultClick value', value)
      let split = value.split('.')
      split.shift()
      split = split.map((s) => {
        console.log('s', s)
        // if (s.includes(null)) {
        //   s = 'Nothing'
        // }
        if (!s.includes('[')) {
          s = `\`${s}\``
        }
        return s
      })
      console.log('handleResultClick split', split)
      const query = `.${split.join('.')}`
      this.form.query = this.form.query + query
    },
    onQueryChange (value) {
      this.form.query = value
    },
    onFormatJson () {
      this.form.inputJson = this.formatJsonString(this.form.inputJson)
    },
    formatJsonString (jsonString) {
      try {
        const jsonObj = JSON.parse(jsonString)
        const formattedString = JSON.stringify(jsonObj, null, 4)

        return formattedString
      } catch (error) {
        return error
      }
    }
    // initWebsocket() {
    //   this.socket.onopen = () => {
    //     console.log("socket open");
    //     this.wsForm.isConnected = true;
    //   };
    //   this.socket.onclose = () => {
    //     this.wsForm.isConnected = false;
    //   };
    //   this.socket.onmessage = msg => {
    //     //console.log('socket message', msg)

    //     // sets raw and value data
    //     this.form.inputJson = this.formatJsonString(msg.data);
    //     this.inputValue = msg.data;
    //   };
    // },

  }
}
</script>
<style>
table,
th,
td {
  border: 1px solid rgb(44, 44, 44);
  border-collapse: collapse;
}

th,
td {
  padding: 5px;
}

.splitpanes__pane {
  box-shadow: 2 0 12px rgba(256, 256, 256, 0.2) inset;
  display: flex;
  position: relative;
}

em.specs {
  font-size: 0.5em;
  line-height: 1;
  position: absolute;
  color: rgba(0, 0, 255, 0.6);
  bottom: 0.5em;
  left: 0;
  right: 0;
  text-align: center;
}

.prism-editor-wrapper code {
  font-size: 0.7em;
  background-color: transparent !important;
}

.vjs-tree {
  font-family: Monaco, Menlo, Consolas, Bitstream Vera Sans Mono, monospace;
  font-size: 12px;
}
</style>
