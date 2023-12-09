const RatingService = require('../services/RatingService')

const createRating = async (req, res) => {
    try { 
        const userId = req.params.id
        const {productId , rate, content} = req.body
        if (!productId || !rate || !userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        
        const data = req.body;
        const response = await RatingService.createRating(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteRating = async (req, res) => {
    try {
        const ratingId = req.params.id;
        if(!ratingId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await RatingService.deleteRating(ratingId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const updateRating = async (req, res) => {
    try {
        const ratingId = req.params.id;
        const {rate, content} = req.body;
        if(!ratingId || !rate){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const data = req.body;
        const response = await RatingService.updateRating(ratingId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

module.exports = {
    createRating,
    deleteRating,
    updateRating
}