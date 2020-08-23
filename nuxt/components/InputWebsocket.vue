<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>Websocket Configuration</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-text>
      <v-card-subtitle>
        This enables you to receive dynamic updates from a
        websocket server.
      </v-card-subtitle>
      <v-card color="grey darken-3">
        <v-card-text>
          <v-text-field v-model="wsForm.url" label="URL Path" class="ml-2" />
          <v-checkbox v-model="wsForm.enabled" label="enabled" />
        </v-card-text>
      </v-card>
      <v-spacer />
      <v-spacer />
      <v-icon :color="isConnected ? 'green': 'red'" class="mr-2">
        mdi-cloud
      </v-icon>

      {{ wsForm.url }}
    </v-card-text>

    <v-card-actions>
      <v-btn color="blue darken-1" text @click="$emit('close', true)">
        Close
      </v-btn>
      <v-spacer />
      <v-btn color="green" @click="onUpdateWebsocket">
        <v-icon>mdi-arrow-right-drop-circle</v-icon>Update Websocket
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'WebsocketConfig',

  data: () => ({
    socket: null, // move to store
    isConnected: false, // move to store
    wsForm: {
      url: `ws://localhost:${location.port}/websocket`,
      enabled: true
    },
    rawInput: null
  }),
  methods: {
    onUpdateWebsocket () {
      console.log('onUpdateWebsocket')
      if (this.socket) {
        console.log('closing socket')
        this.socket.close()
      }

      if (this.wsForm.enabled) {
        console.log('enabling socket')
        this.socket = new WebSocket(this.wsForm.url)

        this.initWebsocket()
      }
    },
    initWebsocket () {
      this.socket.onopen = () => {
        console.log('socket open')
        this.isConnected = true
      }
      this.socket.onclose = () => {
        this.isConnected = false
      }
      this.socket.onmessage = (msg) => {
        console.log('socket message', msg)
        this.rawInput = msg.data
        this.$emit('data', msg.data)
      }
    },
    watch: {
      socket () {
        this.$emit('socket', this.socket)
      }
    }
  }
}
</script>
