import { Config } from "../../dist/ipc/helpers/config"
import { getFlattenMessageCodes, Locale } from "../../dist/ipc/schemas/codes/message-codes";
import { chai } from "../common"
import { IDNSLookupCallback, IDNSLookupOptions } from "../../dist/ipc/schemas/zod/config"

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
		const config: Config = new Config();
	
		expect(config, "Configuration should exist").to.exist;
	});
	
	it("should have the correct default types when initialized with no arguments", () => {
		const config: Config = new Config();
	
		// SOCKET CONFIGURATION
		expect(config.socket, "Socket Configuration should exist").to.exist;
		expect(config.socket.raw, "Socket Configuration Property 'raw' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(config.socket.id, "Socket Configuration Property 'id' should exist and be a string").to.exist.and.to.be.a("string");
		expect(config.socket.root, "Socket Configuration Property 'root' should exist and be a string").to.exist.and.to.be.a("string");
		expect(config.socket.encoding, "Socket Configuration Property 'encoding' should exist and be a string").to.exist.and.to.be.a("string");
		expect(config.socket.delimiter, "Socket Configuration Property 'delimiter' should exist and be a string").to.exist.and.to.be.a("string");
		expect(config.socket.allowAsync, "Socket Configuration Property 'allowAsync' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(config.socket.unlink, "Socket Configuration Property 'unlink' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(config.socket.retryTime, "Socket Configuration Property 'retryTime' should exist and be a number").to.exist.and.to.be.a("number");
		expect(config.socket.maxRetries, "Socket Configuration Property 'maxRetries' should exist and be a number").to.exist.and.to.be.a("number");
		expect(config.socket.maxConnections, "Socket Configuration Property 'maxConnections' should exist and be a number").to.exist.and.to.be.a("number");
		expect(config.socket.readableAll, "Socket Configuration Property 'readableAll' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(config.socket.writeableAll, "Socket Configuration Property 'writeableAll' should exist and be a boolean").to.exist.and.to.be.a("boolean");
	
		// NETWORK CONFIGURATION
		expect(config.network, "Network Configuration should exist").to.exist;
		expect(config.network.IPType, "Network Configuration Property 'IPType' should exist and be a string").to.exist.and.to.be.a("string").and.to.be.oneOf(["IPv4", "IPv6"])
		expect(config.network.tls, "Network Configuration Property 'tls' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(config.network.host, "Network Configuration Property 'tls' should exist and be a string").to.exist.and.to.be.a("string");
		expect(config.network.port, "Network Configuration Property 'port' should exist and be a number").to.exist.and.to.be.a("number");
	
		// TCP INTERFACE CONFIGURATION
		expect(config.tcpInterface, "TCP Interface Configuration should exist").to.exist;
		expect(config.tcpInterface.localAddress, "TCP Interface Configuration Property 'localAddress' should exist and be either a string or null").to.satisfy(function(arg: unknown) {
			if (typeof(arg) === "string" || arg === null) return true;
			return false;
		});
		expect(config.tcpInterface.localPort, "TCP Interface Configuration Property 'localPort' should exist and be either a string or null").to.satisfy(function(arg: unknown) {
			if (typeof(arg) === "string" || arg === null) return true;
			return false;
		});
		expect(config.tcpInterface.family, "TCP Interface Configuration Property 'family' should exist and be a number").to.exist.and.to.be.a("number");
		expect(config.tcpInterface.hints, "TCP Interface Configuration Property 'family' should exist and be an array").to.exist.and.to.be.an("array");
		expect(config.tcpInterface.lookup, "TCP Interface Configuration Property 'lookup' should exist and be either a function or null").to.satisfy(function(arg: unknown) {
			if (typeof(arg) === "function" || arg === null) return true;
			return false;
		});
	
		// LOGGER CONFIGURATION
		expect(config.logger, "Logger Configuration should exist").to.exist;
		expect(config.logger.enabled, "Logger Configuration Property 'enabled' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(config.logger.colors, "Logger Configuration Property 'colors' should exist and be a boolean").to.exist.and.to.be.a("boolean");
		expect(config.logger.depth, "Logger Configuration Property 'depth' should exist and be a number").to.exist.and.to.be.a("number");
		expect(config.logger.logger, "Logger Configuration Property 'enabled' should exist and be either a function or null").to.satisfy(function(arg: unknown) {
			if (typeof(arg) === "function" || arg === null) return true;
			return false;
		});
	
		// ERROR CONFIGURATION
		expect(config.errors, "Logger Configuration should exist").to.exist;
	});
	
	it("should throw a Configuration Error with a parsed message if an invalid value is attempted to be set on the Configuration using isolated setter methods", () => {
		const config: Config = new Config();
		
		/**
		 * ================================================
		 *					SOCKET SETTERS
		 * ================================================
		 */

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketId(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.id.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketRoot(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.root.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketIsRaw(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.raw.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketEncoding(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.encoding.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketDelimiter(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.delimiter.type"))
		
		//@ts-expect-error Testing purposes
		expect(() => config.setSocketAllowAsync(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.allowAsync.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketShouldUnlink(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.unlink.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketRetryTime(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.retryTime.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketMaxRetries(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.maxRetries.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketMaxConnections(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.maxConnections.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketReadableAll(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.readableAll.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setSocketWriteableAll(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.writeableAll.type"))

		/**
		 * =================================================
		 *					NETWORK SETTERS
		 * =================================================
		 */

		// //@ts-expect-error Testing purposes
		// expect(() => config.setNetworkIPType(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.network.IPType.type"))

		// //@ts-expect-error Testing purposes
		// expect(() => config.setNetworkShouldUseTLS(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.network.tls.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setNetworkHost(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.network.host.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setNetworkPort(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.network.port.type"))

		/**
		 * ===============================================
		 *				TCP INTERFACE SETTERS
		 * ===============================================
		 */

		//@ts-expect-error Testing purposes
		expect(() => config.setTCPInterfaceLocalAddress(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.localAddress.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setTCPInterfaceLocalPort(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.localPort.type"))
		
		//@ts-expect-error Testing purposes
		expect(() => config.setTCPInterfaceFamily(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.family.type"))
		
		//@ts-expect-error Testing purposes
		expect(() => config.setTCPInterfaceDNSHints(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.hints.type"))
		
		//@ts-expect-error Testing purposes
		expect(() => config.setTCPInterfaceDNSLookup(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.lookup.type"))

		/**
		 * ================================================
		 *					LOGGER SETTERS
		 * ================================================
		 */

		//@ts-expect-error Testing purposes
		expect(() => config.setIsLoggerEnabled(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.enabled.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setLoggerShouldUseColors(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.colors.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setLoggerDepth(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.depth.type"))

		//@ts-expect-error Testing purposes
		expect(() => config.setLoggerFunction(Symbol("DEBUG"))).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.logger.type"))
	})
	
	it("should throw a Configuration Error with a parsed message if an invalid value is attempted to be set on the Configuration using chained setter methods", () => {
		const config: Config = new Config();

		/**
		 * ================================================
		 *					SOCKET SETTERS
		 * ================================================
		 */

		expect(() => {
			config
				//@ts-expect-error Testing purposes
				.setSocketId(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketRoot(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketIsRaw(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketEncoding(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketDelimiter(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketAllowAsync(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketShouldUnlink(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketRetryTime(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxRetries(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.id.type"))

		expect(() => {
			config
				.setSocketId("sample_id")

				//@ts-expect-error Testing purposes
				.setSocketRoot(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketIsRaw(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketEncoding(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketDelimiter(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketAllowAsync(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketShouldUnlink(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketRetryTime(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxRetries(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.root.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")

				//@ts-expect-error Testing purposes
				.setSocketIsRaw(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketEncoding(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketDelimiter(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketAllowAsync(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketShouldUnlink(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketRetryTime(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxRetries(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.raw.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)

				//@ts-expect-error Testing purposes
				.setSocketEncoding(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketDelimiter(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketAllowAsync(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketShouldUnlink(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketRetryTime(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxRetries(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.encoding.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)
				.setSocketEncoding("ascii")

				//@ts-expect-error Testing purposes
				.setSocketDelimiter(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketAllowAsync(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketShouldUnlink(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketRetryTime(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxRetries(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.delimiter.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)
				.setSocketEncoding("ascii")
				.setSocketDelimiter("\f")

				//@ts-expect-error Testing purposes
				.setSocketAllowAsync(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketShouldUnlink(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketRetryTime(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxRetries(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.allowAsync.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)
				.setSocketEncoding("ascii")
				.setSocketDelimiter("\f")
				.setSocketAllowAsync(true)

				//@ts-expect-error Testing purposes
				.setSocketShouldUnlink(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketRetryTime(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxRetries(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.unlink.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)
				.setSocketEncoding("ascii")
				.setSocketDelimiter("\f")
				.setSocketAllowAsync(true)
				.setSocketShouldUnlink(true)

				//@ts-expect-error Testing purposes
				.setSocketRetryTime(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxRetries(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.retryTime.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)
				.setSocketEncoding("ascii")
				.setSocketDelimiter("\f")
				.setSocketAllowAsync(true)
				.setSocketShouldUnlink(true)
				.setSocketRetryTime(500)

				//@ts-expect-error Testing purposes
				.setSocketMaxRetries(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.maxRetries.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)
				.setSocketEncoding("ascii")
				.setSocketDelimiter("\f")
				.setSocketAllowAsync(true)
				.setSocketShouldUnlink(true)
				.setSocketRetryTime(500)
				.setSocketMaxRetries(Infinity)

				//@ts-expect-error Testing purposes
				.setSocketMaxConnections(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.maxConnections.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)
				.setSocketEncoding("ascii")
				.setSocketDelimiter("\f")
				.setSocketAllowAsync(true)
				.setSocketShouldUnlink(true)
				.setSocketRetryTime(500)
				.setSocketMaxRetries(Infinity)
				.setSocketMaxConnections(100)

				//@ts-expect-error Testing purposes
				.setSocketReadableAll(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.readableAll.type"))

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)
				.setSocketEncoding("ascii")
				.setSocketDelimiter("\f")
				.setSocketAllowAsync(true)
				.setSocketShouldUnlink(true)
				.setSocketRetryTime(500)
				.setSocketMaxRetries(Infinity)
				.setSocketMaxConnections(100)
				.setSocketReadableAll(true)

				//@ts-expect-error Testing purposes
				.setSocketWriteableAll(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.writeableAll.type"))

		/**
		 * =================================================
		 *					NETWORK SETTERS
		 * =================================================
		 */

		// expect(() => {
		// 	config
		// 		//@ts-expect-error Testing purposes
		// 		.setNetworkIPType(Symbol("DEBUG"))

		// 		//@ts-expect-error Testing purposes
		// 		.setNetworkShouldUseTLS(Symbol("DEBUG"))

		// 		//@ts-expect-error Testing purposes
		// 		.setNetworkHost(Symbol("DEBUG"))

		// 		//@ts-expect-error Testing purposes
		// 		.setNetworkPort(Symbol("DEBUG"))
		// }).to.throw(getRawErrorMessage(messageCodes, "invalid.network.IPType.set"))

		// expect(() => {
		// 	config
		// 		.setNetworkIPType("IPv4")

		// 		//@ts-expect-error Testing purposes
		// 		.setNetworkShouldUseTLS(Symbol("DEBUG"))

		// 		//@ts-expect-error Testing purposes
		// 		.setNetworkHost(Symbol("DEBUG"))

		// 		//@ts-expect-error Testing purposes
		// 		.setNetworkPort(Symbol("DEBUG"))
		// }).to.throw(getRawErrorMessage(messageCodes, "invalid.network.tls.type"))

		expect(() => {
			config
			//	 .setNetworkIPType("IPv4")
			//	 .setNetworkShouldUseTLS(false)

				//@ts-expect-error Testing purposes
				.setNetworkHost(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setNetworkPort(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.network.host.type"))

		expect(() => {
			config
				// .setNetworkIPType("IPv4")
				// .setNetworkShouldUseTLS(false)
				.setNetworkHost("localhost")

				//@ts-expect-error Testing purposes
				.setNetworkPort(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.network.port.type"))

		/**
		 * ===============================================
		 *				TCP INTERFACE SETTERS
		 * ===============================================
		 */

		expect(() => {
			config
				//@ts-expect-error Testing purposes
				.setTCPInterfaceLocalAddress(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceLocalPort(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceFamily(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceDNSHints(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceDNSLookup(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.localAddress.type"))

		expect(() => {
			config
				.setTCPInterfaceLocalAddress("sample_address")

				//@ts-expect-error Testing purposes
				.setTCPInterfaceLocalPort(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceFamily(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceDNSHints(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceDNSLookup(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.localPort.type"))

		expect(() => {
			config
				.setTCPInterfaceLocalAddress("sample_address")
				.setTCPInterfaceLocalPort(3000)

				//@ts-expect-error Testing purposes
				.setTCPInterfaceFamily(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceDNSHints(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceDNSLookup(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.family.type"))

		expect(() => {
			config
				.setTCPInterfaceLocalAddress("sample_address")
				.setTCPInterfaceLocalPort(3000)
				.setTCPInterfaceFamily(0)

				//@ts-expect-error Testing purposes
				.setTCPInterfaceDNSHints(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setTCPInterfaceDNSLookup(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.hints.type"))

		expect(() => {
			config
				.setTCPInterfaceLocalAddress("sample_address")
				.setTCPInterfaceLocalPort(3000)
				.setTCPInterfaceFamily(0)
				.setTCPInterfaceDNSHints(null)

				//@ts-expect-error Testing purposes
				.setTCPInterfaceDNSLookup(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.lookup.type"))

		/**
		 * ================================================
		 *					LOGGER SETTERS
		 * ================================================
		 */

		expect(() => {
			config
				//@ts-expect-error Testing purposes
				.setIsLoggerEnabled(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setLoggerShouldUseColors(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setLoggerDepth(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setLoggerFunction(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.enabled.type"))

		expect(() => {
			config
				.setIsLoggerEnabled(true)

				//@ts-expect-error Testing purposes
				.setLoggerShouldUseColors(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setLoggerDepth(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setLoggerFunction(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.colors.type"))

		expect(() => {
			config
				.setIsLoggerEnabled(true)
				.setLoggerShouldUseColors(true)

				//@ts-expect-error Testing purposes
				.setLoggerDepth(Symbol("DEBUG"))

				//@ts-expect-error Testing purposes
				.setLoggerFunction(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.depth.type"))

		expect(() => {
			config
				.setIsLoggerEnabled(true)
				.setLoggerShouldUseColors(true)
				.setLoggerDepth(5)

				//@ts-expect-error Testing purposes
				.setLoggerFunction(Symbol("DEBUG"))
		}).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.logger.type"))
	})

	it("should throw a Configuration Error with a parsed message if an invalid value is attempted to be set on the Configuration using assignment operators", () => {
		const config: Config = new Config();

		/**
		 * ================================================
		 *					SOCKET SETTERS
		 * ================================================
		 */

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.id = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.id.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.root = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.root.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.raw = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.raw.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.encoding = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.encoding.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.delimiter = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.delimiter.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.allowAsync = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.allowAsync.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.unlink = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.unlink.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.retryTime = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.retryTime.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.maxRetries = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.maxRetries.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.maxConnections = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.maxConnections.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.readableAll = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.readableAll.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.socket.writeableAll = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.socket.writeableAll.type"))

		/**
		 * =================================================
		 *					NETWORK SETTERS
		 * =================================================
		 */

		//@ts-expect-error Testing purposes
		expect(() => { config.network.IPType = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.network.IPType.set"))

		//@ts-expect-error Testing purposes
		expect(() => { config.network.tls = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.network.tls.set"))

		//@ts-expect-error Testing purposes
		expect(() => { config.network.host = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.network.host.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.network.port = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.network.port.type"))

		/**
		 * ===============================================
		 *				TCP INTERFACE SETTERS
		 * ===============================================
		 */

		//@ts-expect-error Testing purposes
		expect(() => { config.tcpInterface.localAddress = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.localAddress.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.tcpInterface.localPort = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.localPort.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.tcpInterface.family = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.family.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.tcpInterface.hints = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.hints.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.tcpInterface.lookup = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.tcpInterface.lookup.type"))

		/**
		 * ================================================
		 *					LOGGER SETTERS
		 * ================================================
		 */

		//@ts-expect-error Testing purposes
		expect(() => { config.logger.enabled = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.enabled.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.logger.colors = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.colors.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.logger.depth = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.depth.type"))

		//@ts-expect-error Testing purposes
		expect(() => { config.logger.logger = Symbol("DEBUG") }).to.throw(getRawErrorMessage(messageCodes, "invalid.logger.logger.type"))
	})

	it("should succeed when setting valid values on the Configuration using chained setter methods", () => {
		const config: Config = new Config();

		/**
		 * ================================================
		 *					SOCKET SETTERS
		 * ================================================
		 */

		expect(() => {
			config
				.setSocketId("sample_id")
				.setSocketRoot("sample_root")
				.setSocketIsRaw(false)
				.setSocketEncoding("ascii")
				.setSocketDelimiter("\f")
				.setSocketAllowAsync(true)
				.setSocketShouldUnlink(true)
				.setSocketRetryTime(500)
				.setSocketMaxRetries(Infinity)
				.setSocketMaxConnections(100)
				.setSocketReadableAll(true)
				.setSocketWriteableAll(true)
		}).to.not.throw()

		/**
		 * =================================================
		 *					NETWORK SETTERS
		 * =================================================
		 */

		expect(() => {
			config
				// .setNetworkIPType("IPv4")
				// .setNetworkShouldUseTLS(false)
				.setNetworkHost("localhost")
				.setNetworkPort(3000)
		}).to.not.throw()

		/**
		 * ===============================================
		 *				TCP INTERFACE SETTERS
		 * ===============================================
		 */

		//const test = (hostname: string, callback: (err: Error, address: string, family: number) => void) => { hostname; callback; return; }

		expect(() => {
			config
				.setTCPInterfaceLocalAddress("sample_address")
				.setTCPInterfaceLocalPort(3000)
				.setTCPInterfaceFamily(0)
				.setTCPInterfaceDNSHints(null)
				.setTCPInterfaceDNSLookup(null) // CASE 1 - Null value 

				.setTCPInterfaceDNSLookup( 
					(
						hostname: string, 
						callback: IDNSLookupCallback
					) => { hostname; callback; return; } 
				) // CASE 2 - No Options, generated Callback Interface

				.setTCPInterfaceDNSLookup( 
					(
						hostname: string, 
						options: IDNSLookupOptions, 
						callback: IDNSLookupCallback
					) => { hostname; options; callback; return; } 
				) // CASE 3 - Generated Options Interface, Generated Callback Interface

				.setTCPInterfaceDNSLookup( 
					(
						hostname: string, 
						callback: (err: Error, address: string, family: number) => void
					) => { hostname; callback; return; } 
				) // CASE 4 - No Options, Manual Callback Interface

				.setTCPInterfaceDNSLookup( 
					(
						hostname: string, 
						options: {
							family?: number, 
							hints?: number, 
							all?: boolean, 
							verbatim?: boolean
						}, 
						callback: (err: Error, address: string, family: number) => void
					) => { hostname; options; callback; return; } 
				) // CASE 5 - Manual Options Interface, Manual Callback Interface
		}).to.not.throw()

		expect(() => {
			config
				.setIsLoggerEnabled(true)
				.setLoggerShouldUseColors(true)
				.setLoggerDepth(5)
				.setLoggerFunction(null) // CASE 1 - Null value
				.setLoggerFunction((...args) => { args; return; }) // CASE 2 - Logger function
		}).to.not.throw()
	})

	it("should succeed when setting valid values on the Configuration using assignment operators", () => {
		const config: Config = new Config();

		/**
		 * ================================================
		 *					SOCKET SETTERS
		 * ================================================
		 */

		expect(() => { config.socket.id = "sample_id" }).to.not.throw()
		expect(() => { config.socket.root = "sample_root" }).to.not.throw()
		expect(() => { config.socket.raw = false }).to.not.throw()
		expect(() => { config.socket.encoding = "ascii" }).to.not.throw()
		expect(() => { config.socket.delimiter = "\f" }).to.not.throw()
		expect(() => { config.socket.allowAsync = true }).to.not.throw()
		expect(() => { config.socket.unlink = true }).to.not.throw()
		expect(() => { config.socket.retryTime = 500 }).to.not.throw()
		expect(() => { config.socket.maxRetries = Infinity }).to.not.throw()
		expect(() => { config.socket.maxConnections = 100 }).to.not.throw()
		expect(() => { config.socket.readableAll = true }).to.not.throw()
		expect(() => { config.socket.writeableAll = true }).to.not.throw()

		/**
		 * =================================================
		 *					NETWORK SETTERS
		 * =================================================
		 */

		// expect(() => { config.network.IPType = "IPv4" }).to.not.throw()
		// expect(() => { config.network.tls = false }).to.not.throw()
		expect(() => { config.network.host = "localhost" }).to.not.throw()
		expect(() => { config.network.port = 3000 }).to.not.throw()

		/**
		 * ===============================================
		 *				TCP INTERFACE SETTERS
		 * ===============================================
		 */

		expect(() => { config.tcpInterface.localAddress = "sample_address" }).to.not.throw()
		expect(() => { config.tcpInterface.localPort = 3000 }).to.not.throw()
		expect(() => { config.tcpInterface.family = 0 }).to.not.throw()
		expect(() => { config.tcpInterface.hints = null }).to.not.throw()
		expect(() => { 
			config.tcpInterface.lookup = null 
		}).to.not.throw() // CASE 1 - Null value
		
		expect(() => { 
			config.tcpInterface.lookup = (
				hostname: string, 
				callback: IDNSLookupCallback
			) => { hostname; callback; return; }  
		}).to.not.throw() // CASE 2 - No Options, generated Callback Interface

		expect(() => { 
			config.tcpInterface.lookup = (
				hostname: string, 
				options: IDNSLookupOptions, 
				callback: IDNSLookupCallback
			) => { hostname; options; callback; return; }  
		}).to.not.throw() // CASE 3 - Generated Options Interface, Generated Callback Interface

		expect(() => { 
			config.tcpInterface.lookup = (
				hostname: string, 
				callback: (err: Error, address: string, family: number) => void
			) => { hostname; callback; return; }  
		}).to.not.throw() // CASE 4 - No Options, Manual Callback Interface

		expect(() => { 
			config.tcpInterface.lookup = (
				hostname: string, 
				options: {
					family?: number, 
					hints?: number, 
					all?: boolean, 
					verbatim?: boolean
				}, 
				callback: (err: Error, address: string, family: number) => void
			) => { hostname; options; callback; return; }  
		}).to.not.throw() // CASE 5 - Manual Options Interface, Manual Callback Interface

		/**
		 * ================================================
		 *					LOGGER SETTERS
		 * ================================================
		 */

		expect(() => { config.logger.enabled = true }).to.not.throw() 
		expect(() => { config.logger.colors = true }).to.not.throw() 
		expect(() => { config.logger.depth = 5 }).to.not.throw() 
		expect(() => { config.logger.logger = null }).to.not.throw() // CASE 1 - Null value
		expect(() => { config.logger.logger = (...args) => { args; return; } }).to.not.throw() // CASE 1 - Logger function
	})
}

