import express from 'express'
import router from './routes/products.routes.js'
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
const PORT = 3000;

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended:true}))

//server.use(router);

//server.use('/public', express.static(`${__dirname}/public`));

server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');

server.get('/',(req, res) => {
    res.render('index');
});



server.listen(PORT, ()=>{
    console.log( `Servidor corriendo en el puerto ${PORT}`);
});


