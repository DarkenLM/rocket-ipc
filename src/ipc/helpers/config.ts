/**
 * Copyright (c) 2022
 *
 * Common Configuration File for the IPC Services.  
 * Can be used both for Clients and Servers, however some options may be used only by one side and discarded by the other.  
 * 
 * ----------------
 * 
 * - Socket Configuration: Configuration for the ICP Socket, used to specify the properties of the socket.  
 * - Network Configuration: Configuration for the Networking of the Socket, used to identify the host of the socket to connect to, or serve.  
 * - TCP Interface Configuration: Configuration for the TCP Socket used to configure the TCP connection, if used.  
 * - Logger Configuration: Configuration for the logger of the Client/Server, used to configure the logger. A custom logger can be attached to the existing logger, which will override the built-in one. 
 * 
 * ----------------
 * 
 * **NOTES:**
 * 
 * - On the Network Configuration, the IPType and TLS are currently defined by the configuration system itself, however the code for manually setting them
 * 		was left commented out, in case it may be required at some point.  
 *
 * @summary Configuration file for all the ISP Services
 * @author Rafael Fernandes <rafaelfernandes660@gmail.com>
 * @module
 * 
 */

import os from "os"
import { z } from "zod"
import { schema as ConfigSchema, schema_partial_all as ConfigPartialPropertiesSchema } from "../schemas/zod/config"
import { Errors, ErrorTypes } from "../schemas/errors/errors"
import { BaseLogger } from "./logger"

export type ConfigPartialProperties = z.infer<typeof ConfigPartialPropertiesSchema>//Partial<z.infer<typeof ConfigSchemaAll>>
// type ConfigAll = {
// 	socket: Partial<z.infer<typeof ConfigSchema.socket>>,
// 	network: Partial<z.infer<typeof ConfigSchema.network>>,
// 	tcpInterface: Partial<z.infer<typeof ConfigSchema.tcpInterface>>,
// 	logger: Partial<z.infer<typeof ConfigSchema.logger>>
// }

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
 * IPC Configuration  
 * 
 * Common Configuration File for the IPC Services.  
 * Can be used both for Clients and Servers, however some options may be used only by one side and discarded by the other.  
 * 
 * ----------------
 * 
 * - Socket Configuration: Configuration for the ICP Socket, used to specify the properties of the socket.  
 * - Network Configuration: Configuration for the Networking of the Socket, used to identify the host of the socket to connect to, or serve.  
 * - TCP Interface Configuration: Configuration for the TCP Socket used to configure the TCP connection, if used.  
 * - Logger Configuration: Configuration for the logger of the Client/Server, used to configure the logger. A custom logger can be attached to the existing logger, which will override the built-in one. 
 * 
 * ----------------
 * 
 * **NOTES:**
 * 
 * - On the Network Configuration, the IPType and TLS are currently defined by the configuration system itself, however the code for manually setting them
 * 		was left commented out, in case it may be required at some point.  
 * 
 * @export
 * @class Configuration
 */
export class Configuration {
	#appspace: string
	#socket: z.infer<typeof ConfigSchema.socket>
	#network: z.infer<typeof ConfigSchema.network>
	#tcpInterface: z.infer<typeof ConfigSchema.tcpInterface>
	#logger: BaseLogger//z.infer<typeof ConfigSchema.logger>
	errors: ErrorTypes

