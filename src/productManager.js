const fs = require('fs');

class ProductManager{
    #id = null

    constructor(path){
      this.products = [],
      this.path = path
    }

    async addProduct(title, description, price, thumbnail, code, stock, category){
      let objects = await this.getProducts()

      if(title && description && price && code && stock && category){
        if(this.verifyCode(code, objects)){
          if(!this.#id){
            this.#id = await this.getId(objects)
          }
          let object = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: this.#id,
            status: true,
            category: category
          }
          
          await objects.push(object)
          let JsonList = JSON.stringify(objects, null, '\t')

          await fs.promises.writeFile(this.path, JsonList)

          this.#id += 1
          return("success")
        }else{
          return("El codigo no es correcto")
        }
      }else{
        return("El producto no es correcto")
      }
    }

    verifyCode(newCode, products){
        let codes = []
        if(products.length >= 1){
          products.forEach(product => codes.push(product.code))
          if(!codes.includes(newCode)){
              return(true)
          }else{
              return(false)
          }
        }else{
          return(true)
        }
        
    }

    async getId(products){
      let maxId = 0
      products.forEach(
        (prod) => {
          if(prod.id>maxId){
            maxId = prod.id
          } 
        }
      )
      return(maxId + 1)
    }

    async getProducts(){
      const archivo = await fs.promises.readFile(this.path, 'utf-8')
      if(archivo){
        let archivoAdaptado = JSON.parse(archivo)
        return(archivoAdaptado)
      }
      else{
        return([])
      }
    
  }

    async getProductById(id){
      let productos = await this.getProducts()
      // let adaptedProducts = JSON.parse(productos)
      let filteredProducts = productos.find(prod => prod.id === id)
      if(filteredProducts){
        return(filteredProducts)
      }else{
          return("Not found")
      } 
      
    }

    async updateProduct(id, newValues){
      //Buscamos la lista del archivo
      let products = await this.getProducts()
      //Seleccionamos el producto
      const productIndex = products.findIndex(prod => prod.id == id)

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
        return("Error: Enter valid keys")
      }

      //En caso de estar actualizando el codigo
      if(newKeys.includes("code")){
        let newCode = newValues.code
        //Se verifica que sea valido
        if(!this.verifyCode(newCode, products)){
          return("Error: Code is repeated")
        }
      }

      //Si las keys fueron correctas se actualiza el objeto
      if(productIndex !== 1){
        products[productIndex] = {...products[productIndex], ...newValues}
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        return("Success")
      }else{
        return("Error al actualizar el producto")
      }
    }

    async deleteProduct(id){
      let products = await this.getProducts()
      let filteredProducts = products.filter(prod => prod.id != id)
      let adaptedProducts = JSON.stringify(filteredProducts, null, '\t')
      fs.writeFileSync(this.path, adaptedProducts)
      return("Producto eliminado")
    }
  }
  
const productManager = new ProductManager(String.raw`.\test.json`)

module.exports = productManager