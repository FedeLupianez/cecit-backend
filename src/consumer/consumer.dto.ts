
export interface Consumer {
    id_consumer: string;
    email: string;
    password: string;
    id_partner?: string;
    dni?: string;
    name?: string;
    lastname?: string;
}

export interface ConsumerGet {
    id_consumer?: string;
    email?: string;
}
