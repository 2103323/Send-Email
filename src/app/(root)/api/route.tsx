import { NextResponse,NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

// Assuming these types are correct; adjust as necessary.
interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export async function POST(request: NextRequest) {
    const username = process.env.NEXT_PUBLIC_BURNER_USERNAME;
    const password = process.env.NEXT_PUBLIC_BURNER_PASSWORD;
    const myEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL || '';

    console.log('dealing with request');
    const formData = await request.formData();
    const email = formData.get('email');
    const message = formData.get('message');

    // Create transporter object
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false, // true for 465, false for other ports
        auth: {
            user:  username as string, // Use environment variable or secure storage for credentials
            pass: password as string,
        },
    });

    try {
        const mailOptions: MailOptions = {
            from:  myEmail as string, // Use the email from environment variables
            to: email as string, // Type assertion since formData.get() can return FormDataEntryValue or null
            subject: `Website activity from ${email}`,
            html: `
                <p>Message: ${message} </p>
            `,
        };

        const mail = await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Success: email was sent' });
    } catch (error) {
        console.error(error);
        return new NextResponse('COULD NOT SEND MESSAGE', { status: 500 });
    }
}