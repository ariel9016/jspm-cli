/*
 *   Copyright 2014-2017 Guy Bedford (http://guybedford.com)
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
export const version = require('../package.json').version;
import { JSPM_CONFIG_DIR } from './utils/common';
import { log, LogType, logErr } from './utils/ui';

export * from './project';
export { serve, ServerOptions } from './serve';
import { serverRunning } from './serve';

import { build as buildFunc } from './build';
import { execNode as execFunc, jspx as jspxFunc } from './exec';
import path = require('path');

if (process.env.globalJspm !== undefined) {
  process.once('unhandledRejection', err => {
    log('Internal Error: Unhandled promise rejection.', LogType.err);
    logErr(err.stack || err);
    process.exit(1);
  });
  process.once('SIGINT', () => {
    if (serverRunning)
      log('jspm server terminated.');
    else
      log('jspm process terminated.');
    process.exit(1);
  });
  process.once('SIGTERM', () => {
    if (serverRunning)
      log('jspm server terminated.');
    else
      log('jspm process terminated.');
    process.exit(1);
  });
}
else {
  process.on('unhandledRejection', err => {
    console.error('Internal Error: Unhandled promise rejection.');
    throw err;
  });
}

export async function resolve (name: string, parent?: string, env?: any, relativeFallback?: boolean) {
  const jspmResolve = require('jspm-resolve');
  return jspmResolve(name, parent, { env, relativeFallback });
}

export function resolveSync (name: string, parent?: string, env?: any, relativeFallback?: boolean) {
  const jspmResolve = require('jspm-resolve');
  return jspmResolve.sync(name, parent, { env, relativeFallback });
}

export const JSPM_GLOBAL_PATH = path.resolve(JSPM_CONFIG_DIR, 'global');

export const jspx: typeof jspxFunc = function () {
  return require('./exec').jspx.apply(this, arguments);
}

export const build: typeof buildFunc = function () {
  return require('./build').build.apply(this, arguments);
}

export const execNode: typeof execFunc = function () {
  return require('./exec').execNode.apply(this, arguments);
}

