import express from 'express'
import router from './routes/products.routes.js'
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import {Server} from 'socket.io';



const PORT = 3000;
const   WS_PORT = 3050;

const server = express();
const httpServer= server.listen(WS_PORT, ()=>{
    console.log( `Servidor socketio corriendo en el puerto ${WS_PORT}`);
});

const wss = new Server(httpServer, { cors: { origin: "http://localhost:3000" }});



server.use(express.json());
server.use(express.urlencoded({extended:true}))

server.use(router);

server.use('/public', express.static(`${__dirname}/public`));

server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');


server.listen(PORT, ()=>{
    console.log( `Servidor corriendo en el puerto ${PORT}`);
});


wss.on('connection', (socket) => { 
    console.log(`Cliente conectado (${socket.id})`);
    
    
    socket.emit('server_confirm', 'Conexión recibida');
    
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
    });
    
    socket.on('event_cl01', (data) => {
        console.log(data);
    });
});


