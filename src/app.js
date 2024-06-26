const express = require('express')

const messageModel = require("./dao/models/message.model.js")

const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')
const chatRouter = require('./routes/chat.router.js')

const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

const productManager = require('./dao/dbManagers/productManager.js')

const mongoose = require('mongoose')

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
app.use('/chat', chatRouter)



const main = async() => {
    await mongoose.connect('mongodb://127.0.0.1:27017',{
        dbName: 'ecommerce'
    })

    app.set('productManager', productManager)

    const httpServer = app.listen(8080, () => {
        console.log('server listo')
    })  
    
    

    const wsServer = new Server(httpServer)

    wsServer.on("connection", (socket) => {
        console.log(`Cliente conectado, ID ${socket.id}`)

        productManager.getProducts()
        .then((products) => socket.emit("products", products))
        
        messageModel.find()
        .then((messages) => {socket.emit("loadMessages", messages)})


        socket.on("delete", (productId) => {
            productManager.deleteProduct(productId)
            .then((res) => {
                console.log(res)
                productManager.getProducts()
                .then((products) => wsServer.emit("products", products))
            })
            
        })

        socket.on("add", (product) => {
            const { title, description, price, thumbnail, code, stock, category } = product
            productManager.addProduct(title, description, price, thumbnail, code, stock, category)
            .then((res) => console.log(res))
            productManager.getProducts()
            .then((products) => wsServer.emit("products", products))
        })

        socket.on("message", (messageInfo) => {
            const { email, message } = messageInfo 
            console.log(email, message)

            if(email && message){
                try{
                    messageModel.create({
                        email,
                        message
                    })
                }catch(err){
                    console.log(err)
                }    
            }
            socket.broadcast.emit("newMessage", messageInfo)
            
        })
    })
} 

main()