const axios = require('axios')
const Dev = require('./../models/Dev')
const parseStringAsArray = require('./../utils/parseStringAsArray')

module.exports = {

    async index (req, res) {
        try {
            const devs = await Dev.find()
            return res.status(200).json(devs)
        } catch (error) {
            res.status(400).json({ message: error.message})
        }
    },

    async store (req, res) {
        try {
            const { github_username, techs, latitude, longitude } = req.body 
    
            let dev = await Dev.findOne({ github_username })
    
            if(!dev) {
    
                const response = await axios.get(`https://api.github.com/users/${github_username}`)
            
                const {  name = login, avatar_url, bio } = response.data
            
                const techsArray = parseStringAsArray(techs)
            
                const location = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            
                dev = await Dev.create({
                    github_username,
                    name,
                    avatar_url,
                    bio,
                    techs: techsArray,
                    location
                })
            }
    
            return res.status(200).json(dev)
        } catch (error) {
            res.status(400).json({ message: error.message})
        }
    },

    async update (req, res) {
        try {
            const { id } = req.params
            const { body } = req
            
            const dev = await Dev.findByIdAndUpdate(id, body)
            res.json(dev)
        } catch (error) {
            res.status(400).json({ message: error.message})
        }
    }

}