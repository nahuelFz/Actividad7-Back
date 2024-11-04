// Conectamos a MongoDB usando Mongoose
const connectDB = require('./config/database')
connectDB()

// Traemos el modelo de Pais
const Pais = require('./models/Pais')

//Traemos Express
const express = require('express')
const app = express()

// Middleware para recibir JSON
app.use(express.json())

// Endpoint raiz
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Paises 🗺️')
})

// Definimos el endpoint para obtener todos los películas
app.get('/paises/', (req, res) => {
    const atributo = { ...req.query }
    query = !atributo ? {} : atributo 
    // Si no hay género especificado, obtendremos todas las películas
    Pais.find(query)
        .then(pais => res.json(pais))
        .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Definimos el endpoint para obtener un pais por nombre
app.get('/paises/:nombre', (req, res) => {
    const { nombre } = req.params
    Pais.findOne({ nombre })
       .then(pais => {
            if (!pais) return res.status(404).json({ message: 'Pais no encontrado' })
            res.json(pais)
        })
       .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Definimos el endpoint para obtener un array con los paises por el filtro idioma
app.get('/paises/idioma/:idioma', (req, res) => {
    const { idioma } = req.params
    Pais.find({ idioma })
       .then(paises => {
            if (!paises.length) return res.status(404).json({ message: 'No hay paises con este idioma' })
            res.json(paises)
        })
       .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Definimos el endpoint para agregar un nuevo pais
app.post('/paises', (req, res) => {
    const { nombre, idioma, continente} = req.body

    // Validamos los datos
    if (!nombre || !idioma || !continente) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    // Crear un nuevo pais
    const nuevoPais = new Pais({ nombre, idioma, continente})

    // Guardar el pais en la base de datos
    nuevoPais.save()
        .then(pais => res.json(pais))
        .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Definimos el endpoint para borrar un pais
app.delete('/paises/:nombre', (req, res) => {
    const { nombre } = req.params

    // Buscar el pais por nombre
    Pais.findOneAndDelete({ nombre })
       .then(pais => {
            if (!pais) return res.status(404).json({ message: 'Pais no encontrado' })
            res.json({ message: 'Pais eliminado exitosamente' })
        })
       .catch(error => res.status(500).json({ message: 'Error interno del servidor', error }))
})

// Definimos el puerto de la API
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})