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

module.exports = {
    createRating,
}