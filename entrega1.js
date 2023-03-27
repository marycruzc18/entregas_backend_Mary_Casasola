class ProductManager {

    constructor () {
        this.products = []
     }

     #getId(){
        if(this.products.length === 0) return 1 
        return this.products.length + 1
    }

    getProducts(){
        return this.products;
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
        idProduct: this.#getId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    }
    this.products.push(nuevoProduct)
   
    }
 
  getProductById(idProduct){
    const IdProductExist = this.products.find(product=>product.idProduct === idProduct)
    if( IdProductExist){
        return "Exist"
    }else{
        return"Not found"
    }
  }

}

const pm = new ProductManager()
pm.addProduct("Anillo","Anillo estilo princesa",2000,"sin foto",5233,20)
pm.addProduct("Pulsera","Pulsera dorada",3000,"sin foto",5100,30)
pm.addProduct("Lentes","Lentes Negros",1500,"sin foto",5000,10)
console.log(pm.getProducts())
console.log(pm.getProductById(4))


