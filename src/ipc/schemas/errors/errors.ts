/**
 * Copyright (c) 2022
 *
 * Error Factory for Rocket IPC
 * Called by the Configuration at initialization
 *
 * @summary Error Factory for Rocket IPC
 * @author Rafael Fernandes <rafaelfernandes660@gmail.com>
 *
 * Created at     : 2022-03-27 11:30:38
 * Last modified  : 2022-04-12 14:32:30
 */

import { format } from "util" 
import { getFlattenMessageCodes, Locale, ZodLocaleSchema } from "../codes/message-codes";

const eCode = Symbol("code");
const rawMessage = Symbol("raw_message");

/**
 * Custom Error for any error on the Rocket IPC package
 * 
 * `BaseError[@eCode]` returns the error code for the error thrown
 * `BaseError[@rawMessage]` returns the raw message from the message codes, without any formatting applied
 *
 * @export
 * @class BaseError
 * @extends {Error}
 */
export class BaseError extends Error {
	messages: Locale;
	[eCode]: string
	[rawMessage]: string
	constructor(Messages: Locale, message: string) {
		super(message)
		Object.setPrototypeOf(this, BaseError.prototype);
		this.name = "BaseError"
		this.messages = Messages
		this[eCode] = message
		this[rawMessage] = this.getRawMessage(message)

		if (Error.captureStackTrace) Error.captureStackTrace(this, BaseError);
	}

	/**
	 * Parser for Localization Error strings
	 *
	 * @param {string} key The Locale Error Key to format
	 * @memberof Errors
	 * @returns {Error}
	 */
	public parseError(key: string, ...args: (string | number | boolean)[]): Error {
		const errorLocale = this.messages?.messages?.errors
		if (typeof errorLocale == "object" && key in errorLocale) {
			return new Error(format(String(errorLocale[key]), ...(args || [])))
		} else return new Error(key)
	}

	public getRawMessage(key: string): string {
		const errorLocale = this.messages?.messages?.errors
		if (typeof errorLocale == "object" && key in errorLocale) {
			return String(errorLocale[key])
		} else return key
	}
}

/**
 * Custom Error used on the Configuration, that parses error messages and returns them.
 *
 * @class ConfigurationError
 * @extends {BaseError}
 */
class ConfigurationError extends BaseError {
	constructor(Messages: Locale, message: string) {
		super(Messages, message)
		Object.setPrototypeOf(this, ConfigurationError.prototype);
		this.name = "ConfigurationError"
		this.message = this.parseError(message).message
		

		if (Error.captureStackTrace) Error.captureStackTrace(this, ConfigurationError);
	}
}

export type ErrorTypes = {
	ConfigurationError: new (message: string) => ConfigurationError
}


/**
 * Factory Class for Rocket IPC's Custom Errors
 * Holds the message codes and the created errors
 *
 * @class Errors
 */
class Errors {
	messages: Locale;
	errors: ErrorTypes
	constructor(messageCodes?: Locale) {
		//this.messages = getFlattenMessageCodes()

		if (messageCodes && ZodLocaleSchema.safeParse(messageCodes)) {
			this.messages = messageCodes
		} else this.messages = getFlattenMessageCodes()

		this.errors = this.generateErrors()
	}

	/**
	 * Factory function for Rocket IPC's Custom Errors
	 *
	 * @return {ErrorTypes} The Errors created by the factory
	 * @memberof Errors
	 */
	generateErrors(): ErrorTypes {
		const Messages = this.messages

		return {
			ConfigurationError: ConfigurationError.bind(ConfigurationError, Messages)
		}
	}
}

export {
	Errors
}