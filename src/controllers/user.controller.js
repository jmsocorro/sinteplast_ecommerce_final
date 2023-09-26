import { fi } from "@faker-js/faker";
import UserRepository from "../repositories/user.repository.js";
import ListUserDto from "../dto/listUser.dto.js";
import config from "../config/config.js";

const user = new UserRepository();

const getUsers = async (req, res) => {
  let { limit = 10, page = 1, query, sort } = req.query;
  try {
    const users = await user.getUsers(limit, page, query, sort);
    console.log(users);
    const docsDTO = users.docs.map((doc) => new ListUserDto(doc));
    users.docs = docsDTO;
    console.log(docsDTO);
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
};
const getUserById = async (req, res) => {
  let id = req.params.id;
  try {
    const founduser = await user.updateUserRoleById(id);
    res.render("user", founduser);
  } catch (error) {
    res.status(404).send({
      error: "Usuario no encontrado",
      servererror: error,
    });
  }
};
const getUserRoleById = async (req, res) => {
  let id = req.params.id;
  try {
    const founduser = await user.getUserById(id);
    if (founduser.role) {
      res.render("userRole", founduser);
    } else {
      res.status(404).render("userRole", {
        message: {
          type: "error",
          title: "Usuario no encontrado",
          text: "El id del usaurio no corresponde a ningún usuario",
        },
      });
    }
  } catch (error) {
    res.status(404).render("userRole", {
      message: {
        type: "error",
        title: "Usuario no encontrado",
        text: "El id del usuario no corresponde a ningún usuario",
      },
    });
  }
};
const updateUserRoleById = async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;
  try {
    const result = await user.updateUserRoleById(id, role);
    console.log(result);
    if ("error" in result) {
      console.log(result.error);
      result.updatedUser = {
        message: result.message,
      };
    } else {
      result.message = {
        type: "success",
        title: "Actualización exitosa,",
        text: "El rol del usuario fue actualizado correctamente",
        status: 200,
      };
    }
    res.status(result.message.status).render("userRole", result);
  } catch (error) {
    res.status(404).render("userRole", {
      message: {
        type: "error",
        title: "Error de actualización",
        text: "Error de servidor",
      },
    });
  }
};
const resetPasswordToken = async (req, res) => {
  const { email } = req.body;
  const token = await user.resetPasswordToken(email);
  if (token.error) {
    res.status(404).render("reset", {
      message: {
        type: "error",
        title: "Error",
        text: "El email no corresponde a un usuario existente",
      },
    });
  } else {
    console.log(token);
    res.status(200).render("reset", {
      message: {
        type: "success",
        title: "Usuario encontrado",
        text: "Enviamos un email con las instrucciones para reestablecer tu clave",
      },
    });
  }
};
const resetPassword = async (req, res) => {
  const token = req.params.token;
  const email = await user.resetPassword(token);
  res.status(200).send(email);
};
const ulploadFiles = async (req, res) => {
  const uid = req.user._id;
  const files = req.files;
  try {
    const founduser = await user.updateUserDocsById(uid, files);
    res.status(200).send(founduser);
  } catch (error) {
    res.status(404).send({
      message: {
        type: "error",
        title: "Error de actualización",
        text: "Usuario inexistente",
      },
    });
  }
};
const deleteInactivetUsers = async (req, res) => {
  try {
    const result = await user.deleteInactivetUsers();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
const logout = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      const result = await user.logout(req.user._id);
      console.log(result);
    }
    res.clearCookie(config.JWT_COOKIE).redirect("login");
  } catch (err) {
    res.status(400).send(err);
  }
};
export default {
  getUsers,
  getUserById,
  getUserRoleById,
  updateUserRoleById,
  resetPassword,
  resetPasswordToken,
  ulploadFiles,
  deleteInactivetUsers,
  logout,
};
