
export const state = () => ({
  apiKey: '093b24e85df15a3e66f1fc359f4c48493eaa1b73', // Meraki Sandbox
  apiUrl: 'https://api.meraki.com/api/v1', // "https://localhost:8080",
  net: {},
  nets: [],
  org: {},
  orgs: []
})

export const mutations = {
  setApiKey: (state, payload) => {
    state.apiKey = payload
    // meraki.setApiKey(payload);
    // merakiSdk.Configuration.xCiscoMerakiAPIKey = payload;
  },
  setApiUrl (state, payload) {
    state.apiUrl = payload
    // meraki.setDomain(payload);
    // merakiSdk.Configuration.BASEURI = payload;
  },
  setNet (state, payload) {
    state.net = payload
  },
  setNets: (state, payload) => (state.nets = payload),
  setOrg (state, payload) {
    state.org = payload
  },
  setOrgs: (state, payload) => (state.orgs = payload)
}
