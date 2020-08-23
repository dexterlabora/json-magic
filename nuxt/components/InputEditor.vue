<template>
  <div>
    <v-card-subtitle dark>
      Type or paste valid JSON data
    </v-card-subtitle>
    <v-btn class="mt-4 ml-2" color="grey darken-2" small fab icon absolute right @click="onFormatJson()">
      <v-icon>mdi-format-align-left</v-icon>
    </v-btn>
    <v-card-text style="overflow: auto; position: relative" height="100%">
      <editor ref="aceEditor" v-model="form.inputJson" lang="json" theme="chrome" width="100%" height="80vh" @init="editorInit" @change="onInputJsonChange($event)" />
    </v-card-text>
    <!-- <v-card-text>
        <v-label>Data Size: {{ inputJsonSize/1024 }} Kb</v-label>
      </v-card-text> -->
  </div>
</template>

<script>

export default {
  name: 'InputEditor',
  components: {

    editor: require('vue2-ace-editor')
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({

    form: {
      inputJson: ''
    }
  }),
  computed: {
    selectedRow () {
      const editor = this.$refs.aceEditor.editor
      const selectionRange = editor.getSelectionRange()
      const content = editor.session.getTextRange(selectionRange)
      return content
    }
  },
  watch: {
    'value' () {
      this.form.inputJson = this.value
      console.log('value', this.value)
    },
    'form.inputJson' () {
      this.onInputJsonChange(this.form.inputJson)
    }

  },
  created () {
    this.form.inputJson = this.value// JSON.stringify(this.example, null, 4)
    this.$emit('change', this.form.inputJson) // init
  },

  methods: {
    editorInit (editor) {
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/javascript') // language
      require('brace/mode/json') // language
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/javascript') // snippet
      // const editor = this.$refs.aceEditor.editor
      // const selectionRange = editor.getSelectionRange()

      // const startLine = selectionRange.start.row
      // const endLine = selectionRange.end.row

      // const content = editor.session.getTextRange(selectionRange)
      // this.selectedRow = content
    },

    onSelected (event) { console.log('selected', event) },
    onInputJsonChange ($event) {
      this.$emit('input', $event)
      this.$emit('change', $event)
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
<style >

</style>
