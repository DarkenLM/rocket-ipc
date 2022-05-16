/**
 * Copyright (c) 2022
 *
 * Common Logger for the IPC Services.  
 * Can be used both for Clients and Servers.  
 *
 * @summary Common Logger for the IPC Services
 * @author Rafael Fernandes <rafaelfernandes660@gmail.com>
 * @module
 * 
 */

import { inspect } from "util"
import { z } from "zod"
import { Errors } from "../schemas/errors/errors"
import { schema as ConfigSchema, schema_partial_all as ConfigPartialPropertiesSchema } from "../schemas/zod/config"
import { Configuration } from "./config"
const { ConfigurationError } = Errors

export type LoggerConfig = z.infer<typeof ConfigSchema.logger>
export type LoggerConfigPartial = z.infer<typeof ConfigPartialPropertiesSchema.shape.logger>

type IsLoggerEnabled = LoggerConfig["enabled"]
type loggerShouldUseColors = LoggerConfig["colors"]
type loggerDepth = LoggerConfig["depth"]
type loggerFunctionOverride = LoggerConfig["logger"]

/**
 * Common Logger for the IPC Services.  
 * Can be used both for Clients and Servers.  
 *
 * @export
 * @class BaseLogger
 * 
 */
class BaseLogger {
	//#config: LoggerConfig

	/**
	 * @property {boolean} enabled - Whenever the Logger is enabled [DEFAULT: true]
	 * @property {boolean} colors - Whenever the Logger should display colors [DEFAULT: true]
	 * @property {number} depth - The depth the Logger should expand objects [DEFAULT: 5]
	 * @property {((...args: unknown[]) => void) | null} logger - A custom logger function that will override the built-in logger [DEFAULT: null]
	 */
	#enabled: IsLoggerEnabled
	#colors: loggerShouldUseColors
	#depth: loggerDepth
	#logger: loggerFunctionOverride

	//config: z.infer<typeof ConfigSchema.logger>
	constructor(config?: Configuration | LoggerConfigPartial) {
		this.#enabled = true	// Whenever the Logger is enabled [DEFAULT: true]
		this.#colors = true 	// Whenever the Logger should display colors [DEFAULT: true]
		this.#depth = 5 		// The depth the Logger should expand objects [DEFAULT: 5]
		this.#logger = null 	// A custom logger function that will override the built-in logger [DEFAULT: null]

		if (config) {
			if (config instanceof Configuration) {
				this.#enabled = config.logger.enabled
				this.#colors = config.logger.colors
				this.#depth = config.logger.depth
				this.#logger = config.logger.logger
			} else if (typeof(config) === "object") {
				const isConfigValid = ConfigPartialPropertiesSchema.shape.logger.safeParse(config)

				console.log("CONFIG", config)
				console.log("ISVALID", isConfigValid)

				if (isConfigValid.success) {
					if ("enabled" in config && config.enabled !== undefined) this.#enabled = config.enabled
					if ("colors" in config && config.colors !== undefined) this.#colors = config.colors
					if ("depth" in config && config.depth !== undefined) this.#depth = config.depth
					if ("logger" in config && config.logger !== undefined) this.#logger = config.logger
				} else throw new ConfigurationError("invalid.config.initializing.argument.type")
			} else throw new ConfigurationError("invalid.config.initializing.argument.type")
		}
		
	}

	get enabled() {
		return this.#enabled
	}
	set enabled(value) {
		this.setEnabled(value)
	}

	get colors() {
		return this.#colors
	}
	set colors(value) {
		this.setUseColors(value)
	}

	get depth() {
		return this.#depth
	}
	set depth(value) {
		this.setDepth(value)
	}

	get logger() {
		return this.#logger
	}
	set logger(value) {
		this.setLoggerFunction(value)
	}

	/**
	 * Setter for the Logger's Enabled State
	 * 
	 * Logger's Enabled State: Whenever the Logger is enabled [DEFAULT: true]
	 *
	 * @param {IsLoggerEnabled} value
	 * @return {BaseLogger} The Logger instance, to allow method chaining
	 * @memberof BaseLogger
	 */
	setEnabled(value: IsLoggerEnabled): BaseLogger {
		const isValid = ConfigSchema.logger.shape.enabled.safeParse(value)

		if (isValid.success) {
			this.#enabled = value
			return this
		} else {
			throw new ConfigurationError("invalid.config.logger.enabled.type")
		}
	}

	/**
	 * Setter for the Logger's Color State
	 * 
	 * Logger Color State: Whenever the Logger should display colors [DEFAULT: true]
	 *
	 * @param {loggerShouldUseColors} value
	 * @return {BaseLogger} The Logger instance, to allow method chaining
	 * @memberof BaseLogger
	 */
	setUseColors(value: loggerShouldUseColors): BaseLogger {
		const isValid = ConfigSchema.logger.shape.colors.safeParse(value)

		if (isValid.success) {
			this.#colors = value
			return this
		} else {
			throw new ConfigurationError("invalid.config.logger.colors.type")
		}
	}

	/**
	 * Setter for the Logger's Depth
	 * 
	 * Logger Depth: The depth the Logger should expand objects [DEFAULT: 5]
	 *
	 * @param {loggerDepth} value
	 * @return {BaseLogger} The Logger instance, to allow method chaining
	 * @memberof BaseLogger
	 */
	setDepth(value: loggerDepth): BaseLogger {
		const isValid = ConfigSchema.logger.shape.depth.safeParse(value)

		if (isValid.success) {
			this.#depth = value
			return this
		} else {
			throw new ConfigurationError("invalid.config.logger.depth.type")
		}
	}

	/**
	 * Setter for the Logger's Function
	 * 
	 * Logger Function: A custom logger function that will override the built-in logger [DEFAULT: null]
	 *
	 * @param {loggerFunctionOverride} value
	 * @return {BaseLogger} The Logger instance, to allow method chaining
	 * @memberof BaseLogger
	 */
	setLoggerFunction(value: loggerFunctionOverride): BaseLogger {
		const isValid = ConfigSchema.logger.shape.logger.safeParse(value)

		if (isValid.success) {
			this.#logger = value
			return this
		} else {
			throw new ConfigurationError("invalid.config.logger.logger.type")
		}
	}

	log(...args: unknown[]) {
		if (!this.#enabled) return;
		if (typeof(this.#logger) === "function") {
			this.#logger(...args)
		} else {
			for (const i in args) {
				if (typeof args[i] !== "object"){
					continue;
				}
		
				args[i] = inspect(
					args[i],
					{
						depth: this.#depth,
						colors: this.#colors
					}
				);
			}

			console.log.bind(console).apply(this, args)
		}
	}
}

export {
	BaseLogger
}