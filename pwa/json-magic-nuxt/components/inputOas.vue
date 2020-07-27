<template id="input-oas">
  <v-card height="900px">
    <v-card-text>
      <v-container>
        <v-flex xs12 md12>
          <v-card>
            <v-toolbar dense>
              <v-toolbar-title>Import JSON from an OpenAPI Spec</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-title class="pb-0">
              <v-select
                v-model="oasForm.specUrlsModel"
                :items="oasForm.specUrls"
                label="Open API Specs"
                outlined
                @change="onSpecUrlSelected($event)"
              />
            </v-card-title>
            <div v-if="parsedSwagger.info">
              <v-card-subtitle>
                <v-toolbar dense>
                  <v-toolbar-title>{{ parsedSwagger.info.title }}</v-toolbar-title>
                  <v-card-subtitle dense>
                    {{ parsedSwagger.info.version }}
                  </v-card-subtitle>

                  <v-spacer />
                  <v-btn icon @click="showAdvanced=!showAdvanced">
                    <v-icon color="green">
                      mdi-cogs
                    </v-icon>
                  </v-btn>
                </v-toolbar>

                <v-card v-if="showAdvanced">
                  <api-key-input />
                  <api-url-input />
                  <!-- <v-label>API Host</v-label>
                  <v-card-actions>
                    <v-btn color="green">
                      Update
                    </v-btn>
                  </v-card-actions>-->
                </v-card>
              </v-card-subtitle>
              <v-card-text>
                <v-layout>
                  <!-- <v-flex xs12 sm6 d-flex>
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

                  <v-flex sm12 sm6>
                    <v-select
                      v-model="selectedGroup.service"
                      :items="getServiceGroups(selectedGroup.domain)"
                      item-text="group"
                      label="Service"
                      outline
                    />
                  </v-flex>-->
                  <!-- TESTING  -->
                  <v-flex sm12 sm6>
                    <v-select
                      v-model="selectedFilters.tag0"
                      :items="tagFilters.tag0"
                      label="Filter"
                      outline
                      @change="onFilterTag0"
                    />
                  </v-flex>
                  <v-flex v-if="tagFilters.tag1.length > 1" sm12 sm6>
                    <v-select
                      v-model="selectedFilters.tag1"
                      :items="tagFilters.tag1"
                      label="Filter"
                      outline
                      @change="onFilterTag1"
                    />
                  </v-flex>
                  <v-flex v-if="tagFilters.tag2.length" sm12 sm6>
                    <v-select
                      v-model="selectedFilters.tag2"
                      :items="tagFilters.tag2"
                      label="Filter"
                      outline
                    />
                  </v-flex>
                </v-layout>
              </v-card-text>
            </div>
          </v-card>

          <v-card v-if="filteredPaths">
            <v-card-text style="overflow: auto;">
              <v-swagger
                :key="filteredPaths.key"
                :spec="filteredPaths"
                :base-url="apiUrl"
                style="height:50vh"
                @data="onData($event)"
              />
            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
import VSwagger from './v-swagger/src/v-swagger'
import ApiKeyInput from './ApiKeyInput'
import ApiUrlInput from './ApiUrlInput'

const jsonata = require('jsonata')

