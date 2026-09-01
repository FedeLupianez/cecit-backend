import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'ssh2';
import * as net from 'net';

@Injectable()
export class SshTunnelService {
    private readonly logger = new Logger(SshTunnelService.name);
    private ready: boolean = false;
    private connection: Client | null = null;
    private server: net.Server | null = null;

    async createTunnel(): Promise<void> {
        if (this.ready) return;
        if (process.env.DB_MODE === 'local') {
            this.logger.log(
                'DB_HOST is localhost, skipping SSH tunnel (local database)',
            );
            this.ready = true;
            return;
        }
        this.logger.log('Establishing SSH tunnel...');

        this.connection = new Client();
        await new Promise<void>((resolve, reject) => {
            this.connection!.on('ready', () => {
                this.logger.log('SSH connection ready');
                this.server = net
                    .createServer((socket) => {
                        this.connection!.forwardOut(
                            socket.remoteAddress || '127.0.0.1',
                            socket.remotePort || 0,
                            '127.0.0.1',
                            3306,
                            (err, stream) => {
                                if (err) {
                                    socket.destroy();
                                    return;
                                }
                                socket.pipe(stream);
                                stream.pipe(socket);
                            },
                        );
                    })
                    .listen(Number(process.env.DB_PORT), '127.0.0.1', () => {
                        this.ready = true;
                        resolve();
                    });
            })
                .on('error', (err) => {
                    this.logger.error('SSH tunnel error', err.message);
                    this.ready = false;
                    this.scheduleReconnect();
                    reject(err);
                })
                .on('close', () => {
                    this.logger.warn('SSH connection closed, attempting reconnect...');
                    this.ready = false;
                    this.scheduleReconnect();
                })
                .connect({
                    host: process.env.SSH_HOST,
                    port: 22,
                    username: process.env.SSH_USER,
                    password: process.env.SSH_PASS,
                });
        });
    }

    private scheduleReconnect(): void {
        this.logger.log('Reconnecting in 5 seconds...');
        setTimeout(() => {
            this.createTunnel().catch(() => { });
        }, 5000);
    }
}
