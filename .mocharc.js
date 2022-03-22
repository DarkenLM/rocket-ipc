"use strict"

module.exports = {  
  exit: true,
  bail: true,
  slow: 1000,
  recursive: true,
  extension: ['ts'],
  require: ["ts-node/register", "source-map-support/register"]
}