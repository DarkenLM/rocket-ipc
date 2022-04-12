/**
 * Copyright (c) 2022
 *
 * Common Configuration File for the IPC Services.
 * Can be used both for Clients and Servers, however some options may be used only by one side and discarded by the other.
 * 
 * Socket Configuration: Configuration for the ICP Socket, used to specify the properties of the socket.
 * Network Configuration: Configuration for the Networking of the Socket, used to identify the host of the socket to connect to, or serve.
 * TCP Interface Configuration: Configuration for the TCP Socket used to configure the TCP connection, if used.
 * Logger Configuration: Configuration for the logger of the Client/Server, used to configure the logger. A custom logger can be attached to the existing logger, which will override the built-in one.
 * 
 * NOTES:
 * 	On the Network Configuration, the IPType and TLS are currently defined by the configuration system itself, however the code for manually setting them
 * 		was left commented out, in case it may be required at some point.
 *
 * @summary Configuration file for all the ISP Services of the rocket-ipc package
 * @author Rafael Fernandes <rafaelfernandes660@gmail.com>
 *
 * Created at     : 2022-03-23 08:08:29 
 * Last modified  : 2022-04-12 11:05:50
 */

import os from "os"
import { z } from "zod"
import { schema as ConfigSchema } from "../schemas/zod/config"
import { Errors, ErrorTypes } from "../schemas/errors/errors"


type socketID = z.infer<typeof ConfigSchema.socket>["id"]
type socketRoot = z.infer<typeof ConfigSchema.socket>["root"]
type socketIsRaw = z.infer<typeof ConfigSchema.socket>["raw"]
type socketEncoding = z.infer<typeof ConfigSchema.socket>["encoding"]
type socketDelimiter = z.infer<typeof ConfigSchema.socket>["delimiter"]
type socketAllowAsync = z.infer<typeof ConfigSchema.socket>["allowAsync"]
type socketUnlink = z.infer<typeof ConfigSchema.socket>["unlink"]
type socketRetryTime = z.infer<typeof ConfigSchema.socket>["retryTime"]
type socketMaxRetries = z.infer<typeof ConfigSchema.socket>["maxRetries"]
type socketMaxConnections = z.infer<typeof ConfigSchema.socket>["maxConnections"]
type socketReadableAll = z.infer<typeof ConfigSchema.socket>["readableAll"]
type socketWriteableAll = z.infer<typeof ConfigSchema.socket>["writeableAll"]

// type networkIPType = z.infer<typeof ConfigSchema.network>["IPType"]
// type networkTLS = z.infer<typeof ConfigSchema.network>["tls"]
type networkHost = z.infer<typeof ConfigSchema.network>["host"]
type networkPort = z.infer<typeof ConfigSchema.network>["port"]

type tcpInterfaceLocalAddress = z.infer<typeof ConfigSchema.tcpInterface>["localAddress"]
type tcpInterfaceLocalPort = z.infer<typeof ConfigSchema.tcpInterface>["localPort"]
type tcpInterfaceFamily = z.infer<typeof ConfigSchema.tcpInterface>["family"]
type tcpInterfaceDNSHints = z.infer<typeof ConfigSchema.tcpInterface>["hints"]
type tcpInterfaceDNSLookup = z.infer<typeof ConfigSchema.tcpInterface>["lookup"]

type IsLoggerEnabled = z.infer<typeof ConfigSchema.logger>["enabled"]
type loggerShouldUseColors = z.infer<typeof ConfigSchema.logger>["colors"]
type loggerDepth = z.infer<typeof ConfigSchema.logger>["depth"]
type loggerFunctionOverride = z.infer<typeof ConfigSchema.logger>["logger"]

/**
 * IPC Config
 * Common configuration class for any method that requires a configuration.
 */

class Config {
	protected appspace: string
	protected _socket: z.infer<typeof ConfigSchema.socket>
	protected _network: z.infer<typeof ConfigSchema.network>
	protected _tcpInterface: z.infer<typeof ConfigSchema.tcpInterface>
	protected _logger: z.infer<typeof ConfigSchema.logger>
	errors: ErrorTypes

