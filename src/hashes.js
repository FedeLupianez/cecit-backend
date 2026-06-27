const argon2 = require("argon2");

const accounts = [
    {
        email: "admin@socios.com",
        password: "admin123",
    },
    {
        email: "burger@partner.com",
        password: "burger123",
    },
    {
        email: "cine@partner.com",
        password: "cine123",
    },
    {
        email: "gym@partner.com",
        password: "gym123",
    },
];

(async () => {
    console.log("=== HASHES ===\n");

    for (const account of accounts) {
        const hash = await argon2.hash(account.password);

        console.log(`${account.email}`);
        console.log(`Password: ${account.password}`);
        console.log(`Hash: ${hash}`);
        console.log();
    }
})();
