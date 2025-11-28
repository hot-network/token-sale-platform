
// A simple structured logger service for client and server-side logging.

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const log = (level: LogLevel, context: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logObject = {
        timestamp,
        level,
        context,
        message,
        ...(data && { data })
    };
    
    // In a real app, this could be sent to a logging service like Sentry, LogRocket, or Datadog.
    // For now, we'll use console logging.
    console.log(`[${level}] [${timestamp}] [${context}] ${message}`, data ? data : '');
};

export const logger = {
    info: (context: string, message: string, data?: any) => log('INFO', context, message, data),
    warn: (context: string, message: string, data?: any) => log('WARN', context, message, data),
    error: (context: string, message: string, data?: any) => log('ERROR', context, message, data),
    debug: (context: string, message: string, data?: any) => log('DEBUG', context, message, data),
};