	socket: z.infer<typeof ConfigSchema.socket>
	network: z.infer<typeof ConfigSchema.network>
	tcpInterface: z.infer<typeof ConfigSchema.tcpInterface>
	logger: z.infer<typeof ConfigSchema.logger>

	constructor() {
		this.appspace = "app"  		// Reserved name for application messages [DEFAULT: "app"]
		
		this._socket = {
			id: os.hostname(), 		// The ID of this socket [DEFAULT: System Hostname]
			root: "/tmp",	   		// The root of the Unix Socket (if used) [DEFAULT: "/tmp"]
			raw: false,		   		// Whenever a raw Buffer should be sent instead of JSON objects [DEFAULT: false]
			encoding: "utf8",  		// The encoding of the Buffer, if socket.raw is defined. Can take any of the following values: "ascii", "utf8", "utf16le", "ucs2", "base64", "hex" [DEFAULT: "utf8"]
			delimiter: "\f",   		// The delimiter at the end of each Packet [DEFAULT: "\f"]
			allowAsync: true,  		// Whenever the client can send concurrent requests [DEFAULT: true]
			unlink: true,	   		// Whenever the Unix Socked will be deleted before starting up. If undefined, the user needs to delete it on it's own [DEFAULT: true]
			retryTime: 500,	   		// The time each client should wait before attempting to reconnect [DEFAULT: 500]
			maxRetries: Infinity, 	// The maximum number of retries before the client kills the connection [DEFAULT: Infinity]
			maxConnections: 100,	// The maximum number of connections a socket can handle [DEFAULT: 100]
			readableAll: true,		// Whenever the pipe should be readable by all services [DEFAULT: true]
			writeableAll: true		// Whenever the pipe should be writeable by all services [DEFAULT: true]
		}

		this._network = {
			IPType: getIPType(),	// SYSTEM DEFINED | The IP Family of the system [DEFAULT: IPv4]
			tls: false,				// SYSTEM DEFINED | If TLS should be used for the socket [DEFAULT: false]
			host: "",				// The host of the socket [DEFAULT: localhost]
			port: 3000				// The port the socket should listen to [DEFAULT: 3000]
		}

		this._tcpInterface = {		// TCP sockets only (https://nodejs.org/api/net.html#socketconnectoptions-connectlistener)
			localAddress: null,		// The local address the socket should connect to [DEFAULT: null]
			localPort: null,		// The local port the socket should connect to [DEFAULT: null]
			family: 0,				// The version of IP stack. Must be 4, 6, or 0. The value 0 indicates that both IPv4 and IPv6 addresses are allowed [DEFAULT: 0]
			hints: [],				// Optional DNS lookup hints (ADDRCONFIG, V4MAPPED, ALL) [DEFAULT: Array<Empty>]
			lookup: null 			// A custom DNS lookup function [DEFAULT: null]
		}

		this._logger = {
			enabled: true,			// Whenever the Logger is enabled [DEFAULT: true]
			colors: true,			// Whenever the Logger should display colors [DEFAULT: true]
			depth: 5,				// The depth the Logger should expand objects [DEFAULT: 5]
			logger: null			// A custom logger function that will override the built-in logger [DEFAULT: null]
		}

		this.errors = new Errors().errors

		/* istanbul ignore next */
		if (this._network.IPType === "IPv4") this._network.host = "127.0.0.1"; else this._network.host = "::1";

		// Data accessors for Configuration properties
		// Used to intercept set operations to ensure correct type of a Configuration Property at all times

		this.socket = (() =>{
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const _this = this
			
			// eslint-disable-next-line @typescript-eslint/no-unused-vars

			const proxy = {
				get id() { return _this._socket.id },
				set id(value) {
					_this.setSocketId(value)
				},
				get root() { return _this._socket.root },
				set root(value) {
					_this.setSocketRoot(value)
				},
				get raw() { return _this._socket.raw },
				set raw(value) {
					_this.setSocketIsRaw(value)
				},
				get encoding() { return _this._socket.encoding },
				set encoding(value) {
					_this.setSocketEncoding(value)
				},
				get delimiter() { return _this._socket.delimiter },
				set delimiter(value) {
					_this.setSocketDelimiter(value)
				},
				get allowAsync() { return _this._socket.allowAsync },
				set allowAsync(value) {
					_this.setSocketAllowAsync(value)
				},
				get unlink() { return _this._socket.unlink },
				set unlink(value) {
					_this.setSocketShouldUnlink(value)
				},
				get retryTime() { return _this._socket.retryTime },
				set retryTime(value) {
					_this.setSocketRetryTime(value)
				},
				get maxRetries() { return _this._socket.maxRetries },
				set maxRetries(value) {
					_this.setSocketMaxRetries(value)
				},
				get maxConnections() { return _this._socket.maxConnections },
				set maxConnections(value) {
					_this.setSocketMaxConnections(value)
				},
				get readableAll() { return _this._socket.readableAll },
				set readableAll(value) {
					_this.setSocketReadableAll(value)
				},
				get writeableAll() { return _this._socket.writeableAll },
				set writeableAll(value) {
					_this.setSocketWriteableAll(value)
				}
			}

			return proxy
		})()

		this.network = (() =>{
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const _this = this

			const proxy = {
				get IPType() { return _this._network.IPType },
				set IPType(value) {
					throw new _this.errors.ConfigurationError("invalid.network.IPType.set")
					//_this.setNetworkIPType(value)
				},
				get tls() { return _this._network.tls },
				set tls(value) {
					throw new _this.errors.ConfigurationError("invalid.network.tls.set")
					//_this.setNetworkShouldUseTLS(value)
				},
				get host() { return _this._network.host },
				set host(value) {
					_this.setNetworkHost(value)
				},
				get port() { return _this._network.port },
				set port(value) {
					_this.setNetworkPort(value)
				},
			}

			return proxy
		})()

		this.tcpInterface = (() =>{
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const _this = this

			const proxy = {
				get localAddress() { return _this._tcpInterface.localAddress },
				set localAddress(value) {
					_this.setTCPInterfaceLocalAddress(value)
				},
				get localPort() { return _this._tcpInterface.localPort },
				set localPort(value) {
					_this.setTCPInterfaceLocalPort(value)
				},
				get family() { return _this._tcpInterface.family },
				set family(value) {
					_this.setTCPInterfaceFamily(value)
				},
				get hints() { return _this._tcpInterface.hints },
				set hints(value) {
					_this.setTCPInterfaceDNSHints(value)
				},
				get lookup() { return _this._tcpInterface.lookup },
				set lookup(value) {
					_this.setTCPInterfaceDNSLookup(value)
				},
			}

			return proxy
		})()

		this.logger = (() =>{
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const _this = this

			const proxy = {
				get enabled() { return _this._logger.enabled },
				set enabled(value) {
					_this.setIsLoggerEnabled(value)
				},
				get colors() { return _this._logger.colors },
				set colors(value) {
					_this.setLoggerShouldUseColors(value)
				},
				get depth() { return _this._logger.depth },
				set depth(value) {
					_this.setLoggerDepth(value)
				},
				get logger() { return _this._logger.logger },
				set logger(value) {
					_this.setLoggerFunction(value)
				},
			}

			return proxy
		})()
	}

