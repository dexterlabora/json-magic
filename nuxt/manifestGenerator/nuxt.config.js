module.exports = {
    //...
    render: {
        csp: {
            hashAlgorithm: 'sha256',
            policies: {
              'script-src': [
                'example.com',
              ],
              'style-src': [
                'example.com',
              ],
              'img-src': [
                'example.com',
                'data:',
                'www.gravatar.com'
              ],
              'report-uri': ['https://example.com/report-csp-violations']
            },
            addMeta: true, // Adds the meta tag to HTML
            showResult: true, // Displays the generated CSP string in the console
            saveResult: 'csp_header.txt', // Saves the CSP HTTP Header in this file in the output folder (/dist by default)
        },
    },
    //...
}