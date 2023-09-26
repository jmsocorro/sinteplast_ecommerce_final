import Persistance from "../dao/factory.js";

export default class CartRepository {
  constructor() {
    this.cartDao;
    this.init();
  }

  init = async () => {
    this.cartDao = await Persistance.getCartPers();
  };

  getCarts = async (limit = 10, page = 1, query = "{}", sort) => {
    return await this.cartDao.getCarts(limit, page, query, sort);
  };
  getCartById = async (cid) => {
    return await this.cartDao.getCartById(cid);
  };
  addCart = async (uid) => {
    return await this.cartDao.addCart(uid);
  };
  addProduct = async ({ cid, pid }) => {
    return await this.cartDao.addProduct({ cid, pid });
  };
  updateAllProducts = async (cid, products) => {
    return await this.cartDao.updateAllProducts(cid, products);
  };
  updateProductQty = async ({ cid, pid, qty }) => {
    return await this.cartDao.updateProductQty({ cid, pid, qty });
  };
  deleteAllProducts = async (cid) => {
    return await this.cartDao.deleteAllProducts(cid);
  };
  deleteProduct = async ({ cid, pid }) => {
    return await this.cartDao.deleteProduct({ cid, pid });
  };
  closeCart = async (cid) => {
    return await this.cartDao.closeCart(cid);
  };
  checkOwner = async (pid, uem) => {
    return await this.cartDao.checkOwner(pid, uem);
  };
}
