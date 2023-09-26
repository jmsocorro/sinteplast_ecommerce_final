import chai from "chai";
import supertest from "supertest";

import { generateToken } from "../src/utils.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test users router", () => {
    let cookie;
    it("RUTA: / [GET] -> si no hay session debe renderizar login", async () => {
        const response = await requester.get("/");
        expect(response.status).to.be.eql(200);
        expect(response.type).to.be.eql("text/html");
        expect(response.text).not.to.be.undefined;
        // expect(response.headers.location).to.be.eql('/failurelogin');
    });
    it("RUTA: /login [POST] -> con datos no registrados redirecciona a pantalla de error", async () => {
        const mockuser = {
            email: "",
            password: "",
        };
        const response = await requester.post("/login").send(mockuser);
        expect(response.headers.location).to.be.eql("/failurelogin");
    });
    it("RUTA: /login [POST] -> con los datos de un usuario registrado loguea al usuario y devuelve una cookie ", async () => {
        const mockuser = {
            email: "jmsocorro@gmail.com",
            password: "#husares73JMS",
        };
        const response = await requester.post("/login").send(mockuser);
        const cookieOK = response.headers["set-cookie"][0];
        expect(cookieOK).to.be.ok;
        cookie = {
            name: cookieOK.split("=")[0],
            value: cookieOK.split("=")[1],
        };
        expect(cookie.name).to.be.eql("Cookie_Ecommerce");
        expect(cookie.value).to.be.ok;
    });
    it("RUTA: /apilogin [POST] -> con datos no registrados redirecciona a pantalla de error", async () => {
        const mockuser = {
            email: "",
            password: "",
        };
        const response = await requester.post("/apilogin").send(mockuser);
        expect(response.headers.location).to.be.eql("/failurelogin");
    });
    it("RUTA: /apilogin [POST] -> con los datos de un usuario registrado loguea al usuario y devuelve una cookie ", async () => {
        const mockuser = {
            email: "jmsocorro@gmail.com",
            password: "#husares73JMS",
        };
        const response = await requester.post("/apilogin").send(mockuser);
        const cookieOK = response.headers["set-cookie"][0];
        expect(cookieOK).to.be.ok;
        cookie = {
            name: cookieOK.split("=")[0],
            value: cookieOK.split("=")[1],
        };
        console.log(cookie.value);
        expect(cookie.name).to.be.eql("Cookie_Ecommerce");
        expect(cookie.value).to.be.ok;
    });
    it("---------", async () => {
        const { _body } = await requester
            .get("/current")
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        expect(_body.email).to.be.eql("jmsocorro@gmail.com");
    });
    it("RUTA: / [GET] -> si hay session debe redireccionar a /products", async () => {
        const response = await requester
            .get("/")
            .auth("jmsocorro@gmail", "#husares73JMS");
        expect(response.status).to.be.eql(302);
        expect(response.type).to.be.eql("text/html");
        expect(response.text).not.to.be.undefined;
        // expect(response.headers.location).to.be.eql('/failurelogin');
    });
});
