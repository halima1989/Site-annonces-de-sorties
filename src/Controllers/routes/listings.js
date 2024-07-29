const express = require('express')
const {
    createListing,
    getAllListings,
    getMyListings,
    updateListing,
    deleteListing,
} = require('../ListingControllers')
const { verifyToken } = require('../../../src/utils/extractToken')

const router = express.Router()

router.route('/create').post(createListing)
router.route('/all').get(getAllListings)
router.route('/mine', verifyToken).post(getMyListings)
router.route('/update' ,verifyToken).patch(updateListing)
router.route('/delete', verifyToken).delete(deleteListing)

module.exports = router
