import  fs  from 'fs'
import {Router} from 'express'
import { __dirname } from '../../utils.js';


const ArchivoCarritos = './carrito.json';


const router = Router();

const  ArchivoProductos= './productos.json'

let productos=[];

let carritos=[];



const productRoutes = (io)  => {

const router  = Router()


  router.get('/', async(req, res) => {
    const datos = await fs.promises.readFile(ArchivoProductos,'utf-8' );
    const products= JSON.parse(datos);
   
    res.render('home', {products})
   
  });
  
  
  router.get('/realtimeproducts', async(req, res) => {
    const datos = await fs.promises.readFile(ArchivoProductos,'utf-8' );
    const products= JSON.parse(datos);
   
    res.render('realTimeProducts', {products})
   
  });
  
  
  
  router.post('/api/products', (req, res) => {
    const product = req.body;
  product.id = productos.length + 1;
  productos.push(product);
  fs.writeFile(ArchivoProductos, JSON.stringify(productos), (err) => {
    if (err) throw err;
    res.send('Producto creado exitosamente');
  });
    io.emit('product_added', product);
    
  });
  
  
  
  
  
  
  router.get('/api/products', async (req, res) => {
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
    router.get('/api/products/:pid', async (req, res) => {
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
  
          res.status(500).send(err);
      }
  });
  
  router.put('/api/products/:pid', async (req, res) => {
    const products = await fs.promises.readFile(ArchivoProductos,'utf-8' );
    const productsJson = await JSON.parse(products);
  
    const updatedProduct = productsJson.find(product => product.id === parseInt(req.params.pid));
   
    if (!updatedProduct) {
      res.status(404).send({ mensaje: "No se encontró el producto" });
    } else {
      const updatedData = { ...updatedProduct, ...req.body };
      const updatedProducts = productsJson.map(product => product.id === parseInt(req.params.pid) ? updatedData : product);
      fs.writeFile(ArchivoProductos, JSON.stringify(updatedProducts, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send({ mensaje: "Error al actualizar el archivo" });
          return;
        }
        res.status(200).send({ mensaje: "Producto actualizado" });
      });
    }
  });
  
  
  
  
  
  router.delete('/api/products/:pid', async (req, res) => {
  
    const products = await fs.promises.readFile(ArchivoProductos,'utf-8' );
    const productsJson = await JSON.parse(products);
  
    const borrarItem = productsJson.find(product =>product.id === parseInt(req.params.pid))
  
    if(!borrarItem){
      res.status(404).send({mensaje:"No se encontro producto con ese ID"});
      
    }
    const borrarItemConFilter = productsJson.filter(product =>product.id != parseInt(req.params.pid))
    fs.writeFile(ArchivoProductos, JSON.stringify(borrarItemConFilter), error =>{
      if(error) throw error;
      res.status(404).send({mensaje:"El producto fue eliminado"});
  
      
    })
  
  
  })
  
  fs.readFile(ArchivoCarritos, 'utf-8', (err, data) => {
    if (!err) {
      carritos = JSON.parse(data);
    }
  });
  
  router.post('/api/carts', (req, res) => {  
  
    const newId = carritos.length + 1;
    const newCart = {
      id: newId,
      products: []
    };
    carritos.push(newCart);
  
   
    fs.writeFile(ArchivoCarritos, JSON.stringify(carritos, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al guardar el archivo de carritos');
        return;
      }
      res.send(`Carrito creado exitosamente con ID: ${newId}`);
    });
  
  
  
  });
  
  
  router.post('/api/carts/:idcart/products/:pid', async (req, res) => {
    const cartId = req.params.idcart;
    const productId = req.params.pid;
  
  
    const carts = await fs.promises.readFile(ArchivoCarritos, 'utf-8');
    const cartsJson = JSON.parse(carts);
    const cartIndex = cartsJson.findIndex((cart) => cart.id === parseInt(cartId));
    if (cartIndex === -1) {
      res.status(404).send('Carrito no encontrado');
      return;
    }
  
  
    const products = await fs.promises.readFile(ArchivoProductos, 'utf-8');
    const productsJson = JSON.parse(products);
    const productIndex = productsJson.findIndex((product) => product.id === parseInt(productId));
    if (productIndex === -1) {
      res.status(404).send('Producto no encontrado');
      return;
    }
  
    const cart = cartsJson[cartIndex];
    const product = productsJson[productIndex];
    cart.products.push(product);
    fs.writeFile(ArchivoCarritos, JSON.stringify(cartsJson, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al guardar el archivo');
        return;
      }
      res.send('Producto agregado al carrito exitosamente');
    });
  });
  
  return router;
  
}






export default productRoutes;
  