	/**
	 * @property {string} id - The ID of this socket [DEFAULT: System Hostname]
	 * @property {string} root - The root of the Unix Socket (if used) [DEFAULT: "/tmp"]
	 * @property {boolean} raw - Whenever a raw Buffer should be sent instead of JSON objects [DEFAULT: false]
	 * @property {"ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "hex"} encoding - The encoding of the Buffer, if socket.raw is defined. Can take any of the following values: "ascii", "utf8", "utf16le", "ucs2", "base64", "hex" [DEFAULT: "utf8"]
	 * @property {string} delimiter - The delimiter at the end of each Packet [DEFAULT: "\f"]
	 * @property {boolean} allowAsync - Whenever the client can send concurrent requests [DEFAULT: true]
	 * @property {boolean} unlink - Whenever the Unix Socked will be deleted before starting up. If undefined, the user needs to delete it on it's own [DEFAULT: true]
	 * @property {number} retryTime - The time each client should wait before attempting to reconnect [DEFAULT: 500]
	 * @property {number} maxRetries - The maximum number of retries before the client kills the connection [DEFAULT: Infinity]
	 * @property {number} maxConnections - The maximum number of connections a socket can handle [DEFAULT: 100]
	 * @property {boolean} readableAll - Whenever the pipe should be readable by all services [DEFAULT: true]
	 * @property {boolean} writeableAll - Whenever the pipe should be writeable by all services [DEFAULT: true]
	 */
	socket: z.infer<typeof ConfigSchema.socket>

	/**
	 * @property {"IPv4" | "IPv6"} IPType - SYSTEM DEFINED | The IP Family of the system [DEFAULT: IPv4]
	 * @property {boolean} tls - SYSTEM DEFINED | If TLS should be used for the socket [DEFAULT: false]
	 * @property {string} host - The host of the socket [DEFAULT: localhost]
	 * @property {number} port - The port the socket should listen to [DEFAULT: 3000]
	 */
	network: z.infer<typeof ConfigSchema.network>

	/**
	 * @property {string | null} localAddress - The local address the socket should connect to [DEFAULT: null]
	 * @property {number | null} localPort - The local port the socket should connect to [DEFAULT: null]
	 * @property {number} family - The version of IP stack. Must be 4, 6, or 0. The value 0 indicates that both IPv4 and IPv6 addresses are allowed [DEFAULT: 0]
	 * @property {number[] | null} hints - Optional DNS lookup hints (ADDRCONFIG, V4MAPPED, ALL) [DEFAULT: Array<Empty>]
	 * @property {((args_0: string, args_1: (args_0: unknown, ...args_1: unknown[]) => void) => void) | ((args_0: string, args_1: {...;}, args_2: (args_0: unknown, ...args_1: unknown[]) => void) => void) | null} lookup - A custom DNS lookup function [DEFAULT: null]
	 */
	tcpInterface: z.infer<typeof ConfigSchema.tcpInterface>

	/**
	 * @property {boolean} enabled - Whenever the Logger is enabled [DEFAULT: true]
	 * @property {boolean} colors - Whenever the Logger should display colors [DEFAULT: true]
	 * @property {number} depth - The depth the Logger should expand objects [DEFAULT: 5]
	 * @property {((...args: unknown[]) => void) | null} logger - A custom logger function that will override the built-in logger [DEFAULT: null]
	 */
	logger: z.infer<typeof ConfigSchema.logger>

	constructor(config?: Configuration | ConfigPartialProperties) {
		this.#appspace = "app"  	// Reserved name for application messages [DEFAULT: "app"]
		
		this.#socket = {
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

		this.#network = {
			IPType: getIPType(),	// SYSTEM DEFINED | The IP Family of the system [DEFAULT: IPv4]
			tls: false,				// SYSTEM DEFINED | If TLS should be used for the socket [DEFAULT: false]
			host: "",				// The host of the socket [DEFAULT: localhost]
			port: 3000				// The port the socket should listen to [DEFAULT: 3000]
		}

