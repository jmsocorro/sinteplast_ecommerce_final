import { Router } from "express";
import passport from "passport";
import multer from "multer";
import userController from "../controllers/user.controller.js";
import fs from "fs";
import {
  generateToken,
  userLogged,
  passportAuthenticateApi,
  passportAuthenticateRole,
  createLogger,
} from "../utils.js";
import UserDto from "../dto/user.dto.js";
import config from "../config/config.js";

const router = Router();
const logger = createLogger();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const targetDir = "./src/public/" + file.fieldname + "/" + req.user._id;
    fs.mkdirSync(targetDir, { recursive: true });
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "_" + Date.now());
  },
});
const uploader = multer({ storage });

router.get("/", userLogged("jwt"), (req, res) => {
  res.render("login", {});
});
router.get("/login", userLogged("jwt"), (req, res) => {
  res.render("login", {});
});
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failurelogin" }),
  async (req, res) => {
    if (!req.user) {
      res.render("login", {
        message: {
          type: "error",
          title: "Error de logueo",
          text: "El correo eletrónico o contraseña no son correctos",
        },
      });
    } else {
      delete req.user.password;
      delete req.user._id;
      delete req.user.__v;
      logger.debug(Date.now() + " / " + JSON.stringify(req.user));
      res
        .status(200)
        .cookie(config.JWT_COOKIE, req.user.token)
        .redirect("/products");
    }
  }
);
router.post(
  "/apilogin",
  passport.authenticate("login", { failureRedirect: "/failurelogin" }),
  async (req, res) => {
    if (!req.user) {
      res.render("login", {
        message: {
          type: "error",
          title: "Error de logueo",
          text: "El correo eletrónico o contraseña no son correctos",
        },
      });
    } else {
      delete req.user.password;
      delete req.user._id;
      delete req.user.__v;
      logger.debug(Date.now() + " / " + req.user);
      res.status(200).cookie(config.JWT_COOKIE, req.user.token).send(req.user);
    }
  }
);
router.get("/register", userLogged("jwt"), (req, res) => {
  res.render("register", {});
});
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "failureregister",
  }),
  async (req, res) => {
    res.render("login", {
      message: {
        type: "success",
        title: "Registro exitoso",
        text: "Iniciá tu session con los datos cargados",
      },
    });
  }
);
router.get(
  "/registeradmin",
  passportAuthenticateRole("jwt", ["admin"]),
  (req, res) => {
    res.render("registerAdmin", {});
  }
);
router.post(
  "/registeradmin",
  passportAuthenticateRole("jwt", ["admin"]),
  passport.authenticate("register", {
    failureRedirect: "failureregister",
  }),
  async (req, res) => {
    res.render("registeradmin", {
      message: {
        type: "success",
        title: "Registro exitoso",
        text: "El usuario fue dado de alta exitosamente",
      },
    });
  }
);
router.get("/users/:uid", passportAuthenticateApi("jwt"), (req, res, next) => {
  if (!req.user) {
    res.status(400).send({
      error: "No existe una sesión de usuario activa",
    });
  } else if (req.user.role !== "admin") {
    res.status(401).send({
      error: "No esta autorizado para editar Usuarios",
    });
  } else {
    next("route");
  }
});
router.get("/users/:id", userController.getUserRoleById);
router.post(
  "/api/users/:id",
  passportAuthenticateApi("jwt"),
  (req, res, next) => {
    if (!req.user) {
      res.status(400).send({
        error: "No existe una sesión de usuario activa",
      });
    } else if (req.user.role !== "admin") {
      res.status(401).send({
        error: "No esta autorizado para editar Usuarios",
      });
    } else {
      next("route");
    }
  }
);
router.post("/api/users/:id", userController.updateUserRoleById);
router.get("/api/users", passportAuthenticateApi("jwt"), (req, res, next) => {
  if (!req.user) {
    res.status(400).send({
      error: "No existe una sesión de usuario activa",
    });
  } else if (req.user.role !== "admin") {
    res.status(401).send({
      error: "No esta autorizado para editar Usuarios",
    });
  } else {
    next("route");
  }
});
router.get("/api/users", userController.getUsers);
router.delete(
  "/api/users",
  passportAuthenticateApi("jwt"),
  (req, res, next) => {
    if (!req.user) {
      res.status(400).send({
        error: "No existe una sesión de usuario activa",
      });
    } else if (req.user.role !== "admin") {
      res.status(401).send({
        error: "No esta autorizado para editar Usuarios",
      });
    } else {
      next("route");
    }
  }
);
router.delete("/api/users", userController.deleteInactivetUsers);
router.post(
  "/api/users/:uid/documents",
  passportAuthenticateApi("jwt"),
  (req, res, next) => {
    if (!req.user) {
      res.status(400).send({
        error: "No existe una sesión de usuario activa",
      });
    } else {
      next("route");
    }
  }
);
router.post(
  "/api/users/:uid/documents",
  uploader.any(),
  userController.ulploadFiles
);
router.get(
  "logout",
  passportAuthenticateApi("jwt"),
  (req, res, next) => {
    if (!req.user) {
      res.status(400).send({
        error: "No existe una sesión de usuario activa",
      });
    } else {
      next("route");
    }
  }
);
router.get("/logout", userController.logout);
router.get("/failureregister", (req, res) => {
  res.render("register", {
    message: {
      type: "error",
      title: "Error de registro",
      text: "El email ya se encuentre registrado",
    },
  });
});
router.get("/failurelogin", (req, res) => {
  res.render("login", {
    message: {
      type: "error",
      title: "Error de logueo",
      text: "El correo eletrónico o contraseña no son correctos",
    },
  });
});
router.get(
  "/githublogin",
  passport.authenticate("github", { scope: ["user: email"] }),
  (req, res) => {}
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/failurelogin" }),
  async (req, res) => {
    delete req.user.password;
    delete req.user._id;
    delete req.user.__v;
    const token = generateToken(req.user);
    req.user.token = token;
    res.cookie(config.JWT_COOKIE, req.user.token).redirect("/products");
  }
);
router.get("/current", passportAuthenticateApi("jwt"), (req, res) => {
  if (!req.user) {
    res.status(400).send({
      error: "No existe una sesión de usuario activa",
    });
  }
  const user = new UserDto(req.user);
  res.send(user);
});
router.get("/reset", userLogged("jwt"), (req, res) => {
  res.render("reset", {});
});
router.post("/reset", userController.resetPasswordToken);
router.get("/reset/:token", userController.resetPassword);
router.get("/failurereset", (req, res) => {
  res.render("reset", {
    message: {
      type: "error",
      title: "Error",
      text: "El correo eletrónico no pertenece a un usuario",
    },
  });
});

export default router;
