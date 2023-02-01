# NHL Data Pipeline

## Introduction

The NHL Data Pipeline is a project that ingests live NHL game data, stores it in a database, and makes it accessible for further analysis. The project consists of three processes:

- Setup process: This process sets up the required databases and tables.

- Ingest data process: This process continually watches for game status changes and ingests game data when games are live. The game data consists of information about the players, such as player ID, player name, team ID, team name, player age, player number, player position, assists, goals, hits, points, penalty minutes, and opponent team.

- Data retrieval process: This process retrieves data from the database and makes it accessible for further analysis.

## Requirements

- NodeJS and yarn
- Typescript
- PostgreSQL

## Installation

1. Clone the repository:

```bash
git clone https://github.com/[YOUR-USERNAME]/nhl-data-pipeline.git
```

2. Change into the project directory:

```bash
cd nhl-data-pipeline
```

3. Install the dependencies:

```bash
yarn install
```

4. Create a .env file in the project root directory with the following content:

```bash
DB_HOST=[YOUR-DATABASE-HOST]
DB_NAME=[YOUR-DATABASE-NAME]
DB_PORT=[YOUR-DATABASE-PORT]
DB_USER=[YOUR-DATABASE-USERNAME]
DB_PASSWORD=[YOUR-DATABASE-PASSWORD]
# Replace the placeholders with your actual database information
```

5. Run the setup process:

```bash
yarn run setup
```

Alternatively, you can run the setup process with the following command:

```bash
yarn run reset
```

6. Start the ingest data process:

```bash
yarn run dev
```

7. Start the data retrieval process for specific games:

```bash
yarn run watch GAME-ID || yarn run watch GAME-ID DATE
```

```bash

## Usage

The NHL Data Pipeline is designed to run continuously in the background, continually watching for game status changes and ingesting game data when games are live. The ingested game data is stored in a PostgreSQL database, and can be retrieved for further analysis through the data retrieval process.
```