// Vue.use(VSwagger)
export default {
  name: 'InputOas',

  components: {
    VSwagger,
    ApiKeyInput,
    ApiUrlInput
  },

  data () {
    return {
      showAdvanced: false,
      selectedFilters: {
        tag0: '',
        tag1: '',
        tag2: ''
      },
      // selectedGroup: { domain: '', service: '' },
      // groups: [],
      allPaths: {},
      parsedSwagger: {},
      oasForm: {
        selectedSpecUrl: '',
        specUrlsModel: {},
        specUrls: [
          {
            text: 'Meraki API v1-beta',
            value:
              'https://raw.githubusercontent.com/meraki/openapi/v1-beta/openapi/spec2.json'
          },
          {
            text: 'Meraki API v0',
            value:
              'https://raw.githubusercontent.com/meraki/openapi/master/openapi/spec2.json'
          },
          {
            text: 'Pet Store - OAS 2.0 Example',
            value: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/petstore-expanded.json'
          },
          {
            text: 'uspto - OAS 3.0 Example',
            value: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/uspto.json'
          }
        ]
      }
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

    filteredPaths () {
      if (!this.allPaths || !this.selectedFilters) {
        return []
      }
      let filtered = []
      filtered = { ...filtered, ...this.allPaths }
      filtered.key = JSON.stringify(this.selectedFilters) + new Date()
      if (!filtered.request) {
        return
      }
      // Match selection filters to tags
      filtered.request = filtered.request.filter((r) => {
        if (
          r.tags[0] === this.selectedFilters.tag0 &&
          r.tags[2] === this.selectedFilters.tag2
        ) {
          return r
        } else if (
          r.tags[0] === this.selectedFilters.tag0 &&
          !r.tags[2] &&
          this.selectedFilters.tag2 === '/'
        ) {
          return r
        }
      })
      return filtered
    },
    tagFilters () {
      if (!this.allPaths) {
        return
      }
      if (!this.allPaths.request) {
        return
      }
      const filters = {
        tag0: [],
        tag1: [],
        tag2: []
      }

      // tag0
      this.allPaths.request.forEach(p => filters.tag0.push(p.tags[0]))
      const set0 = [...new Set(filters.tag0)]
      filters.tag0 = set0.sort()

      // tag1
      this.allPaths.request.forEach((p) => {
        if (p.tags[0] === this.selectedFilters.tag0) {
          filters.tag1.push(p.tags[1] || '/')
        }
      })
      const set1 = [...new Set(filters.tag1)]
      filters.tag1 = set1.sort()

      // tag2
      this.allPaths.request.forEach((p) => {
        if (
          p.tags[0] === this.selectedFilters.tag0 &&
          p.tags[1] === this.selectedFilters.tag1
        ) {
          filters.tag2.push(p.tags[2] || '/')
        }
      })
      const set2 = [...new Set(filters.tag2)]
      filters.tag2 = set2.sort()

      return filters
    }
  },
  mounted () {
    this.oasForm.specUrlsModel = this.oasForm.specUrls[0] // set default spec
    this.oasForm.selectedSpecUrl = this.oasForm.specUrls[0].value
    this.initSwagger()
  },

  methods: {
    onFilterTag0 () {
      if (!this.tagFilters) {
        return
      }
      if (!this.tagFilters.tag1) {
        return
      }
      this.selectedFilters.tag1 = this.tagFilters.tag1[0]
      if (!this.tagFilters.tag2) {
        return
      }
      this.selectedFilters.tag2 = this.tagFilters.tag2[0]
    },
    onFilterTag1 () {
      if (!this.tagFilters.tag2) {
        return
      }
      this.selectedFilters.tag2 = this.tagFilters.tag2[0]
    },
    // onFilterTag2(){
    //   if (!this.tagFilters.tag3) { return }
    //   this.selectedFilters.tag3 = this.tagFilters.tag3[0]
    // },
    onSpecUrlSelected (data) {
      this.oasForm.selectedSpecUrl = data // for posterity
      this.initSwagger(this.oasForm.selectedSpecUrl)
    },
    onData (data) {
      console.log('inputOas relay data', data)
      this.$emit('data', data)
    },

    initSwagger () {
      this.fetchOasSpec().then((parsed) => {
        this.parsedSwagger = parsed

        // Swagger 2
        if (this.parsedSwagger.swagger) {
          const jsonExpression = jsonata(`(
            $requestArray := $.paths.*#$pi.*#$i.{
                "key": $i,
                "url": $keys(%.%)[$pi],
                "method": $keys(%)[$i],
                "description": description,
                "operationId": operationId,
                "tags": (tags ? tags : [$keys(%.%)[$pi]])
            };

            {
                "host": schemes[0] & "://" & host & basePath,
                "title": info.title,
                "description": info.description,
                "opened": true,
                "request":$requestArray
            };
            )`)
          this.allPaths = jsonExpression.evaluate(parsed)

        // OAS v3
        } else if (this.parsedSwagger.openapi) {
          const jsonExpression = jsonata(`/* OAS v3 */
(
            $requestArray := $.paths.*#$pi.*#$i.{
                "key": $i,
                "url": $keys(%.%)[$pi],
                "method": $keys(%)[$i],
                "description": description,
                "operationId": operationId,
                "tags": (tags ? tags : [$keys(%.%)[$pi]])
            };

            {
                "host": $replace(servers[0].url,'{scheme}',servers[0].variables.scheme.default),
                "title": info.title,
                "description": info.description,
                "opened": true,
                "request":$requestArray
            };
            )`)
          this.allPaths = jsonExpression.evaluate(parsed)
        }

        // init first filter

        // Specific to Meraki
        this.adjustDefaultSelections()

        this.onFilterTag0()
        this.$store.commit('setApiUrl', this.allPaths.host)
        console.log('this.allPaths.host', this.allPaths.host)
      })
    },
    adjustDefaultSelections () {
      if (!this.parsedSwagger.info) { return }
      let i = 0
      if (this.parsedSwagger.info.version.substring(0, 1) === '0') {
        i = this.tagFilters.tag0.indexOf('Organizations')
      } else if (this.parsedSwagger.info.version.substring(0, 1) === '1') {
        i = this.tagFilters.tag0.indexOf('organizations')
      }
      this.selectedFilters.tag0 =
        i > 0 ? this.tagFilters.tag0[i] : this.tagFilters.tag0[0]
    },
    fetchOasSpec () {
      return axios
        .get(this.oasForm.selectedSpecUrl)
        .then((res) => {
          return res.data
        })
        .catch(e => console.log('axios openapiSpec get error ', e))
    }
  }
}
</script>
