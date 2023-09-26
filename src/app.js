import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import { Server } from "socket.io";

import config from "./config/config.js";
import apiProductsRouter from "./routes/apiProducts.router.js";
import productsRouter from "./routes/products.router.js";
import apiCartsRouter from "./routes/apiCarts.router.js";
import cartsRouter from "./routes/carts.router.js";
import realTimeProductsRouter from "./routes/realtimeproducts.router.js";
import chatRouter from "./routes/chat.router.js";
import userRouter from "./routes/users.router.js";
import mailerRouter from "./routes/mailer.router.js";
import smsRouter from "./routes/sms.router.js";
import mockingproductsRouter from "./routes/mockingproducts.router.js";
import logRouter from "./routes/logs.router.js";
import __dirname, { passportAuthenticate } from "./utils.js";
import initializePassport from "./config/passport.config.js";
import { messageModel } from "./models/messageModel.js";
import errorHandler from "./controllers/errors/middleware.error.js";
import { createLogger } from "./utils.js";

mongoose.set("strictQuery", false);

const app = express();
const logger = createLogger();

const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Sinteplast Construccion Ecommerce - Documentation",
            description:
                "API para administrar productos, usuarios y pedidos en una aplicación de ecommerce.",
            version: "1.0.0",
        },
    },
    apis: ['./src/docs/**/*.yaml'],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(cookieParser());
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", userRouter);
app.use("/api/products", passportAuthenticate("jwt"), apiProductsRouter);
app.use("/products", passportAuthenticate("jwt"), productsRouter);
app.use("/api/carts", passportAuthenticate("jwt"), apiCartsRouter);
app.use("/carts", passportAuthenticate("jwt"), cartsRouter);
app.use("/chat", passportAuthenticate("jwt"), chatRouter);
app.use("/mail", passportAuthenticate("jwt"), mailerRouter);
app.use("/sms", passportAuthenticate("jwt"), smsRouter);
app.use("/mockingproducts", passportAuthenticate("jwt"), mockingproductsRouter);
app.use("/loggerTest", passportAuthenticate("jwt"), logRouter);
app.use(
    "/realtimeproducts",
    passportAuthenticate("jwt"),
    realTimeProductsRouter
);
app.use(express.static(__dirname + "/public"));
app.use(errorHandler);

try {
    await mongoose.connect(config.MONGO_URL, {
        serverSelectionTimeoutMS: 5000,
    });
    logger.debug(Date.now() + " / DB conected");
    const httpServer = app.listen(8080, () => {
        logger.debug(Date.now() + " / Server UP");
    });

    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socketClient) => {
        //const prod = new ProductManager("./src/data/productos.json");
        logger.info(Date.now() + " / User conected");
        socketClient.on("deleteProd", (prodId) => {
            const result = prod.deleteProduct(prodId);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto eliminado");
            }
        });
        socketClient.on("addProd", (product) => {
            const producto = JSON.parse(product);
            const result = prod.addProduct(producto);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto agregado");
            }
        });
        socketClient.on("newMessage", async (message) => {
            try {
                logger.info(Date.now() + " / " + message);
                let newMessage = await messageModel.create({
                    user: message.email.value,
                    message: message.message,
                });
                logger.info(Date.now() + " / ", newMessage);
                socketServer.emit("emitMessage", newMessage);
            } catch (error) {
                logger.error(Date.now() + " / " + error);
                socketClient.emit("error", error);
            }
        });
    });
} catch (error) {
    logger.error(Date.now() + " / " + error);
}
