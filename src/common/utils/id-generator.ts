import { randomBytes } from 'crypto';
import { ObjectLiteral, Repository } from 'typeorm';

function generateHex(length: number): string {
    return randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)
        .toUpperCase();
}

export async function generateUniqueId<T extends ObjectLiteral>(
    repo: Repository<T>,
    columnName: string,
): Promise<string> {
    let exists = true;
    let id = '';
    while (exists) {
        id = generateHex(4);
        const count = await repo
            .createQueryBuilder('t')
            .where(`t.${columnName} = :id`, { id })
            .getCount();
        exists = count > 0;
    }
    return id;
}

export async function generateUniqueToken<T extends ObjectLiteral>(
    repo: Repository<T>,
    columnName: string,
): Promise<string> {
    let exists = true;
    let token = '';
    while (exists) {
        token = generateHex(6);
        const count = await repo
            .createQueryBuilder('t')
            .where(`t.${columnName} = :token`, { token })
            .getCount();
        exists = count > 0;
    }
    return token;
}
