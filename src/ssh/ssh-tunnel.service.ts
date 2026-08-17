
import { Injectable, Logger } from "@nestjs/common";
import { Client } from 'ssh2';
import * as net from 'net';

@Injectable()
export class SshTunnelService {
    private readonly logger = new Logger(SshTunnelService.name);
    private ready: boolean = false;


    async createTunnel(): Promise<void> {
        if (this.ready) return;
        this.logger.log('Establishing SSH tunnel...');
        const connection = new Client();
        await new Promise<void>((resolve, reject) => {
            connection
                .on('ready', () => {
                    this.logger.log('SSH connection ready');
                    net
                        .createServer((socket) => {
                            connection.forwardOut(
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
                                }
                            )
                        }).listen(Number(process.env.DB_PORT), '127.0.0.1', () => {
                            this.ready = true;
                            resolve();
                        })
                })                .on('error', (err) => {
                    this.logger.error('SSH tunnel error', err.message);
                    reject(err);
                })
                .connect({
                    host: process.env.SSH_HOST,
                    port: 22,
                    username: process.env.SSH_USER,
                    password: process.env.SSH_PASS
                })
        })
    }


}
