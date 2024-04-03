const { Router } = require('express')
const productManager = require('../dao/dbManagers/productManager.js')
const router = Router()

router.get('/', async (req, res) => {
    try{
        let limit = req.query.limit
        let products = await productManager.getProducts(limit)

        res.status(200).render('home', {products})
    }catch(err){
        res.status(400).json({success: false})
    }
    
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
    let productId = req.params.pid
    let product = await productManager.getProductById(productId)

    res.send(product)
    
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

