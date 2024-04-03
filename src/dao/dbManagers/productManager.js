const ProductModel = require('../models/product.model.js')

class ProductManager{
    constructor(){}

    async addProduct(title, description, price, thumbnail, code, stock, category){
      const validStock = !isNaN(stock) || stock >= 0
      const validPrice = !isNaN(price) || price >= 0

      if(title && description && code && stock && category && validStock && validPrice){
        try{
          return(await ProductModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status: true,
            category
          }))
        }catch(err){
          return(err)
        }
                  
      }else{
        return "Error: Invalid data"
      }
    }

    async getProducts(limit = null){
      const validLimit = !isNaN(limit) || limit >= 0

      const products = validLimit
      ? await ProductModel.find().limit(limit)
      : await ProductModel.find()

      return products.map(product => product.toObject({virtuals: true}))
  }

    async getProductById(id){
      try{
        return await ProductModel.findOne({ _id: id })
      }catch (err){
        return err
      }
    }

    async updateProduct(id, newValues){
      //Keys posibles a editar
      let validKeys = ["title", "description", "price", "thumbnail", "code", "stock"]
      //Keys a editar
      let newKeys = Object.keys(newValues) 
      let valid = true

      //se controla que se esten updateando campos validos
      if(newKeys.includes("id")){
        return("Error: Id can not be modified")
      }

      newKeys.forEach((key) => {
        if(!validKeys.includes(key)){
          valid = false
        }
      })

      if(!valid){
        return console.error("Error: Enter valid keys")
      }

      try{
        return await ProductModel.updateOne({ _id: id}, {...newValues})
      }catch (err){
        return err
      }
    }

    async deleteProduct(id){
      try{
        return await ProductModel.deleteOne({_id: id})
      }catch(err){
        return err
      }
    }
  }
  
const productManager = new ProductManager(String.raw`.\test.json`)

module.exports = productManager

