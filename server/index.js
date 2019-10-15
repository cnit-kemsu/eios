const express = require('express')
const path = require('path')

const { port = 8080, public: publicFolder = 'public' } = require('minimist')(process.argv.slice(2))
const app = express()

app.use('/public', express.static(path.resolve(__dirname, '..', publicFolder)))
app.use('/*', (req, res) => res.sendFile(path.resolve(__dirname, '..', publicFolder, 'index.html')))

app.listen(port, () => {
    console.log('App listening on port: ' + port)
})

