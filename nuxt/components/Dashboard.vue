<template>
  <v-layout class="fill-height">
    <!-- Import Report Dialog -->
    <template>
      <v-row justify="center">
        <v-dialog
          v-model="importReportDialog"
          max-width="800"
          max-height="800"
          :fullscreen="$vuetify.breakpoint.mobile"
        >
          <v-card>
            <v-card-title>
              Upload an existing JSON Magic report
            </v-card-title>
            <v-card-text>
              <v-file-input
                v-model="form.inputReportFile"
                style="padding-top: 25px; padding-right: 5px; width:'50'"

                color="green"
                height="5"
                width="25"
                show-size
                solo
                prepend-icon=""
                prepend-inner-icon="mdi-upload"
                dense
                label="Import Report"
                dark
                outlined
                small
                small-chips
                accept="application/JSON"
                @change="onImportReport"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn @click="importReportDialog=false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- History Dialog -->
    <template>
      <v-row justify="center">
        <v-dialog
          v-model="historyDialog"
          max-width="800"
          max-height="800"
          :fullscreen="$vuetify.breakpoint.mobile"
        >
          <input-history :history="inputValueHistory" @close="historyDialog = false" @data="onHistoryData($event)" />
        </v-dialog>
      </v-row>
    </template>
    <!-- OAS Dialog -->
    <template>
      <v-row justify="center">
        <v-dialog
          v-model="oasDialog"
          max-width="75%"
          height="700px"
          :fullscreen="$vuetify.breakpoint.mobile"
        >
          <input-oas @close="oasDialog = false" @data="onOasData($event)" />
        </v-dialog>
      </v-row>
    </template>

    <!-- Websocket Dialog -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="wsDialog" max-width="700px" :fullscreen="$vuetify.breakpoint.mobile">
          <input-websocket @close="wsDialog = false" @data="onWebsocketData($event)" />
        </v-dialog>
      </v-row>
    </template>

    <!-- User API Dialog -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="apiDialog" max-width="700px" :fullscreen="$vuetify.breakpoint.mobile">
          <input-api
            @close="apiDialog = false"
            @data="onApiData($event)"
            @url="onInputName($event)"
          />
        </v-dialog>
      </v-row>
    </template>

    <!-- <splitpanes class="default-theme"> -->

    <splitpanes @resize="paneResize($event)">
      <pane v-if="toggleViewInput" min-size="1" :size="paneSizes.input">
        <!-- JSON Input  -->
        <v-card width="100%" style="position: absolute" class="mr-2">
          <v-toolbar dense>
            <v-toolbar-title dense>
              Input
            </v-toolbar-title>
            <!-- <v-btn small icon @click="paneSizes.input=100">
              <v-icon>mdi-arrow-expand-all</v-icon>
            </v-btn>
            <v-btn small icon @click="paneSizes.input=25">
              <v-icon>mdi-arrow-collapse-all</v-icon>
            </v-btn>-->

            <v-spacer />
            <v-btn small class="mr-2" icon @click="historyDialog=true">
              <v-icon color="grey lighten-1">
                mdi-clock
              </v-icon>
            </v-btn>
            <div class="text-center">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="green"
                    outlined
                    dark
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add JSON
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <v-btn dark outlined color="green" @click="oasDialog=true">
                        <v-icon class="pr-2">
                          mdi-api
                        </v-icon> OpenAPI
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      <v-btn outlined dark color="green" @click="apiDialog=true">
                        <v-icon class="pr-2">
                          mdi-console
                        </v-icon>URL
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      <v-btn outlined dark color="green" @click="wsDialog=true">
                        <v-icon class="pr-2">
                          mdi-cloud
                        </v-icon>Websocket
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      <v-file-input
                        v-model="form.inputFile"
                        dense

                        dark
                        label="JSON File"
                        accept="application/JSON"
                        @change="onJsonFileUpload"
                      />
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-toolbar>

          <input-editor
            v-model="form.inputJson"

            style="position: relative"
            @change="onEditorData($event)"
          />

          <v-label>
            <div style="font-size: 0.8em;">
              {{ form.inputName }}
            </div>
          </v-label>
        </v-card>
      </pane>
      <!-- v-show breaks splitpanes -- FIX THIS (split query and result components) -->
      <pane min-size="1" :size="paneSizes.explore">
        <jsonata-explorer :value="parsedInput" :query="form.query" @change="form.query=($event)" @data="result = $event" />
      </pane>
      <pane v-if="toggleViewTable" min-size="1">
        <!-- Results Table -->

        <v-card v-if="result" width="100%" height="100%" style="position: absolute" class="m-2">
          <v-toolbar dense width="100%">
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

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  active-class="color:'green'"
                  fab small icon right v-bind="attrs"
                  @click="copyTableToClipboard()"
                  v-on="on"
                >
                  <v-icon>mdi-clipboard-text-multiple-outline</v-icon>
                </v-btn>
              </template>
              <span>Copy table HTML to clipboard</span>
            </v-tooltip>
          </v-toolbar>
          <!-- <v-card-text class="m-2" style=" overflow: auto;" height="100%">
            <v-simple-table
              dense
              fixed-header
              light
              class="m-2 tableView "
              style="height:100%; position: relative;"
              min-height="800px"
            >
              <div id="resultTable" ref="resultTable" style="height:100%: postion:absolute;" v-html="tableHtml" />
            </v-simple-table>
          </v-card-text> -->
          <v-layout>
            <v-flex
              style="position: absolute; overflow: auto; height: 100%; width:100%"
            >
              <v-card-text class="m-2">
                <v-simple-table
                  dense
                  fixed-header
                  light
                  class="m-2 tableView "
                >
                  <div id="resultTable" ref="resultTable" v-html="tableHtml" />
                </v-simple-table>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-card>
      </pane>
    </splitpanes>
  </v-layout>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import InputWebsocket from './InputWebsocket'
