const { Router } = require('express')
const productManager = require('../productManager.js')
const router = Router()

router.get('/', async (req, res) => {
    let limit = req.query.limit
    let products = await productManager.getProducts()
    if(products){
        if(limit){
            products = products.slice(0, limit)
        }
    }
    res.send(products)
})

router.get('/:pid', async (req, res) => {
    let products = await productManager.getProducts()
    let productId = req.params.pid
    let product = products.find(prod => prod.id == productId)
    product ?res.send(product)
    :res.send('Product not found')
    
})

router.post('/', (req, res) => {
    const info = req.body
    const { title, description, price, thumbnail, code, stock, category } = info

    productManager.addProduct(title, description, price, thumbnail, code, stock, category)
    .then(response => res.send(response))
})

router.delete('/:pid', (req, res) => {
    let id = req.params.pid
    

    productManager.deleteProduct(id)
    .then(response => res.send(response))
})

router.put('/:pid', (req, res) => {
    let id = req.params.pid
    productManager.updateProduct(id, req.body)
    .then(response => res.send(response))
})

module.exports = router

// {
//     "title": "Sprite Zero 330ml",
//     "description": "Refresco burbujeante con sabor a lima-limón, sin calorías y sin azúcar.",
//     "price": 700,
//     "thumbnail": ["www.imagen.com/sprite-zero"],
//     "code": "s330",
//     "stock": 30,
//     "category": "gaseosas"
// }
// {
//     "title": "Coca Cola 500ml",
//     "description": "Esta sabroza cola premium resalta por si sola gracias a su perfecta efervecencia y buen balance de sabores",
//     "price": 950,
//     "thumbnail": "www.imagen.com",
//     "code": "cc500",
//     "stock": 43,
//     "category": "gaseosas"
// }
// {
//     "title": "Pepsi 500ml",
//     "description": "Refrescante cola con un toque de limón, perfecta para cualquier ocasión.",
//     "price": 850,
//     "thumbnail": "www.imagen.com/pepsi",
//     "code": "p500",
//     "stock": 50,
//     "category": "gaseosas"
// }
// {
//     "title": "Sprite Zero 330ml",
//     "description": "Refresco burbujeante con sabor a lima-limón, sin calorías y sin azúcar.",
//     "price": 700,
//     "thumbnail": "www.imagen.com/sprite-zero",
//     "code": "s330",
//     "stock": 30,
//     "category": "gaseosas"
// }
// {
//     "title": "Fanta Naranja 355ml",
//     "description": "Bebida gaseosa con sabor a naranja natural, ideal para acompañar tus comidas.",
//     "price": 750,
//     "thumbnail": "www.imagen.com/fanta-naranja",
//     "code": "f355",
//     "stock": 60,
//     "category": "gaseosas"
// }
// {
//     "title": "Schweppes Tónica 250ml",
//     "description": "Tónica clásica con un equilibrado sabor a quinina, perfecta para combinar con tu ginebra favorita.",
//     "price": 600,
//     "thumbnail": "www.imagen.com/schweppes-tonica",
//     "code": "s250",
//     "stock": 25,
//     "category": "gaseosas"
// }
