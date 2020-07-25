<template>
  <div :class="['request', method.toLowerCase(), isOpened]">
    <div :class="['request-item']" @click="open = !open">
      <v-layout column>
        <v-flex class="sm12 md12">
          <strong class="description">{{ description }}</strong>
        </v-flex>
        <v-flex class="sm4 md4">
          <v-btn small :color="methodColors[method]">
            {{ method }}
          </v-btn>
        </v-flex>
        <v-flex class="sm8 md8">
          <div class="path">
            {{ url }}
          </div>
        </v-flex>
      </v-layout>
    </div>
    <params-table v-show="open" :params="sourceList" :method="method" :description="description" @data="onData($event)" />
  </div>
</template>

<script>
import ParamsTable from './params-table.vue'

export default {

  components: {
    ParamsTable
  },
  props: {
    description: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: '/'
    },
    params: {
      type: Array,
      default: () => {
        return []
      }
    },
    headers: {
      type: Array,
      default: () => {
        return []
      }
    },
    path: {
      type: Array,
      default: () => {
        return []
      }
    },
    body: {
      type: Object,
      default: () => {
        return {}
      }
    },
    method: {
      type: String,
      default: 'GET'
    },
    open: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      methodColors: {
        put: 'orange',
        get: 'green',
        delete: 'red',
        post: 'blue'
      },
      opened: this.open || true,
      spec: this.$parent.spec,
      dataHeaders: this.parseHeaders(this.headers),
      dataBody: this.parseBody(this.body),
      dataPath: this.parsePath(this.path),
      dataQuery: this.parseQuery(this.params)
    }
  },
  computed: {
    isOpened () {
      return this.open
    },

    host () {
      return this.$parent.host
    },

    sourceList () {
      return [].concat(
        this.dataPath,
        this.dataHeaders,
        this.dataBody,
        this.dataQuery
      )
    }
  },
  methods: {
    onData (data) {
      console.log('relay onData', data)
      this.$emit('data', data)
    },
    parsePath () {
      const paths = this.url
        .split('/')
        .filter((it) => {
          return it.indexOf('{') === 0 && it.indexOf('}') === it.length - 1
        })
        .map((it) => {
          return it.replace(/\{/g, '').replace(/\}/g, '')
        })

      return paths.map((key) => {
        let obj = this.path.filter((it) => {
          return it.key === key
        })[0]

        if (!obj) {
          obj = { key, value: '' }
        }

        if (typeof obj === 'string') {
          obj = { key, value: obj }
        }

        return Object.assign(
          {
            source: 'path',
            required: true,
            type: 'string',
            description: ''
          },
          this.parseItems(obj)
        )
      })
    },

    /**
     * request headers
     *
     * {
     *  Authorization: 'Bearer {{access_token}}'
     * }
     *
     * {{xxx}} 로 시작되는건 외부에서 입력받을 수 있는 변수로 대체됨
     *
     */
    parseHeaders (headers) {
      return headers.map((obj) => {
        obj.params = this.parseHeaderValue(obj.description)

        return Object.assign(
          {
            source: 'header',
            type: 'string',
            required: true,
            description: ''
          },
          this.parseItems(obj)
        )
      })
    },
    /**
     * body
     *
     * {
     *  data : { a: 1, b: 2, c: 3 },
     *  contentType: 'application/json'
     * }
     *
     * or
     *
     * {
     *  data : "{ a: 1, b: 2, c: 3 }",
     *  contentType: 'text/plain'
     * }
     *
     */

    parseBody (body) {
      if (!body.data) { return [] }

      if (typeof body.data === 'string') {
        body.dataValue = body.data + ''
      } else if (typeof body.data === 'object') {
        body.dataValue = JSON.stringify(body.data, null, 4)
      }

      return [
        Object.assign(
          {
            source: 'body',
            key: 'body',
            contentType: 'application/json',
            required: false,
            description: ''
          },
          body
        )
      ]
    },

    /**
     * query string
     *
     * [
     *   { key : 'xxx', value : 'xxx', type: 'string', defalut: 'xxx' , description : 'xxx', required: true },
     * ]
     *
     */
    parseQuery (params) {
      return Object.keys(params).map((key) => {
        let obj = params[key]

        if (typeof obj === 'string') {
          obj = { key, value: obj }
        }

        return Object.assign(
          {
            source: 'query',
            type: 'string',
            required: false, // not dynamic --cory
            description: ''
          },
          this.parseItems(obj)
        )
      })
    },
    parseHeaderValue (headerValue) {
      const arr = headerValue.match(/\{\{(.*)\}\}/g)
      return arr.map((it) => {
        const key = it.replace(/\{/g, '').replace(/\}/g, '')
        return { key, value: '' }
      })
    },
    parseItems (item) {
      if (!item.items) { return item }
      console.log('DEBUG parseItems ', item)
      // item.items = (item.items || []).map((it, index) => {
      item.items = ([item.items] || []).map((it, index) => {
        if (typeof it === 'string') {
          it = { text: it, value: it }
        }

        if (index === 0) {
          it.selected = true
          item.inputValue = it.value
        }

        return it
      })

      return item
    }
  }
}
</script>

<style scoped lang="scss">
.request {
  border: 1px solid #000;
  border-radius: 4px;
  margin: 0 0 15px;

  .request-item {
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  &.post {
    .method {
      background: #49cc90;
    }
  }

  &.put {
    .method {
      background: #fca130;
    }
  }

  &.get {
    .method {
      background: #61affe;
    }
  }

  &.delete {
    .method {
      background: #f93e3e;
    }
  }

  .method {
    font-size: 14px;
    font-weight: 700;
    min-width: 80px;
    padding: 6px 15px;
    text-align: center;
    border-radius: 3px;
    background: #000;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
    font-family: sans-serif;
    color: #fff;
    text-transform: uppercase;
    box-sizing: border-box;
  }

  .path {
    font-size: 12px;
    display: flex;
    flex: 0 3 auto;
    align-items: center;
    word-break: break-all;
    padding: 0 10px;
    font-family: monospace;
    font-weight: 600;
    color: rgb(102, 102, 102);
    box-sizing: border-box;
  }

  .description {
    font-size: 13px;
    flex: 1;
    font-family: sans-serif;
    color: #fff;
  }
}
</style>
