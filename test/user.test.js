const app = require("../src/index");
const supertest = require("supertest");
const request = supertest(app)

const mainUser = {nome: "Lucas", email: "lucas@gmail.com", password: "13311441"}

beforeAll(() => {

    return request.post("/user")
    .send(mainUser)
    .then(res => {})
    .catch(error => console.log(error))

});

afterAll(() => {
    return request.delete(`/deleUserSecret${mainUser.email}`)
    .catch(erro => {console.log(erro)})

})

describe("Cadastro de usuario", () => {

    test("Deve cadastrar um usuario com sucesso", () => {

        let time = Date.now();
        let email = `${time}@gmail.com`
        let user = {
            name: "Lucas",
            email,
            password: "1234567"
        }

        return request.post("/user")
        .send(user)
        .then(res => {

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email)

        }).catch(err => {
            console.log(err)
        })

    })

    test("Deve impedir que o cadastro seja feito com dados vazios", () => {

        let user = { name: "", email: "", password: ""}
  
        return request.post("/user")
        .send(user)
        .then(res => {

            expect(res.statusCode).toEqual(400);

        }).catch(err => {
            console.log(err)
        })

    })

    test("Deve impedir cadastro de e-mails iguais", () => {

        let time = Date.now();
        let email = `${time}@gmail.com`
        let user = {
            name: "Lucas",
            email,
            password: "1234567"
        }

        return request.post("/user")
        .send(user)
        .then(res => {

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email)

            return request.post("/user")
            .send(user)
            .then(res => {

                expect(res.statusCode).toEqual(400);
                expect(res.body.error).toEqual("E-mail já cadastrado")

            }).catch(err => {
                console.log(err)
            })

        }).catch(err => {
            console.log(err)
        })

    })

});

describe("Autenticação", () => {
    test("Deve retornar token quando logat", () => {
        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined()
        })
        .catch(err =>{
            console.log(err)
        } )
    });

    test("Deve impedir que um usuario não cadastrado se logue", () => {

        return request.post("/auth")
        .send({email:"kmdaskl@gmial.com", password: mainUser.password})
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.email).toEqual("E-mail não cadastrado")
        })
        .catch(err =>{
            console.log(err)
        } )

    });

    test("Deve impedir que um usuario com a senha se logue", () => {

        return request.post("/auth")
        .send({email: mainUser.password , password: "lindão"})
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.senha).toEqual("Senha incorreta")
        })
        .catch(err =>{
            console.log(err)
        } )

    })
})