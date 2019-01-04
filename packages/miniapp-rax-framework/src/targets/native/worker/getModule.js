import { log, error } from '../../../core/debugger';
import { getAppWorker } from './index';
import app from './app';
import { registerPage, createPage } from './page';

const MODULE_GETTER = '__WINDMILL_MODULE_GETTER__';
const getNativeModule = global[MODULE_GETTER];

/**
 * getSchemaData
 * @param {*} successCallback
 * @param {*} errorCallback
 */
function getSchemaData(successCallback = noop, errorCallback = noop) {
  getAppWorker().$call('memoryStorage.getItem', {
    key: 'schemaData'
  }, successCallback, errorCallback);
}

const VALID_MOD_REG = /^@core\//;

/**
 * Get module by name.
 * @param mod {String} Module name.
 */
export default function getModule(mod) {
  log(`requiring mod ${mod}`);
  if (!VALID_MOD_REG.test(mod)) {
    error('Unknown module, only core modules allowed!' + mod);
    return null;
  }
  const context = this;

  switch (mod) {
    case '@core/app':
      return app;

    case '@core/page':
      if (context && context.clientId) {
        return createPage(context.clientId);
      } else {
        return { register: registerPage };
      }

    case '@core/rax':
      return context && context.raxInstance;

    /**
     * For template app to get schema data
     */
    case '@core/getSchemaData':
      return getSchemaData;
  }
}