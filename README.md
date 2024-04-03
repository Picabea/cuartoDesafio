Instalar el proyecto e instalar express seria suficiente para hacerlo funcional.

Los routers cuentan con los siguientes protocolos:

-Productos
  °get:
      -'/': Devuelve todos los productos, se puede enviar por query params un limite de productos
      -'/:pid': Devuelve el producto con el ID enviado en el parametro
   °post:
      -'/': Se debe enviar un objeto JSON con "title, description, price, thumbnail, code, stock y category" y lo agrega al .json
   °delete:
      -'/:pid': Elimina el objeto con el id enviado por parametro
   °put:
      -'/:pid': Se debe enviar un objeto JSON con atributos a modificar del objeto con el ID enviado por parametro

-Carts
   °get:
      -'/:cid': Devuelve el carrito con el ID enviado por parametro
   °post:
      -'/': Se debe enviar una lista JSON con uno o mas objetos(productos). Estos deben tener un atributo ID que no se debe repetir en ningun producto y el atributo quantity 
      -'/:cid/product/:pid': Se añade o actualiza el producto enviado por parametro del carrito enviado por parametro. Se debe enviar por el body un objeto JSON con el atributo "quantity"



Aclaracion: Al fondo de productManager de fileManagers se encuentran comentados varios objetos para que puedas hacer el post a products facilmente con postman
Al fondo de carts js de db managers se encunetran algunas lineas para testear parte del codigo

