import Persistance from "../dao/factory.js";

export default class ProductRepository {
  constructor() {
    this.productDao;
    this.init();
  }

  init = async () => {
    this.productDao = await Persistance.getProductPers();
  };

  getProducts = async (limit = 10, page = 1, query = "{}", sort) => {
    return await this.productDao.getProducts(limit, page, query, sort);
  };
  getProductById = async (id) => {
    return await this.productDao.getProductById(id);
  };
  addProduct = async ({
    title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    category,
    status = true,
    owner,
  }) => {
    return await this.productDao.addProduct({
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status,
      owner,
    });
  };
  updateProduct = async ({
    id,
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
    status,
    owner,
  }) => {
    return await this.productDao.updateProduct({
      id,
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status,
      owner,
    });
  };
  deleteProduct = async (id) => {
    return await this.productDao.deleteProduct(id);
  };
}
