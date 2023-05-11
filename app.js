
import express from 'express';
import productRoutes from './api/products/products.routes.js';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import fs from 'fs';

const PORT = 3000;
const   WS_PORT = 3050;

const server = express();
const httpServer= server.listen(WS_PORT, ()=>{
  console.log( `Servidor socketio corriendo en el puerto ${WS_PORT}`);
});
const io = new Server(httpServer, {
  cors: {
      origin: "*",
      methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
      credentials: false
  }
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));


server.use('/', productRoutes(io));

server.use('/public', express.static(`${__dirname}/public`));

server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

io.on('connection', (socket) => {
  console.log(`Cliente conectado (${socket.id})`);
  socket.emit('server_confirm', 'Conexión recibida');
  socket.on('product_added', (product) => {
    console.log(`Producto agregado: ${JSON.stringify(product)}`);
    io.emit('product_added', product);
  });
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado (${socket.id})`);
  });
});

  

  
