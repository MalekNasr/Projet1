# Microservices Project with API Gateway, Kubernetes, and Docker

## Overview

This project is a microservices-based system implemented with **Docker**, **Kubernetes**, and an **API Gateway**. It consists of:
- **HotelService**: A service to manage hotel room data.
- **UserService**: A service to manage user data.
- **API Gateway**: A single entry point to route client requests to the respective microservices.

---

## Features

- Microservices architecture with **HotelService** and **UserService**.
- **API Gateway** to handle routing and client interactions.
- Services containerized using **Docker**.
- Orchestrated and deployed on **Kubernetes**.
- **MongoDB** as the database for both services.
- Continuous Integration (CI) pipeline using **Jenkins**.
- Monitoring and observability using **Prometheus** and **Grafana**.

---

## Project Structure

```plaintext
.
├── Gateway/
│   ├── apiGateway.js       # Gateway logic
│   ├── Dockerfile          # Dockerfile for API Gateway
│   ├── schema/             # GraphQL schema
│   └── resolvers/          # GraphQL resolvers
├── MicroSer/
│   ├── hotelMicroservice.js # HotelService logic
│   ├── hotel.proto         # gRPC proto file for HotelService
│   ├── Dockerfile          # Dockerfile for HotelService
├── MicroServ/
│   ├── userMicroservice.js # UserService logic
│   ├── user.proto          # gRPC proto file for UserService
│   ├── Dockerfile          # Dockerfile for UserService
├── Jenkinsfile             # CI pipeline configuration
├── Kubernetes/
│   ├── hotel-service-deployment.yml
│   ├── user-service-deployment.yml
│   ├── mongo-deployment.yml
│   └── gateway-deployment.yml
└── README.md               # Project documentation
