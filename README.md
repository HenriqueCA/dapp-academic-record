# AcademicBlock: Uma aplicação descentralizada de visualização de histórico acadêmico

Esse projeto mostra um dApp feito com NextJs, Tailwind CSS, Moralis e hardhat.

A aplicação faz uso do framework Moralis para facilitar a comunicação do navegador com a rede blockchain. Para isso, é necessário criar um dApp no site [Moralis](https://moralis.io/) selecionando uma blockchain local. Após a criação, recupere as informações de `SERVER_URL` e `APP_ID`, colocando em um arquivo `.env` na pasta raiz do projeto, com os seguintes valores:

```
NEXT_PUBLIC_SERVER_URL=xxx
NEXT_PUBLIC_APP_ID=xxx
```

Para iniciar a aplicação, siga os seguintes passos:

1. baixe as dependências com `npm install`.
2. Em um terminal, inicie a rede de blockchain com `npx hardhat node`.
3. Em um segundo terminal, faça o deploy do contrato na rede com `npx hardhat run scripts/deploy.js --network localhost`
4. Após o deploy, inicie o frontend da aplicação com `npm run dev`.



