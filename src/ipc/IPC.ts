/**
 * Copyright (c) 2022
 *
 * Compendium file for the IPC Services
 * Contains all exposed IPC interfaces from this package
 *
 * @summary Compendium file for the IPC Services
 * @author Rafael Fernandes <rafaelfernandes660@gmail.com>
 *
 * @module
 */

/**
 * Copyright (c) 2022
 *
 * Error Factory
 * Generates custom errors used throughout the IPC Services
 *
 * @summary Error Factory
 * @author Rafael Fernandes <rafaelfernandes660@gmail.com>
 * 
 * @module
 *
 */
export * as Errors from "./schemas/errors/errors"
export * as Localization from "./schemas/codes/message-codes"
export { Configuration } from "./helpers/config"
export { BaseLogger } from "./helpers/logger"