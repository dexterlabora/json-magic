// Load remote template
pm.sendRequest('https://raw.githubusercontent.com/dexterlabora/json-magic/master/postman/postman-viz-jsonmagic-template.html',  (_, res) => { 
    var template = res.text()
    var data = pm.response.json()
    pm.visualizer.set(template, data )
});