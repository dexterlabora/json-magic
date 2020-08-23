<template>
  <v-card>
    <v-card-title large>
      Making sense of <v-icon class="pl-2" size="50px">
        mdi-code-json
      </v-icon> like <v-icon class="pl-2" size="50px">
        mdi-auto-fix
      </v-icon>
    </v-card-title>
    <v-card-subtitle>An open source tool to explore complex JSON.</v-card-subtitle>
    <v-card-text>
      Easily interact with Open APIs such as the Cisco Meraki Dashboard API, or just paste in JSON data to begin the magic.
    </v-card-text>
    <v-card-subtitle>
      Getting Started
    </v-card-subtitle>
    <v-card-text>
      <ol>
        <li>
          Paste JSON directly into the editor or select <strong>+ ADD JSON</strong> to import from the web or your local computer
        </li>
        <li>
          Filter the data by using a JSONata expression
        </li>
        <li>
          Run the filter query and view the JSON and Table output
        </li>
        <li>
          Save the Report or export the query, JSON, CSV or HTML
        </li>
      </ol>
    </v-card-text>
    <v-card-text>
      <v-container>
        <v-card>
          <v-card-title>
            Resources
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item><a href="https://github.com/dexterlabora/json-magic" target="_blank">GitHub</a></v-list-item>
              <v-list-item><a href="https://meraki.io" target="_blank">Cisco Meraki Developers</a></v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>
    </v-card-text>
  </v-card>
</template>
