
import {} from 'dotenv/config'

import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './api/products/products.routes.js';
import chatRoutes from './api/chat.routes.js'
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', productRoutes(io));
app.use('/chat', chatRoutes);
app.use('/public', express.static(`${__dirname}/public`));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


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

try {
  
 // await mongoose.connect(MONGOOSE_URL)
 await  mongoose.connect('mongodb+srv://marycruz18:mcoderdb@cluster0.6ci8xpp.mongodb.net/ecommerce') 
  server.listen(PORT, () => {
     
      console.log(`Servidor API/Socket.io iniciado en puerto ${PORT}`);
  });
} catch(err) {
  console.log('No se puede conectar con el servidor de bbdd');
}

  

  