	/**
	 * ================================================
	 *					SOCKET SETTERS
	 * ================================================
	 */

	
	/**
	 * Setter for the Configuration's Socket ID
	 * 
	 * Socket ID: The ID of this socket [DEFAULT: System Hostname]
	 *
	 * @param {socketID} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketId(value: socketID): Config {
		const isValid = ConfigSchema.socket.shape.id.safeParse(value)

		if (isValid.success) {
			this._socket.id = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.id.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Root
	 * 
	 * Socket Root: The root of the Unix Socket (if used) [DEFAULT: "/tmp"]
	 *
	 * @param {socketID} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketRoot(value: socketRoot): Config {
		const isValid = ConfigSchema.socket.shape.root.safeParse(value)

		if (isValid.success) {
			this._socket.root = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.root.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Raw State
	 * 
	 * Socket Raw State: Whenever a raw Buffer should be sent instead of JSON objects [DEFAULT: false]
	 *
	 * @param {socketIsRaw} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketIsRaw(value: socketIsRaw): Config {
		const isValid = ConfigSchema.socket.shape.raw.safeParse(value)

		if (isValid.success) {
			this._socket.raw = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.raw.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Encoding
	 * 
	 * Socket Encoding: The encoding of the Buffer, if socket.raw is defined. Can take any of the following values: "ascii", "utf8", "utf16le", "ucs2", "base64", "hex" [DEFAULT: "utf8"]
	 *
	 * @param {socketEncoding} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketEncoding(value: socketEncoding): Config {
		const isValid = ConfigSchema.socket.shape.encoding.safeParse(value)

		if (isValid.success) {
			this._socket.encoding = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.encoding.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Delimiter
	 * 
	 * Socket Delimiter The delimiter at the end of each Packet [DEFAULT: "\f"]
	 *
	 * @param {socketDelimiter} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketDelimiter(value: socketDelimiter): Config {
		const isValid = ConfigSchema.socket.shape.delimiter.safeParse(value)

		if (isValid.success) {
			this._socket.delimiter = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.delimiter.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Allow Async State
	 * 
	 * Socket Allow Async State: Whenever the client can send concurrent requests [DEFAULT: true]
	 *
	 * @param {socketAllowAsync} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketAllowAsync(value: socketAllowAsync): Config {
		const isValid = ConfigSchema.socket.shape.allowAsync.safeParse(value)

		if (isValid.success) {
			this._socket.allowAsync = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.allowAsync.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Unlink State
	 * 
	 * Socket Unlink State: Whenever the Unix Socked will be deleted before starting up. If undefined, the user needs to delete it on it's own [DEFAULT: true]
	 *
	 * @param {socketUnlink} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketShouldUnlink(value: socketUnlink): Config {
		const isValid = ConfigSchema.socket.shape.unlink.safeParse(value)

		if (isValid.success) {
			this._socket.unlink = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.unlink.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Retry Time
	 * 
	 * Socket Retry Time: The time each client should wait before attempting to reconnect [DEFAULT: 500]
	 *
	 * @param {socketRetryTime} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketRetryTime(value: socketRetryTime): Config {
		const isValid = ConfigSchema.socket.shape.retryTime.safeParse(value)

		if (isValid.success) {
			this._socket.retryTime = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.retryTime.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Maximum Retries
	 * 
	 * Socket Maximum Retries: The maximum number of retries before the client kills the connection [DEFAULT: Infinity]
	 *
	 * @param {socketMaxRetries} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketMaxRetries(value: socketMaxRetries): Config {
		const isValid = ConfigSchema.socket.shape.maxRetries.safeParse(value)

		if (isValid.success) {
			this._socket.maxRetries = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.maxRetries.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Maximum Concurrent Connections
	 * 
	 * Socket Maximum Concurrent Connections: The maximum number of connections a socket can handle [DEFAULT: 100]
	 *
	 * @param {socketMaxConnections} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketMaxConnections(value: socketMaxConnections): Config {
		const isValid = ConfigSchema.socket.shape.maxConnections.safeParse(value)

		if (isValid.success) {
			this._socket.maxConnections = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.maxConnections.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Readable All State
	 * 
	 * Socket Readable All State: Whenever the pipe should be readable by all services [DEFAULT: true]
	 *
	 * @param {socketReadableAll} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketReadableAll(value: socketReadableAll): Config {
		const isValid = ConfigSchema.socket.shape.readableAll.safeParse(value)

		if (isValid.success) {
			this._socket.readableAll = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.readableAll.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Writeable All State
	 * 
	 * Socket Writeable All State: Whenever the pipe should be writeable by all services [DEFAULT: true]
	 *
	 * @param {socketWriteableAll} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketWriteableAll(value: socketWriteableAll): Config {
		const isValid = ConfigSchema.socket.shape.writeableAll.safeParse(value)

		if (isValid.success) {
			this._socket.writeableAll = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.socket.writeableAll.type")
		}
	}

	/**
	 * =================================================
	 *					NETWORK SETTERS
	 * =================================================
	 */

