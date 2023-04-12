const fs = require('fs');

class ProductManager {

    constructor (path) {
        this.products = []
        this.path =path;
     }

     #getId(){
        if(this.products.length === 0) return 1 
        return this.products.length + 1
    }

   async getProducts(){
        try{
          const datos = await fs.promises.readFile(this.path,'utf-8' );
          const products= JSON.parse(datos);
          console.log(products);
        }catch(error){
          console.log("error!!");
          return;
        }
    }

    addProduct(title,description,price,thumbnail,code,stock){
       
        if( !title || !description || !price || !thumbnail || !stock ){
          console.log("Error: Debe completar todos los campos");
          return; 
        }

       const enc = this.products.some(product =>product.code === code) 
       if(enc){
        console.log(`Ya existe producto con mismo código ${code}`)
       }

       const nuevoProduct={
        id: this.#getId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    }
    this.products.push(nuevoProduct)
    console.log("Se agrego producto");
    fs.writeFile(this.path, JSON.stringify(this.products), (error) =>{
      if(error) throw error;
      console.log("Se guardo archivo")

    })
   
    }
 
 async getProductById(idProduct){
  const datos = await fs.promises.readFile(this.path,'utf-8');
  const productById= JSON.parse(datos);

  const IdProductExist = productById.find((product) => product.id === idProduct)
    console.log(IdProductExist ? IdProductExist :"Not Found")
  }

  async updateProduct(idProduct,campo,actualizacion){
    const datos = await fs.promises.readFile(this.path,'utf-8' );
    const products= JSON.parse(datos);

    const indice = products.findIndex((product)=>product.id === idProduct)
    if(indice === -1){
      console.log("No hay producto")
      return;
     
    }
    products[indice] [campo] = actualizacion;

    fs.writeFile(this.path, JSON.stringify(products), error =>{
      if(error) throw error;
      console.log("El producto fue actualizado")

      
    })
  }

 async deleteProduct(borrarId){
  const datos = await fs.promises.readFile(this.path,'utf-8' );
  const products= JSON.parse(datos);

  const borrarItemConFilter = products.filter((product )=>product.id != borrarId)

  if( borrarItemConFilter.length === products.length){
    console.log(`No se encontro producto con ese ID  ${borrarId}`)
    return;
  }

  fs.writeFile(this.path, JSON.stringify(borrarItemConFilter), error =>{
    if(error) throw error;
    console.log("El producto fue eliminado")

    
  })

 }

}

//const pm = new ProductManager('./productos.json');
//pm.addProduct("Zarcillos","Zarcillos Estrella",2500,"sin foto",5330,100);
//pm.addProduct("Anillo","Anillo estilo princesa",2000,"sin foto",5233,20);
//pm.addProduct("Anillo","Anillo dorado",2000,"sin foto",5234,25);
//pm.addProduct("Zarcillos","Zarcillo dorado",2600,"sin foto",5236,50);
//pm.addProduct("Cinturón","Cinturón Negro",2800,"sin foto",5240,120);
//pm.addProduct("Cinturón","Cinturón Blanco",2800,"sin foto",5241,70);
//pm.addProduct("Cadena","Cadena dorada",2100,"sin foto",5250,75);
//pm.addProduct("Cadena","Cadena trenzada",2100,"sin foto",5251,85);
//pm.addProduct("Lentes","Lentes Negros",2400,"sin foto",5260,30);
//pm.addProduct("Lentes","Lentes rosados",2450,"sin foto",5261,25);



//pm.updateProduct(1,'stock',50)
//pm.deleteProduct(2);

exports.ProductManager = ProductManager
