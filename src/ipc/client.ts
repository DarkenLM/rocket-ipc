/**
 * IPC Client
 * Controls the client for any IPC transaction
 */

class BaseClient {
	client: null
	constructor() {
		this.client = null
	}
}

export {
	BaseClient as BaseServer
}