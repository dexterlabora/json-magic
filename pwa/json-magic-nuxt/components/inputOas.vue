<template id="input-oas">
  <v-card height="700px">
    <v-card-text>
      <v-container>
        <v-flex xs12 md12>
          <v-card>
            <v-card-text>
              <v-layout>
                <v-flex xs12 sm6 d-flex>
                  <v-select
                    v-model="selectedGroup.domain"
                    :items="domains"
                    item-text="group"
                    label="Domain"
                    outline
                    @change="onSelectedGroup"
                  />
                  <v-spacer />
                </v-flex>
                <v-flex>
                  <v-select
                    v-model="selectedGroup.service"
                    :items="getServiceGroups(selectedGroup.domain)"
                    item-text="group"
                    label="Service"
                    outline
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card v-if="filteredGroup">
            <v-card-text style="overflow: auto;">
              <v-swagger :key="filteredGroup.key" :spec="filteredGroup" :base-url="apiUrl" style="height:55vh" @data="onData($event)" />
            </v-card-text>
          </v-card>
        </v-flex>

        <v-footer app>
          <v-label>Base URL</v-label>
          <v-spacer />
          <strong>{{ allPaths.host }}</strong>

          <v-label>Version {{ allPaths.version }}</v-label>
          <v-spacer />

          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
import VSwagger from './v-swagger/src/v-swagger'

const jsonata = require('jsonata')

// Vue.use(VSwagger)
export default {
  name: 'InputOas',

  components: {
    VSwagger
  },

  data () {
    return {
      selectedGroup: { domain: '', service: '' },
      groups: [],
      allPaths: {},

      parsedSwagger: {}
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading
    },
    apiKey () {
      return this.$store.state.apiKey
    },
    apiUrl () {
      return this.$store.state.apiUrl
    },
    org () {
      return this.$store.state.org
    },
    net () {
      return this.$store.state.net
    },
    filteredGroup () {
      if (!this.allPaths || !this.selectedGroup) {
        return []
      }
      let filtered = []
      filtered = { ...filtered, ...this.allPaths }
      filtered.key = JSON.stringify(this.selectedGroup) + new Date()
      if (!filtered.request) {
        return
      }
      // Match selection filters to tags
      filtered.request = filtered.request.filter((r) => {
        if (
          r.tags[0] === this.selectedGroup.domain &&
          r.tags[2] === this.selectedGroup.service
        ) {
          return r
        } else if (
          r.tags[0] === this.selectedGroup.domain &&
          !r.tags[2] &&
          this.selectedGroup.service === '...'
        ) {
          return r
        }
      })
      return filtered
    },
    domains () {
      if (!this.allPaths.request) {
        return []
      }
      const array = []
      this.allPaths.request.forEach(p => array.push(p.tags[0]))
      const uniqueArray = [...new Set(array)]
      return uniqueArray.sort()
    }
  },
  mounted () {
    this.initSwagger()
  },

  methods: {
    onData (data) {
      console.log('inputOas relay data', data)
      this.$emit('data', data)
    },
    getServiceGroups (domain) {
      if (!this.allPaths.request) {
        return []
      }
      const array = []
      this.allPaths.request.forEach((p) => {
        if (!p) {
          return
        }
        if (p.tags[0] === domain) {
          array.push(p.tags[2] || '...')
        }
      })
      const uniqueArray = [...new Set(array)]
      return uniqueArray.sort()
    },

    initSwagger () {
      this.fetchOasSpec().then((parsed) => {
        this.parsedSwagger = parsed

        this.groups = [...this.groups, ...parsed.tags.map(t => t.name)]
        // this.oasTree.items = this.generateOasTree(parsed);

        const jsonExpression = jsonata(`(
            $requestArray := $.paths.*#$pi.*#$i.{
                "key": $i,
                "url": $keys(%.%)[$pi],
                "method": $keys(%)[$i],
                "description": description,
                "operationId": operationId,
                "tags": tags
            };

            {
                "host": "${this.apiUrl}",
                "title": "Meraki Dashboard API",
                "description": "Cisco Meraki API",
                "opened": true,
                "request":$requestArray
            };
            )`)
        this.allPaths = jsonExpression.evaluate(parsed)

        // this.allPaths = oasReporter.generateSwaggerPathsVue(parsed, {
        //   baseUrl: this.apiUrl
        // });
      })
    },

    onSelectedGroup () {
      if (!this.selectedGroup) {
        return
      }
      // set default
      this.selectedGroup.service = '...'
    },
    onSelectedService () {
      if (!this.selectedGroup) {
        return
      }
      this.selectedGroup.service = '...'
      //   this.selectedGroup = this.groupReports[0]; // set default report
    },
    fetchOasSpec () {
      return axios
        .get(
          'https://raw.githubusercontent.com/meraki/openapi/v1-beta/openapi/spec2.json'
        )
        .then((res) => {
          return res.data
        })
        .catch(e => console.log('axios openapiSpec get error ', e))
    },
    handleError (error, errorTitle, action) {
      console.log('handleError error: ', error)
      this.$store.commit('setLoading', false)
      console.log(errorTitle)
      if (error.errorCode === 400) {
        console.log('Bad request, often due to missing a required parameter.')
        this.$store.commit('setSnackbar', {
          msg: 'Bad request, often due to missing a required parameter.',
          color: 'danger'
        })
      } else if (error.errorCode === 401) {
        console.log('No valid API key provided.')
        this.$store.commit('setSnackbar', {
          msg: 'No valid API key provided.',
          color: 'danger'
        })
      } else if (error.errorCode >= 500 && error.errorCode < 600) {
        console.log('Server error')
        this.$store.commit('setSnackbar', {
          msg: 'Server error or invalid parameters',
          color: 'danger'
        })
      } else if (error.errorCode === 404) {
        console.log(
          "The requested resource doesn't exist or you do not have permission"
        )
        this.$store.commit('setSnackbar', {
          msg:
            "The requested resource doesn't exist or you do not have permission",
          color: 'danger'
        })
      } else {
        console.log("Welp, that's not good: ", action)
        this.$store.commit('setSnackbar', {
          msg: error.Error ? error.Error : error,
          color: 'danger'
        })
      }
    }
  }
}
</script>
