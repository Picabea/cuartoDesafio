const productManager = require("./productManager.js")
const CartModel = require('../models/cart.model.js')

class Cart{
    async createCart(productos){
        if(await this.validateProducts(productos)){
            try{
                console.log("subiendo")
                return(await CartModel.create({products: [...productos]}))
            }catch(err){
                return(err)
            }
        }else{
            return("Products are not valid")
        }
    }
    
    async validateProducts(products) {
        let valid = true; // Se inicializa como true
        await Promise.all(products.map(async (product) => {
            try {
                const producto = await productManager.getProductById(product.productId); 
                if (!producto || !producto._id) {
                    console.log("Producto no encontrado:", product.id);
                    valid = false;
                }
            } catch (error) {
                console.error("Error al obtener producto:", error);
                valid = false;
            }
        }));

        if (valid === true) { // Verificar si es true
            console.log("Todos los productos son válidos");
            return true;
        } else {
            console.log("Al menos un producto no es válido");
            return false;
        }
    }
    
    async getCarts(){
        try{
            const carts = await CartModel.find()
        return(carts)
        }catch(err){
            console.error(err)
        }
    }

    async getCartById(id){
        const carts = await this.getCarts()
        carts.map(cart => cart.toObject({virtuals: true}))
        const cart = carts.find(cart => cart.id === id)

        if(cart){
            return(cart)
        }else{
            return("Error: that cart does not exist")
        }
    }

    async addProductToCart(cid, pid, quantity){
        const cart = await this.getCartById(cid)
        const newProducts = cart.products

        const newProduct = {id: await productManager.getProductById(pid), quantity}
        console.log(newProduct)
        if(newProduct.id){
            newProducts.push(newProduct)
            console.log(newProducts)
        }else{
            return("Error, el producto no existe")
        }
        
        try{
            console.log(await CartModel.updateOne({_id: cid}, {$set: {products: newProducts}}))
        }catch(err){
            console.log(err)
        }
    }
}

const cart = new Cart()

module.exports = cart



//Codigo para hacer post del cart:
// [
//     {
//         "id": "660c3d464eb0ad95e8415901",
//         "quantity": 5
//     },
//     {
//         "id": "660bb122289e9afba45f546c",
//         "quantity": 10
//     }
// ]


//Codigo apra insertar un producto al cart:
// http://localhost:8080/api/carts/660c577508630c15906f9564/product/660bb18539d161ae2f053b11
// {
//     "quantity": 5
// }