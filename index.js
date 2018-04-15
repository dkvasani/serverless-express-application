const serverless = require('serverless-http');
const express = require('express')
const app = express()
const mongodbConnectionString = 'mongodb://dkvasani:dkvasani@ds011933.mlab.com:11933/dkvasani'
const dbName = 'dkvasani'
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.get('/', function (req, res) {
    const request = require('request');

    request('https://pt8o6ak18a.execute-api.ap-south-1.amazonaws.com/dev', { }, (err, response, body) => {
        if (err) { return console.log(err); }
        var data = JSON.parse(response.body);
        res.render('pages/index.ejs', {stockdata : data.stockData})
    });

})

app.get('/dk', function (req, res) {
    MongoClient.connect(mongodbConnectionString, (err, client) => {
        if (err) return console.log(err)
        db = client.db(dbName) // whatever your database name is
        db.collection('quotes').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('index.ejs', { quotes: result })
        })
    })
})

app.post('/quotes', (req, res) => {
    MongoClient.connect(mongodbConnectionString, (err, client) => {
        if (err) return console.log(err)
        db = client.db(dbName) // whatever your database name is
        db.collection('quotes').save(req.body, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/')
        })
    })
})

module.exports.handler = serverless(app);