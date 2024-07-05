# Postman Visualization Scripts

Postman supports the ability to "Visualize" your response data. By using these scripts, we can take advantage of that and render a JSON Magic view and transform the JSON.

HTML Structure: The HTML provides the structure for the webpage. It has three main sections contained within divs, each with a specific ID: json-data, queryEditor, and json-results.

CSS: The CSS, although not fully included in the code you provided, is used to style the webpage.

JavaScript Libraries: The code imports several JavaScript libraries to provide additional functionality:

- jsonata is used for querying and transforming JSON data.
- split.js is used for creating resizable split views.
- jquery and jquery-ui are used for DOM manipulation and UI components.
- json2csv is used for converting JSON data to CSV.
- ace is an embedded code editor that is used for editing JSON data and queries in the webpage.

Script: The JavaScript code controls the functionality of the page. It initializes three instances of the Ace editor for JSON input, JSONata query input, and displaying the query results. It also handles fetching data, updating results when the JSON or query changes, and building a table from the results.

Postman Integration: The code integrates with Postman, a platform for API development. It tries to fetch data from Postman using the pm.getData function. If Postman is not connected, it catches the error and logs a message to the console.

The interactive tool allows you to input JSON data, construct a JSONata query, and visualize the resulting data. The results can also be represented in a tabular format. 

# Installaion
- Copy the contents of `postman-viz-embed.js` into your Postman Request's **Tests** script area
- Run your endpoint
- Select **Visualize**

# tl;dr

The embed script assigns the Postman visualization template to the `postman-viz-jsonmgagic-template.html` file, and then renders the web visualization