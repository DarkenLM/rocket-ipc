"use strict";
import helpers_config from "./helpers/config"
import schemas_errors_errors from "./schemas/errors/errors"

const helpers = {
	config: helpers_config
}

const schemas = {
	errors: {
		errors: schemas_errors_errors
	}
}

describe("HELPERS", async function() {
	describe("CONFIG", helpers.config)
})

describe("SCHEMAS", async function() {
	describe("ERRORS", async function() {
		describe("ERRORS", schemas.errors.errors)
	})
})
