<template>
  <v-app>
    <v-app-bar app clipped-left dark color="green darken-4">
                <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
                <v-toolbar-title>JSON Magic <v-icon>mdi-view-dashboard-outline</v-icon>

                </v-toolbar-title>
            </v-app-bar>

    <v-main>
      <Dashboard />
    </v-main>
    <!-- <v-footer app>
                <span>DexterLabora &copy; {{ new Date().getFullYear() }}</span>
                <v-spacer></v-spacer>
                <v-icon :color="wsForm.isConnected ? 'green': 'red'" class="mr-2">mdi-cloud</v-icon>
                <div class=".text-sm-body-1">{{wsForm.url}}</div>
            </v-footer> -->
  </v-app>
</template>

<script>
import Dashboard from "./components/Dashboard";

export default {
  name: "App",

  components: {
    Dashboard
  },

  data: () => ({
    //
  }),
  created(){
    this.$vuetify.theme.dark = true;
  }
};
</script>


