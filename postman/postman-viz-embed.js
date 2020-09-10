// JSON Magic Postman Template
const templateUrl = "https://raw.githubusercontent.com/dexterlabora/json-magic/master/postman/postman-viz-jsonmagic-template.html"

// Load template
pm.sendRequest(templateUrl,  (_, res) => { 
    var template = res.text()
    var data = pm.response.json()
    pm.visualizer.set(template, data )
});