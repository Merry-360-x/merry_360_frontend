/**
 * Logger utility with environment-based filtering
 * 
 * Usage:
 *   import { logger } from '@/utils/logger'
 *   logger.log('Debug message')      // Only in development
 *   logger.warn('Warning message')   // Only in development  
 *   logger.error('Error message')    // Always logged
 *   logger.debug('Detailed debug')   // Only in development
 */

const isDev = import.meta.env.DEV
const isDebugMode = import.meta.env.VITE_DEBUG === 'true'

// Noop function for production
const noop = () => {}

// Format log prefix with timestamp
const formatPrefix = (level) => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8)
  return `[${timestamp}] [${level}]`
}

export const logger = {
  /**
   * General logging - only in development
   */
  log: isDev 
    ? (...args) => console.log(formatPrefix('LOG'), ...args)
    : noop,
  
  /**
   * Warning messages - only in development
   */
  warn: isDev
    ? (...args) => console.warn(formatPrefix('WARN'), ...args)
    : noop,
  
  /**
   * Error messages - ALWAYS logged (critical for debugging production issues)
   */
  error: (...args) => console.error(formatPrefix('ERROR'), ...args),
  
  /**
   * Debug messages - only in development with explicit debug flag
   */
  debug: (isDev && isDebugMode)
    ? (...args) => console.debug(formatPrefix('DEBUG'), ...args)
    : noop,
  
  /**
   * Info messages - only in development
   */
  info: isDev
    ? (...args) => console.info(formatPrefix('INFO'), ...args)
    : noop,
  
  /**
   * Group related logs together - only in development
   */
  group: isDev
    ? (label) => console.group(formatPrefix('GROUP'), label)
    : noop,
  
  groupEnd: isDev
    ? () => console.groupEnd()
    : noop,
  
  /**
   * Performance timing - only in development
   */
  time: isDev
    ? (label) => console.time(label)
    : noop,
  
  timeEnd: isDev
    ? (label) => console.timeEnd(label)
    : noop,
  
  /**
   * Table display for objects/arrays - only in development
   */
  table: isDev
    ? (data) => console.table(data)
    : noop
}

export default logger
