import mongoose from "mongoose";
import userModel from "../models/users.Model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { generateResetToken, gettokeninfo } from "../utils.js";

import config from "../config/config.js";

export default class UserManagerDB {
  constructor() {
    this.userModel = mongoose.model(
      userModel.userCollection,
      userModel.userSchema
    );
  }
  newUser = async ({ first_name, last_name, email, age, password }) => {
    try {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,120}$/;
      let errortxt = [];
      (!first_name || first_name.length === 0) &&
        errortxt.push("first_name es obligatorio.");
      (!last_name || last_name.length === 0) &&
        errortxt.push("last_name es obligatorio.");
      (!email || email.length === 0) && errortxt.push("email es obligatorio.");
      (!age || age.length === 0) && errortxt.push("age es obligatorio.");
      age &&
        (isNaN(age) || Number.isInteger(age) || age <= 0) &&
        errortxt.push("age tiene que ser un número positivo.");
      (!password || !regex.test(password)) &&
        errortxt.push(
          "password debe tener al entre 8 y 120 caracteres, al menos una mayúscula, una minúscula y un caracter especial. " +
            regex.test(password) +
            " " +
            password
        );
      const found = await this.userModel
        .findOne({ email: email })
        .lean()
        .exec();
      if (found !== null) {
        errortxt.push(
          "Ya se encuentra un usuario registrado con el mismo correo electrónico."
        );
      }
      if (errortxt.length > 0) {
        return { error: 1, errortxt: errortxt };
      } else {
        const hashpass = bcrypt.hashSync(password, 10);
        const user = {
          first_name,
          last_name,
          email,
          age,
          password: hashpass,
        };
        const newUser = new this.userModel(user);
        newUser.save();
        return newUser;
      }
    } catch (error) {
      return { error: 3, servererror: error };
    }
  };
  loginUser = async ({ email, password }) => {
    try {
      logger.debug(Date.now() + " /  " + email + " - " + password);
      const found = await this.userModel
        .findOne({ email: email })
        .lean()
        .exec();
      if (found !== null && bcrypt.compareSync(password, found.password)) {
        return found;
      } else {
        return {
          error: 4,
          errortxt: ["El correo eletrónico o contraseña no son correctos"],
        };
      }
      return found;
    } catch (error) {
      logger.error(Date.now() + " / " + error);
      return { error: 3, servererror: error };
    }
  };
  getUsers = async (limit = 10, page = 1, query = "{}", sort) => {
    // verifico si query tiene un formato valido
    const isValidJSON = (query) => {
      try {
        JSON.parse(query);
        return true;
      } catch (e) {
        return false;
      }
    };
    const vquery = isValidJSON ? JSON.parse(query) : {};
    // verifico si sort tiene un formato valido
    const users = await this.userModel.paginate(vquery, {
      page,
      limit,
      lean: true,
      sort,
    });
    return users;
  };
  getUserById = async (id) => {
    try {
      const founduser = await this.userModel.findOne({ _id: id }).lean().exec();
      return founduser;
    } catch (error) {
      return { error: 3, servererror: error };
    }
  };
  updateUserRoleById = async (id, role) => {
    try {
      const founduser = await this.userModel.findOne({ _id: id }).lean().exec();
      if (founduser === null) {
        console.log("el usuario no existe");
        return {
          error: 2,
          message: {
            type: "error",
            title: "Error de actualización",
            text: "Usuario inexistentes",
            status: 404,
          },
        };
      }
      if (!["user", "premium", "admin"].includes(role)) {
        console.log("el rol no existe");
        founduser.error = 3;
        founduser.message = {
          type: "error",
          title: "Error de actualización",
          text: "Rol inexistentes",
          status: 404,
        };
        return founduser;
      }
      if (role === "premium" && !founduser.status) {
        console.log("el usuario no ha terminado de procesar su documentación.");
        founduser.error = 4;
        founduser.message = {
          type: "error",
          title: "Error de actualización",
          text: "El usuario no ha terminado de procesar su documentación",
          status: 404,
        };
        return founduser;
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(id, {
        role,
      });
      updatedUser.role = role;
      return updatedUser;
    } catch (error) {
      console.log(error);
      return { error: 3, servererror: error };
    }
  };
  updateUserLastConnectionById = async (id) => {
    console.log("userDB");
    console.log(id);
    try {
      const founduser = await this.userModel.findOne({ _id: id }).lean().exec();
      if (founduser === null) {
        return {
          error: 2,
          message: {
            type: "error",
            title: "Error de actualización",
            text: "Usuario inexistentes",
            status: 404,
          },
        };
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(id, {
        last_connection: Date.now(),
      });
      return updatedUser;
    } catch (error) {
      console.log(error);
      return { error: 3, servererror: error };
    }
  };
  updateUserCartById = async (id, cid) => {
    try {
      const founduser = await this.userModel.findOne({ _id: id }).lean().exec();
      if (founduser === null) {
        console.log("el usuario no existe");
        return { error: 2, errortxt: "el usuario no existe" };
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(id, {
        cart: cid,
      });
      updatedUser.cart = cid;
      return {
        updatedUser,
      };
    } catch (error) {
      console.log(error);
      return { error: 3, servererror: error };
    }
  };
  updateUserDocsById = async (uid, files) => {
    try {
      const founduser = await this.userModel
        .findOne({ _id: uid })
        .lean()
        .exec();
      const documents = "documents" in founduser ? founduser.documents : [];
      const doctype = "doctype" in founduser ? founduser.doctype : [];
      if (founduser === null) {
        console.log("el usuario no existe");
        return { error: 2, errortxt: "el usuario no existe" };
      }
      files.map((file) => {
        documents.push({
          name: file.filename,
          reference:
            "./src/public/" +
            file.fieldname +
            "/" +
            founduser._id +
            "/" +
            file.filename,
        });
        !doctype.includes(file.fieldname) && doctype.push(file.fieldname);
      });
      console.log("files");
      console.log(documents);
      console.log(doctype);
      const status =
        doctype.includes("id_doc") &&
        doctype.includes("address_doc") &&
        doctype.includes("bank_doc");
      const updatedUser = await this.userModel.findByIdAndUpdate(uid, {
        documents: documents,
        doctype: doctype,
        status: status,
      });
      console.log("updatedUser");
      console.log(updatedUser);
      updatedUser.documents = documents;
      updatedUser.doctype = doctype;
      updatedUser.status = status;
      console.log(updatedUser);
      return {
        updatedUser,
      };
    } catch (error) {
      console.log(error);
      return { error: 3, servererror: error };
    }
  };
  resetPasswordToken = async (email) => {
    const founduser = await this.userModel
      .findOne({ email: email })
      .lean()
      .exec();
    if (founduser === null) {
      console.log("el usuario no existe");
      return { error: 2, errortxt: "el usuario no existe" };
    }
    const token = generateResetToken(email);
    // Envio el token por mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: config.MAIL_APP_USER,
        pass: config.MAIL_APP_PASS,
      },
    });
    const mailresult = await transport.sendMail({
      from: "Sinteplast Construccion - Tienda <" + config.MAIL_APP_USER + ">",
      to: `${founduser.first_name} ${founduser.last_name}<${founduser.email}>`,
      subject: `Reestablecimiento de clave`,
      html: `
                    <div>
                        <h1>Reestablecimiento de clave</h1>
                        <p>Usuario: ${founduser.first_name} ${founduser.last_name}</p>
                        <a href="http://localhost:8080/reset/${token}">Reestablecer tu clave heciendo click aca</a>
                        <p>o copiá esta direccion en tu navegador</p>
                        <p>http://localhost:8080/reset/${token}</p>
                    </div>
                    `,
      attachments: [],
    });

    return { mailresult };
  };
  resetPassword = async (token) => {
    const email = gettokeninfo(token);
    console.log(email);
    return { email };
  };
  deleteInactivetUsers = async () => {
    try {
      const incativityTime = new Date();
      incativityTime.setDate(incativityTime.getDate() - 2);
      const inactiveUsers = await this.userModel
        .find({
          $and: [
            {
              role: { $ne: "admin" },
            },
            {
              $or: [
                {
                  last_connection: {
                    $lt: incativityTime,
                  },
                },
                {
                  last_connection: {
                    $exists: false,
                  },
                },
              ],
            },
          ],
        })
        .lean();
      const deletedUsers = await this.userModel.findOneAndDelete({
//      const deletedUsers = await this.userModel.deleteMany({
        $and: [
          {
            role: { $ne: "admin" },
          },
          {
            $or: [
              {
                last_connection: {
                  $lt: incativityTime,
                },
              },
              {
                last_connection: {
                  $exists: false,
                },
              },
            ],
          },
        ],
      });

      return {
        inactiveUsers: inactiveUsers,
        deletedUsers: deletedUsers,
      };
    } catch (error) {
      logger.error(Date.now() + " / " + error);
      return { error: 3, servererror: error };
    }
  };
}

// export { UserManagerDB };
