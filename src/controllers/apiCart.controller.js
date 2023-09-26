import CartRepository from "../repositories/cart.repository.js";
import config from "../config/config.js";

const carro = new CartRepository();

const getCarts = async (req, res) => {
  try {
    const result = await carro.getCarts();
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
const getCartById = async (req, res) => {
  const cid = req.params.cid;
  try {
    const result = await carro.getCartById(cid);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
const addCart = async (req, res) => {
  try {
    const result = await carro.addCart(req.user._id);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
const addProduct = async (req, res) => {
  const newCartProduct = {
    cid: req.params.cid,
    pid: req.params.pid,
  };
  try {
    const userisowner = await carro.checkOwner(req.params.pid, req.user.email);
    if(userisowner){
        res.status(401).send({ error: 6, errortxt: "No podés agregar un producto de tu portfolio" });
    } else {
      if (newCartProduct.cid === "null" && (!req.user.cart || req.user.cart===null)) {
        const result = await carro.addCart(req.user._id);
        newCartProduct.cid = result.newCart._id;
        const updatedcart = await carro.addProduct(newCartProduct);
        if (updatedcart.error) {
          res.status(400).cookie(config.JWT_COOKIE, result.token).send(updatedcart);
        } else {
          res.status(201).cookie(config.JWT_COOKIE, result.token).send(updatedcart);
        }
      } else {
        newCartProduct.cid =
          newCartProduct.cid === "null" ? req.user.cart : newCartProduct.cid;
        const result = await carro.addProduct(newCartProduct);
        if (result.error) {
          res.status(400).send(result);
        } else {
          res.status(201).send(result);
        }
      }
    };
  } catch (err) {
    res.status(400).send("err");
  }
};
const deleteAllProducts = async (req, res) => {
  const cid = req.params.cid;
  try {
    const result = await carro.deleteAllProducts(cid);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
const deleteProduct = async (req, res) => {
  const deleteCartProduct = {
    cid: req.params.cid,
    pid: req.params.pid,
  };
  try {
    const result = await carro.deleteProduct(deleteCartProduct);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
const updateProductQty = async (req, res) => {
  const updateProduct = {
    cid: req.params.cid,
    pid: req.params.pid,
    qty: req.body.qty,
  };
  try {
    const result = await carro.updateProductQty(updateProduct);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
const updateAllProducts = async (req, res) => {
  const cid = req.params.cid;
  const products = req.body;
  try {
    const result = await carro.updateAllProducts(cid, products);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
const closeCart = async (req, res) => {
  const cart = {
    cid: req.params.cid,
    user: req.user,
  };
  try {
    const result = await carro.closeCart(cart);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
export default {
  getCarts,
  getCartById,
  addCart,
  addProduct,
  deleteAllProducts,
  deleteProduct,
  updateProductQty,
  updateAllProducts,
  closeCart,
};
