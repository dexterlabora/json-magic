<template>
  <v-container class="fill-height" fluid>
    <!-- OAS Dialog -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="oasDialog" max-width="75%" height="700px">
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
          <input-api @close="apiDialog = false" @data="onApiData($event)" @url="onApiName($event)" />
        </v-dialog>
      </v-row>
    </template>

    <!-- <splitpanes class="default-theme"> -->
    <splitpanes>
      <pane min-size="5" :size="paneSizes.input">
        <!-- JSON Input  -->
        <v-card width="100%" height="100%" style="position: relative" class="mr-2">
          <v-toolbar dense>
            <v-toolbar-title>Input</v-toolbar-title>
            <!-- <v-btn small icon @click="paneSizes.input=100">
              <v-icon>mdi-arrow-expand-all</v-icon>
            </v-btn>
            <v-btn small icon @click="paneSizes.input=25">
              <v-icon>mdi-arrow-collapse-all</v-icon>
            </v-btn> -->
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

          <input-editor v-model="form.inputJson" height="100%" style="position: relative" @change="onEditorData($event)" />

          <v-label>
            <div style="font-size: 0.8em;">
              {{ form.inputName }}
            </div>
          </v-label>
        </v-card>
      </pane>
      <pane min-size="5" :size="paneSizes.explore">
        <!-- JSONata Explorer -->
        <v-card width="100%" height="100%" style="position: relative" class="m-2">
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

          <div v-if="!isLargeJson">
            <v-card-subtitle>Select a property to add to JSONata query</v-card-subtitle>
            <v-card-text>
              <vue-json-pretty
                id="resultJsonPretty"
                :data="result"
                style="height:60vh; overflow: auto; "
                @click="handleResultClick"
              />
            </v-card-text>
          </div>
          <div v-else>
            <v-card-subtitle>Whoa, that's some big JSON... Here's a simpler view</v-card-subtitle>
            <v-card-actions>
              <v-spacer />
              <v-btn small color="green" outlined @click="onGenerateTable">
                Update Table
              </v-btn>
            </v-card-actions>

            <!-- <vue-prism-editor readonly :code="JSON.stringify(result, null, 4)" language="js" class="pl-2" /> -->
            <v-card-text>
              <pre><v-textarea :value="JSON.stringify(result, null, 4)" style="max-height:55vh; " /></pre>
            </v-card-text>
          </div>
          <v-card-text class="pt-0 mt-0">
            <small>
              {{ jsonSize }} Kb
            </small>
          </v-card-text>

          <!-- <vue-json-pretty
                  id="resultJsonPretty"

                  style="height:60vh; "
                  @click="handleResultClick"
          />-->
        </v-card>
      </pane>
      <pane min-size="5" :size="paneSizes.table">
        <!-- Results Table -->

        <v-card v-if="result" width="100%" height="100%" style="position: relative" class="m-2">
          <v-toolbar dense>
            <v-toolbar-title>
              Table
              <!-- <v-btn @click="onGenerateTable">
                Magic Table
              </v-btn>-->
            </v-toolbar-title>

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
          <v-card-text class="m-2">
            <v-simple-table dense fixed-header light class="m-2" style="position: relative" height="900px">
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
// import MonacoEditor from 'monaco-editor-vue'
import InputWebsocket from './InputWebsocket'
import InputApi from './InputApi'
import InputOas from './InputOas'
import InputEditor from './InputEditor'

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
    InputOas,
    // MonacoEditor,
    InputEditor
  },
  data: () => ({
    panel: [0, 0],
    paneSizes: { // TO DO - implement the buttons and links to this
      input: 25,
      explore: 25,
      table: 50
    },
    drawer: false,
    isLoading: false,
    apiDialog: false,
    wsDialog: false,
    oasDialog: false,
    form: {
      inputName: '',
      inputFile: undefined,
      inputJson: '',
      query: '$'
    },

    socket: null,
    inputValue: {},
    result: [],
    tableFields: [],
    tableHtml: undefined,
    parsedInput: {},
    isLargeJson: false,
    jsonSize: 0
  }),
  computed: {},
  watch: {
    inputValue () {
      // console.log('updating inputJson')
      this.onGenerateParsedInput()
    },
    'form.query' () {
      this.result = this.generateJsonataResult(
        this.form.query,
        this.parsedInput
      )
      // this.updateTableFields(this.result)
    },

    parsedInput () {
      if (!this.parsedInput) {
        return
      }
      this.result = this.generateJsonataResult(
        this.form.query,
        this.parsedInput
      )
    },
    result () {
      this.jsonSize = this.sizeInKb(this.result)
      this.isLargeJson = this.jsonSize > 500 // Kb
      if (!this.isLargeJson) {
        this.onGenerateTable() // slowish
      }
    }
  },
  created () {
    // this.$vuetify.theme.dark = true;
    // console.log('dashboard loading')
    // this.onConnectWebsocket();

    // initialize with example JSON
    // this.form.inputJson = JSON.stringify(this.example, null, 4)
    this.inputValue = this.form.inputJson
    this.onGenerateParsedInput()
    this.onGenerateTable()
  },
  methods: {
    onGenerateParsedInput () {
      // //console.log('generated parsedInput this.inputValue', this.inputValue)
      if (!this.inputValue) {
        return
      }
      if (
        // !Array.isArray(this.inputValue) &&
        // !this.isObject(this.inputValue) &&
        !this.inputValue
      ) {
        return
      }
      try {
        this.parsedInput = JSON.parse(this.inputValue)
        // console.log('finished onGeneratedParsedInput')
      } catch (e) {
        // console.log('not JSON, just return raw data')
        this.parsedInput = this.inputValue
      }
      Object.freeze(this.parsedInput) // makes the tree faster, since we are not modifying it
    },
    sizeInKb (obj) {
      const str = JSON.stringify(obj)
      return (
        new Blob([str], { type: 'plain/text', endings: 'native' }).size / 1000
      )
    },
    onGenerateTable () {
      // console.log('onGenerateTable pre- result', this.result)
      this.tableHtml = this.generateTableHtml(this.result)
    },
    generateTableHtml (object) {
      if (!object) {
        return
      }
      // cleans up JSON before tableify
      function replacer (name, val) {
        if (val === null) {
          return 'null' // remove from result
        } else {
          return val
        }
      };
      let adjusted = object
      // if (Array.isArray(object)) {
      //   adjusted = object.map((r) => {
      //     if (!r) {
      //       return 'Nothing'
      //     } else {
      //       return r
      //     }
      //   })
      // }

      if (this.isObject(object)) {
        // sanitize
        adjusted = JSON.parse(JSON.stringify(adjusted, replacer, 4))
      }

      // console.log('tableHtml pre-adjusted', adjusted)
      const table = `${tableify(adjusted).replace(
        '<table>',
        '<table id="resultTable">'
      )}`
      return this.addUrlLinks(table)
    },
    // filterNull(value) {
    //   function recursiveFix(o) {
    //     // loop through each property in the provided value
    //     for (var k in o) {
    //       // make sure the value owns the key
    //       if (o.hasOwnProperty(k)) {
    //         if (o[k] === null) {
    //           // if the value is null, set it to 'null'
    //           o[k] = "null";
    //         } else if (typeof o[k] !== "string" && o[k].length > 0) {
    //           // if there are sub-keys, make a recursive call
    //           recursiveFix(o[k]);
    //         }
    //       }
    //     }
    //   }

    //   var cloned = jQuery.extend(true, {}, value);
    //   recursiveFix(cloned);
    //   return cloned;
    // },
    addUrlLinks (string) {
      if (!string) {
        return
      }
      // //console.log('addUrlLinks string', string)
      return linkifyHtml(string, {
        defaultProtocol: 'https'
      })
    },
    onEditorData (data) {
      // console.log('dash editor data', data)
      this.form.inputJson = data
      this.inputValue = this.form.inputJson
    },
    onOasData (data) {
      // console.log('dash api data', data)
      this.form.inputJson = this.formatJsonString(JSON.stringify(data))
      // this.inputValue = this.form.inputJson
    },
    onApiData (data) {
      // console.log('dash api data', data)
      this.form.inputJson = this.formatJsonString(JSON.stringify(data))
      // this.inputValue = this.form.inputJson
    },
    onInputName (data) {
      // console.log('dash api data', data)
      this.form.inputName = data
      // this.inputValue = this.form.inputJson
    },
    onWebsocketData (dataString) {
      // console.log('dash websocket data', dataString)
      this.form.inputJson = this.formatJsonString(dataString)
      // this.inputValue = this.form.inputJson
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
      // console.log('generateJsonataResult')
      let result
      try {
        result = jsonata(query).evaluate(jsonData, (error, result) => {
          if (error) {
            console.error('jsonata error', error)
            return error.message
          }

          // console.log('Finished JSONata')
          return result
        })
      } catch (e) {
        // console.log('JSONata expression error', e)
        return e.message
      }
      // console.log('Finished final JSONata')
      return result
    },
    onJsonFileUpload () {
      // console.log('updating JSON with user file upload')
      if (!this.form.inputFile) {
        // this.form.inputJson = "No File Chosen"
        return
      }

      const reader = new FileReader()
      // Use the javascript reader object to load the contents
      // of the file in the v-model prop
      reader.readAsText(this.form.inputFile)
      reader.onload = () => {
        // console.log('input being parsed', reader.result)
        this.form.inputJson = reader.result
        this.inputValue = JSON.parse(reader.result)
        // console.log('input updated', this.form.inputJson)
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
        // console.log(csv)
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

    handleResultClick (value) {
      // console.log('handleResultClick value', value)
      let split = value.split('.')
      split.shift()
      split = split.map((s) => {
        // console.log('s', s)
        // if (s.includes(null)) {
        //   s = 'Nothing'
        // }
        if (!s.includes('[')) {
          s = `\`${s}\``
        }
        return s
      })
      // console.log('handleResultClick split', split)
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
      // console.log('formatJsonString')
      try {
        const jsonObj = JSON.parse(jsonString)
        const formattedString = JSON.stringify(jsonObj, null, 4)
        // console.log('Finished - formatJsonString')
        return formattedString
      } catch (error) {
        // console.log('Finished - formatJsonString error', error)
        return jsonString
      }
    }
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

/* .splitpanes__pane {
  box-shadow: 2 0 12px rgba(256, 256, 256, 0.2) inset;
  display: flex;
  position: relative;
} */
.splitpanes {background-color: #f8f8f8;}

.splitpanes__splitter {background-color: #ccc;position: relative;}
.splitpanes__splitter:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.4s;
  background-color: rgba(255, 0, 0, 0.3);
  opacity: 0;
  z-index: 1;
}
.splitpanes__splitter:hover:before {opacity: 1;}
.splitpanes--vertical > .splitpanes__splitter:before {left: -10px;right: -10px;height: 100%;}
.splitpanes--horizontal > .splitpanes__splitter:before {top: -10px;bottom: -10px;width: 100%;}

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

.v-textarea textarea{
  font-size: 0.8em;
  padding: 0;
  height: 500px;
  line-height: 0.8rem;
}
</style>
