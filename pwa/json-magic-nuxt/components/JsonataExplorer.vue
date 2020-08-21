<template>
  <!-- JSONata Explorer -->
  <v-card width="100%" style="overflow: auto;position: relative; max-height:94vh;" class="mr-2">
    <!-- Filter  -->

    <splitpanes vertical horizontal>
      <pane min-size="5" :size="paneSizes.input" class="pb-2">
        <v-card v-if="true" width="100%">
          <v-toolbar dense>
            <v-toolbar-title>Filter</v-toolbar-title>

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

          <!-- <v-card-subtitle>
            Use any valid
            <a
              href="http://docs.jsonata.org/overview.html"
              target="_blank"
            >JSONata expression.</a>
          </v-card-subtitle> -->
          <v-card-actions class="mt-2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-shortkey="['meta', '\\']"
                  v-bind="attrs"
                  label="cmd+ \\"
                  small
                  right
                  color="yellow"
                  outlined
                  class="ml-2"
                  v-on="on"
                  @click="handleClearClick()"
                  @shortkey="handleClearClick()"
                >
                  Clear
                </v-btn>
              </template>
              <span small>Command + \</span>
            </v-tooltip>
            <v-spacer />
            <v-card-subtitle class="ml-4 pb-0 mb-0">
              <v-btn icon dark href="http://docs.jsonata.org/overview.html" target="_blank">
                <v-icon>mdi-book-open-variant</v-icon>
              </v-btn>
              JSONata expression
            </v-card-subtitle>
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-shortkey="['meta', 'enter']"
                  v-bind="attrs"
                  label="cmd+enter"
                  small
                  right
                  color="blue"
                  outlined
                  class="ml-2"
                  v-on="on"
                  @click="onRunQuery"
                  @shortkey="handleRunClick()"
                >
                  Run
                </v-btn>
              </template>
              <span small>Command + Enter</span>
            </v-tooltip>
          </v-card-actions>
          <v-card-text class="pb-0 aceQueryCard">
            <vue-prism-editor v-if="false" v-model.lazy="form.query" v-debounce="delay" language="js" class="ml-0 mb-0 my-editor" />
            <editor
              ref="aceQueryEditor"
              v-model="form.query"
              class="dynamicHeight"
              name="aceQueryEditor"

              lang="javascript"
              theme="chrome"
              width="100%"

              style="max-height:40vh; overflow: auto;position: relative;"
              @init="editorQueryInit"
            />
            <!-- style="overflow: auto;position: relative; max-height:94vh;" -->
            <!-- <vue-prism-editor v-model.lazy="term" v-debounce="delay" language="js" class="pl-2" /> -->
          </v-card-text>
        </v-card>
      </pane>
      <pane min-size="5" :size="paneSizes.result">
        <!-- Result -->
        <v-card v-if="true" width="100%" height="100%" style="overflow: auto;">
          <v-card-text>
            <v-card-subtitle class="pt-0 pb-0 mb-0 mt-0">
              JSONata Results
            </v-card-subtitle>
            <div v-if="!isLargeJson">
              <v-card-text style="overflow: auto; max-height:800px" class="pt-3">
                <v-slider
                  v-model="form.jsonDeapth"

                  min="0"
                  max="10"
                  ticks
                  thumb-label
                  thumb-size="10"
                  color="green"
                  tick-size="7"
                  dense
                  width="50px"
                />

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mr-8"
                      fab small icon right absolute :color="usingSelectMode ? 'green' : 'white'" v-bind="attrs"
                      @click="onSelectPropMode($event)"
                      v-on="on"
                    >
                      <v-icon>mdi-target</v-icon>
                    </v-btn>
                  </template>
                  <span>Enables ability to target a property name and add it's tree path to the JSONata query</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      active-class="color:'green'"
                      fab small icon right absolute v-bind="attrs"
                      @click="copyResult()"
                      v-on="on"
                    >
                      <v-icon>mdi-clipboard-text-multiple-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Copy JSON to clipboard</span>
                </v-tooltip>

                <vue-json-pretty
                  id="resultJsonPretty"
                  :deep="form.jsonDeapth"
                  :data="result"

                  @click="handleResultClick"
                />
              </v-card-text>
            </div>
            <div v-else>
              <div v-if="!isHugeJson">
                <v-card-subtitle>Whoa, that's some big JSON... Here's a simpler view</v-card-subtitle>
                <v-btn class="mr-6 mt-4" small icon fab right absolute @click="copyResult()">
                  <v-icon>mdi-clipboard-text-multiple-outline</v-icon>
                </v-btn>
                <v-card-text>
                  <editor
                    ref="aceEditor"
                    v-model="resultString"
                    lang="json"
                    theme="ambiance"
                    height="500"
                    @init="editorInit"
                  />
                </v-card-text>
              </div>
              <div v-else>
                <v-card-subtitle>Okay, that's some HUGE JSON... I'm not even going to show that.</v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn small color="warning" outlined @click="download('HUGEdata.json',result)">
                    <v-icon class="pr-2">
                      mdi-download
                    </v-icon>Give it to me anyways.
                    <br>
                  </v-btn>
                </v-card-actions>

                <v-card-text />
              </div>
            </div>
          </v-card-text>
          <v-footer style="overflow: auto; position: relative" class="pt-0 mt-0">
            <small>{{ jsonSize }} Kb</small>
          </v-footer>
        </v-card>
      </pane>
    </splitpanes>
  </v-card>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import VuePrismEditor from 'vue-prism-editor'
