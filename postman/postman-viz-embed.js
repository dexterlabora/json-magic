// Load remote template
pm.sendRequest('https://raw.githubusercontent.com/dexterlabora/json-magic/master/postman/postman-viz-jsonmagic-template.html',  (_, res) => ( temp = res.text()));
// Run template
setTimeout(() => pm.visualizer.set(temp, pm.response.json()),300)