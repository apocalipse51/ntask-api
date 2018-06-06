module.exports = app => {
    const Users = app.db.models.Users;

    app.route("/user")
        .all(app.auth.authenticate())
        /**
         * @api {get} /user Exibe usuário autenticado
         * @apiGroup Usuario
         * @apiHeader {String} Authorization Token de usuário
         * @apiHeaderExample {json} Header
         *      {"Authorization": "JWT lakjsdlaksjd90812u3987asdhas"}         
         * @apiSuccess {Number} id Id de registro
         * @apiSuccess {String} name Nome
         * @apiSuccess {String} email Email
         * @apiSuccessExample {json} Sucesso
         *      HTTP/1.1 200 OK
         *      {
         *          "id": 1,
         *          "name": "John Connor",
         *          "email": "john@connor.net"
         *      }
         * @apiErrorExample {json} Erro de consulta
         *      HTTP/1.1 412 Precondition Failed
         */
        .get((req, res) => {
            Users.findById(req.user.id, {
                attributes: ["id", "name", "email"]
            })
            .then(result => {
                if(result) {
                    res.status(200).json(result)
                } else {
                    res.sendStatus(404);
                }            
            })
            .catch(error => res.status(412).json({msg: error.message}));
        })  
        /**
         * @api {delete} /user Exclui usuário autenticado
         * @apiGroup Usuario
         * @apiHeader {String} Authorization Token de usuário
         * @apiHeaderExample {json} Header
         *      {"Authorization": "JWT çalskda9s0ud12983095alskdma"}
         * @apiSuccessExample {json} Sucesso
         *      HTTP/1.1 204 No Content
         * @apiErrorExample {json} Erro na exclusão
         *      HTTP/1.1 412 Precondition Failed
         */
        .delete((req, res) => {
            Users.destroy({where: {id: req.user.id}})
            .then(result => res.sendStatus(204))
            .catch(error => res.status(412).json({msg: error.message}));
        });             
    /**
     * @api {post} /users Cadastra novo usuário
     * @apiGroup Usuario
     * @apiParam {String} name Nome
     * @apiParam {String} email Email
     * @apiParam {String} password Senha
     * @apiParamExample {json} Entrada
     *      {
     *          "name": "John Connor",
     *          "email": "john@connor.net",
     *          "password": "123456"
     *      }
     * @apiSuccess {Number} id Id de registro
     * @apiSuccess {String} name Nome
     * @apiSuccess {String} email Email
     * @apiSuccess {String} password Senha criptografada
     * @apiSuccess {Date} updated_at Data de atualização
     * @apiSuccessExample {json} Sucesso
     *      HTTP/1.1 200 OK
     *      {
     *          "id": 1,
     *          "name": "John Connor",
     *          "email": "john@connor.net",
     *          "password": "oi12j391@*#&@mas",
     *          "updated_at": "2018-05-03T15:46:00.778Z",
     *          "created_at": "2018-05-03T15:46:00.778Z"   
     *      }
     * @apiErrorExample {json} Erro no cadastro
     *      HTTP/1.1 412 Precondition Failed
     */
    app.post("/users", (req, res) => {
        Users.create(req.body)
            .then(result => res.status(200).json(result))
            .catch(error => res.status(412).json({msg: error.message}));
    })
};