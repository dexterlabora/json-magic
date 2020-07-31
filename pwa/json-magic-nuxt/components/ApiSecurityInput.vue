<template id="api-url-input">
  <v-card v-if="open">
    <v-card-text>
      <v-select v-model="form.selectedDef" label="Authorization Method" :items="definitionKeys" />
      <div v-if="selectedDefinitionObj">
        <v-text-field v-model="form.securityValue" :label="form.securityProperty" type="password" @change="onChange" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    securityDefinitions: {
      type: Object,
      default: undefined
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        selectedDef: '',
        definitions: {
          // EXAMPLE
        //   meraki_api_key: {
        //     type: 'apiKey',
        //     name: 'X-Cisco-Meraki-API-Key',
        //     in: 'header'
        //   }
        },
        securityValue: '',
        securityProperty: ''
      }
    }
  },
  computed: {
    apiKey () {
      return this.$store.state.apiKey
    },
    definitionKeys () {
      if (!this.form.definitions) { return }
      return Object.keys(this.form.definitions)
    },
    selectedDefinitionObj () {
      if (!this.form.definitions || !this.form.selectedDef) { return }
      return this.form.definitions[this.form.selectedDef]
    }
  },
  watch: {
    'securityDefinitions' (val) {
      this.form.definitions = val
    },
    'selectedDefinitionObj' () {
      this.applyDefaultValue()
      this.onChange()
    },
    'definitionKeys' () {
      if (!this.definitionKeys) { return }
      this.form.selectedDef = this.definitionKeys[0] // set default
    }
  },
  created () {
    this.form.definitions = this.securityDefinitions

    // this.form.securityValue = this.apiUrl
  },
  methods: {
    applyDefaultValue () {
      if (this.selectedDefinitionObj) {
        if (this.selectedDefinitionObj.name === 'X-Cisco-Meraki-API-Key') {
          this.form.securityValue = this.apiKey
          this.form.securityProperty = this.selectedDefinitionObj.name
        }
      }
    },
    onChange () {
      const headers = {}
      headers[this.form.securityProperty] = this.form.securityValue
      console.log('new headers', headers)
      this.$emit('change', headers)
    }
  },
  template: 'ApiSecurityInput'
}
</script>
