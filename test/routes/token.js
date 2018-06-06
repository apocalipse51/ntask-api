describe("Routes: Token", () => {
    const Users = app.db.models.Users;
    describe("Post /token", () => {
        beforeEach(done => {
            Users
                .destroy({where: {}})
                .then(() => Users.create({
                    name: "John",
                    email: "john@email.com",
                    password: "123456"
                }))
                .then(() => done());
        });
        describe("status 200", () => {
            it("returns authenticated user token", done => {
                request.post("/token")
                    .send({
                        email: "john@email.com",
                        password: "123456"
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.include.keys("token");
                        done(err);
                    });
            });
        });
        describe("status 401", () => {
            it("throws error when password is incorrect", done => {
                request.post("/token")
                    .send({
                        email: "john@email.com",
                        password: "SENHA_ERRADA"
                    })
                    .expect(401)
                    .end((err, res) => {
                        done(err);
                    });
            });
            it("throws error when email not exist", done => {
                request.post("/token")
                    .send({
                        email: "EMAIL_ERRADO",
                        password: "SENHA_ERRADA"
                    })
                    .expect(401)
                    .end((err, res) => {
                        done(err);
                    });
            });
            it("throws error when email and password are blank", done => {
                request.post("/token")
                    .expect(401)
                    .end((err, res) => {
                        done(err);
                    });
            });
        });
    });
});