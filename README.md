# Ruuvipuserrin

This is a rebuild of [unkhz/ruuvitaulu](https://github.com/unkhz/ruuvitaulu), attempting to improve fault tolerance

- separate measurement delegation functionality (gateway) from parsing the data, so that there can be multiple redundant gateway boxes connected to single parser pipeline
- avoid storing measurements in the gateway after they have been succesfully passed on, so that gateway boxes do not run out of space
- avoid unnecessary gaps in data caused by network issues between the gateway boxes and the final storage in cloud

## Implementation

Following shiny tools are used

- [Cloudflare workers](https://workers.cloudflare.com/) for serverless functions and apps
- [Redis Streams](https://redis.io/docs/data-types/streams/) for durable processing of measurements
- [Nx (package based)](https://nx.dev) for monorepo organization and task running
- [Bun](https://bun.sh) TypeScript runtime for faster microservices (where necessary APIs are supported)
- [ruuvitag-listener](https://github.com/lautis/ruuvitag-listener) fast readings from Ruuvitag devices, written in Rust
- [Remix.run](https://remix.run/) for HTML first web application UI
- [TailwindCSS](https://tailwindcss.com/) for lightweight and scalable styles
- [DaisyUI](https://daisyui.com/) for CSS-only components

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

## Architecture

#### System components

| Entity    | Description                   | Phase            | Responsibility                                                                                                |
| --------- | ----------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Source    | IoT device                    | Extract          | sends e.g. bluetooth beacons containing measurements of physical system properties like temperature, humidity |
| Listener  | Rust app / Ruuvi Station      | Extract          | captures measurements, forwards to gateway box                                                                |
| Gatherer  | Typescript app w/ Bun runtime | Staging          | receives data from a different network, stores intermediate snapshots of measurement                          |
| Queue     | Redis streams                 | Staging          | holds measurements, allows quantizing the time dimension of measurements                                      |
| Publisher | Typescript app w/ Bun runtime | Transform / Load | transforms intermediate data into final format, pushes final data forward towards Archive                     |
| Archive   | PostgreSQL database           |                  | holds data in final format, provides to consumers like Grafana                                                |

#### Network topology diagram (example setup)

```mermaid
graph LR
    subgraph LAN
        Listener(Listener/Rust)---SG1(Gatherer)
        Phone1(Listener/Phone)---HG1(Gatherer)
        Phone2(Listener/Phone)---HG1(Gatherer)
        SG1---Redis1(Queue)
        HG1---Redis1(Queue)
        Redis1---Publisher1(Publisher)
        Tag3(Source)---Phone1
        Tag4(Source)---Phone1
        Tag5(Source)---Phone2
        Tag1(Source)---Listener
        Tag2(Source)---Listener
    end
    subgraph Cloud
        Publisher1---Gatherer2(Gatherer)
        Gatherer2---Redis2(Queue)
        Redis2---Publisher2(Publisher)
        Publisher2---Archive
    end
```

#### Communication sequence diagram

```mermaid
sequenceDiagram
    loop Every beacon
        Source->>Listener: push single measurement
        Listener->>Listener: aggregate multiple measurements into snapshot
        Listener->>+Gatherer: push snapshot
        Gatherer->>-Listener: ack
    end
    loop Every 15 seconds
        Gatherer->>Gatherer: quantize time dimension of measurements
        Gatherer->>+Queue: queue quantized measurements
        Queue->>-Gatherer: ack
    end
    loop Every 30 seconds
        Publisher->>+Queue: pull snapshots
        Queue->>-Publisher: send snapshots
        Publisher->>Publisher: transform measurements for final storage
        Publisher->>+Archive: push transformed measurements
        Archive->>-Publisher: ack
        Publisher->>+Queue: trim processed measurements
        Queue->>-Publisher: ack
    end
```