import VueJsonPretty from 'vue-json-pretty'
import * as editor from 'vue2-ace-editor'
import 'prismjs'
import 'prismjs/themes/prism.css'
import debounce from 'v-debounce'
import Vue from 'vue'
Vue.use(require('vue-shortkey'))

const _ = require('lodash')

const jsonata = require('jsonata')
export default {
  name: 'JsonataExplorer',
  components: {
    Splitpanes,
    Pane,
    VuePrismEditor,
    VueJsonPretty,

    // editor: require('vue2-ace-editor')
    editor
  },
  directives: {
    debounce
  },
  props: ['value', 'query'],
  // props: {
  //   value: {
  //     type: Any
  //     // default: {}
  //   }
  // },
  data: () => ({
    panel: [0, 1],
    paneSizes: {
      input: 30,
      result: 70
    },
    // selectedRow: '',
    options: {},
    editor: undefined,
    result: {},
    resultString: '',
    form: {
      query: '$',
      inputJson: '',
      jsonDeapth: 5
    },
    jsonSize: 0,
    isLargeJson: false,
    isHugeJson: false,
    jsonSizeLimit: 500, // kb
    delay: 5000,

    disabled: false,
    readonly: false,
    usingSelectMode: false
  }),

  watch: {

    query () {
      this.form.query = this.query
      // this.heightUpdateFunction(this.editorQuery)
    },
    value () {
      this.form.inputJson = this.value
      this.onRunQuery()
    },
    'form.query' () {
      console.log(`real-time Query term changed to ${this.form.query}`)
      this.heightUpdateFunction(this.editorQuery)
      // ** Disabled realtime Query because of performance
      // this.updateQuery(this.form.query)
    },

    result () {
      console.log('this.result', this.result)
      if (!this.result) {
        return {}
      }
      // this.$refs.aceEditor.editor.getSession().foldAll(4)
      this.jsonSize = this.sizeInKb(this.result)
      this.isLargeJson = this.jsonSize > this.jsonSizeLimit // 500 // Kb
      this.isHugeJson = this.jsonSize > 20000
      console.log('this.jsonSize', this.jsonSize)

      if (this.isHugeJson) {
        // huge data size
        console.log('HUGE DATA')
        const errorMsg = {
          error:
            'This is HUGE JSON, are you sure you did that right? Check for loops',
          sizeInKb: this.jsonSize
        }
        this.resultString = JSON.stringify(this.errorMsg, null, 4)
        this.$emit('data', errorMsg)
      } else if (this.isLargeJson) {
        // large data size
        this.resultString = JSON.stringify(this.result, null, 4)
        // this.editor.getSession().foldAll(4)
        this.$emit('data', this.result)
      } else {
        // normal data size
        this.$emit('data', this.result)
      }
    }
  },
  created () {
    this.form.query = this.query
    this.form.inputJson = this.value
    this.result = this.generateJsonataResult(
      this.form.query,
      this.form.inputJson
    )

    this.$emit('data', this.result) // init
  },
  mounted () {
    this.onRunQuery()
  },

  methods: {
    onSelectPropMode () {
      this.usingSelectMode = !this.usingSelectMode
    },
    copyResult () {
      navigator.clipboard.writeText(JSON.stringify(this.result, null, 4))
    },
    handleRunClick (e) {
      console.log('keyboard cmd enter pressed', e)

      this.onRunQuery()
    },
    handleClearClick (e) {
      console.log('keyboard cmd delete pressed', e)
      this.form.query = '$'
      this.onRunQuery()
    },
    updateQuery: _.debounce(function (e) {
      console.log(`Delayed query ${this.form.query}`)
      this.onRunQuery()
    }, 500),
    editorInit (editor) {
      require('brace/ext/language_tools') // language extension prerequsite...
      // require('brace/mode/html')
      require('brace/mode/javascript') // language
      require('brace/mode/json') // language
      require('brace/mode/less')
      require('brace/theme/ambiance')
      // require('brace/snippets/javascript') // snippet
      editor.setOption('showLineNumbers', false)
      editor.getSession().foldAll()
      this.heightUpdateFunction(editor)
      this.editor = editor
      // const editor = this.$refs.aceEditor.editor
      // const selectionRange = editor.getSelectionRange()

      // const startLine = selectionRange.start.row
      // const endLine = selectionRange.end.row

      // const content = editor.session.getTextRange(selectionRange)
      // this.selectedRow = content
    },
    editorQueryInit (editor) {
      require('brace/ext/language_tools') // language extension prerequsite...
      // require('brace/mode/html')
      require('brace/mode/javascript') // language
      require('brace/mode/json') // language
      require('brace/mode/less')
      require('brace/theme/ambiance')
      // require('brace/snippets/javascript') // snippet
      editor.setOption('showLineNumbers', false)
      editor.getSession().setUseWorker(false)
      editor.getSession().foldAll()
      this.heightUpdateFunction(editor, parent)
      this.editorQuery = editor
      // const editor = this.$refs.aceEditor.editor
      // const selectionRange = editor.getSelectionRange()

      // const startLine = selectionRange.start.row
      // const endLine = selectionRange.end.row

      // const content = editor.session.getTextRange(selectionRange)
      // this.selectedRow = content
    },
    heightUpdateFunction (editor, parent) {
      // http://stackoverflow.com/questions/11584061/
      let newHeight = editor.getSession().getScreenLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth()
      console.log('new ace Editor Height', newHeight)
      const element = document.querySelector('.dynamicHeight')
      console.log('element', element)
      console.log('element.style', element.style)
      const minHeight = '100'
      if (newHeight < minHeight) { newHeight = minHeight }
      element.style.height = (newHeight.toString() + 'px')
      if (parent) {
        const pElement = document.querySelector('.aceQueryCard')
        pElement.style.height = ((newHeight + 10).toString() + 'px')
      }
      // document.querySelector('#editor-section').height(newHeight.toString() + 'px')

      // This call is required for the editor to fix all of
      // its inner structure for adapting to a change in size
      editor.resize()
    },
    onRunQuery () {
      this.result = this.generateJsonataResult(
        this.form.query,
        this.form.inputJson
      )
      this.$emit('change', this.form.query)
    },
    timeboxExpression (expr, timeout, maxDepth) {
      let depth = 0
      const time = Date.now()
      console.log(
        'run timeboxExpression (expr, timeout, maxDepth)',
        expr,
        timeout,
        maxDepth
      )
      const checkRunnaway = function () {
        if (depth > maxDepth) {
          // stack too deep
          console.log('stack too deep')
          // eslint-disable-next-line  no-throw-literal
          throw {
            code: 'U1001',
            message:
              'Stack overflow error: Check for non-terminating recursive function.  Consider rewriting as tail-recursive.',
            stack: new Error().stack
          }
        }
        if (Date.now() - time > timeout) {
          // expression has run for too long
          console.log('expression has run for too long')
          // eslint-disable-next-line  no-throw-literal
          throw {
            code: 'U1002',
            message: 'Expression evaluation timeout: Check for infinite loop',
            stack: new Error().stack
          }
        }
      }

      // register callbacks
      expr.assign('__evaluate_entry', function (expr, input, environment) {
        depth++
        checkRunnaway()
      })
      expr.assign('__evaluate_exit', function (
        expr,
        input,
        environment,
        result
      ) {
        depth--
        checkRunnaway()
      })
    },
    sizeInKb (obj) {
      const str = JSON.stringify(obj)
      return (
        new Blob([str], { type: 'plain/text', endings: 'native' }).size / 1000
      )
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
    handleResultClick (value) {
      if (!this.usingSelectMode) { return }
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
    generateJsonataResult (query, jsonData) {
      let result
      try {
        const expr = jsonata(query)
        expr.assign('trace', function (arg) {
          console.log(arg)
        })
        this.timeboxExpression(expr, 1000, 500)

        expr.assign('trace', function (arg) {
          console.log('trace arg', arg)
        })
        console.log('generateJsonataResult query, jsonData', query, jsonData)

        result = expr.evaluate(jsonData, (error, result) => {
          if (error) {
            console.error('jsonata error', error)
            // finalResult = error
            return error.message
          }
          console.log('Finished JSONata', result)

          return result
        })
      } catch (e) {
        console.log('JSONata expression error', e)
        result = e.message
      }
      console.log('generateJsonataResult result')
      return result
    }
  }
}
</script>
<style >

</style>
