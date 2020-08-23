<template>
    <div class="directory">
        <div class="language- extra-class"><pre class="language-text"><code>{{text}}</code></pre></div>
    </div>
</template>

<script>
export default {
    props: {
        root: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            realRoot: this.root.length ? this.root : [] 
        }
    },
    methods: {
        getDepthString (depth, parentLastList = []) {
            if (depth < 2) {
                return '' 
            }
            let texts = []
            parentLastList.pop()

            for(var i = 0, len = depth - 1; i < len; i++) {
                if (parentLastList[i]) {
                    texts.push('   ')
                } else {
                    texts.push('│  ')
                }
                
            }

            return texts.join('')
        },

        getNodeString (index, start, last, depth) {
            if (depth == 0 ) return '' 
            if (start && !last) return '├─ ' 

            return last ? '└─ ' : '├─ ';
        },
        convertTreeToText (list) {
            return list.map(({ text, index, start, parentLastList, last, depth, leaf }) => {
                
                return [
                    this.getDepthString(depth, parentLastList),
                    this.getNodeString(index, start, last, depth),

                    text
                ].join('')


            }).join('\n')
        },
        traverse(root, all = [], parentLastList = [],index, start, last, depth = 0) {
            const name = root[0]
            const children = root[1] 

            if (name) {              
                all.push({ text: name, index, start, last, depth, parentLastList, leaf: !children })
            }

            if (children && children.length) {
                children.forEach((child, index) => {
                    const last = index == children.length - 1
                    const start = index == 0
                    if (typeof child === 'string') {
                        all.push({ text: child, index, start, last, depth: depth + 1, parentLastList: [...parentLastList, last], leaf: true })
                    }  else {
                        this.traverse(child, all, [...parentLastList, last], index, start, last, depth + 1)
                    }
                });
            }
        }
    },
    computed: {
        text () {
            let allTree = [] 
            this.traverse(this.realRoot, allTree, [], 0, true, true, 0)
            
            return this.convertTreeToText(allTree);
        }

    }
}
</script>

<style>

</style>
