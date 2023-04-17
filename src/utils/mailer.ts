import nodemailer from "nodemailer";

export async function sendLoginEmail(email: string, data: any) {
  console.log("EMAIL:::", email);
  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.com",
    port: 587,
    secure: false,
    // service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER, // sender address
    to: email, // list of receivers
    subject: `Contact us`, // Subject line
    text: "Contact us", // plain text body
    html: `
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact</title>
     <style>
        /* Reset some default styles */
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        /* Container for the email content */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f8f8;
        }

        /* Heading styles */
        h1 {
            font-size: 24px;
            color: #333;
            margin: 0;
        }

        /* Paragraph styles */
        p {
            font-size: 16px;
            color: #555;
            margin-bottom: 10px;
        }

        /* Divider styles */
        .divider {
            height: 1px;
            background-color: #ddd;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        /* Signature styles */
        .signature {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Email Subject</h1>
        <p><strong>Name:</strong> ${data?.name}</p>
        <p><strong>Email:</strong> ${data?.email}</p>
        <div class="divider"></div>
        <p><strong>Message:</strong> ${data?.message}</p>
        <div class="divider"></div>

        <p>Thank you for your message.</p>
        <p>If you have any further questions or concerns, please feel free to contact us.</p>
        <div class="divider"></div>
        <p class="signature">Best regards,<br>Xolton Team</p>
    </div>
</body>
</html>    `, // html body
  });

  return info;
}
