const app = require("../src/index");
const supertest = require("supertest");
const request = supertest(app)

test("A aplicacao deve responder a porta 3131", () => {

    return request.get("/").then(res => {
        let status = res.statusCode
        expect(status).toEqual(200);
    }).catch(err => {
        console.log(err)
    });
})