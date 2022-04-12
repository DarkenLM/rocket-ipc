import { chai } from "../../common";
import { Errors, BaseError } from "../../../dist/ipc/schemas/errors/errors";
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
	describe("Errors", () => {
		it("should create an instance using its constructor with no arguments", () => {
			const ErrorFactory = new Errors()
			
			expect(ErrorFactory).to.exist
		})

		it("should create an instance using its constructor with arguments", () => {
			const ErrorFactory = new Errors(messageCodes)
			
			expect(ErrorFactory).to.exist
		})

		it("should create error instances when the generator method is called", () => {
			const ErrorFactory = new Errors()
			const errors = ErrorFactory.generateErrors()

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
			const validBaseError = new BaseError(messageCodes, "invalid.socket.id")

			expect(sampleBaseError).to.have.property("message", "sample.error.code")
			expect(validBaseError).to.have.property("message", getRawErrorMessage(messageCodes, "invalid.socket.id"))
		})
	})

	describe("ConfigurationError", () => {
		it("should create an instance using its constructor", () => {
			const ErrorFactory = new Errors()
			const errors = ErrorFactory.generateErrors()
			const { ConfigurationError } = errors
			const configurationError = new ConfigurationError("sample.error.code")

			expect(configurationError).to.exist
		})

		it("should parse valid message codes and return the error code if it is not valid", () => {
			const ErrorFactory = new Errors()
			const errors = ErrorFactory.generateErrors()
			const { ConfigurationError } = errors
			const sampleConfigurationError = new ConfigurationError("sample.error.code")
			const validConfigurationError = new ConfigurationError("invalid.socket.id")

			expect(sampleConfigurationError).to.have.property("message", "sample.error.code")
			expect(validConfigurationError).to.have.property("message", getRawErrorMessage(messageCodes, "invalid.socket.id"))
		})
	})
}