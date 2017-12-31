const mongoose = require('mongoose')

const url = 'mongodb://...'

mongoose.connect(url);
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const byName = (p1, p2) => {
    return p1.name > p2.name ? 1 : -1
}

const personToString = (p) => {
    let tabs;
    if (p.name.length < 6) {
        tabs = '\t\t'
    } else {
        tabs = '\t'
    }
    return p.name + tabs + p.number
}

if (process.argv.length <= 2) {
    console.log("puhelinluettelo:")
    Person
        .find({})
        .then(res => {
            res.sort(byName).forEach(p => {
                console.log(personToString(p))
            })
            mongoose.connection.close()
        })
    return
}

const name = process.argv[2]
const number = process.argv[3]

console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)

const person = new Person({
    name,
    number
})

person
.save()
.then(response => {
  console.log('person saved!')
  mongoose.connection.close()
})