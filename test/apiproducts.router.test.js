import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test product router", () => {
    it("/api/products [GET] -> devuelve status 401 si el usuario no esta logueado", async () => {
        const response = await requester.get("/api/products");
        expect(response.status).to.be.eq(401)
    });
});
