<template id="api-key-input">
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="form.apiKey"
        label="API Key"
        :type="showApiKey ? 'text' : 'password'"
        :append-icon="showApiKey ? 'mdi-visibility_off' : 'mdi-visibility'"
        @click:append="showApiKey = !showApiKey"
        @change="updateApiKey"
      />
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  data () {
    return {
      showApiKey: false,
      form: {
        apiKey: ''
      }
    }
  },
  computed: {
    apiKey () {
      return this.$store.state.apiKey
    }
  },
  mounted () {
    this.form.apiKey = this.apiKey
  },
  methods: {
    updateApiKey () {
      this.$store.commit('setApiKey', this.form.apiKey)
    }
  },
  template: '#api-key-input'
}
</script>
