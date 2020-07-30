<template>
  <div>
    <v-card-subtitle dark>
      Type or paste valid JSON data
      <v-btn class="ml-2" color="grey lighten-2" small outlined @click="onFormatJson()">
        Beautify
      </v-btn>
    </v-card-subtitle>
    <v-card-text style="overflow: auto;">
      <!-- <vue-prism-editor
                v-model="form.inputJson"
                language="js"
                style="height:75vh"

                @change="inputValue=form.inputJson"
        />-->
      <!-- <v-textarea v-model="form.inputJson" auto-grow style="height:70vh; " @change="inputValue=form.inputJson" /> -->

      <MonacoEditor
        v-model="form.inputJson"
        width="400"
        height="740"
        theme="vs-light"
        language="javascript"
        :value="form.inputJson"
        :options="options"
        @change="onInputJsonChange($event)"
      />
    </v-card-text>
    <!-- <v-card-text>
        <v-label>Data Size: {{ inputJsonSize/1024 }} Kb</v-label>
      </v-card-text> -->
  </div>
</template>

<script>

import MonacoEditor from 'monaco-editor-vue'

export default {
  name: 'InputEditor',
  components: {

    MonacoEditor
  },
  // props: ['value'],
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    options: {
      lineNumbers: 'off',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      ariaLabel: 'online code editor',
      accessibilityHelpUrl: 'Nothing yet...',
      readOnly: false,
      theme: 'vs-light',
      language: 'javascript',

      foldingHighlight: true,
      foldingStrategy: 'auto',
      slider: false,
      fontSize: '10px',
      // Resizes Based on Screen & Container Size.
      automaticLayout: true
    },
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
            address: [
              'freddy@my-social.com',
              'frederic.smith@very-serious.com'
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
    form: {
      inputJson: ''
    }
  }),
  watch: {
    'value' () {
      this.form.inputJson = this.value
    }
  },
  created () {
    this.form.inputJson = JSON.stringify(this.example, null, 4)
    this.$emit('change', this.form.inputJson) // init
  },
  methods: {
    onInputJsonChange ($event) {
      console.log('monaco change event', $event)
      this.$emit('input', $event)
      this.$emit('change', $event) // possibly better way
    },
    onFormatJson () {
      this.form.inputJson = this.formatJsonString(this.form.inputJson)
    },
    formatJsonString (jsonString) {
      console.log('formatJsonString')
      try {
        const jsonObj = JSON.parse(jsonString)
        const formattedString = JSON.stringify(jsonObj, null, 4)
        console.log('Finished - formatJsonString')
        return formattedString
      } catch (error) {
        console.log('Finished - formatJsonString error', error)
        return jsonString
      }
    }
  }
}
</script>
<style scoped>

</style>