	// /**
	//  * Setter for the Configuration's Network Host
	//  * 
	//  * Network Host: SYSTEM DEFINED | The IP Family of the system [DEFAULT: IPv4]
	//  *
	//  * @param {networkIPType} value
	//  * @return {Config} The Configuration instance, to allow method chaining
	//  * @memberof Config
	//  */
	// setNetworkIPType(value: networkIPType): this {
	// 	const isValid = ConfigSchema.network.shape.IPType.safeParse(value)

	// 	if (isValid.success) {
	// 		this._network.IPType = value
	// 		return this
	// 	} else {
	// 		throw new this.errors.ConfigurationError("invalid.network.IPType.type")
	// 	}
	// }

	// /**
	//  * Setter for the Configuration's Network TLS State
	//  * 
	//  * Network TLS State: SYSTEM DEFINED | If TLS should be used for the socket [DEFAULT: false]
	//  *
	//  * @param {networkTLS} value
	//  * @return {Config} The Configuration instance, to allow method chaining
	//  * @memberof Config
	//  */
	// setNetworkShouldUseTLS(value: networkTLS): this {
	// 	const isValid = ConfigSchema.network.shape.tls.safeParse(value)

	// 	if (isValid.success) {
	// 		this._network.tls = value
	// 		return this
	// 	} else {
	// 		throw new this.errors.ConfigurationError("invalid.network.tls.type")
	// 	}
	// }

