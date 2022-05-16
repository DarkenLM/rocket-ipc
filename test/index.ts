"use strict";
import helpers_config from "./helpers/config"
import helpers_logger from "./helpers/logger"

import schemas_errors_errors from "./schemas/errors/errors"

const helpers = {
	config: helpers_config,
	logger: helpers_logger
}

const schemas = {
	errors: {
		errors: schemas_errors_errors
	}
}

describe("HELPERS", async function() {
	describe("CONFIG", helpers.config)
	describe("LOGGER", helpers.logger)
})

describe("SCHEMAS", async function() {
	describe("ERRORS", async function() {
		describe("ERRORS", schemas.errors.errors)
	})
})
