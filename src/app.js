const express = require('express')
const app = express()
const cors = require('cors')
const { connect } = require('./Services/Connexion')
const userRoutes = require('../src/Controllers/routes/users')
const listingRoutes = require('./Controllers/routes/listings')
require('dotenv').config()

app.use(express.json())
app.use(cors())

connect(process.env.DB_URL, (error) => {
    if (error) {
        console.log('Failed to connect')
        process.exit(-1)
    } else {
        console.log('successfully connected')
    }
})

app.use('/user', userRoutes);
app.use('/listing', listingRoutes);
console.log('server is listening');
app.listen(3003);
 