	/**
	 * Setter for the Configuration's Network Host
	 * 
	 * Network Host: The host of the socket [DEFAULT: localhost]
	 *
	 * @param {networkHost} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setNetworkHost(value: networkHost): Config {
		const isValid = ConfigSchema.network.shape.host.safeParse(value)

		if (isValid.success) {
			this._network.host = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.network.host.type")
		}
	}

	/**
	 * Setter for the Configuration's Network Port
	 * 
	 * Network Port: The port the socket should listen to [DEFAULT: 3000]
	 *
	 * @param {networkPort} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setNetworkPort(value: networkPort): Config {
		const isValid = ConfigSchema.network.shape.port.safeParse(value)

		if (isValid.success) {
			this._network.port = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.network.port.type")
		}
	}

	/**
	 * =================================================
	 *					TCP INTERFACE SETTERS
	 * =================================================
	 */

	/**
	 * Setter for the Configuration's TCP Interface's Local Address
	 * 
	 * TCP Interface's Local Address: The local address the socket should connect to [DEFAULT: null]
	 *
	 * @param {tcpInterfaceLocalAddress} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceLocalAddress(value: tcpInterfaceLocalAddress): Config {
		const isValid = ConfigSchema.tcpInterface.shape.localAddress.safeParse(value)

		if (isValid.success) {
			this._tcpInterface.localAddress = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.tcpInterface.localAddress.type")
		}
	}

	/**
	 * Setter for the Configuration's TCP Interface's Local Port
	 * 
	 * TCP Interface's Local Port: The local port the socket should connect to [DEFAULT: null]
	 *
	 * @param {tcpInterfaceLocalPort} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceLocalPort(value: tcpInterfaceLocalPort): Config {
		const isValid = ConfigSchema.tcpInterface.shape.localPort.safeParse(value)

		if (isValid.success) {
			this._tcpInterface.localPort = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.tcpInterface.localPort.type")
		}
	}

	/**
	 * Setter for the Configuration's TCP Interface's Family
	 * 
	 * TCP Interface's Family: The version of IP stack. Must be 4, 6, or 0. The value 0 indicates that both IPv4 and IPv6 addresses are allowed [DEFAULT: 0]
	 *
	 * @param {tcpInterfaceFamily} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceFamily(value: tcpInterfaceFamily): Config {
		const isValid = ConfigSchema.tcpInterface.shape.family.safeParse(value)

		if (isValid.success) {
			this._tcpInterface.family = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.tcpInterface.family.type")
		}
	}

	/**
	 * Setter for the Configuration's TCP Interface's DNS Hints
	 * 
	 * TCP Interface's DNS Hints: Optional DNS lookup hints (ADDRCONFIG, V4MAPPED, ALL) [DEFAULT: Array<Empty>]
	 *
	 * @param {tcpInterfaceDNSHints} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceDNSHints(value: tcpInterfaceDNSHints): Config {
		const isValid = ConfigSchema.tcpInterface.shape.hints.safeParse(value)

		if (isValid.success) {
			this._tcpInterface.hints = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.tcpInterface.hints.type")
		}
	}

	/**
	 * Setter for the Configuration's TCP Interface's DNS Lookup
	 * 
	 * TCP Interface's DNS Lookup: A custom DNS lookup function [DEFAULT: null]
	 *
	 * @param {socketID} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceDNSLookup(value: tcpInterfaceDNSLookup): Config {
		const isValid = ConfigSchema.tcpInterface.shape.lookup.safeParse(value)

		if (isValid.success) {
			this._tcpInterface.lookup = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.tcpInterface.lookup.type")
		}
	}

	/**
	 * ================================================
	 *					LOGGER SETTERS
	 * ================================================
	 */

