/**
 * Copyright (c) 2022
 *
 * Message Code interface for Rocket IPC
 *
 * @summary Message Code interface for Rocket IPC
 * @author Rafael Fernandes <rafaelfernandes660@gmail.com>
 *
 * Created at     : 2022-03-29 21:39:52
 * Last modified  : 2022-04-12 14:32:10
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";

type GenericObject = { [key: string]: any };
type messageField = { [key: string]: string | messageField }
const ZodLocale: z.ZodSchema<messageField> = z.lazy(() =>
	z.record(z.union([z.string(), ZodLocale]))
);

export const ZodLocaleSchema = z.object({
	messages: ZodLocale,
});

export type Locale = z.infer<typeof ZodLocaleSchema>

/**
 * Fetcher for Message Codes
 * Uses fs.readFileSync to fetch the JSON data from the message codes file due to limits on ES6 modules caching
 *
 * @export
 * @return {Locale} Message Codes
 */
export function getMessageCodes(): Locale {
	try {
		const filePath = join(__dirname, "./messages.json")

		/* istanbul ignore next */
		if (!filePath) throw new Error("Unable to get Message Codes: Could not access the Message Codes file path")

		const fileData = readFileSync(filePath, "utf-8")
		const jsonData: Locale = JSON.parse(fileData)
		const isValid = ZodLocaleSchema.safeParse(jsonData)

		/* istanbul ignore else */
		if (isValid.success) {
			return jsonData
		} else {
			throw isValid.error.format()._errors[0]
		}
	} catch (e) /* istanbul ignore next */ {
		let err = "Unknown error"

		if (e instanceof Error) err = e.message
		else if (typeof e === "string") err = e

		throw new Error(err)
	}
}

/**
 * Flattener for Message Codes
 * Returns an one-level object with message codes as strings
 * 
 * Ex.:
 * ```json
 * {
 *   "messages": {
 *     "errors": {
 *       "sample": {
 *         "error": "Sample error message"
 *       }
 *     }
 *   }
 * }
 * ```
 * 
 * will become
 * ```json
 * {
 *   "messages": {
 *     "errors": {
 *       "sample.error": "Sample error message"
 *     }
 *   }
 * }
 * ```
 * 
 * @export
 * @return {Locale} a flattened list of Message Codes
 */
export function getFlattenMessageCodes(): Locale {
	const flattenObj = (obj: messageField | string) => {
		const result: GenericObject = {};

		/* istanbul ignore else */
		if (typeof (obj) === "object") {
			for (const i in obj) {
				if ((typeof obj[i]) === "object" && !Array.isArray(obj[i])) {
					const temp = flattenObj(obj[i]);

					for (const j in temp) {
						result[i + "." + j as keyof typeof obj] = temp[j];
					}
				} else {
					result[i as keyof typeof obj] = obj[i as keyof typeof obj];
				}
			}
			return result;
		} else return { null: obj } // Added to make Typescript happy
	};

	const obj = getMessageCodes()
	const is_messageField = (x: any): x is messageField => ZodLocale.safeParse(x).success
	
	if (typeof(obj.messages) == "object") {
		for (const cat in obj.messages) {
			obj.messages[cat] = is_messageField(obj.messages[cat]) ? flattenObj(obj.messages[cat]) : obj.messages[cat]
		}
	}

	return obj
	// return flattenObject(obj)
}