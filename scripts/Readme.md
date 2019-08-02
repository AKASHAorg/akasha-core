# Utility scripts for development


## Plugins

@todo add documentation about plugin generator

1. `cd ./ui-plugins` (right now the template expects you to generate a plugin in the same folder with `awf-plugin-loader`)

2. Run `npx create-react-library --template-path ../scripts/plugin-templates/awf-plugin-ts --skip-prompts awf-plugin-sample`

3. `cd awf-plugin-sample` then `npm start`

4. In a new terminal:

    `cd awf-plugin-sample/example` then `npm start`

5. navigate to `localhost:3000/awf-plugin-sample`

> NOTE: Any changes to `/example` folder should first be discussed to be included in the template! Modify it at your own risk!
