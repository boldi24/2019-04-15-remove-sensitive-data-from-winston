const winston = require('winston');
const isObject = require('is-plain-object');
const isEmpty = require('is-empty');

const { createLogger, format, transports } = winston;

const { combine, printf } = format;

const excludedKeys = ['password', 'Authorization'];
const deepRegexReplace = (value, keys) => {
  if (typeof value === 'undefined' || typeof keys === 'undefined') return {};

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i = i + 1) {
      value[i] = deepRegexReplace(value[i], keys);
    }
    return value;
  }

  if (!isObject(value)) {
    return value;
  }

  if (typeof keys === 'string') {
    keys = [keys];
  }

  if (!Array.isArray(keys)) {
    return value;
  }

  for (let j = 0; j < keys.length; j++) {
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        if (new RegExp(keys[j],'i').test(key)) value[key] = '[REDACTED]';
      }
    }
  }

  for (let key in value) {
    if (value.hasOwnProperty(key)) {
      value[key] = deepRegexReplace(value[key], keys);
    }
  }

  return value;
};

const logger = createLogger({
  transports: [
    new transports.Console()
  ],
  format: combine(printf(({ level, message, ...rest }) => {
    const log = { message };
    if (!isEmpty(rest)) log.data = rest;
    return `[${level}]: ${JSON.stringify(deepRegexReplace(log, excludedKeys))}`;
  }))
});

module.exports = logger;