const fs= require ('fs')
const express = require ('express')
const PORT = 8080;

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended:true}))

const  ArchivoProductos= './productos.json'


server.get('/products', async (req, res) => {
    try{
        const datos = await fs.promises.readFile(ArchivoProductos,'utf-8' );
        const products= JSON.parse(datos);
        const limit = parseInt(req.query.limit)
        if(limit){
            res.send(products.slice(0,limit))
            return
        }else{
            
          res.status(200).send(products);
        }

      }catch(error){
        res.status(404).send({ mensaje: 'Producto no existe' });
        return;
      }
      
    
       
    });

 server.get('/products/:pid', async (req, res) => {
        try {
            const products = await fs.promises.readFile(ArchivoProductos, 'utf-8');
            const productsJson = await JSON.parse(products);
            const product = productsJson.find(product => product.id === parseInt(req.params.pid));
            if (product) {
                res.status(200).send(product);
            } else {
                res.status(404).send({ mensaje: 'ERROR: No hay producto con ese id, no existe' });
            }
        } catch(err) {
            console.log(err);
            res.status(500).send(err);
        }
    });
     
        
              
           

server.listen(PORT, ()=>{
    console.log( `Servidor corriendo en el puerto ${PORT}`);
});

