<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <about />
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"

      app
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-btn
        icon
        to="/"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn> -->
      <v-toolbar-title color="green" v-text="title" />

      <v-spacer />

      <v-btn small @click="onToggleView('a')">
        <v-icon>{{ form.toggleView.a ? "mdi-arrow-expand-all" : "mdi-arrow-collapse-all" }}</v-icon> Input
      </v-btn>
      <v-btn small @click="onToggleView('b')">
        <v-icon>{{ form.toggleView.b ? "mdi-arrow-expand-all" : "mdi-arrow-collapse-all" }}</v-icon> Filter
      </v-btn>
      <v-btn small @click="onToggleView('c')">
        <v-icon>{{ form.toggleView.c ? "mdi-arrow-expand-all" : "mdi-arrow-collapse-all" }}</v-icon> Table
      </v-btn>
      <v-spacer />
      <v-btn class="mr-2" color="grey darken-2" small @click="$nuxt.$emit('toggleImportReportDialog')">
        <v-icon>mdi-upload</v-icon> Import Report
      </v-btn>

      <v-text-field v-model="form.reportName" color="green" dense style="padding-top: 25px; padding-right: 10px; width: 20px" outlined label="Report Name" />
      <v-btn small color="green" tile dark @click="onExportReport($event)">
        <v-icon small>
          mdi-content-save
        </v-icon>Save
      </v-btn>

      <!-- <v-btn
        icon
        to="/inspire"
      >
        <v-icon>mdi-information</v-icon>
      </v-btn> -->
      <!-- <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>

      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import about from '../pages/about'
export default {
  components: {
    about
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      form: {
        inputReportFile: undefined,
        toggleView: {
          a: true,
          b: true,
          c: true
        },
        reportName: `New JSON Magic Report ${this.getDateString()}`
      },

      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/'
        },
        {
          icon: 'mdi-information',
          title: 'About',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: false,
      rightDrawer: false,
      title: 'JSON Magic'
    }
  },

  created () {
    this.$nuxt.$on('reportName', (name) => {
      console.log('new report name', name)
      this.form.reportName = name
    })
  },

  methods: {
    getDateString () {
      const date = new Date()
      const year = date.getFullYear()
      const month = `${date.getMonth() + 1}`.padStart(2, '0')
      const day = `${date.getDate()}`.padStart(2, '0')
      return `${day}-${month}-${year}`
    },

    onExportReport (event) {
      event.stopPropagation()
      this.$nuxt.$emit('exportReport', this.form.reportName)
    },
    onToggleView (event) {
      console.log('event', event)
      console.log('this.form.toggleView[event]', this.form.toggleView[event])
      this.form.toggleView[event] = !this.form.toggleView[event]

      switch (event) {
        case 'a':
          this.$nuxt.$emit('toggleViewInput', this.form.toggleView.a)
          break
        case 'b':
          this.$nuxt.$emit('toggleViewFilter', this.form.toggleView.b)
          break
        case 'c':
          this.$nuxt.$emit('toggleViewTable', this.form.toggleView.c)
      }
    }
  }
}
</script>
<style >
.v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
    min-height: 38px;
    width: 150px;
}
</style>
