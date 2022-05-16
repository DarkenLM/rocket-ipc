import { createHash } from "crypto";
import * as chai from "chai"
import sinon from "sinon"

export function generateRandomHash() {
	const hash = createHash("sha256").update(String(Date.now())).digest("base64url")
	return hash
}

export {
	chai,
	sinon
}