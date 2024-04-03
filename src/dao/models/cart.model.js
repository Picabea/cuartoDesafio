const mongoose = require('mongoose')

const cartProduct = new mongoose.Schema({
    quantity:{
        type: Number,
        required: true
    },
    productId:{
        type: String,
        required: true
    }
})

const schema = new mongoose.Schema({
    products:[
        cartProduct
    ]
})

schema.virtual('id').get(function (){
    return this._id.toString()
})

module.exports = mongoose.model('Cart', schema, 'carts')