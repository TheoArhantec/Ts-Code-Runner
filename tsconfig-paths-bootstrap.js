/* eslint-disable @typescript-eslint/typedef */
const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const { baseUrl, paths } = tsConfig.compilerOptions;

tsConfigPaths.register({ baseUrl, paths });
