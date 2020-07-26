<template id="api-url-input">
  <v-card>
    <v-card-text>
      <v-text-field v-model="form.apiUrl" label="API Base URL" @change="updateApiUrl" />
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  data () {
    return {
      form: {
        apiUrl: ''
      }
    }
  },
  computed: {
    apiUrl () {
      return this.$store.state.apiUrl
    }
  },
  watch: {
    'apiUrl' () {
      this.form.apiUrl = this.apiUrl
    }
  },
  mounted () {
    this.form.apiUrl = this.apiUrl
  },
  methods: {
    updateApiUrl () {
      this.$store.commit('setApiUrl', this.form.apiUrl)
    }
  },
  template: '#api-url-input'
}
</script>
