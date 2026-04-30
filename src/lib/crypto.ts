import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your_secret_password';

export function generateSignature(data: any) {
    return crypto
        .createHmac('sha256', ADMIN_SECRET)
        .update(JSON.stringify(data))
        .digest('hex');
}