	/**
	 * Setter for the Configuration's Logger Enabled State
	 * 
	 * Logger's Enabled State: Whenever the Logger is enabled [DEFAULT: true]
	 *
	 * @param {IsLoggerEnabled} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setIsLoggerEnabled(value: IsLoggerEnabled): Config {
		const isValid = ConfigSchema.logger.shape.enabled.safeParse(value)

		if (isValid.success) {
			this._logger.enabled = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.logger.enabled.type")
		}
	}

	/**
	 * Setter for the Configuration's Logger Color State
	 * 
	 * Logger Color State: Whenever the Logger should display colors [DEFAULT: true]
	 *
	 * @param {loggerShouldUseColors} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setLoggerShouldUseColors(value: loggerShouldUseColors): Config {
		const isValid = ConfigSchema.logger.shape.colors.safeParse(value)

		if (isValid.success) {
			this._logger.colors = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.logger.colors.type")
		}
	}

	/**
	 * Setter for the Configuration's Logger Depth
	 * 
	 * Logger Depth: The depth the Logger should expand objects [DEFAULT: 5]
	 *
	 * @param {loggerDepth} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setLoggerDepth(value: loggerDepth): Config {
		const isValid = ConfigSchema.logger.shape.depth.safeParse(value)

		if (isValid.success) {
			this._logger.depth = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.logger.depth.type")
		}
	}

	/**
	 * Setter for the Configuration's Logger Lookup
	 * 
	 * Logger Lookup: A custom logger function that will override the built-in logger [DEFAULT: null]
	 *
	 * @param {loggerFunctionOverride} value
	 * @return {Config} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setLoggerFunction(value: loggerFunctionOverride): Config {
		const isValid = ConfigSchema.logger.shape.logger.safeParse(value)

		if (isValid.success) {
			this._logger.logger = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.logger.logger.type")
		}
	}
}

function getIPType() {
	const netInt = os.networkInterfaces()
	return (Object.values(netInt)[0] || [{}])[0]?.family || "IPv4"
}

export {
	Config
}