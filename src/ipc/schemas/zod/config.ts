/* eslint-disable @typescript-eslint/no-explicit-any */
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
	}).strict(),
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
	}).strict(),
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
	}).strict(),
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
	}).strict()
}

const schema_partial = {
	socket: schema.socket.partial(),
	network: schema.network.partial(),
	tcpInterface: schema.tcpInterface.partial(),
	logger: schema.logger.partial()
}

//const eeee = Object.keys(schema).map(key => { return {key, value: schema[key as keyof typeof schema].partial()} }).reduce((prev, curr) => ({ ...prev, [curr.key]: curr.value}), {})
//const newobj = merge(...eeee)//Object.assign({}, ...eeee)

// const eeee = Object.keys(schema).map(key => { return {[key]: schema[key as keyof typeof schema].partial()} })
// //const newobj = merge(...eeee)
// // @ts-expect-error eeeee
// const newobj2 = extend(...eeee)

// console.log(newobj2)

export const schema_all = z.object(schema).strict()
export const schema_partial_all = schema_all.deepPartial().strict()//z.object(schema_partial).partial()
//export const schema_all_partial = z.object(newobj2).partial()
//export const schema_all_partial = z.object(eeee).partial()

//type test = z.infer<typeof schema_all_partial>

export {
	schema,
	schema_partial,
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

// Complex Type (Merge)

// type Primitive = string | number | boolean | bigint | symbol | null | undefined;
// type Expand<T> = T extends Primitive ? T : { [K in keyof T]: T[K] };

// type OptionalKeys<T> = {
// 	[K in keyof T]-?: T extends Record<K, T[K]> ? never : K;
// }[keyof T];

// type RequiredKeys<T> = {
// 	[K in keyof T]-?: T extends Record<K, T[K]> ? K : never;
// }[keyof T] &
// 	keyof T;

// type RequiredMergeKeys<T, U> = RequiredKeys<T> & RequiredKeys<U>;

// type OptionalMergeKeys<T, U> =
// 	| OptionalKeys<T>
// 	| OptionalKeys<U>
// 	| Exclude<RequiredKeys<T>, RequiredKeys<U>>
// 	| Exclude<RequiredKeys<U>, RequiredKeys<T>>;

// type MergeNonUnionObjects<T, U> = Expand<
// 	{
// 		[K in RequiredMergeKeys<T, U>]: Expand<Merge<T[K], U[K]>>;
// 	} & {
// 		[K in OptionalMergeKeys<T, U>]?: K extends keyof T
// 			? K extends keyof U
// 				? Expand<Merge<
// 					Exclude<T[K], undefined>,
// 					Exclude<U[K], undefined>
// 				>>
// 				: T[K]
// 			: K extends keyof U
// 			? U[K]
// 			: never;
// 	}
// >;

// type MergeNonUnionArrays<T extends readonly any[], U extends readonly any[]> = Array<Expand<Merge<T[number], U[number]>>>

// type MergeArrays<T extends readonly any[], U extends readonly any[]> = [T] extends [never]
// 	? U extends any
// 		? MergeNonUnionArrays<T, U>
// 		: never
// 	: [U] extends [never]
// 	? T extends any
// 		? MergeNonUnionArrays<T, U>
// 		: never
// 	: T extends any
// 	? U extends any
// 		? MergeNonUnionArrays<T, U>
// 		: never
// 	: never;

// type MergeObjects<T, U> = [T] extends [never]
// 	? U extends any
// 		? MergeNonUnionObjects<T, U>
// 		: never
// 	: [U] extends [never]
// 	? T extends any
// 		? MergeNonUnionObjects<T, U>
// 		: never
// 	: T extends any
// 	? U extends any
// 		? MergeNonUnionObjects<T, U>
// 		: never
// 	: never;

// export type Merge<T, U> =
// 	| Extract<T | U, Primitive>
// 	| MergeArrays<Extract<T, readonly any[]>, Extract<U, readonly any[]>>
// 	| MergeObjects<Exclude<T, Primitive | readonly any[]>, Exclude<U, Primitive | readonly any[]>>;

// export type complexObjectType<T, U> = Merge<T, U>





// type OptionalPropertyNames<T> =
//   { [K in keyof T]-?: (Record<string, unknown> extends { [P in K]: T[K] } ? K : never) }[keyof T];

// type SpreadProperties<L, R, K extends keyof L & keyof R> =
//   { [P in K]: L[P] | Exclude<R[P], undefined> };

// type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

// type SpreadTwo<L, R> = Id<
//   & Pick<L, Exclude<keyof L, keyof R>>
//   & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
//   & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
//   & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
// >;

// type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ? SpreadTwo<L, Spread<R>> : unknown

// function merge<A extends object[]>(...a: [...A]) {
// 	return Object.assign({}, ...a) as Spread<A>;
// }