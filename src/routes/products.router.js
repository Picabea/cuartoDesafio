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
    res.render('home', {products})
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        useWS: true,
        scripts: [
            "realTimeProducts.js"
        ]

    })
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

