import { chai } from "../../common";
import { ErrorFactory, BaseError, getErrorMessage } from "../../../dist/ipc/schemas/errors/errors";
import { getFlattenMessageCodes, Locale } from "../../../dist/ipc/schemas/codes/message-codes";
const { expect } = chai

const messageCodes = getFlattenMessageCodes()
function getRawErrorMessage(messageCodes: Locale, key: string) {
	const errorLocale = messageCodes?.messages?.errors

	if (typeof errorLocale == "object" && key in errorLocale) {
		return String(errorLocale[key])
	} else return key
}

export default function test() {
	describe("ErrorFactory", () => {
		it("should create an instance using its constructor with no arguments", () => {
			const errorFactory = new ErrorFactory()
			
			expect(errorFactory).to.exist
		})

		it("should create an instance using its constructor with arguments", () => {
			const errorFactory = new ErrorFactory(messageCodes)
			
			expect(errorFactory).to.exist
		})

		it("should create error instances when the generator method is called", () => {
			const errorFactory = new ErrorFactory()
			const errors = errorFactory.generateErrors()

			expect(errors).to.exist
		})
	})

	describe("BaseError", () => {
		it("should create an instance using its constructor", () => {
			const baseError = new BaseError(messageCodes, "sample.error.code")

			expect(baseError).to.exist
		})

		it("should parse valid message codes and return the error code if it is not valid", () => {
			const sampleBaseError = new BaseError(messageCodes, "sample.error.code")
			const validBaseError = new BaseError(messageCodes, "invalid.config.socket.id")

			expect(sampleBaseError).to.have.property("message", "sample.error.code")
			expect(validBaseError).to.have.property("message", getRawErrorMessage(messageCodes, "invalid.config.socket.id"))
		})
	})

	describe("ConfigurationError", () => {
		it("should create an instance using its constructor", () => {
			const errorFactory = new ErrorFactory()
			const errors = errorFactory.generateErrors()
			const { ConfigurationError } = errors
			const configurationError = new ConfigurationError("sample.error.code")

			expect(configurationError).to.exist
		})

		it("should parse valid message codes and return the error code if it is not valid", () => {
			const errorFactory = new ErrorFactory()
			const errors = errorFactory.generateErrors()
			const { ConfigurationError } = errors
			const sampleConfigurationError = new ConfigurationError("sample.error.code")
			const validConfigurationError = new ConfigurationError("invalid.config.socket.id")

			expect(sampleConfigurationError).to.have.property("message", "sample.error.code")
			expect(validConfigurationError).to.have.property("message", getRawErrorMessage(messageCodes, "invalid.config.socket.id"))
		})
	})

	describe("getErrorMessage", () => {
		it("should extract the message out of an Error", () => {
			const newError = new Error("sample.error.code")
			const newBaseError = new BaseError(messageCodes, "sample.error.code")
			const newConfigurationError = new BaseError(messageCodes, "sample.error.code")

			expect(getErrorMessage(newError), "Error Message should exist and be a string").to.exist.and.to.be.a("string")
			expect(getErrorMessage(newBaseError), "Error Message should exist and be a string").to.exist.and.to.be.a("string")
			expect(getErrorMessage(newConfigurationError), "Error Message should exist and be a string").to.exist.and.to.be.a("string")
		})

		it("should extract the message out of a thrown primitive", () => {
			try {
				throw "Test message"
			} catch(e) {
				expect(getErrorMessage(e), "Error Message should exist and be a string").to.exist.and.to.be.a("string")
			}

			try {
				throw 123
			} catch(e) {
				expect(getErrorMessage(e), "Error Message should exist and be a string").to.exist.and.to.be.a("string")
			}

			try {
				throw { foo: "bar" }
			} catch(e) {
				expect(getErrorMessage(e), "Error Message should exist and be a string").to.exist.and.to.be.a("string")
			}

			try {
				throw true
			} catch(e) {
				expect(getErrorMessage(e), "Error Message should exist and be a string").to.exist.and.to.be.a("string")
			}

			try {
				throw undefined
			} catch(e) {
				expect(getErrorMessage(e), "Error Message should exist and be a string").to.exist.and.to.be.a("string")
			}

			try {
				throw null
			} catch(e) {
				expect(getErrorMessage(e), "Error Message should exist and be a string").to.exist.and.to.be.a("string")
			}
		})
	})
}