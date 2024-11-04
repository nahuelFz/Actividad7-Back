const mongoose = require('mongoose')

const PaisSchema = new mongoose.Schema({
    pais: String,
    idioma: { type: [String], required: true },
    continente: String,
})


const Pais = mongoose.model('Pais', PaisSchema)

module.exports = Pais