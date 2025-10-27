import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { randomUUID } from "crypto";
import { pets } from "./dados.js";
import {
  logMiddleware,
  logRequestMiddleware,
  logBody,
  validatePetMiddleware,
  validatePetIdadeMiddleware
} from "./middleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(logMiddleware);

//  GET /pets — Listar todos
app.get("/pets", [logRequestMiddleware], (req, res) => {
  const { nome, tutor, raca } = req.query;
  let dados = pets;

  if (nome) dados = dados.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
  if (tutor) dados = dados.filter(p => p.tutor.toLowerCase().includes(tutor.toLowerCase()));
  if (raca) dados = dados.filter(p => p.raca.toLowerCase().includes(raca.toLowerCase()));

  res.status(200).send({
    ok: true,
    mensagem: "Lista de pets retornada com sucesso.",
    dados
  });
});

//  POST /pets — Criar novo pet
app.post("/pets", [logBody, validatePetMiddleware, validatePetIdadeMiddleware], (req, res) => {
  try {
    const body = req.body;

    const novoPet = {
      id: randomUUID(),
      nome: body.nome,
      raca: body.raca,
      idade: body.idade,
      tutor: body.tutor
    };

    pets.push(novoPet);

    res.status(201).send({
      ok: true,
      mensagem: "Pet criado com sucesso!",
      dados: pets
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      ok: false,
      mensagem: "Erro ao criar pet.",
      erro: error.toString()
    });
  }
});

//  GET /pets/:id — Buscar pet específico
app.get("/pets/:id", [logRequestMiddleware], (req, res) => {
  const { id } = req.params;

  const pet = pets.find(p => p.id === id);
  if (!pet) {
    return res.status(404).send({
      ok: false,
      mensagem: "Pet não encontrado!"
    });
  }

  res.status(200).send({
    ok: true,
    mensagem: "Pet encontrado com sucesso!",
    dados: pet
  });
});

//  PUT /pets/:id — Atualizar pet
app.put("/pets/:id", [logBody, validatePetMiddleware], (req, res) => {
  const { id } = req.params;
  const { nome, raca, idade, tutor } = req.body;

  const pet = pets.find(p => p.id === id);
  if (!pet) {
    return res.status(404).send({
      ok: false,
      mensagem: "Pet não encontrado!"
    });
  }

  pet.nome = nome;
  pet.raca = raca;
  pet.idade = idade;
  pet.tutor = tutor;

  res.status(200).send({
    ok: true,
    mensagem: "Pet atualizado com sucesso!",
    dados: pets
  });
});

// 🐾 DELETE /pets/:id — Remover pet
app.delete("/pets/:id", (req, res) => {
  const { id } = req.params;

  const index = pets.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).send({
      ok: false,
      mensagem: "Pet não encontrado!"
    });
  }

  pets.splice(index, 1);

  res.status(200).send({
    ok: true,
    mensagem: "Pet removido com sucesso!",
    dados: pets
  });
});

//  PATCH /pets/:id — Atualizar apenas a idade (exemplo)
app.patch("/pets/:id", (req, res) => {
  const { id } = req.params;
  const { idade } = req.body;

  const pet = pets.find(p => p.id === id);
  if (!pet) {
    return res.status(404).send({
      ok: false,
      mensagem: "Pet não encontrado!"
    });
  }

  pet.idade = idade;

  res.status(200).send({
    ok: true,
    mensagem: "Idade do pet atualizada com sucesso!",
    dados: pet
  });
});

//  Porta
const porta = process.env.PORT;
app.listen(porta, () => {
console.log(`Servidor rodando na porta ${porta} 🐾`);
});
