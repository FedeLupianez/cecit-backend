import { randomUUID } from 'node:crypto';
import { Params } from 'nestjs-pino';

export function createLoggerConfig(): Params {
    return {
        pinoHttp: {
            level: process.env.LOG_LEVEL ?? 'debug',

            genReqId: (req) => {
                return req.headers['x-request-id']?.toString() ?? randomUUID();
            },

            customProps: (req) => ({
                request_id: req.id,
            }),

            customAttributeKeys: {
                responseTime: 'response_time',
            },

            customSuccessMessage: (req, res) => {
                return `${req.method} ${req.url}`;
            },

            customErrorMessage: (req, res, error) => {
                return `${req.method} ${req.url} ${error.message}`;
            },

            redact: {
                paths: [
                    'req.headers.authorization',
                    'req.headers.cookie',
                    'req.body.password',
                    'req.body.refreshToken',
                    'req.body.accessToken',
                    'password',
                    'refreshToken',
                    'accessToken',
                ],
                censor: '[REDACTED]',
            },

            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss.l',

                    messageFormat:
                        '[ {context} ] {msg} request_id={request_id} response_time={responseTime}',

                    ignore: 'pid,hostname',
                },
            },
        },
    };
}
