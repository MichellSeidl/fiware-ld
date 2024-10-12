# FIWARE-LD: Plataforma de Gestão de Dados Contextuais com NGSI-LD
Este repositório contém uma implementação do FIWARE Orion-LD, utilizando a especificação NGSI-LD para gestão de dados contextuais em tempo real. Ele permite a orquestração de serviços essenciais com Docker e docker-compose, integrando o Orion-LD com o MongoDB para armazenamento de dados históricos.

Recursos incluídos:
Orion-LD: Broker de Contexto compatível com NGSI-LD, permitindo a gestão e a consulta de entidades baseadas em contexto.
MongoDB (v3.6): Base de dados para armazenamento de dados contextuais e persistência histórica.
Configuração de docker-compose para facilitar a orquestração e o gerenciamento dos containers.
Exposição do broker Orion-LD na porta 1027, com MongoDB configurado para armazenamento persistente.
Este repositório é ideal para quem deseja explorar a criação e o gerenciamento de dados contextuais no formato NGSI-LD e integrar com sistemas IoT ou aplicações baseadas em FIWARE.

Como usar:
Clone o repositório.
Suba os containers com docker-compose up.
Acesse o Orion-LD na porta 1027 e inicie a gestão de suas entidades contextuais.
