const { Listing } = require('../Models/Listing')
const client = require('../Services/Connexion')
const { ObjectId } = require('bson')
const { extractToken } = require('../utils/extractToken')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createListing = async (request, response) => {
    if (
        !request.body.title ||
        !request.body.description ||
        !request.body.price ||
        !request.body.image ||
        !request.body.category 
    ) {
        response.status(400).json({ error: 'Some fields are missing' })
    }

    try {
        let listing = new Listing(
            request.body.title,
            request.body.description,
            request.body.image,
            request.body.price,
            request.body.category,
            request.body.userId,
            new Date(),
            'published'
        )

        let result = await client
            .db('Sorties_&_Voyages')
            .collection('listing')
            .insertOne(listing)
        response.status(200).json(result)
    } catch (e) {
        console.log(e)
        response.status(500).json(e)
    }
}

const getMyListings = async (request, response) => {
    // Ici on extrait on crée une variable token,
    // qui utilise la fonction extract token
    // Cette fonction extrait le token présent dans mon headers/Authorization
    // autrement dit, le token dans le header de ma requête http, sera dans cette variable
    const token = await extractToken(request)

    // La libraire jwt , propose une fonction verify, qui permettra de vérifier le token grâce à la clef secrète,
    // et renvoi la donnée présente dans ce jwt.
    // Si la clef secrète est la même qu'a la connexion, c-a-d la clef passée dans jwt.sign
    // Alors la donnée est renvoyée, sinon une erreur est jouée.

    jwt.verify(
        token,
        process.env.MY_SUPER_SECRET_KEY,
        async (err, authData) => {
            if (err) {
                // Si il y a une erreur ou et que le jwt et que sa clef secrète est fausse
                // une erreur sera générée par la fonction, et nous renvoyons une requête d'erreur en 401 -> non autorisé
                // Car nous n'autorions pas nimporte qui a accéder à cette donnée
                console.log(err)
                res.status(401).json({ err: 'Unauthorized' })
                return
            } else {
                // Dans le callback de cette fonction est renvoyé la donnée présente dans le jwt
                // je me sers de cette donnée pour faire ma requête à mongodb
                // et je n'ai plus besoin de rien dans le body
                let listings = await client
                    .db('Sorties_&_Voyages')
                    .collection('listing')
                    // Authdata est ce qui la donnée renvoyé par verify
                    // Quand on fais le jwt.sign à la connexion, on a mis l'id dans ce jwt
                    // et donc je peux y accèder ici.
                    .find({ userId: authData.id })
                let apiResponse = await listings.toArray()

                res.status(200).json(apiResponse)
            }
        }
    )
}

const getAllListings = async (request, response) => {

    let listings = await client.db('Sorties_&_Voyages').collection('listing').find()

    let apiResponse = await listings.toArray()
    response.status(200).json(apiResponse)
}

const deleteListing = async (request, response) => {
        if (!request.body.userId || !request.body.listingId) {
            response.status(400).json({ error: 'Some fields are missing' })
            return
        }
        let listingId = new ObjectId(request.body.listingId)
        let userId = new ObjectId(request.body.userId)
    
        let user = await client
            .db('Sorties_&_Voyages')
            .collection('user')
            .find({ _id: userId })
    
        let listing = await client
            .db('Sorties_&_Voyages')
            .collection('listing')
            .find({ _id: listingId })
    
        if (!user || !listing) {
            response.status(401).json({ error: 'Unauthorized mothafucker' })
            return
        }
    
        if (listing.userId !== user._id || user.role !== 'admin') {
            response.status(401).json({ error: 'Unauthorized mothafucker' })
            return
        }
    
        try {
            await client
                .db('Sorties_&_Voyages')
                .collection('listing')
                .deleteOne({ _id: listingId })
        } catch (e) {
            console.log(e)
            response.status(500).json(e)
        }
    }
    


const updateListing = async (request, response) => {
    if (
        !request.body.title ||
        !request.body.description ||
        !request.body.price ||
        !request.body.image ||
        !request.body.userId
    ) {
        response.status(400).json({ error: 'Some fields are missing' })
    }

    let user = await client
        .db('Sorties_&_Voyages')
        .collection('user')
        .find({ _id: request.body.userId })

    let listing = await client
        .db('Sorties_&_Voyages')
        .collection('listing')
        .find({ _id: request.body.listingId })

    if (!user || !listing) {
        response.status(401).json({ error: 'Unauthorized mothafucker' })
        return
    }

    if (listing.userId !== user._id || user.role !== 'admin') {
        response.status(401).json({ error: 'Unauthorized mothafucker' })
        return
    }

    try {
        await client
            .db('Sorties_&_Voyages')
            .collection('listing')
            .updateOne(
                { _id: listing._id },
                {
                    $set: {
                        title: request.body.title,
                        description: request.body.description,
                        image: request.body.image,
                        price: request.body.price,
                        category: request.body.category,
                        status: request.body.status,
                    },
                }
            )
    } catch (e) {
        console.log(e)
        response.status(500).json(e)
    }
}

module.exports = {
    createListing,
    getAllListings,
    getMyListings,
    updateListing,
    deleteListing
}
