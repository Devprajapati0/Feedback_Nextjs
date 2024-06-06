import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

resend.domains.create({ name: 'devheinji@gmail.com' });