# vignette-api

## Running locally

Environment variables are specified in the `package.json`, so running this locally is as simple as running `yarn start`.
The server will then be hosted at `localhost:9000`. Use `http://localhost:9000/submissions` to view the index of submissions

## Testing

Once again, environment variables are configured using the `package.json`. `yarn test` will run mocha tests under the `tests/` directory.

## CI

Travis CI is used to build the app and run tests when changes are made to the codebase. Configuration for this can be found at `.travis.yml`

## Project structure

`server.js` starts the server and defines URL endpoints for various actions. These actions are defined at `routes.js`.
Database interactions (ie CRUD of database records) are managed from the `db/` directory
The `models/` directory defines the schema for datatypes used in the app
`tests/` stores tests for the application
