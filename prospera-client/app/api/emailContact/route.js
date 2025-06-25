import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();
    console.log("name: "+name);
    console.log("email: "+email);
    console.log("message: "+message);
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_PROVIDER || "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      // from: `"${name}" <${process.env.SMTP_USER}>`,
      from: process.env.SMTP_USER,
      to: "tandel.brunoi.ca@gmail.com",
      subject: "New Contact Message from Prospera",
      text: "Test static message",
      html: `<p><strong>From:</strong> ${name}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
    // console.error("Email sending error:", error);
    // return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}