import InputApi from './InputApi'
import InputHistory from './InputHistory'
import InputOas from './InputOas'
import InputEditor from './InputEditor'
import JsonataExplorer from './JsonataExplorer'

const tableify = require('tableify')
const json2csv = require('json2csv')
const linkify = require('linkifyjs')
require('linkifyjs/plugins/hashtag')(linkify) // optional
const linkifyHtml = require('linkifyjs/html')

/* global pm */
// Access to Postman global if running embeded

export default {
  name: 'Dashboard',
  components: {
    Splitpanes,
    Pane,
    InputWebsocket,
    InputApi,
    InputOas,
    InputEditor,
    InputHistory,
    JsonataExplorer
  },

  data: () => ({
    panel: [0, 0],
    paneSizes: {
      input: 25,
      explore: 35
    },

    drawer: false,
    isLoading: false,
    apiDialog: false,
    historyDialog: false,
    importReportDialog: false,
    wsDialog: false,
    oasDialog: false,
    form: {
      inputRouteQuery: '',
      inputPostman: {},
      inputName: '',
      inputFile: undefined,
      inputJson: `{
  "Account": {
    "Account Name": "Firefly",
    "Order": [
      {
        "OrderID": "order103",
        "Product": [
          {
            "Product Name": "Bowler Hat",
            "ProductID": 858383,
            "SKU": "0406654608",
            "Description": {
              "Colour": "Purple",
              "Width": 300,
              "Height": 200,
              "Weight": 0.75
            },
            "Price": 34.45,
            "Quantity": 2
          },
          {
            "Product Name": "Trilby hat",
            "ProductID": 858236,
            "SKU": "0406634348",
            "Description": {
              "Colour": "Orange",
              "Width": 300,
              "Height": 200,
              "Depth": 210,
              "Weight": 0.6
            },
            "Price": 21.67,
            "Quantity": 1
          }
        ]
      },
      {
        "OrderID": "order104",
        "Product": [
          {
            "Product Name": "Bowler Hat",
            "ProductID": 858383,
            "SKU": "040657863",
            "Description": {
              "Colour": "Purple",
              "Width": 300,
              "Height": 200,
              "Depth": 210,
              "Weight": 0.75
            },
            "Price": 34.45,
            "Quantity": 4
          },
          {
            "ProductID": 345664,
            "SKU": "0406654603",
            "Product Name": "Cloak",
            "Description": {
              "Colour": "Black",
              "Width": 30,
              "Height": 20,
              "Depth": 210,
              "Weight": 2
            },
            "Price": 107.99,
            "Quantity": 1
          }
        ]
      }
    ]
  }
}`,
      inputReportFile: undefined,
      inputReport: {},
      query: `/* Example to filter JSON by Product Name and shape output*/
$.Account.Order.Product[\`Product Name\`="Bowler Hat"].
{
    "OrderID": %.OrderID, /* access parent object */
    "Quantity": Quantity,
    "Price": Price,
    "Total": "$" & (Quantity * Price) /* compute value string*/
}`
    },

    socket: null,
    inputValue: {},
    combinedInputValue: [],
    inputValueHistory: [],
    historyLimit: 20, // prevents memory issues
    result: {},
    tableFields: [],
    tableHtml: undefined,
    parsedInput: {},
    isLargeJson: false,
    jsonSize: 0,
    toggleViewInput: true,
    toggleViewFilter: true,
    toggleViewTable: true,
    isEditing: true
  }),
  computed: {
    toggleInput () {
      return this.$store.state.toggleInput
    },
    toggleJsonata () {
      return this.$store.state.toggleJsonata
    },
    toggleTableify () {
      return this.$store.state.toggleTableify
    },

    report () {
      return {
        info: {
          description:
            'A JSONata query expression, the input JSON data and resulting JSON data'
        },
        name: this.form.inputName,
        query: this.form.query,
        inputJson: this.parsedInput,

        outputJson: this.result
      }
    }
  },
  watch: {
    '$route.query.inputJson' () {
      this.onQueryData(this.$route.query.inputJson)
    },
    '$route.query.postman' () {
      // if () { return }
      console.log('query postman', this.$route.query.postman)
      // console.log('postman data', getPostmanData())
    },
    'form.inputPostman' () {
      if (!this.form.inputPostman) { return }
      this.onPostmanData(this.form.inputPostman)
      // console.log('watch form.inputPostman', this.form.inputPostman)
      // this.form.inputJson = this.formatJsonString(JSON.stringify(this.form.inputPostman))
      // this.form.inputValue = this.form.inputPostman
    },
    inputValue () {
      this.onGenerateParsedInput()
    },

    result () {
      this.jsonSize = this.sizeInKb(this.result)
      this.isLargeJson = this.jsonSize > 50 // 500 // Kb
      // if (!this.isLargeJson) {
      this.onGenerateTable() // slowish
      // }
      // this.resultJsonPretty = { ...{}, ...this.result }
      // Object.freeze(this.resultJsonPretty)
    },
    'paneSizes.explore' () {
      console.log('watch paneSizes.explore', this.paneSizes.explore)
      const elCard = document.querySelector('.tableView')
      if (elCard) {
      //   if (sizes[(sizes.length - 1)]) {
      // const adjustedSize = this.paneSizes.table + 80
      // elCard.style.width = (adjustedSize.toString() + '%')
        elCard.style.width = '100%'
      }
      // this.paneResize(this.paneSizes)
    }
  },
  created () {
    this.$nuxt.$on('importReport', (file) => {
      this.form.inputReportFile = file
      this.onImportReport()
    })
    this.$nuxt.$on('toggleImportReportDialog', () => {
      this.importReportDialog = !this.importReportDialog
    })
    this.$nuxt.$on('toggleViewInput', () => {
      this.toggleViewInput = !this.toggleViewInput
    })
    this.$nuxt.$on('toggleViewFilter', () => {
      this.toggleViewFilter = !this.toggleViewFilter
      if (this.toggleViewFilter) {
        this.paneSizes.explore = 25
      } else {
        this.paneSizes.explore = 1
      }
    })
    this.$nuxt.$on('toggleViewTable', () => {
      this.toggleViewTable = !this.toggleViewTable
    })
    this.$nuxt.$on('exportReport', (name) => {
      // download report
      this.form.inputName = name
      this.onSaveReport()
    })
  },
  mounted () {
    // window.addEventListener('beforeunload', this.onBeforeUnload)
    this.onQueryData(this.$route.query.inputJson)
    console.log('query postman', this.$route.query.postman)

    // Postman Support
    // if (this.$route.query.postman === 'true') {
    this.getPostmanData()
    // console.log('getPostmanData', data)
    // const dataString = JSON.stringify(data)
    // console.log('dataString', dataString)
    // this.form.inputJson = this.formatJsonString(dataString)
    // }
    console.log('this.inputValue', this.inputValue)
    this.inputValue = this.form.inputJson
    this.combinedInputValue = [JSON.parse(this.form.inputJson)]
    this.onGenerateParsedInput()
    this.onGenerateTable()
  },
  beforeMount () {
    window.addEventListener('beforeunload', this.preventNav)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('beforeunload', this.preventNav)
    })
  },

  // beforeRouteLeave (to, from, next) {
  //   if (this.isEditing) {
  //     if (!window.confirm('Leave without saving?')) {
  //       return
  //     }
  //   }
  //   next()
  // },
  methods: {
    getPostmanData () {
      try {
        pm.getData((err, data) => {
          if (err) { console.log('postman err', err) }
          console.log('postman data', data.res)
          console.log('postman pm', data.pm)
          this.form.inputPostman = data.res
          this.form.query = '$'
        })
      } catch (e) {
        console.log('not running in Postman')
      }
    },
    paneResize (sizes) {
      console.log('paneResize', sizes)
      const elCard = document.querySelector('.tableView')
      // if (elCard & sizes.length) {
      //   if (sizes[(sizes.length - 1)]) {
      const adjustedSize = sizes[(sizes.length - 1)].size + 80
      elCard.style.width = (adjustedSize.toString() + '%')
      //   }
      // }
    },
    preventNav (event) {
      if (!this.isEditing) { return }
      event.preventDefault()
      event.returnValue = ''
    },
    onInputSelection (event) {
      console.log('inputSelection event', event.text)
    },
    onSaveReport () {
      this.download((this.report.name || 'JSON-Magic-report') + '.json', this.report)
    },
    onImportReport () {
      if (!this.form.inputReportFile) {
        console.log('reportReader no file')
        return
      }
      const reportReader = new FileReader()
      // Use the javascript reader object to load the contents
      // of the file in the v-model prop
      reportReader.readAsText(this.form.inputReportFile)
      reportReader.onload = () => {
        console.log('reportReader', reportReader.result)
        this.form.inputReport = JSON.parse(reportReader.result)
        this.form.inputJson = this.formatJsonString(
          JSON.stringify(this.form.inputReport.inputJson)
        )
        this.form.name = this.form.inputReport.name
        this.form.query = this.form.inputReport.query
        this.$nuxt.$emit('reportName', this.form.inputReport.name)
      }
    },
    onGenerateParsedInput () {
      if (!this.inputValue) {
        return
      }
      if (!this.inputValue) {
        return
      }
      try {
        this.parsedInput = JSON.parse(this.inputValue)

        // console.log('finished onGeneratedParsedInput')
      } catch (e) {
        console.log('not JSON, just return raw data with conversion')
        this.parsedInput = JSON.parse(JSON.stringify(this.inputValue))
      }
    },
    sizeInKb (obj) {
      const str = JSON.stringify(obj)
      return (
        new Blob([str], { type: 'plain/text', endings: 'native' }).size / 1000
      )
    },
    onGenerateTable () {
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
      }
      let adjusted = object

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
    addUrlLinks (string) {
      if (!string) {
        return
      }
      return linkifyHtml(string, {
        defaultProtocol: 'https'
      })
    },
    updateInputHistory (obj) {
      this.inputValueHistory.push({
        time: new Date().toISOString(),
        name: JSON.stringify(obj).substring(0, 100), // get first few characters of JSON for quick summary
        value: obj
      }
      )
      if (this.inputValueHistory.length > this.historyLimit) {
        this.inputValueHistory.shift()
      }
    },
    onEditorData () {
      this.inputValue = this.form.inputJson
    },
    onOasData (obj) {
      this.form.inputJson = this.formatJsonString(JSON.stringify(obj))
      this.updateInputHistory(obj)
    },
    onHistoryData (array) {
      // if single item returned, remove additinal parent array
      let adjusted
      if (array.length === 1) {
        adjusted = array[0]
      } else {
        adjusted = array
      }
      this.form.inputJson = this.formatJsonString(JSON.stringify(adjusted))
    },
    onApiData (obj) {
      // const useCombinedInput = true // temp
      // // console.log('updating inputJson')
      // if (useCombinedInput) {
      //   this.combinedInputValue.push(obj)
      //   this.form.inputJson = this.formatJsonString(JSON.stringify(this.combinedInputValue))
      // } else {
      this.form.inputJson = this.formatJsonString(JSON.stringify(obj))
      this.updateInputHistory(obj)
      // }
    },
    onInputName (data) {
      this.form.inputName = data
    },
    onQueryData (string) {
      if (!string) { return }
      console.log('json from query data', string)
      this.form.query = '$'
      this.form.inputRouteQuery = string
      this.form.inputJson = this.formatJsonString(string)
      this.updateInputHistory(JSON.parse(string))
    },
    onPostmanData (data) {
      console.log('watch form.inputPostman', this.form.inputPostman)
      this.form.inputJson = this.formatJsonString(JSON.stringify(this.form.inputPostman))
      this.form.inputValue = this.form.inputPostman
      this.updateInputHistory(this.form.inputPostman)
    },
    // onPostmanData (obj) {
    //   this.form.inputPostman = obj
    //   this.form.inputJson = this.formatJsonString(JSON.stringify(obj))
    //   // this.inputValue = obj
    //   this.updateInputHistory({ ...{}, ...obj })
    // },
    onWebsocketData (string) {
      this.form.inputJson = this.formatJsonString(string)
      this.updateInputHistory(JSON.parse(string))
    },
    onJsonataData (query, data) {
      this.form.query = query
      this.result = data
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
    copyTableToClipboard () {
      navigator.clipboard.writeText(this.tableHtml)
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
        this.updateInputHistory(this.inputValue)
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
    onFormatJson () {
      this.form.inputJson = this.formatJsonString(this.form.inputJson)
    },
    formatJsonString (jsonString) {
      try {
        const jsonObj = JSON.parse(jsonString)
        const formattedString = JSON.stringify(jsonObj, null, 4)

        return formattedString
      } catch (error) {
        console.log('Finished - formatJsonString error', error)
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
  font-size: x-small;
  padding: 5px;
}

.splitpanes__pane {
  box-shadow: 2 0 12px rgba(256, 256, 256, 0.2) inset;
  display: flex;
  position: relative;
}
.splitpanes {
  background-color: #f8f8f8;
}

.splitpanes__splitter {
  background-color: #ccc;
  position: relative;
}
.splitpanes__splitter:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.4s;
  background-color: rgba(255, 0, 0, 0.3);
  opacity: 0;
  z-index: 1;
}
.splitpanes__splitter:hover:before {
  opacity: 1;
}
.splitpanes--vertical > .splitpanes__splitter:before {
  left: -10px;
  right: -10px;
  height: 100%;
}
.splitpanes--horizontal > .splitpanes__splitter:before {
  top: -10px;
  bottom: -10px;
  width: 100%;
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

.v-textarea textarea {
  font-size: 0.8em;
  padding: 0;
  height: 500px;
  line-height: 0.8rem;
}
.v-icon.v-icon.v-icon--link {
  cursor: pointer;
  outline: none;
  color: green;
}
</style>
