const express = require("express");
const app = express();
const connection = require("./database/database");
const perguntaModel = require("./database/pergunta-model");
const respostaModel = require("./database/resposta-model");

connection
  .authenticate()
  .then(() => console.log("foi"))
  .catch(() => console.log("n"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  const buscaConfig = {
    raw: true,
    order: [["id", "DESC"]],
  };
  const irPraOutrolugar = () => res.redirect("pergunta/1");

  const p = {
    irPraOutrolugar,
  };

  perguntaModel.findAll(buscaConfig).then((perguntas) => {
    const index = 1;
    res.render("index", {
      perguntas,
      index,
      p,
    });
  });
});
app.get("/perguntar", (req, res) => res.render("perguntar"));

app.post("/salvarpergunta", (req, res) => {
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  const umaPergunta = {
    titulo,
    descricao,
  };
  perguntaModel.create(umaPergunta).then(() => res.redirect("/"));
});

app.get("/pergunta/:id", (req, res) => {
  const id = req.params.id;
  const condicaoBusca = {
    raw: true,
    where: {
      id,
    },
  };
  perguntaModel.findOne(condicaoBusca).then((pergunta) => {
    if (pergunta === null) res.redirect("/");
    else {
      const condicaoBusca = {
        where: { perguntaId: pergunta.id },
        order: [
            ['id','DESC']
        ]
      };
      respostaModel.findAll(condicaoBusca).then((respostas) => {
        res.render("pergunta", { pergunta, respostas });
      });
    }
  });
});

app.post("/responder", (req, res) => {
  const corpo = req.body.corpo;
  const perguntaId = req.body.pergunta;
  console.log("chegou");
  const resposta = {
    corpo,
    perguntaId,
  };

  respostaModel
    .create(resposta)
    .then(() => res.redirect(`/pergunta/${perguntaId}`));
});

app.listen(4200, () => console.log("App no ar"));
