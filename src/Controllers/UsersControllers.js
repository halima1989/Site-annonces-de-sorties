const { User } = require('../Models/User')
const client = require('../Services/Connexion')
const bcrypt = require('bcrypt')
const { ObjectId } = require('bson')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const register = async (request, response) => {
    if (
        !request.body.firstName ||
        !request.body.lastName ||
        !request.body.email ||
        !request.body.password
    ) {
        response.status(400).json({ error: 'Some fields are missing' })
    }
    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    try {
        let user = new User(
            request.body.firstName,
            request.body.lastName,
            'user',
            request.body.email,
            hashedPassword,
            new Date(),
            new Date(),
            true
        )

        let result = await client
            .db('Sorties_&_Voyages')
            .collection('user')
            .insertOne(user)
        response.status(200).json(result)
    } catch (e) {
        console.log(e)
        response.status(500).json(e)
    }
}

const login = async (request, response) => {
    if (!request.body.email || !request.body.password) {
        response.status(400).json({ error: 'Some fields are missing' })
        return
    }

    let user = await client
        .db('Sorties_&_Voyages')
        .collection('user')
        .findOne({ email: request.body.email })

    if (!user) {
        response.status(401).json({ error: 'Wrong credentials' })
        return
    }

    const isValidPasswod = bcrypt.compare(request.body.password, user.password)

    if (!isValidPasswod) {
        response.status(401).json({ error: 'Wrong credentials' })
    } else {
        // De faire ça et envoyer la data en clair , je vais créer un token

        // Au lieu de renvoyer la donnée en claire comme avant,
        // je peux mettre  cette donnée dans un json web token pour qu'elle
        // soit un peu plus invisibilisée, et permettra au backend de vérifier
        // la clef secrète afin d'être que c'est bien mon back end qui l'a crée
        // et que ce n'est pas falsifié,
        // Autrement dit, je vais créer ( signer) le jwt avec une clef secrète a la connexion
        // et quand un user devra être authentifier pour une requête
        // par exemple, voir toutes mes annonces, le jwt me permetrra de :
        // 1) Récupérer la data
        // 2) Vérifier l'id de l'utilisateur dans cette data
        // 3) Vérifier que le token a bien été généré par mon app lors de la connexion
        // car on vérifiera cette clef à la connexion, et pour chaque requête à authentifier
        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                gdpr: new Date(user.gdpr).toLocaleString('fr'),
            },
            process.env.MY_SUPER_SECRET_KEY,
            { expiresIn: '20d' }
        )

        response.status(200).json({ jwt: token })
    }
}

module.exports = { register, login }