		this.#tcpInterface = {		// TCP sockets only (https://nodejs.org/api/net.html#socketconnectoptions-connectlistener)
			localAddress: null,		// The local address the socket should connect to [DEFAULT: null]
			localPort: null,		// The local port the socket should connect to [DEFAULT: null]
			family: 0,				// The version of IP stack. Must be 4, 6, or 0. The value 0 indicates that both IPv4 and IPv6 addresses are allowed [DEFAULT: 0]
			hints: [],				// Optional DNS lookup hints (ADDRCONFIG, V4MAPPED, ALL) [DEFAULT: Array<Empty>]
			lookup: null 			// A custom DNS lookup function [DEFAULT: null]
		}

		this.#logger = new BaseLogger()

		this.errors = Errors//new ErrorFactory().errors

		/* istanbul ignore next */
		if (this.#network.IPType === "IPv4") this.#network.host = "127.0.0.1"; else this.#network.host = "::1";

		// Data accessors for Configuration properties
		// Used to intercept set operations to ensure correct type of a Configuration Property at all times

		this.socket = (() =>{
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const _this = this
			
			// eslint-disable-next-line @typescript-eslint/no-unused-vars

			const proxy = {
				get id() { return _this.#socket.id },
				set id(value) {
					_this.setSocketId(value)
				},
				get root() { return _this.#socket.root },
				set root(value) {
					_this.setSocketRoot(value)
				},
				get raw() { return _this.#socket.raw },
				set raw(value) {
					_this.setSocketIsRaw(value)
				},
				get encoding() { return _this.#socket.encoding },
				set encoding(value) {
					_this.setSocketEncoding(value)
				},
				get delimiter() { return _this.#socket.delimiter },
				set delimiter(value) {
					_this.setSocketDelimiter(value)
				},
				get allowAsync() { return _this.#socket.allowAsync },
				set allowAsync(value) {
					_this.setSocketAllowAsync(value)
				},
				get unlink() { return _this.#socket.unlink },
				set unlink(value) {
					_this.setSocketShouldUnlink(value)
				},
				get retryTime() { return _this.#socket.retryTime },
				set retryTime(value) {
					_this.setSocketRetryTime(value)
				},
				get maxRetries() { return _this.#socket.maxRetries },
				set maxRetries(value) {
					_this.setSocketMaxRetries(value)
				},
				get maxConnections() { return _this.#socket.maxConnections },
				set maxConnections(value) {
					_this.setSocketMaxConnections(value)
				},
				get readableAll() { return _this.#socket.readableAll },
				set readableAll(value) {
					_this.setSocketReadableAll(value)
				},
				get writeableAll() { return _this.#socket.writeableAll },
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
				get IPType() { return _this.#network.IPType },
				set IPType(value) {
					throw new _this.errors.ConfigurationError("invalid.config.network.IPType.set")
					//_this.setNetworkIPType(value)
				},
				get tls() { return _this.#network.tls },
				set tls(value) {
					throw new _this.errors.ConfigurationError("invalid.config.network.tls.set")
					//_this.setNetworkShouldUseTLS(value)
				},
				get host() { return _this.#network.host },
				set host(value) {
					_this.setNetworkHost(value)
				},
				get port() { return _this.#network.port },
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
				get localAddress() { return _this.#tcpInterface.localAddress },
				set localAddress(value) {
					_this.setTCPInterfaceLocalAddress(value)
				},
				get localPort() { return _this.#tcpInterface.localPort },
				set localPort(value) {
					_this.setTCPInterfaceLocalPort(value)
				},
				get family() { return _this.#tcpInterface.family },
				set family(value) {
					_this.setTCPInterfaceFamily(value)
				},
				get hints() { return _this.#tcpInterface.hints },
				set hints(value) {
					_this.setTCPInterfaceDNSHints(value)
				},
				get lookup() { return _this.#tcpInterface.lookup },
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
				get enabled() { return _this.#logger.enabled },
				set enabled(value) {
					_this.setIsLoggerEnabled(value)
				},
				get colors() { return _this.#logger.colors },
				set colors(value) {
					_this.setLoggerShouldUseColors(value)
				},
				get depth() { return _this.#logger.depth },
				set depth(value) {
					_this.setLoggerDepth(value)
				},
				get logger() { return _this.#logger.logger },
				set logger(value) {
					_this.setLoggerFunction(value)
				},
			}

			return proxy
		})()

		// Initialize properties from provided object, or migrate from another Configuration instance
		if (config) {
			if (config instanceof Configuration) {
				this.socket = config.socket
				this.network = config.network
				this.tcpInterface = config.tcpInterface
				this.logger = config.logger
			} else if (typeof(config) === "object") {
				const fields = ["socket", "network", "tcpInterface", "logger"] as const;

				/* istanbul ignore next */
				// eslint-disable-next-line no-inner-declarations
				function setField(this: Configuration, field: typeof fields[number], Config: ConfigPartialProperties) {
					const Field = this[field as keyof typeof this]
					if (!Field) throw new this.errors.ConfigurationError("config.unknown.property", ["Configuration", field])
					if (typeof(Field) !== "object" || (typeof(Field) === "object" && Field === null )) throw new this.errors.ConfigurationError("invalid.config.initializing.argument.field", [field, "Object", "at Configuration"])

					if (field in Config) {
						const ConfigField = Config[field]
						if (typeof(ConfigField) !== "object" || (typeof(ConfigField) === "object" && ConfigField === null )) throw new this.errors.ConfigurationError("invalid.config.initializing.argument.field", [field, "Object", "at Configuration Initializing Argument"])
							
						for (const prop in ConfigField) {
							const configProperty = ConfigField[prop as keyof typeof ConfigField]
							if (!(prop in Field)) throw new this.errors.ConfigurationError("config.unknown.property", ["Configuration", prop])

							Field[prop as keyof typeof Field] = configProperty
						}
					}
				}

				const isConfigValid = ConfigPartialPropertiesSchema.safeParse(config);

				if (isConfigValid.success) {
					for (const field of fields) {
						setField.apply(this, [field, config])
					}
				} else throw new this.errors.ConfigurationError("invalid.config.initializing.argument.type")	
			} else throw new this.errors.ConfigurationError("invalid.config.initializing.argument.type")
		}
	}
	
	/**
	 * Returns the Configuration's reserved Application-reserved namespace for IPC messages.
	 *
	 * @memberof Configuration
	 */
	get appspace() {
		return this.#appspace
	}

	/**
	 * Prevents modifying the appspace outside of the configuration.
	 *
	 * @memberof Configuration
	 */
	set appspace(value) {
		throw new this.errors.ConfigurationError("forbidden.property.system")
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
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketId(value: socketID): Configuration {
		const isValid = ConfigSchema.socket.shape.id.safeParse(value)

		if (isValid.success) {
			this.#socket.id = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.id.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Root
	 * 
	 * Socket Root: The root of the Unix Socket (if used) [DEFAULT: "/tmp"]
	 *
	 * @param {socketID} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketRoot(value: socketRoot): Configuration {
		const isValid = ConfigSchema.socket.shape.root.safeParse(value)

		if (isValid.success) {
			this.#socket.root = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.root.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Raw State
	 * 
	 * Socket Raw State: Whenever a raw Buffer should be sent instead of JSON objects [DEFAULT: false]
	 *
	 * @param {socketIsRaw} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketIsRaw(value: socketIsRaw): Configuration {
		const isValid = ConfigSchema.socket.shape.raw.safeParse(value)

		if (isValid.success) {
			this.#socket.raw = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.raw.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Encoding
	 * 
	 * Socket Encoding: The encoding of the Buffer, if socket.raw is defined. Can take any of the following values: "ascii", "utf8", "utf16le", "ucs2", "base64", "hex" [DEFAULT: "utf8"]
	 *
	 * @param {socketEncoding} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketEncoding(value: socketEncoding): Configuration {
		const isValid = ConfigSchema.socket.shape.encoding.safeParse(value)

		if (isValid.success) {
			this.#socket.encoding = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.encoding.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Delimiter
	 * 
	 * Socket Delimiter The delimiter at the end of each Packet [DEFAULT: "\f"]
	 *
	 * @param {socketDelimiter} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketDelimiter(value: socketDelimiter): Configuration {
		const isValid = ConfigSchema.socket.shape.delimiter.safeParse(value)

		if (isValid.success) {
			this.#socket.delimiter = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.delimiter.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Allow Async State
	 * 
	 * Socket Allow Async State: Whenever the client can send concurrent requests [DEFAULT: true]
	 *
	 * @param {socketAllowAsync} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketAllowAsync(value: socketAllowAsync): Configuration {
		const isValid = ConfigSchema.socket.shape.allowAsync.safeParse(value)

		if (isValid.success) {
			this.#socket.allowAsync = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.allowAsync.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Unlink State
	 * 
	 * Socket Unlink State: Whenever the Unix Socked will be deleted before starting up. If undefined, the user needs to delete it on it's own [DEFAULT: true]
	 *
	 * @param {socketUnlink} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketShouldUnlink(value: socketUnlink): Configuration {
		const isValid = ConfigSchema.socket.shape.unlink.safeParse(value)

		if (isValid.success) {
			this.#socket.unlink = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.unlink.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Retry Time
	 * 
	 * Socket Retry Time: The time each client should wait before attempting to reconnect [DEFAULT: 500]
	 *
	 * @param {socketRetryTime} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketRetryTime(value: socketRetryTime): Configuration {
		const isValid = ConfigSchema.socket.shape.retryTime.safeParse(value)

		if (isValid.success) {
			this.#socket.retryTime = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.retryTime.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Maximum Retries
	 * 
	 * Socket Maximum Retries: The maximum number of retries before the client kills the connection [DEFAULT: Infinity]
	 *
	 * @param {socketMaxRetries} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketMaxRetries(value: socketMaxRetries): Configuration {
		const isValid = ConfigSchema.socket.shape.maxRetries.safeParse(value)

		if (isValid.success) {
			this.#socket.maxRetries = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.maxRetries.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Maximum Concurrent Connections
	 * 
	 * Socket Maximum Concurrent Connections: The maximum number of connections a socket can handle [DEFAULT: 100]
	 *
	 * @param {socketMaxConnections} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketMaxConnections(value: socketMaxConnections): Configuration {
		const isValid = ConfigSchema.socket.shape.maxConnections.safeParse(value)

		if (isValid.success) {
			this.#socket.maxConnections = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.maxConnections.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Readable All State
	 * 
	 * Socket Readable All State: Whenever the pipe should be readable by all services [DEFAULT: true]
	 *
	 * @param {socketReadableAll} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketReadableAll(value: socketReadableAll): Configuration {
		const isValid = ConfigSchema.socket.shape.readableAll.safeParse(value)

		if (isValid.success) {
			this.#socket.readableAll = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.readableAll.type")
		}
	}

	/**
	 * Setter for the Configuration's Socket Writeable All State
	 * 
	 * Socket Writeable All State: Whenever the pipe should be writeable by all services [DEFAULT: true]
	 *
	 * @param {socketWriteableAll} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setSocketWriteableAll(value: socketWriteableAll): Configuration {
		const isValid = ConfigSchema.socket.shape.writeableAll.safeParse(value)

		if (isValid.success) {
			this.#socket.writeableAll = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.socket.writeableAll.type")
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
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setNetworkHost(value: networkHost): Configuration {
		const isValid = ConfigSchema.network.shape.host.safeParse(value)

		if (isValid.success) {
			this.#network.host = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.network.host.type")
		}
	}

	/**
	 * Setter for the Configuration's Network Port
	 * 
	 * Network Port: The port the socket should listen to [DEFAULT: 3000]
	 *
	 * @param {networkPort} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setNetworkPort(value: networkPort): Configuration {
		const isValid = ConfigSchema.network.shape.port.safeParse(value)

		if (isValid.success) {
			this.#network.port = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.network.port.type")
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
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceLocalAddress(value: tcpInterfaceLocalAddress): Configuration {
		const isValid = ConfigSchema.tcpInterface.shape.localAddress.safeParse(value)

		if (isValid.success) {
			this.#tcpInterface.localAddress = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.tcpInterface.localAddress.type")
		}
	}

	/**
	 * Setter for the Configuration's TCP Interface's Local Port
	 * 
	 * TCP Interface's Local Port: The local port the socket should connect to [DEFAULT: null]
	 *
	 * @param {tcpInterfaceLocalPort} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceLocalPort(value: tcpInterfaceLocalPort): Configuration {
		const isValid = ConfigSchema.tcpInterface.shape.localPort.safeParse(value)

		if (isValid.success) {
			this.#tcpInterface.localPort = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.tcpInterface.localPort.type")
		}
	}

	/**
	 * Setter for the Configuration's TCP Interface's Family
	 * 
	 * TCP Interface's Family: The version of IP stack. Must be 4, 6, or 0. The value 0 indicates that both IPv4 and IPv6 addresses are allowed [DEFAULT: 0]
	 *
	 * @param {tcpInterfaceFamily} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceFamily(value: tcpInterfaceFamily): Configuration {
		const isValid = ConfigSchema.tcpInterface.shape.family.safeParse(value)

		if (isValid.success) {
			this.#tcpInterface.family = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.tcpInterface.family.type")
		}
	}

	/**
	 * Setter for the Configuration's TCP Interface's DNS Hints
	 * 
	 * TCP Interface's DNS Hints: Optional DNS lookup hints (ADDRCONFIG, V4MAPPED, ALL) [DEFAULT: Array<Empty>]
	 *
	 * @param {tcpInterfaceDNSHints} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceDNSHints(value: tcpInterfaceDNSHints): Configuration {
		const isValid = ConfigSchema.tcpInterface.shape.hints.safeParse(value)

		if (isValid.success) {
			this.#tcpInterface.hints = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.tcpInterface.hints.type")
		}
	}

	/**
	 * Setter for the Configuration's TCP Interface's DNS Lookup
	 * 
	 * TCP Interface's DNS Lookup: A custom DNS lookup function [DEFAULT: null]
	 *
	 * @param {socketID} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setTCPInterfaceDNSLookup(value: tcpInterfaceDNSLookup): Configuration {
		const isValid = ConfigSchema.tcpInterface.shape.lookup.safeParse(value)

		if (isValid.success) {
			this.#tcpInterface.lookup = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.tcpInterface.lookup.type")
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
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setIsLoggerEnabled(value: IsLoggerEnabled): Configuration {
		const isValid = ConfigSchema.logger.shape.enabled.safeParse(value)

		if (isValid.success) {
			this.#logger.enabled = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.logger.enabled.type")
		}
	}

	/**
	 * Setter for the Configuration's Logger Color State
	 * 
	 * Logger Color State: Whenever the Logger should display colors [DEFAULT: true]
	 *
	 * @param {loggerShouldUseColors} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setLoggerShouldUseColors(value: loggerShouldUseColors): Configuration {
		const isValid = ConfigSchema.logger.shape.colors.safeParse(value)

		if (isValid.success) {
			this.#logger.colors = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.logger.colors.type")
		}
	}

	/**
	 * Setter for the Configuration's Logger Depth
	 * 
	 * Logger Depth: The depth the Logger should expand objects [DEFAULT: 5]
	 *
	 * @param {loggerDepth} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setLoggerDepth(value: loggerDepth): Configuration {
		const isValid = ConfigSchema.logger.shape.depth.safeParse(value)

		if (isValid.success) {
			this.#logger.depth = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.logger.depth.type")
		}
	}

	/**
	 * Setter for the Configuration's Logger Function
	 * 
	 * Logger Function: A custom logger function that will override the built-in logger [DEFAULT: null]
	 *
	 * @param {loggerFunctionOverride} value
	 * @return {Configuration} The Configuration instance, to allow method chaining
	 * @memberof Config
	 */
	setLoggerFunction(value: loggerFunctionOverride): Configuration {
		const isValid = ConfigSchema.logger.shape.logger.safeParse(value)

		if (isValid.success) {
			this.#logger.logger = value
			return this
		} else {
			throw new this.errors.ConfigurationError("invalid.config.logger.logger.type")
		}
	}
}

function getIPType() {
	const netInt = os.networkInterfaces()
	return (Object.values(netInt)[0] || [{}])[0]?.family || "IPv4"
}

// export {
// 	Configuration as Config
// }