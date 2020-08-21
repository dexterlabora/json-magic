<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>Import JSON from an API</v-toolbar-title>
      <v-spacer />
      <v-btn color="green" outlined @click="apiForm.showAdvanced=!apiForm.showAdvanced">
        Extra Settings
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-card color="grey darken-3">
        <v-text-field v-model="apiForm.url" label="URL Path" class="mr-2" />
      </v-card>
      <v-spacer />
      <v-card v-if="apiForm.showAdvanced">
        <v-checkbox v-model="apiForm.includeHeaders" label="include headers" />
        <v-label dark>
          Custom Auth Header
        </v-label>
        <v-text-field v-model="apiForm.headerKey" small label="Key" />
        <v-text-field v-model="apiForm.headerValue" small type="password" label="API Key" />
        <v-spacer />
        <v-card width="70%">
          <v-label dark>
            API Proxy Server
          </v-label>
          <v-checkbox v-model="serverOptions.enabled" label="Use Proxy" />
          <v-text-field v-model="serverOptions.proxyUrl" small label="URL Path" />
        </v-card>
      </v-card>
      <v-tile v-if="error" color="red">
        {{ error }}
      </v-tile>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue darken-1" text @click="$emit('close', true)">
        Close
      </v-btn>
      <v-spacer />
      <v-btn color="green" :loading="isLoading" @click="fetchJson">
        <v-icon>mdi-arrow-right-drop-circle</v-icon>Run API
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const axios = require('axios')

export default {
  name: 'InputApi',

  data: () => ({
    serverOptions: {
      enabled: true,
      proxyUrl: '/api/proxy'
    },
    isLoading: false,
    inputValue: null,
    apiForm: {
      url:
        'https://api.meraki.com/api/v1/organizations/537758/inventoryDevices',
      showAdvanced: false,
      includeHeaders: false,
      inputHeaders: '{ "X-Cisco-Meraki-API-Key": "093b24e85df15a3e66f1fc359f4c48493eaa1b73"}', // DEMO API KEY
      headerKey: 'X-Cisco-Meraki-API-Key',
      headerValue: '093b24e85df15a3e66f1fc359f4c48493eaa1b73'
    },
    error: undefined

  }),
  watch: {
    open () {
      console.log('inputApi open', this.open)
      this.apiDialog = this.open
    }
  },
  methods: {
    fetchJson () {
      const options = {
        method: 'get', // ONLY ALLOWING GET METHODS (For now)
        url: this.apiForm.url,
        headers: {}
      }
      if (this.apiForm.includeHeaders) {
        options.headers[this.apiForm.headerKey] = this.apiForm.headerValue
      }

      console.log('fetchJson', options)
      this.error = null
      this.isLoading = true
      let url = ''
      if (this.serverOptions.enabled) {
        url = this.serverOptions.proxyUrl
      } else {
        url = options.url
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }

      axios
        .post(url, options)
        .then((res) => {
          console.log('fetchJson response', this.apiForm.url, res)
          this.inputValue = res.data
          this.$emit('data', this.inputValue)
          this.$emit('url', this.apiForm.url)
        })
        .catch((e) => {
          console.log('fetch error', e)
          this.isLoading = false
          this.inputValue = e
          this.$emit('data', this.inputValue)
          this.$emit('url', this.apiForm.url)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
