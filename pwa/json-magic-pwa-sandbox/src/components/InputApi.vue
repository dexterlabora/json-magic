<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>Import JSON from an API</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="apiForm.showAdvanced=!apiForm.showAdvanced">Extra Settings</v-btn>
    </v-toolbar>
    <v-card-text>
      <v-card color="grey darken-3">
        <v-text-field label="URL Path" v-model="apiForm.url" class="mr-2"></v-text-field>
        <v-text-field small type="password" label="API Key" v-model="apiForm.headerValue"></v-text-field>
      </v-card>
      <v-spacer></v-spacer>
      <v-card v-if="apiForm.showAdvanced">
        <v-checkbox v-model="apiForm.includeHeaders" label="include headers"></v-checkbox>
        <v-label dark>Custom Auth Header</v-label>
        <v-text-field small label="Key" v-model="apiForm.headerKey"></v-text-field>
        <v-spacer></v-spacer>
        <v-card width="70%">
          <v-label dark>API Proxy Server</v-label>

          <v-text-field small label="URL Path" v-model="serverOptions.proxyUrl"></v-text-field>
        </v-card>
      </v-card>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue darken-1" text @click="$emit('close', true)">Close</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="fetchJson" color="green" :loading="isLoading">
        <v-icon>mdi-arrow-right-drop-circle</v-icon>Run API
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const axios = require("axios");
export default {
  name: "input-api",
  data: () => ({
    serverOptions: {
      proxyUrl: "/api/proxy"
    },
    isLoading: false,
    apiForm: {
      url:
        "https://api.meraki.com/api/v1/organizations/537758/inventoryDevices",
      showAdvanced: false,
      includeHeaders: true,
      inputHeaders: `{ "X-Cisco-Meraki-API-Key": "093b24e85df15a3e66f1fc359f4c48493eaa1b73"}`, // DEMO API KEY
      headerKey: "X-Cisco-Meraki-API-Key",
      headerValue: "093b24e85df15a3e66f1fc359f4c48493eaa1b73"
    }
  }),
  watch: {
    open() {
      console.log("inputApi open", this.open);
      this.apiDialog = this.open;
    }
  },
  methods: {
    fetchJson() {
      let options = {
        method: "get", // ONLY ALLOWING GET METHODS (For now)
        url: this.apiForm.url,
        headers: {}
      };

      options.headers[this.apiForm.headerKey] = this.apiForm.headerValue;
      console.log("fetchJson", options);
      this.isLoading = true;
      axios
        .post(this.serverOptions.proxyUrl, options)
        .then(res => {
          console.log("fetchJson ", this.form.url, res);
          this.form.inputJson = JSON.stringify(res.data, null, 4);
          this.inputValue = res.data;
          this.$emit("data", res.data);
        })
        .catch(e => {
          console.log("fetch error", JSON.stringify(e));
          //this.isLoading = false
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>
