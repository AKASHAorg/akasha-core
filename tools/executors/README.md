# NX Executors

This package contains all custom executors built for the NX monorepo build system used by AKASHA.

## General

Executors perform build actions on code. This can be building, linting, testing, serving etc.
Two major benefits of using executors instead of package manager scripts:

- Executors encourage a consistent methodology for performing similar actions on unrelated projects
- Nx can leverage this consistency to perform the same executor across multiple projects. i.e. nx affected --target=test will run the test executor on every project that is affected by the current code change.

The executors are compiled during the bootstrap process, as subsequent build processes may depend on them being already compiled.

## Available Executors

### [i18n](./i18n/impl.ts)

> Handles translation extraction, removes the need for individual i18next parser configs and npm scripts, while also allowing for nx computational caching.

It generates a transient i18n-parser config for each project and then runs the i18next command to parse and extract translations from specified projects. It will throw an error if any incorrect strings (ie. template strings) are passed to the parser.

## How to create new executors

Add a new folder under tools/executors, named after the executor you want to create.
Each executor consists of (at least) 4 files:

- executor.json
  > JSON file with a list of all executors under this namespace/folder (one namespace can have multiple executors implemented), with references to their implementation and a description of what they are supposed to do.
- impl.ts
  > The actual implementation for an executor. This file is compiled to javascript in the same folder, as this is the behaviour NX expects. Executors are async functions, which must return an object {success: true|false}'. If a namespace needs more than one executor, add it with a new name, and also specify it in the project tsconfig.json for correct compilation.
- package.json
  > Simple JSON file pointing to the location of executor.json
- schema.json
  > JSON file specifying the schema of the executor, which describes the options being passed to the executor.

For more info on creating executors, you can visit https://nx.dev/executors/creating-custom-builders
