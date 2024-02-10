# PROJECT INSTALL
```npm
npm install typescript @types/node -D

npx tsc --init
```

Entrar no gitHub da microsoft para pegar a verão atualizada do tsconfig.json
<https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping>

```json
{
  "compilerOptions": {
    "lib": ["ES2023"],
    "module": "node16",
    "target": "ES2022"
  }
}
```

Node por padrão não suporta typescript, primeiro precisamos converter o código para java e depois executar, por isso instalamos a lib tsx como lib de desenvolvimento, ela faz esse processo de forma automatizada. 

```npm
npm install tsx -D
``` 

Criar o script de dev no package.json

> "dev": "tsx watch src/http/server.ts"

Para esse projeto iremos usar o fastify ao invés de express como de costume
```npm
npm i fastify
```


# BANCO DE DADOS + DOCKER
Iremos usar o postgress, por ser openSource. 

Iremos usar o docker, uma estrategia que usamos nas aplicações principalmente backend para criarmos ambiente de desenvolvimento isolados para cada aplicação. 
Assim cada aplicação irá possuir sua própria instância. Quando uma outra aplicação precisar do Postgress ela terá sua própria instância.
Iremos criar o `docker-compose.yml`, este arquivo é basicamente um arquivo de receita, dentro dele irá conter exatamente quais serviços a nossa aplicação precisa, se precisamos de Postgress, Redis, Mysql irá estar escrito dentro do arquivo. 
IMAGE = algo criado por outra pessoa ou empresa que tenha os comandos exatos para intalar o postgress em um sistema linux zerado, nada mais é que uma receita pra configurar o postgress em um ambiente zerado.
PORTS = redirecionamento de porta, como o banco postgress estará rodando dentro de um container, é como se ele estivesse rodando em um sistema operacional diferente eu preciso falar a porta
ENVIROMENT = variáveis de ambiente
VOLUMES = sistema de storage, quando eu subir o meu container os dados irão ficar persistidos mesmo que eu desligue meu pc. Irá criar uma pasta escondida dentro do docker para salvor os dados.

Após todas as configs feitas iremos rodar o:
```docker
docker compose up -d
```
-d irá rodar no modo detach, assim não preciso manter o terminal aberto ela irá ficar rodando até que eu peça para para de rodar

Para listar todos os containers rodando
```docker
docker ps
docker logs idContainer
```


## ORM/PRISMA.IO <https://www.prisma.io/>

ORM traz uma interface para navegar no banco de dados, cruds com muito mais simplicidade uma linguagem mais simples. Ajuda também a controlar a parte de migrations, elas são basicamente uma linha do tempo, um controle, versionamento do nossso DB, cada vez que adicionamos um campo, alteramos um campo, cria uma tabela etc... teremos uma pasta dentro do prisma/migrations/15132165_create_poll

Instalar o prisma como uma dependência de desenvolvimento
```npm
npm install -D prisma
```

Após instalar o prisma iremos executar o comando
```npx
npx prisma init
```
só de executar iremos criar um arquivo `.env`, nesse arquivo iremos pegar as informações do `docker-compose.yml` de enviroments e passar na url do `.env`.
>DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

Após criar a tabela ou update no schema.prisma, executar o comando:
```npx
npx prisma migrate dev
```
Assim ele me pergunta o nome do que "fiz até agora", ai por exemplo, o meu primeiro migrate foi o q fiz (seria como um commit? talvez) create polls. Assim ele me gera o sql necessário para criar a tabela no DB. 

Podemos usar para interface/navegação do banco o:
```npx
npx prisma studio
```


### BIBLIOTECA DE VALIDAÇÃO

A primeira que iremos utilizar será uma biblioteca de validação(seria uma espécie de middleware?). Ela se chama zod <https://www.npmjs.com/package/zod>
```npm
npm install zod
```

### BIBLIOTECA DE COOKIE

Nos ajuda a trabalhar e manipular os cookies dentro da aplicação
```npm
npm i @fastify/cookie
```

### BIBLIOTE REDIS

biblioteca feita para manipulação do redis dentro do node que usa a sintaxe do ecma6 <https://redis.io/commands/zrank/>
```
npm i ioredis
```

### BIBLIOTECA WEBSOCKET FASTIFY

<https://github.com/fastify/fastify-websocket>
```
npm i @fastify/websocket
```