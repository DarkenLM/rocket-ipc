/**
 * Copyright (c) 2022
 *
 * Property Schema for the Configuration Class
 * Ensures the correct types of values are used on the config at all times.
 * 
 * Socket Configuration: Configuration for the ICP Socket, used to specify the properties of the socket.
 * Network Configuration: Configuration for the Networking of the Socket, used to identify the host of the socket to connect to, or serve.
 * TCP Interface Configuration: Configuration for the TCP Socket used to configure the TCP connection, if used.
 * Logger Configuration: Configuration for the logger of the Client/Server, used to configure the logger. A custom logger can be attached to the existing logger, which will override the built-in one.
 *
 * @summary Property Schema for the Configuration Class
 * @author Rafael Fernandes <rafaelfernandes660@gmail.com>
 *
 * Created at     : 2022-03-23 11:57:34
 * Last modified  : 2022-04-12 11:08:20
 */

import { z } from "zod"

const _schema = {
	tcpInterface: {
		lookup: generateLookupTypes()
	}
}

const schema = {
	socket: z.object({
		id: z.string({
			invalid_type_error: "Paramether must be a string value",
		}),
		root: z.string({
			invalid_type_error: "Paramether must be a string value",
		}),
		raw: z.boolean({
			invalid_type_error: "Paramether must be a boolean value",
		}),
		encoding: z.union([
			z.literal("ascii"), 
			z.literal("utf8"), 
			z.literal("utf16le"), 
			z.literal("ucs2"), 
			z.literal("base64"), 
			z.literal("hex")
		],
		{
			invalid_type_error: "Paramether must be one of the following: \"ascii\", \"utf8\", \"utf16le\", \"ucs2\", \"base64\", \"hex\"",
		}),
		delimiter: z.string({
			invalid_type_error: "Paramether must be a string value",
		}),
		allowAsync: z.boolean({
			invalid_type_error: "Paramether must be a boolean value",
		}),
		unlink: z.boolean({
			invalid_type_error: "Paramether must be a boolean value",
		}),
		retryTime: z.number({
			invalid_type_error: "Paramether must be a numeric value",
		}),
		maxRetries: z.number({
			invalid_type_error: "Paramether must be a numeric value",
		}),
		maxConnections: z.number({
			invalid_type_error: "Paramether must be a numeric value",
		}),
		readableAll: z.boolean({
			invalid_type_error: "Paramether must be a boolean value",
		}),
		writeableAll: z.boolean({
			invalid_type_error: "Paramether must be a boolean value",
		})
	}),
	network: z.object({
		IPType: z.union([
			z.literal("IPv4"), 
			z.literal("IPv6")
		],
		{
			invalid_type_error: "Paramether must be one of the following: \"IPv4\", \"IPv6\"",
		}),
		tls: z.boolean({
			invalid_type_error: "Paramether must be a boolean value",
		}),
		host: z.string({
			invalid_type_error: "Paramether must be a string value",
		}),
		port: z.number({
			invalid_type_error: "Paramether must be a numeric value",
		})
	}),
	tcpInterface: z.object({
		localAddress: z.string({
			invalid_type_error: "Paramether must be a string value",
		}).nullable(),
		localPort: z.number({
			invalid_type_error: "Paramether must be a number value",
		}).nullable(),
		family: z.number({
			invalid_type_error: "Paramether must be a numeric value",
		}).refine((num: number) => [0, 4, 6].includes(num)).default(0),
		hints: z.number({
			invalid_type_error: "Paramether must be a numeric value",
		}).array().nullable(),
		lookup: _schema.tcpInterface.lookup.schema
	}),
	logger: z.object({
		enabled: z.boolean({
			invalid_type_error: "Paramether must be a boolean value",
		}),
		colors: z.boolean({
			invalid_type_error: "Paramether must be a boolean value",
		}),
		depth: z.number({
			invalid_type_error: "Paramether must be a numeric value",
		}),
		logger: z.union([
			z.null(),
			z.function().returns(z.void())
		])
	})
}

export {
	schema,
	_schema
}

export type IDNSLookupCallback = z.infer<typeof _schema.tcpInterface.lookup.types.callback>
export type IDNSLookupOptions = z.infer<typeof _schema.tcpInterface.lookup.types.options>

// Helpers

function generateLookupTypes() {
	const allowedFamilyNumbers = [0, 4, 6];
	/* istanbul ignore next */
	const family = z
		.number()
		.refine((num: number) => allowedFamilyNumbers.includes(num))
		.default(0)
		.optional();
	const options = z.object({
		family,
		hints: z.number().optional(),
		all: z.boolean().optional(),
		verbatim: z.boolean().optional()
	});

	const errorArg = z.instanceof(Error);
	const address = z.string();
	const callbackArgs = z.union([
		errorArg.or(z.null()),
		address.nullable(),
		family.nullable(),
		z.unknown()
	]);

	const callbackFnSchema = z.function().args(callbackArgs).returns(z.void());

	// Final schema

	const fnTypeWithOptn = z.function(z.tuple([
		z.string(),
		options,
		callbackFnSchema
	])).returns(z.void())

	const fnTypeNoOptn = z.function(z.tuple([
		z.string(),
		callbackFnSchema
	])).returns(z.void())

	const schemaType = z.union([
		z.null(),
		fnTypeNoOptn,
		fnTypeWithOptn
	])


	return {
		schema: schemaType,
		types: {
			options,
			callback: callbackFnSchema
		}
	}
}