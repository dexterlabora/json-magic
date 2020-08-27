
export const state = () => ({
  apiKey: '093b24e85df15a3e66f1fc359f4c48493eaa1b73', // Meraki Sandbox
  apiUrl: 'https://api.meraki.com/api/v1', // "https://localhost:8080",
  net: {},
  nets: [],
  org: {},
  orgs: []
  // toggleView: {
  //   a: true,
  //   b: true,
  //   c: true
  // },
  // toggleInput: true,
  // toggleJsonata: true,
  // toggleTableify: true
})

export const mutations = {
  // setToggleView: (state, payload) => { Object.assign(state.toggleView, payload) },
  // setToggleView (state, payload) {
  //   console.log('adding toggle to state', payload)
  //   // state.toggleView = payload
  //   state.toggleView.splice(index, 1, payload)
  // },
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
  }
  // toggleInput: (state, payload) => { console.log('toggleInput state payload', payload); state.toggleInput = payload },
  // toggleJsonata: (state, payload) => { state.toggleJsonata = payload },
  // toggleTableify: (state, payload) => { state.toggleTableify = payload }

}
