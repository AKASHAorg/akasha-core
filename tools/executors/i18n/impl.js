"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const outputRoot = path_1.default.resolve('locales');
const executorRoot = path_1.default.resolve('tools', 'executors');
const getParserConfig = (ns, pkgRootPath) => ({
    useKeysAsDefaultValue: true,
    locales: ['en'],
    verbose: true,
    keySeparator: false,
    nsSeparator: null,
    defaultNamespace: ns,
    output: `${outputRoot}/$LOCALE/$NAMESPACE.json`,
    input: [`${pkgRootPath}/src/**/*.{ts,tsx}`],
});
async function i18nExecutor(options, context) {
    const currentProject = context.projectName;
    const namespace = currentProject.split('/')[1];
    const projectRoot = path_1.default.resolve(options.cwd);
    const config = getParserConfig(namespace, projectRoot);
    const configPath = `${executorRoot}/dist/i18next-parser.${namespace}.config.js`;
    fs_1.default.mkdirSync(`${executorRoot}/dist`, { recursive: true });
    fs_1.default.writeFileSync(configPath, `module.exports=${JSON.stringify(config)}`, 'utf-8');
    const { stdout, stderr } = await (0, util_1.promisify)(child_process_1.exec)(`i18next --config ${configPath}`);
    if (stderr) {
        console.error(stderr);
    }
    console.log(stdout);
    return { success: true };
}
exports.default = i18nExecutor;
//# sourceMappingURL=impl.js.map