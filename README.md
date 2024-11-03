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

# IoT Agent Ultralight para Orion-LD

## Descrição
Este repositório contém a implementação do **IoT Agent Ultralight**, uma solução projetada para facilitar a integração de dispositivos IoT com a plataforma **Orion-LD**. O IoT Agent Ultralight traduz dados provenientes de dispositivos e sensores para o formato NGSI-LD, permitindo a comunicação eficiente e a gestão de dados em tempo real.

## Funcionalidades
- **Integração Simples**: Permite conectar dispositivos IoT de forma fácil e rápida ao Orion-LD.
- **Suporte ao NGSI-LD**: Transforma dados de dispositivos em formato compatível com NGSI-LD, promovendo a interoperabilidade.
- **Escalabilidade**: Suporta a adição de múltiplos dispositivos sem complicações, ideal para aplicações em larga escala.

## Como Funciona
O IoT Agent Ultralight atua como um intermediário entre dispositivos IoT e o Orion-LD. Ele recebe dados dos sensores em um formato simplificado e os converte para o formato NGSI-LD antes de enviá-los para a plataforma de gerenciamento. Isso permite que os dados sejam armazenados e consultados facilmente, proporcionando uma visão abrangente das informações coletadas.

## Cygnus-LD

O **Cygnus-LD** é um componente da plataforma FIWARE responsável por coletar, processar e persistir dados de contexto gerados pelo Orion-LD. Ele é utilizado para armazenar dados históricos, permitindo que eventos e mudanças no contexto sejam registrados e posteriormente analisados. O Cygnus-LD facilita a integração com diferentes sistemas de armazenamento, como bancos de dados relacionais, sistemas de arquivos e sistemas de processamento de big data, oferecendo flexibilidade na escolha do tipo de armazenamento de dados históricos.

Na configuração padrão, o Cygnus-LD atua como um conector entre o Orion-LD e um banco de dados MongoDB, onde ele grava dados de contexto à medida que são atualizados no Orion-LD. Isso possibilita a criação de aplicações e relatórios baseados em séries temporais, essencial para sistemas que precisam manter um histórico de eventos para análises posteriores.

### Principais Funcionalidades do Cygnus-LD

- **Coleta de Dados de Contexto:** Recebe notificações de dados de contexto provenientes do Orion-LD.
- **Persistência de Dados:** Armazena dados históricos em repositórios específicos, como MongoDB, para posterior consulta e análise.
- **Processamento de Séries Temporais:** Facilita a construção de relatórios e análises sobre dados de contexto ao longo do tempo.

O Cygnus-LD é configurável para atender a diferentes necessidades de armazenamento e, juntamente com o Orion-LD, é uma peça fundamental para soluções que necessitam de monitoramento contínuo e histórico dos dados em tempo real.


## Como usar:

1. Clone o repositório.
2. Suba os containers com `docker-compose up`.
3. Acesse o Orion-LD na porta **1027** e inicie a gestão de suas entidades contextuais.
