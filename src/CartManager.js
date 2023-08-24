import { promises as fs } from "fs";
export class Cart {
  constructor() {
    this.id = Cart.incrementarId();
    this.products = [];
  }

  static incrementarId() {
    return new Date().getTime();
  }
}

export class CartManager {
  constructor() {
    this.path = "Cart.json";
  }
  async saveCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
    } catch (error) {
      console.error("Error saving carts:", error);
    }
  }
  async getCart() {
    const carts = JSON.parse(await fs.readFile(this.path, "utf-8"));
    console.log(carts);
    return carts;
  }

  async addCart(cart) {
    const carts = await this.getCart();
    console.log(carts);
    carts.push(cart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
  }

  async getCartById(id) {
    const carts = await this.getCart();
    const cart = carts.find((cart) => cart.id == id);
    return cart;
  }

  async addProductToCart(cartId, productId, quantity) {
    const carts = await this.getCart();
    const cartIndex = carts.findIndex((c) => c.id == cartId);

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const existingProduct = cart.products.find((p) => p.product == productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await this.saveCarts(carts);
      return true;
    }

    return false;
  }
}
