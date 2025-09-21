# Projeto de demonstração para serviço CPU-Bound usando um monorepo nestjs Monorepo com gRPC

Este projeto demonstração utiliza um monorepo nestjs com gRPC para demonstrar como um serviço CPU-Bound pode ser implementado.

Ele consiste em dois serviços separados:

* `apps/orchestrator`: O serviço orquestrador do monorepo, responsável por gerenciar o tráfego e fazer as chamadas para o serviço de empacotamento.
* `apps/packing`: O serviço de empacotamento, responsável por processar as requisições e retornar as caixas necessárias para embalar os produtos.

O serviço de empacotamento é um serviço CPU-Bound que processa as requisições e retorna as caixas necessárias para embalar os produtos. Ele é implementado utilizando o padrão de comunicação gRPC.

Para executar o projeto, basta executar o comando `docker-compose up` na pasta raiz do projeto. Isso irá criar os containers necessários para executar o serviço de empacotamento e o monorepo.

A documentação swagger do projeto está disponível na rota default `/api`
