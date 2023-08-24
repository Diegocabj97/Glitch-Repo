import { promises as fs } from "fs";

export class ProductManager {
  constructor() {
    this.path = "Productos.json";
  }

  async getProducts() {
    let prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    return prods;
  }

  async getProductById(id) {
    const prods = await this.getProducts();
    const prod = prods.find((product) => product.id === id);

    if (prod) {
      console.log(prod);
    } else {
      console.log("Producto no encontrado");
    }
    return prod;
  }

  async addProduct(product) {
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const maxId = prods.reduce(
      (max, prod) => (prod.id > max ? prod.id : max),
      0
    );
    const newProductId = maxId + 1;

    const prod = prods.find((prod) => prod.code === product.code);

    if (prod) {
      console.log(`El producto ${product.code} ya se encuentra agregado`);
    } else {
      const newProduct = {
        ...product,
        id: newProductId,
      };

      prods.push(newProduct);
      await fs.writeFile(this.path, JSON.stringify(prods));
      console.log("Producto agregado correctamente");
    }
  }

  async deleteProduct(id) {
    const prods = await this.getProducts();
    const prod = prods.find((prod) => prod.id === id);

    if (prod) {
      await fs.writeFile(
        this.path,
        JSON.stringify(prods.filter((prod) => prod.id != id))
      );
      console.log("Producto eliminado correctamente");
    } else {
      console.log("Producto no encontrado");
    }
  }

  async updateProduct(id, product) {
    const prods = await this.getProducts();
    const prodindex = prods.findIndex((prod) => prod.id === id);

    if (prodindex !== -1) {
      prods[prodindex].code = product.code;
      prods[prodindex].title = product.title;
      prods[prodindex].price = product.price;
      prods[prodindex].thumbnail = product.thumbnail;
      prods[prodindex].stock = product.stock;
      prods[prodindex].category = product.category;
      prods[prodindex].description = product.description;

      await fs.writeFile(this.path, JSON.stringify(prods));
      console.log("Producto actualizado correctamente");
    } else {
      console.log("Producto no encontrado");
    }
  }
}

export class Product {
  constructor(
    code,
    title,
    price,
    description,
    stock,
    category,
    thumbnail = []
  ) {
    this.id = Product.incrementarId();
    this.code = code;
    this.title = title;
    this.price = price;
    this.description = description;
    this.stock = stock;
    this.category = category;
    this.thumbnail = thumbnail;
  }

  static async incrementarId() {
    if (!this.idIncrement) {
      const maxId = await Product.getMaxProductId();
      this.idIncrement = maxId + 1;
    } else {
      this.idIncrement++;
    }
    return this.idIncrement;
  }

  static async getMaxProductId() {
    const productManager = new ProductManager();
    const prods = await productManager.getProducts();
    const maxId = prods.reduce(
      (max, prod) => (prod.id > max ? prod.id : max),
      0
    );
    return maxId;
  }
}
