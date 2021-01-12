# vignette-api

## Running locally

On a first-time run, node modules need to be installed using the command `yarn install`, or just `yarn`.
Following this, the server can be started using `yarn start`.
The server will then be hosted at `localhost:9000`. Visit [localhost:9000/submissions](http://localhost:9000/submissions) to view the index of submissions

Environment variables are declared in `package.json`.

## Testing

Once again, environment variables are configured using the `package.json`.
Use `yarn test` to run mocha tests under the `tests/` directory.

## CI

Travis CI is used to build the app and run tests when changes are made to the codebase.
Configuration for this can be found at `.travis.yml`

## Hosting

The application is hosted on Heroku.
The staging server can be found at: [https://vignette-api-staging.herokuapp.com/](https://vignette-api-staging.herokuapp.com/)
The production serve can be found at: [https://vignette-api.herokuapp.com/](https://vignette-api.herokuapp.com/)

## Project structure

`server.js` starts the server and defines URL endpoints for various actions. These actions are defined at `routes.js`.
Database interactions (ie CRUD of database records) are managed from the `db/` directory
The `models/` directory defines the schema for datatypes used in the app
`tests/` stores tests for the application
