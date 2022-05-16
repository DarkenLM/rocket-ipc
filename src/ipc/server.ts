/**
 * Copyright (c) 2022
 *
 * Base Server Class for the IPC Protocol Server.  
 * Defines the base properties, common to all Servers, to ensure consistency inbetween them.
 * 
 * @summary Base Server Class for the IPC Protocol Server
 * @author Rafael Fernandes <rafaelfernandes660@gmail.com>
 * @module
 * 
 */

import { ConfigPartialProperties, Configuration } from "./helpers/config"

/**
 * Base Server Class for the IPC Protocol Server.  
 * Defines the base properties, common to all Servers, to ensure consistency inbetween them.
 * 
 * @export
 * @class BaseServer
 * 
 */
class BaseServer {
	server: null
	config: Configuration
	constructor(config: ConfigPartialProperties) {
		this.server = null
		this.config = new Configuration(config)
	}
}

export {
	BaseServer
}