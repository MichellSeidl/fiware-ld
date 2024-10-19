# FIWARE-LD: Plataforma de Gestão de Dados Contextuais com NGSI-LD

Este repositório contém uma implementação do FIWARE Orion-LD, utilizando a especificação **NGSI-LD** para gestão de dados contextuais em tempo real. Ele permite a orquestração de serviços essenciais com Docker e **docker-compose**, integrando o **Orion-LD** com o **MongoDB** para armazenamento de dados históricos.

## Recursos incluídos:

- **Orion-LD**: Broker de Contexto compatível com NGSI-LD, permitindo a gestão e a consulta de entidades baseadas em contexto.
- **MongoDB (v3.6)**: Base de dados para armazenamento de dados contextuais e persistência histórica.
- Configuração de **docker-compose** para facilitar a orquestração e o gerenciamento dos containers.
- Exposição do broker Orion-LD na porta **1027**, com MongoDB configurado para armazenamento persistente.

Este repositório é ideal para quem deseja explorar a criação e o gerenciamento de dados contextuais no formato NGSI-LD e integrar com sistemas IoT ou aplicações baseadas em FIWARE.

## Portas dos Serviços

- **1026/TCP** - Orion-LD (Porta interna do Context Broker)
- **27017/TCP** - MongoDB (Porta do banco de dados, recomenda-se não abrir para a internet)

## Collection do Postman (Material para experimentação)

Aqui você vai encontrar um conjunto de collections desenvolvidas para serem importadas pela ferramenta Postman. Essa collection vai ajudá-lo a interagir com os componentes do **FIWARE** e **NGSI-LD**.

[Click aqui](https://www.postman.com/fiware/fiware-foundation-ev-s-public-workspace/folder/gthdx5a/linked-data-using-orion-ld)
para acessar a collection do Postman

# Comparativo entre FIWARE NGSIv2 e FIWARE NGSI-LD

| Característica                       |            FIWARE NGSIv2             |          FIWARE NGSI-LD           |
|--------------------------------------|--------------------------------------|-----------------------------------|
| **Modelo de Dados**                  | JSON/Key-Value                       | JSON-LD (baseado em Linked Data)  |
| **Padrão de Interface**              | NGSIv2 (REST API)                   | NGSI-LD (W3C RDF, JSON-LD)        |
| **Suporte a Dados Contextuais**      | Atributos de entidades sem semântica forte | Atributos semânticos com suporte a Linked Data e ontologias |
| **Relacionamento entre Entidades**   | Relacionamentos limitados e implícitos | Relacionamentos explícitos e semânticos |
| **Interoperabilidade**               | Baseado em APIs específicas de FIWARE | Baseado em padrões abertos e interoperáveis como W3C Linked Data |
| **Gerenciamento de Tempo**           | Suporte limitado a timestamps em entidades | Suporte nativo a dados temporais e históricos |
| **Persistência de Dados**            | Depende de extensões como Cygnus para persistência de dados históricos | Dados históricos podem ser gerenciados diretamente com NGSI-LD e integrações apropriadas |
| **Escalabilidade**                   | Arquitetura mais simples, mas com limitações de escalabilidade em grandes cenários | Mais adequada para sistemas distribuídos e cenários de IoT em larga escala |
| **Ontologias e Semântica**          | Não tem suporte direto a ontologias  | Integração com ontologias e vocabulários externos (por exemplo, schema.org) |
| **Formato de Respostas**             | JSON                                 | JSON-LD com links para vocabulários externos |
| **Ciclo de Vida das Entidades**      | Simples (CRUD: Create, Read, Update, Delete) | Rico (CRUD + patch, relacionamento entre entidades, notificações semânticas) |
| **Compatibilidade com NGSIv2**       | NGSIv2 é amplamente utilizado, mas com menor suporte semântico | NGSI-LD oferece compatibilidade via transcodificadores, mas a migração completa requer ajustes no modelo de dados |

## Como usar:

1. Clone o repositório.
2. Suba os containers com `docker-compose up`.
3. Acesse o Orion-LD na porta **1027** e inicie a gestão de suas entidades contextuais.
