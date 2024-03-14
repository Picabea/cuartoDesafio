const express = require('express')
const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const productManager = require('./productManager.js')

const app = express()

//Configuracion handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.use(express.static(`${__dirname}/../public`))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('./public'))

app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

const httpServer = app.listen(8080, () => {
    console.log('server listo')
})  

const wsServer = new Server(httpServer)

wsServer.on("connection", (socket) => {
    console.log(`Cliente conectado, ID ${socket.id}`)

    productManager.getProducts()
    .then((products) => socket.emit("products", products))
    
    socket.on("delete", (productId) => {
        console.log("a")
        productManager.deleteProduct(productId)
    })

    socket.on("add", (product) => {
        console.log("test")
        const { title, description, price, thumbnail, code, stock, category } = product
        productManager.addProduct(title, description, price, thumbnail, code, stock, category)
        .then((res) => console.log(res))
    })

})