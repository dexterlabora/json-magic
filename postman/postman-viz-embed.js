
// Load remote template
pm.sendRequest('postman-viz-jsonmagic-template.html',  (_, res) => ( temp = res.text()));
// Run template
setTimeout(() => pm.visualizer.set(temp, pm.response.json()),250)

