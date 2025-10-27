// Middleware de log básico
export function logMiddleware(req, res, next) {
  console.log(`Nova requisição: ${req.method} ${req.url}`);
  next();
}

// Middleware pra logar corpo do request
export function logBody(req, res, next) {
  console.log(" Body recebido:", req.body);
  next();
}

// Middleware de log de requisições GET específicas
export function logRequestMiddleware(req, res, next) {
  console.log(` Acessando rota ${req.method} ${req.url}`);
  next();
}

// Validação geral dos campos do pet
export function validatePetMiddleware(req, res, next) {
  const { nome, raca, idade, tutor } = req.body;

  if (!nome || !raca || !idade || !tutor) {
    return res.status(400).send({
      ok: false,
      mensagem: "Todos os campos (nome, raca, idade, tutor) são obrigatórios!"
    });
  }

  next();
}

// Validação de idade mínima só pra exemplo
export function validatePetIdadeMiddleware(req, res, next) {
  const { idade } = req.body;
  if (idade < 0) {
    return res.status(400).send({
      ok: false,
      mensagem: "Idade não pode ser negativa!"
    });
  }
  next();
}
