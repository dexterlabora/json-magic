<template>
  <v-card>
    <v-card-title>JSONata Query Tips and Tricks</v-card-title>
    <v-card-subtitle>
      Operators
    </v-card-subtitle>
    <v-card-text>
      <v-layout>
        <v-flex>
          <v-card-subtitle>
            Path
          </v-card-subtitle>
          <v-card-text>
            <v-list two-line dense>
              <v-list-item-content v-for="item in tips.pathOperators" :key="item.name">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle><code>{{ item.query }}</code></v-list-item-subtitle>
              </v-list-item-content>
            </v-list>
          </v-card-text>
        </v-flex>
        <v-flex>
          <v-card-subtitle>
            Numeric
          </v-card-subtitle>
          <v-card-text>
            <v-list two-line dense>
              <v-list-item-content v-for="item in tips.numericOperators" :key="item.name">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle><code>{{ item.query }}</code></v-list-item-subtitle>
              </v-list-item-content>
            </v-list>
          </v-card-text>
        </v-flex>
        <v-flex>
          <v-card-subtitle>
            Comparison
          </v-card-subtitle>
          <v-card-text>
            <v-list two-line dense>
              <v-list-item-content v-for="item in tips.comparisonOperators" :key="item.name">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle><code>{{ item.query }}</code></v-list-item-subtitle>
              </v-list-item-content>
            </v-list>
          </v-card-text>
        </v-flex>
        <v-flex>
          <v-card-subtitle>
            Boolean
          </v-card-subtitle>
          <v-card-text>
            <v-list two-line dense>
              <v-list-item-content v-for="item in tips.booleanOperators" :key="item.name">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle><code>{{ item.query }}</code></v-list-item-subtitle>
              </v-list-item-content>
            </v-list>
          </v-card-text>
        </v-flex>
        <v-flex>
          <v-card-subtitle>
            Other
          </v-card-subtitle>
          <v-card-text>
            <v-list two-line dense>
              <v-list-item-content v-for="item in tips.otherOperators" :key="item.name">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle><code>{{ item.query }}</code></v-list-item-subtitle>
              </v-list-item-content>
            </v-list>
          </v-card-text>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn color="grey" @click="$emit('close',true)">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>

/*
          $ (Root)
          . (Map)
          [ ... ] (Filter)
          ^( ... ) (Order-by)
          { ... } (Reduce)
          * (Wildcard)
          ** (Descendants)
          % (Parent)
          # (Positional variable binding)
          @ (Context variable binding)

        + (Addition)
        - (Substraction/Negation)
        * (Multiplication)
        / (Division)
        % (Modulo)
        .. (Range)

        = (Equals)
        != (Not equals)
        > (Greater than)
        < (Less than)
        >= (Greater than or equals)
        <= (Less than or equals)
        in (Inclusion)

        & (Concatenation)
        ? : (Conditional)
        := (Variable binding)
        ~> (Chain)
        ... ~> | ... | ... | (Transform)

*/
export default {
  name: 'JsonataTips',
  components: {

  },
  data: () => ({
    tips: {
      pathOperators: [
        {
          name: 'Root',
          query: '$',
          result: ''
        },
        {
          name: 'Map',
          query: '.',
          result: ''
        },
        {
          name: 'Filter',
          query: '[ ... ]',
          result: ''

        },
        {
          name: 'Wildcard',
          query: '*',
          result: ''
        },
        {
          name: 'Decendents',
          query: '**',
          result: ''
        },
        {
          name: 'Parent',
          query: '%',
          result: ''

        }
      ],
      numericOperators: [
        {
          name: 'Addition',
          query: '+',
          result: ''
        },
        {
          name: 'Subtraction/Negation',
          query: '-',
          result: ''
        },
        {
          name: 'Multiplication',
          query: '*',
          result: ''

        },
        {
          name: 'Division',
          query: '/',
          result: ''
        },
        {
          name: 'Modulo',
          query: '%',
          result: ''
        },
        {
          name: 'Range',
          query: '..',
          result: ''

        }
      ],
      comparisonOperators: [
        {
          name: 'Equal',
          query: '=',
          result: ''
        },
        {
          name: 'Not equal',
          query: '!=',
          result: ''
        },
        {
          name: 'Greater than',
          query: '>',
          result: ''

        },
        {
          name: 'Less than',
          query: '<',
          result: ''
        },
        {
          name: 'Greater than or equals',
          query: '>=',
          result: ''
        },
        {
          name: 'Less than or equals',
          query: '<=',
          result: ''

        },
        {
          name: 'Inclusion',
          query: 'in',
          result: ''

        }
      ],
      booleanOperators: [
        {
          name: 'Boolean AND',
          query: 'and',
          result: ''
        },
        {
          name: 'Boolean OR',
          query: 'or',
          result: ''
        }
      ],
      otherOperators: [
        {
          name: 'Concatenation',
          query: '&',
          result: ''
        },
        {
          name: 'Conditional',
          query: '? : ',
          result: ''
        },
        {
          name: 'Variable binding',
          query: ':=',
          result: ''

        },
        {
          name: 'Chain',
          query: '~>',
          result: ''
        },
        {
          name: 'Transform',
          query: '... ~> | ... | ... |',
          result: ''
        }
      ]
    }
  })
}
</script>
