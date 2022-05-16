//import { inspect } from "util";
import { Configuration } from "../../dist/ipc/helpers/config";
import { BaseLogger } from "../../dist/ipc/helpers/logger"
import { getFlattenMessageCodes, Locale } from "../../dist/ipc/schemas/codes/message-codes";
import { chai, sinon } from "../common"

const { expect } = chai

const messageCodes = getFlattenMessageCodes()
function getRawErrorMessage(messageCodes: Locale, key: string) {
	const errorLocale = messageCodes?.messages?.errors

	if (typeof errorLocale == "object" && key in errorLocale) {
		return String(errorLocale[key])
	} else return key
}

export default function test() {
	it("should create an instance using its constructor", () => {
		const logger: BaseLogger = new BaseLogger();
	
		expect(logger, "Logger should exist").to.exist;
	});

	it("should have the correct default types when initialized with no arguments", () => {
		const logger: BaseLogger = new BaseLogger();

		expect(logger.enabled, "Logger Property 'enabled' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(logger.colors, "Logger Property 'colors' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(logger.depth, "Logger Property 'depth' should exist and be a number").to.exist.and.to.be.a("number");
		expect(logger.logger, "Logger Property 'enabled' should exist and be either a function or null").to.satisfy(function(arg: unknown) {
			if (typeof(arg) === "function" || arg === null) return true;
			return false;
		});
	});

	it("should throw a Configuration Error with a parsed message when passing an invalid value to the constructor", () => {
		//@ts-expect-error Testing purposes
		expect(() => { new BaseLogger(Symbol("DEBUG")) }, "Logger should throw a Configuration Error").to.throw();
		
		//@ts-expect-error Testing purposes
		expect(() => { new BaseLogger({ foo: "bar" }) }, "Logger should throw a Configuration Error").to.throw();
	})


	it("should create an instance with pre-set values when passing an Configuration Instance to the constructor", () => {
		const config: Configuration = new Configuration({ 
			logger: { enabled: false, colors: false }
		});

		const logger: BaseLogger = new BaseLogger(config);

		expect(logger, "Logger should exist").to.exist;
		expect(logger.enabled, "Logger Property 'enabled' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(logger.colors, "Logger Property 'colors' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(logger.depth, "Logger Property 'depth' should exist and be a number").to.exist.and.to.be.a("number");
		expect(logger.logger, "Logger Property 'enabled' should exist and be either a function or null").to.satisfy(function(arg: unknown) {
			if (typeof(arg) === "function" || arg === null) return true;
			return false;
		});
	})

	it("should create an instance with pre-set values when passing an object with configuration properties to the constructor", () => {
		const logger: BaseLogger = new BaseLogger({ enabled: false, colors: false, depth: 10, logger: null });

		expect(logger, "Logger should exist").to.exist;
		expect(logger.enabled, "Logger Property 'enabled' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(logger.colors, "Logger Property 'colors' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(logger.depth, "Logger Property 'depth' should exist and be a number").to.exist.and.to.be.a("number");
		expect(logger.logger, "Logger Property 'enabled' should exist and be either a function or null").to.satisfy(function(arg: unknown) {
			if (typeof(arg) === "function" || arg === null) return true;
			return false;
		});
	})

	it("should throw a Configuration Error with a parsed message if an invalid value is attempted to be set on the Logger Configuration using isolated setter methods", () => {
		const logger: BaseLogger = new BaseLogger();
		
		//@ts-expect-error Testing purposes
		expect(() => logger.setEnabled(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.enabled.type"))

		//@ts-expect-error Testing purposes
		expect(() => logger.setUseColors(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.colors.type"))

		//@ts-expect-error Testing purposes
		expect(() => logger.setDepth(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.depth.type"))

		//@ts-expect-error Testing purposes
		expect(() => logger.setLoggerFunction(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.logger.type"))
	})

	it("should throw a Configuration Error with a parsed message if an invalid value is attempted to be set on the Logger Configuration using chained setter methods", () => {
		const logger: BaseLogger = new BaseLogger();

		expect(() => 
			logger
				.setEnabled(true)

				//@ts-expect-error Testing purposes
				.setUseColors(Symbol("DEBUG"))
				//@ts-expect-error Testing purposes
				.setDepth(Symbol("DEBUG"))
				//@ts-expect-error Testing purposes
				.setLoggerFunction(Symbol("DEBUG"))
		).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.colors.type"))

		expect(() => 
			logger
				.setEnabled(true)
				.setUseColors(true)
				//@ts-expect-error Testing purposes
				.setDepth(Symbol("DEBUG"))
				//@ts-expect-error Testing purposes
				.setLoggerFunction(Symbol("DEBUG"))
		).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.depth.type"))

		expect(() => 
			logger
				.setEnabled(true)
				.setUseColors(true)
				.setDepth(5)
				//@ts-expect-error Testing purposes
				.setLoggerFunction(Symbol("DEBUG"))
		).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.logger.type"))

		expect(() => 
			logger
				.setEnabled(true)
				.setUseColors(true)
				.setDepth(5)
				.setLoggerFunction(null)
				.setLoggerFunction((...args) => { args; return; })
		).to.not.throw()
	})

	it("should throw a Configuration Error with a parsed message if an invalid value is attempted to be set on the Logger Configuration using assignment operators", () => {
		const logger: BaseLogger = new BaseLogger();

		//@ts-expect-error Testing purposes
		expect(() => { logger.enabled = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.enabled.type"))

		//@ts-expect-error Testing purposes
		expect(() => { logger.colors = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.colors.type"))

		//@ts-expect-error Testing purposes
		expect(() => { logger.depth = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.depth.type"))

		//@ts-expect-error Testing purposes
		expect(() => { logger.logger = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.config.logger.logger.type"))
	})

	it("should succeed when setting valid values on the Logger Configuration using chained setter methods", () => {
		const logger: BaseLogger = new BaseLogger();

		expect(() => {
			logger
				.setEnabled(true)
				.setUseColors(true)
				.setDepth(5)
				.setLoggerFunction(null) // CASE 1 - Null value
				.setLoggerFunction((...args) => { args; return; }) // CASE 2 - Logger function
		}).to.not.throw()
	})

	it("should succeed when setting valid values on the Logger Configuration using assignment operators", () => {
		const logger: BaseLogger = new BaseLogger();

		expect(() => { logger.enabled = true }).to.not.throw() 
		expect(() => { logger.colors = true }).to.not.throw() 
		expect(() => { logger.depth = 5 }).to.not.throw() 
		expect(() => { logger.logger = null }).to.not.throw() // CASE 1 - Null value
		expect(() => { logger.logger = (...args) => { args; return; } }).to.not.throw() // CASE 1 - Logger function
	})

	it("should log the correct values to the console when the default log function is called", () => {
		// const _log = console.log
		const consoleLogStub = sinon.stub(console, "log")
		//	.callsFake(function(...args: unknown[]) {
		//		_log.apply({}, ["============================================"])
		//		_log.apply({}, ["ARGUMENTS:", inspect(args, true, 5, true)])
		//		return _log.apply({}, args)
		//	})
		const logger: BaseLogger = new BaseLogger();

		// SAMPLE STRING
		logger.log("Lorem Ipsum Dolore Sit Amet.")
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith("Lorem Ipsum Dolore Sit Amet."), "Logger should log correct sample string").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE NUMBER
		logger.log(123)
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith(123), "Logger should log correct sample number").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE OBJECT
		logger.log({ a: 123, b: "hello" })
		expect(consoleLogStub.calledOnce).to.be.true

		// eslint-disable-next-line quotes
		expect(consoleLogStub.calledWith("{ a: \x1B[33m123\x1B[39m, b: \x1B[32m'hello'\x1B[39m }"), "Logger should log correct sample object").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE BOOLEAN
		logger.log(true)
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith(true), "Logger should log correct sample boolean").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE ARRAY
		logger.log([123, "123"])
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith("[ \x1B[33m123\x1B[39m, \x1B[32m'123'\x1B[39m ]"), "Logger should log correct sample array").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE UNDEFINED VALUE
		logger.log(undefined)
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith(undefined), "Logger should log correct sample undefined value").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE NULL VALUE
		logger.log(null)
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith("\x1B[1mnull\x1B[22m"), "Logger should log correct sample null value").to.be.true
		consoleLogStub.resetHistory()

		consoleLogStub.restore()
	})

	it("should log the correct values to the console when a custom log function is called", () => {
		const consoleLogStub = sinon.stub(console, "log")
		const logger: BaseLogger = new BaseLogger();
		logger.setLoggerFunction(function(...args: unknown[]) {
			console.log("CUSTOM:", ...args)
		})

		// SAMPLE STRING
		logger.log("Lorem Ipsum Dolore Sit Amet.")
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith("CUSTOM:", "Lorem Ipsum Dolore Sit Amet."), "Logger should log correct sample string").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE NUMBER
		logger.log(123)
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith("CUSTOM:", 123), "Logger should log correct sample number").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE OBJECT
		logger.log({ a: 123, b: "hello" })
		expect(consoleLogStub.calledOnce).to.be.true

		// eslint-disable-next-line quotes
		expect(consoleLogStub.calledWith("CUSTOM:", { a: 123, b: "hello" }), "Logger should log correct sample object").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE BOOLEAN
		logger.log(true)
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith("CUSTOM:", true), "Logger should log correct sample boolean").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE ARRAY
		logger.log([123, "123"])
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith("CUSTOM:", [123, "123"]), "Logger should log correct sample array").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE UNDEFINED VALUE
		logger.log(undefined)
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith("CUSTOM:", undefined), "Logger should log correct sample undefined value").to.be.true
		consoleLogStub.resetHistory()

		// SAMPLE NULL VALUE
		logger.log(null)
		expect(consoleLogStub.calledOnce).to.be.true
		expect(consoleLogStub.calledWith("CUSTOM:", null), "Logger should log correct sample null value").to.be.true
		consoleLogStub.resetHistory()

		consoleLogStub.restore()
	})
}