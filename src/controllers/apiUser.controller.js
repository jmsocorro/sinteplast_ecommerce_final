import UserRepository from "../repositories/user.repository.js";

const user = new UserRepository();

const getUserById = async (req, res) => {
  let id = req.params.id;
  try {
    const founduser = await user.getUserById(id);
    res.status(200).send(founduser);
  } catch (error) {
    res.status(404).send({
      error: "Usero no encontrado",
      servererror: error,
    });
  }
};
const getUsers = async (req, res) => {
  let { limit = 10, page = 1, query, sort } = req.query;
  try {
    const usuarios = await user.getUsers(limit, page, query, sort);
    res.status(200).send(usuarios);
  } catch (err) {
    res.status(400).send(err);
  }
};
const addUser = async (req, res, next) => {
  const usuario = req.body;
  try {
    const result = await user.addUser(usuario);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    next(err);
  }
};
const updateUser = async (req, res) => {
  const usuario = req.body;
  try {
    const result = await user.updateUser(usuario);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
const deleteUser = async (req, res) => {
  let id = req.params.id;
  try {
    const result = await user.deleteUser(id);
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

export default {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
