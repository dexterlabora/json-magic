// Access the response data JSON as a JavaScript object
const res = pm.response.json();


// ------------
// - Template -
// ------------

// Configure the template
var template = `
<button onclick="download()">Download Table </button><span><a id="magiclink" href="https://meraki-micro-services.ew.r.appspot.com//">Open with JSON Magic</a>
<div id="myTable" height="75"></div>


 <!-- Tableify-->
 <script src="https://cdn.jsdelivr.net/npm/tableify@1.1.0/index.min.js"></script>

<script>
    var result;
    var table
    
    function download () {
      const data = table;
      const element = document.createElement('a')
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 4))
      )
      element.setAttribute('download', 'table.html')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }

    function setMagicLink(data){
        var ctx = document.getElementById("magiclink");
        var uriData = encodeURIComponent(JSON.stringify(data));
        ctx.href = "https://meraki-micro-services.ew.r.appspot.com/?inputJson=" + uriData;
    }

    // Get DOM element to render the chart in
    var ctx = document.getElementById("myTable");


    // Access the data passed to pm.visualizer.set() from the JavaScript
    // code of the Visualizer template
    pm.getData(function (err, value) {
        result = value;
        table = tableify(value)
        setMagicLink(result)
       ctx.innerHTML = table
    });

</script>
`;

// -------------------------
// - Bind data to template -
// -------------------------

// Set the visualizer template
pm.visualizer.set(template, res);