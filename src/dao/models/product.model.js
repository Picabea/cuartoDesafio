const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true,
        unique: true
    },
    stock:{
        type: Number,
        required: true
    },
    status:{
        type: Boolean,
        required: true
    },
    category:{
        type: String,
        required: true
    }

})

schema.virtual('id').get(function (){
    return this._id.toString()
})

module.exports = mongoose.model('Product', schema, 'products')