/**
 * IPC Packet
 * Handles the communication paload between Processes
 */

class BasePacket {
	payload: object
	constructor() {
		this.payload = {}
	}
}

export {
	BasePacket
}