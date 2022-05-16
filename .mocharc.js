"use strict"

module.exports = {  
  exit: true,
  bail: true,
  slow: 1000,
  recursive: true,
  colors: true,
  extension: ['ts'],
  require: ["ts-node/register", "source-map-support/register"],
  reporter: 'spec'
}