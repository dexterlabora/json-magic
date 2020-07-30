<template>
  <!-- <v-container fluid> -->
  <v-combobox
    v-model="model"
    :filter="filter"
    :hide-no-data="!search"
    :items="items"
    item-text="text"
    item-value="value"
    :search-input.sync="search"
    label="Select an API or paste in an OAS JSON link"
    solo
    small-chips
  >
    <!-- <template v-slot:no-data>
      <v-list-item>
        <span class="subheading"><v-btn @click="items.push(model)">Add API<v-btn /></v-btn></span>
      </v-list-item>
    </template> -->
    <template v-slot:selection="{ attrs, item, parent, selected }">
      <v-chip
        v-if="item === Object(item)"
        v-bind="attrs"
        :color="`${item.color} `"
        :input-value="selected"
        label
        small
      >
        <span class="pr-2">
          {{ item.text }}
        </span>
        <v-icon

          @click="parent.selectItem(item)"
        />
      </v-chip>
    </template>
    <template v-slot:item="{ index, item }">
      <v-text-field
        v-if="editing === item"
        v-model="editing.text"
        autofocus
        flat
        background-color="transparent"

        solo
        @keyup.enter="edit(index, item)"
      />
      <v-chip
        v-else
        :color="`${item.color} `"
        dark
        label
        small
      >
        {{ item.text }}
      </v-chip>
      <v-spacer />
      <v-list-item-action v-if="item.custom" @click.stop>
        <v-btn
          icon
          @click.stop.prevent="edit(index, item)"
        >
          <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </v-combobox>
  <!-- </v-container> -->
</template>
<script>
export default {
  data: () => ({
    activator: null,
    attach: null,
    colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
    editing: null,
    index: -1,
    items: [
      { header: 'Select an API or paste in an OAS JSON link' },
      {
        text: 'Meraki API v1-beta',
        value:
            'https://raw.githubusercontent.com/meraki/openapi/v1-beta/openapi/spec2.json',
        color: 'green'
      },
      {
        text: 'Meraki API v0',
        value:
            'https://raw.githubusercontent.com/meraki/openapi/master/openapi/spec2.json',
        color: 'green'
      },
      {
        text: 'Pet Store - OAS 2.0 Example',
        value: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/petstore-expanded.json',
        color: 'gray'

      },
      {
        text: 'Uber Example',
        value: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/uber.json',
        color: 'gray'

      },

      {
        text: 'uspto - OAS 3.0 Example',
        value: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/uspto.json',
        color: 'gray'
      }
    ],
    nonce: 1,
    menu: false,
    model:
      {
        text: 'Meraki API v1-beta',
        value: 'https://raw.githubusercontent.com/meraki/openapi/v1-beta/openapi/spec2.json',
        color: 'green'
      },
    x: 0,
    search: null,
    y: 0
  }),

  watch: {
    model (val, prev) {
      if (!val) { return }
      if (val === prev) { return }
      if (typeof val === 'string') {
        const v = {
          text: val,
          value: val,
          custom: true

        }

        this.items.push(v)

        this.nonce++
      }
      console.log('specSelected', this.model)
      this.$emit('change', this.model)
    }
  },
  created () {
    this.$emit('change', this.model)
  },

  methods: {
    edit (index, item) {
      if (!this.editing) {
        this.editing = item
        this.index = index
      } else {
        this.editing = null
        this.index = -1
      }
    },
    filter (item, queryText, itemText) {
      if (item.header) { return false }

      const hasValue = val => val != null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .includes(query.toString().toLowerCase())
    }
  }
}
</script>
