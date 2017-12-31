const mongoose = require('mongoose')

const url = 'mongodb://heroku_4hgn9r4x:okv5sr7v6nlonf84ol2n293l3h@ds115583.mlab.com:15583/heroku_4hgn9r4x'

mongoose.connect(url);
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person