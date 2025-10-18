import { getBaseTemplate, sendMail } from "./mail.js";


const content = `<div class="email-body"><p>Hello, this is a test email!</p></div>`;

sendMail({
    to: "ahamedmaajid87@gmail.com",
    subject: "Test Email via Brevo",
    text: "Hello, this is a test email!",
    html: getBaseTemplate(content, "Preview text here")
});