#af-testing

> This package contains the end-to-end tests written for AKASHA World, as well as a common utility package used for unit testing across the monorepo.

### ethereum-world
[Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress) end-to-end tests are contained in the ethereum-world directory. Scripts than run it for each environment are contained in the ```package.json```, if you want to run them locally, run ```yarn ethereum-world-local```.

### unit test utils
Contained in the src directory, largely used to provide mock data as-is, generate new data, as well as mocked providers for various libs and features.
