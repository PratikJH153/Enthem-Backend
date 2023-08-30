# Project Name

**Enthem - Connecting People through Recommendations**

## Table of Contents

- [Description](#description)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Backend](#backend)
- [Frontend](#frontend)
- [DevOps & Hosting](#devops--hosting)

## Description

Enthem is a platform that uses advanced algorithms to provide personalized recommendations to users. The platform is designed to help users connect with people who share similar interests and locations.

## Technologies Used

- **DBMS:** Neo4j, MongoDB, SQL
- **DevOps & Hosting:** Git, Docker, Linode, Uptime Kuma
- **Backend:** Node.js, Typescript, Firebase, Dio, Bloc, Socket
- **Frontend:** Flutter, Dio, Bloc, Firebase
- **Integration:** Node.js, Socket, API Repositories, JWT Token Authorization
- **Realtime:** WebSocket for Many-to-Many Socket Clients Connection
- **UI/UX:** App UI/UX Development, Realtime Connection Visualization with Miro

## Features

- Visualizing data and structuring it into clusters
- Establishing relationships between nodes based on comparisons
- Building recommendation APIs using the Cypher language
- Recommending nearby people using the Haversine formula
- Storing user data, chat data, and room model schema
- User authentication through Google Sign In
- Securing data with encryption and JWT Token Authorization
- Computing data as required for dynamic content
- Connecting Neo4j and MongoDB for efficient data handling

## Installation

1. Clone this repository.
2. Install required dependencies using `npm install`.

## Usage

1. Configure the backend by setting up API repositories, headers authorization, etc.
2. Set up frontend using Flutter, Dio, Bloc, and Firebase for state management.
3. Establish WebSocket connections for real-time interactions.

## Backend

- Utilizes Node.js and Typescript for server-side logic.
- Firebase authentication for secure user sign-in.
- Develops APIs for various calls using Dio and Bloc.
- Establishes a connection between Neo4j and MongoDB for efficient data storage and retrieval.
- Implements dependency injector architecture for maintainability.

## Frontend

- Developed using Flutter for a cross-platform mobile app.
- Dio and Bloc used for API calls and state management.
- Firebase integrated for real-time user authentication and data updates.
- Provides a user-friendly UI/UX for seamless interactions.

## DevOps & Hosting

- Version control managed through Git; CI/CD with GitHub Actions.
- Docker containerization for streamlined deployment.
- Hosted on a Linux server using Linode.
- Monitored server status using Uptime Kuma for reliability.
