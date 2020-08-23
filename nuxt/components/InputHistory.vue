<template id="input-history">
  <v-card v-if="open">
    <v-card-title>JSON Input History</v-card-title>
    <v-card-subtitle>Select JSON from previously run imports.</v-card-subtitle>
    <v-card-text>
      <p>You can even select multiple payloads to combine the data into a single array, but similar data will yield the best table results.</p>
      <p>Optionally, you can include the payloads name and timestamp by selecting the <strong>meta</strong> option.</p>
    </v-card-text>
    <v-card-text style="overflow: auto; position: relative; height:50vh">
      <!-- <v-list two-line subheader>
        <v-subheader inset>
          History
        </v-subheader>

        <v-list-item
          v-for="item in form.history"
          :key="item.name"
          @click="form.selectedJson.push(item)"
        >
          <v-list-item-avatar>
            <v-icon>
              mdi-plus
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="item.time" />
            <v-list-item-subtitle />
            <code>{{ item.name }}</code>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset />
      </v-list> -->

      <!-- WORKINNG METHOD -->
      <v-combobox
        v-model="form.selectedJson"
        class="mt-4"
        open-on-clear
        item-text="name"
        item-value="value"
        :items="form.history"
        label="Select from recent history"
        multiple

        chips
        dense
      >
        <template v-slot:selection="{ attrs, item, parent, selected }">
          <v-chip
            v-if="item === Object(item)"
            class="mt-2"
            v-bind="attrs"
            :color="`${item.color} lighten-3`"
            :input-value="selected"
            label
            small
          >
            <span class="pr-2">
              <code> {{ item.name }}</code>
            </span>
            <v-icon
              small
              color="white"
              @click="parent.selectItem(item)"
            >
              mdi-close
            </v-icon>
          </v-chip>
        </template>
        <template v-slot:item="{ item }">
          <v-layout>
            <v-flex height="200">
              <v-label>
                {{ item.time }}
              </v-label>
            </v-flex>
            <v-flex>
              <code class="ml-4">{{ item.name }}</code>
            </v-flex>
          </v-layout>
        </template>
      </v-combobox>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="open=false">
        Cancel
      </v-btn>

      <v-spacer />
      <v-checkbox v-model="form.includesMeta" label="Include Meta" />
      <v-spacer />
      <v-btn color="green" @click="onChange">
        Send to Sheet
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    history: {
      type: Array,
      default: undefined
    },
    open: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: {
        selectedJson: [],
        history: [],
        includesMeta: false
      }
    }
  },
  computed: {},
  watch: {
    history () {
      this.form.history = this.history
    }
  },
  created () {
    this.form.history = this.history

    // this.form.securityValue = this.apiUrl
  },
  methods: {
    onChange () {
      console.log('JSON selected', this.form.selectedJson)
      if (this.form.includesMeta) {
        this.$emit('data', this.form.selectedJson)
      } else {
        const value = this.form.selectedJson.map(j => j.value)
        this.$emit('data', value)
      }
    }
  },
  template: 'InputHistory'
}
</script>
