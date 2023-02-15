# Ruuvipuserrin

This is a rebuild of [unkhz/ruuvitaulu](https://github.com/unkhz/ruuvitaulu), attempting to improve fault tolerance

- separate measurement delegation functionality (gateway) from parsing the data, so that there can be multiple redundant gateway boxes connected to single parser pipeline
- avoid storing measurements in the gateway after they have been succesfully passed on, so that gateway boxes do not run out of space
- avoid unnecessary gaps in data caused by network issues between the gateway boxes and the final storage in cloud

### Architecture 

```mermaid
sequenceDiagram
    loop Every beacon
        Ruuvitags->>Listener: Listener (Rust) receives bluetooth beacon measurement
        Listener->>Queuer: Queuer (Bun) receives measurement from Listener
    end
    loop Every 15 seconds
        Queuer->>Redis: Queuer (Bun) pushes periodical snapshot of measurements to Redis
    end
    loop Every 30 seconds
        Redis->>Publisher: Publisher (Node) pulls unprocessed snapshots from Redis
        Publisher->>Cloud: Publisher (Node) pushes snapshots to cloud databases (InfluxDb, TimescaleDb)
        Cloud->>Publisher: Cloud databases acknowledge succesful storage of measurements
        Publisher->>Redis: Publisher (Node) trims processed measurements from Redis stream
    end
```

### Implementation

Following shiny tools are used

- [Redis Streams](https://redis.io/docs/data-types/streams/) for durable processing of measurements
- [Nx (package based)](https://nx.dev) for monorepo organization and task running
- [Bun](https://bun.sh) TypeScript runtime for faster microservices (where necessary APIs are supported)
- [ruuvitag-listener](https://github.com/lautis/ruuvitag-listener) fast readings from Ruuvitag devices, written in Rust

### Install

Ensure you have installed following tools in your gateway box (e.g. raspberry pi).

- [Rust](https://rustup.rs/)
- [Node](https://nodejs.org/en/download/)
- [Redis](https://redis.io/docs/getting-started/installation/install-redis-on-linux/)

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
