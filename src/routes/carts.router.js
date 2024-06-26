const { Router } = require('express')
const cart = require('../dao/dbManagers/carts.js')
const router = Router()


router.post('/', async (req, res) => {
    const products = req.body
    if(products.length >= 1){
        res.send(await cart.createCart(products))
    }else{
        res.send("Envie al menos un producto")
    }
    
})

router.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.body.quantity

    cart.addProductToCart(cid, pid, quantity)
    .then(response => res.send(response))
})

router.get('/:cid', (req, res) => {
    const cid = req.params.cid
    cart.getCartById(cid)
    .then(response => res.send(response))
})

module.exports = router

