const fs= require ('fs')
const express = require ('express')
const {ProductManager} = require('./ProductManager')
const PORT = 8080;

const server = express();
server.use(express.urlencoded({extended:true}))



const productManager= new ProductManager('./productos.json');

server.get('/products', async (req, res) => {
 const products = await  productManager.getProducts()
 const {limit} = parseInt(req.query)
 if(limit) 
 return res.json(products.slice(0,limit))
 else
 return res.json(products)
 
       
    });

 server.get('/products/:pid',async (req, res) => {
    const products = await  productManager.getProducts()
    if (req.params.id === undefined) {
        res.json(products);
    } else {
        const pid = parseInt(req.params.pid);
        const product = products.find((product) => { return product.id === pid });
        res.send(product);
    }
    });   
        
              
           
       
    

server.listen(PORT, ()=>{
    console.log( `Servidor corriendo en el puerto ${PORT}`);
});

