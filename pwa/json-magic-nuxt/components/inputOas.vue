<template id="input-oas">
  <v-card height="800px">
    <!-- <v-card-text> -->
    <!-- <v-container> -->
    <v-flex xs12 md12>
      <!-- <v-card> -->
      <v-toolbar dense>
        <v-btn
          @click="$emit('close',true)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Import from an OpenAPI</v-toolbar-title>
      </v-toolbar>

      <v-spacer />
      <input-oas-spec-select @change="onSpecUrlSelected($event)" />

      <div v-if="parsedSwagger">
        <v-div v-if="parsedSwagger.info">
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

          <v-card width="800px">
            <!-- <api-key-input />
                  <api-url-input />-->
            <api-security-input
              :open="showAdvanced"
              :security-definitions="allPaths.securityDefinitions"
              @change="onSecurityHeaders($event)"
            />
            <!-- <v-label>API Host</v-label>
                  <v-card-actions>
                    <v-btn color="green">
                      Update
                    </v-btn>
                  </v-card-actions>-->
          </v-card>
        </v-div>
        <v-card-text v-if="tagFilters">
          <v-form v-model="valid">
            <!-- <v-container> -->
            <v-row>
              <v-col cols="12" md="4" class="pt-0">
                <v-select
                  v-model="selectedFilters.tag0"
                  class="pt-0"
                  :items="tagFilters.tag0"
                  label="Filter"
                  outline
                  @change="onFilterTag0"
                />
              </v-col>

              <v-col v-if="tagFilters.tag1.length > 1" cols="12" md="4" class="pt-0">
                <v-select
                  v-model="selectedFilters.tag1"
                  class="pt-0"
                  :items="tagFilters.tag1"
                  label="Filter"
                  outline
                  @change="onFilterTag1"
                />
              </v-col>

              <v-col v-if="tagFilters.tag2.length" cols="12" md="4" class="pt-0">
                <v-select
                  v-model="selectedFilters.tag2"
                  class="pt-0"
                  :items="tagFilters.tag2"
                  label="Filter"
                  outline
                />
              </v-col>
            </v-row>
            <v-row style="background-color: grey;">
              <v-col cols="12" md="12">
                <div v-if="filteredPaths">
                  <!-- <v-card-text style="overflow: auto; position: relative;"> -->
                  <v-swagger
                    :key="filteredPaths.key"
                    background-color="grey"
                    style="overflow: auto; position: relative; height:50vh"
                    :spec="filteredPaths"
                    :base-url="apiUrl"
                    :security-headers="this.securityHeaders"

                    @data="onData($event)"
                  />
                  <!-- </v-card-text> -->
                </div>
              </v-col>
            </v-row>
            <!-- </v-container> -->
          </v-form>
        </v-card-text>
      </div>
      <!-- </v-card> -->
    </v-flex>
    <!-- </v-container> -->
    <!-- </v-card-text> -->
  </v-card>
</template>

<script>
import axios from 'axios'
import VSwagger from './v-swagger/src/v-swagger'
// import ApiKeyInput from './ApiKeyInput'
// import ApiUrlInput from './ApiUrlInput'
import ApiSecurityInput from './ApiSecurityInput'
import InputOasSpecSelect from './InputOasSpecSelect'

const jsonata = require('jsonata')

// Vue.use(VSwagger)
export default {
  name: 'InputOas',

  components: {
    VSwagger,
    // ApiKeyInput,
    // ApiUrlInput,
    InputOasSpecSelect,
    ApiSecurityInput
  },

  data () {
    return {
      securityHeaders: {},
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
        selectedSpecUrl: ''
        // specUrlsModel: {},
        // specUrls: [
        //   {
        //     text: 'Meraki API v1-beta',
        //     value:
        //       'https://raw.githubusercontent.com/meraki/openapi/v1-beta/openapi/spec2.json'
        //   },
        //   {
        //     text: 'Meraki API v0',
        //     value:
        //       'https://raw.githubusercontent.com/meraki/openapi/master/openapi/spec2.json'
        //   },
        //   {
        //     text: 'Pet Store - OAS 2.0 Example',
        //     value: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/petstore-expanded.json'
        //   },
        //   {
        //     text: 'uspto - OAS 3.0 Example',
        //     value: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/uspto.json'
        //   }
        // ]
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
    // this.oasForm.specUrlsModel = this.oasForm.specUrls[0] // set default spec
    // this.oasForm.selectedSpecUrl = this.oasForm.specUrls[0].value
    this.initSwagger()
  },

  methods: {
    onSecurityHeaders (data) {
      this.securityHeaders = data
    },
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
      console.log('onSpecUrlSelected', data)
      this.oasForm.selectedSpecUrl = data.value
      this.initSwagger(data.value)
    },
    onData (data) {
      console.log('inputOas relay data', data)
      this.$emit('data', data)
    },

    initSwagger () {
      this.fetchOasSpec(this.oasForm.selectedSpecUrl).then((parsed) => {
        this.parsedSwagger = parsed

        // Swagger 2
        if (!this.parsedSwagger) {
          return
        }
        if (this.parsedSwagger.swagger) {
          const jsonExpression = jsonata(`(
            $requestArray := $.paths.*#$pi.*#$i.{
                "key": $i,
                "url": $keys(%.%)[$pi],
                "method": $keys(%)[$i],
                "description": description,
                "operationId": operationId,
                "params": parameters,
                "tags": (tags ? tags : [$keys(%.%)[$pi]])
            };

            {
                "host": schemes[0] & "://" & host & basePath,
                "title": info.title,
                "description": info.description,
                "securityDefinitions":securityDefinitions,
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
                "params": parameters,
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
      if (!this.parsedSwagger) {
        return
      }
      if (!this.parsedSwagger.info) {
        return
      }
      let i = 0
      if (this.parsedSwagger.info.version.substring(0, 1) === '0') {
        i = this.tagFilters.tag0.indexOf('Organizations')
      } else if (this.parsedSwagger.info.version.substring(0, 1) === '1') {
        i = this.tagFilters.tag0.indexOf('organizations')
      }
      this.selectedFilters.tag0 =
        i > 0 ? this.tagFilters.tag0[i] : this.tagFilters.tag0[0]
    },
    fetchOasSpec (specUrl) {
      return axios
        .get(specUrl)
        .then((res) => {
          return res.data
        })
        .catch((e) => {
          console.log('axios openapiSpec get error ', e)
          return e
        })
    }
  }
}
</script>
