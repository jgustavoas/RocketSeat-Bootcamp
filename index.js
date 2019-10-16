const express = require('express');

const server = express();

server.use(express.json());

const projetos = [];

let contarReqs = 0;

// Middleware global
server.use((req, res, next) => {
  contarReqs += 1;

  console.log(`Número de requisições feitas: ${contarReqs}`);

  return next();
})

//Middleware local
function checarProjetoPorID(req, res, next) {
  const {id} = req.params;

  if(!projetos.find(p => p.id === id)) {
    return res.status(400).send(`Não existe um projeto com a id ${id}`);
  }

  return next();

}

server.get('/', (req, res) => {
  res.send('Hello World');
})

// URL "projetos" (plural) para indicar listagem de todos os projetos
server.get('/projetos', (req, res) => {
  res.json(projetos);
})

server.post('/projeto', (req, res) => {
  const projeto = req.body;

  projetos.push(projeto);

  return res.json(projetos);
})

server.put('/projeto/:id', checarProjetoPorID, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  let qualProjeto = projetos.find(p => p.id === id);

  qualProjeto.title = title;

  return res.json(projetos);

})

server.delete('/projeto/:id', checarProjetoPorID, (req, res) => {
  const {id} = req.params;

  let indiceDoProjeto = projetos.findIndex(p => p.id === id);

  projetos.splice(indiceDoProjeto, 1);  

  return res.send('Projeto apagado com sucesso');
})

server.post('/projeto/:id/tasks', checarProjetoPorID, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  let qualProjeto = projetos.find(p => p.id === id);

  qualProjeto.tasks.push(title);

  return res.json(projetos);
})

server.listen(3000);