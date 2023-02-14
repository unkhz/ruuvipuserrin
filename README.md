# Ruuvipuserrin

This is a rebuild of [unkhz/ruuvitaulu](https://github.com/unkhz/ruuvitaulu), attempting to improve fault tolerance

- separate measurement delegation functionality (gateway) from parsing the data, so that there can be multiple redundant gateway boxes connected to single parser pipeline
- avoid storing measurements in the gateway after they have been succesfully passed on, so that gateway boxes do not run out of space
- avoid unnecessary gaps in data caused by network issues between the gateway boxes and the final storage in cloud

### Implementation

Following shiny tools are used

- [temporal.io](https://temporal.io) for durable execution of measurement collection
- [tRPC](https://trpc.io) for type-safe communication between gateway box microservices
- [Nx (package based)](https://nx.dev) for monorepo organization and task running
- [Bun](https://bun.sh) TypeScript runtime for faster microservices (where necessary APIs are supported)
- [ruuvitag-listener](https://github.com/lautis/ruuvitag-listener) fast readings from Ruuvitag devices, written in Rust

### Install

Ensure you have installed following tools in your gateway box (e.g. raspberry pi).

- [Rust](https://rustup.rs/)
- [Node](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/engine/install/)

Install monorepo dependencies

```
npm install
```

Run package specific setup scripts

```
npm run setup
```

### Running

```
npm run start-all
```
