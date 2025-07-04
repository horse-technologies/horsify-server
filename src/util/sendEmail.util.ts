import nodemailer from "nodemailer";

const sendEmail = async (email: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    // port: 587,
    // secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter
    .sendMail({
      from: {
        name: "Memphis Corporations",
        address: process.env.EMAIL_USER || "",
      },
      to: email,
      subject: subject,
      html: text,
    })
    .then((response: any) => {
      if (response) {
        console.log("success response", response);
      } else {
        console.log("error response", response);
      }
    });
};

const sendEmailWithAttachment = async (
  email_from: string,
  email: string,
  subject: string,
  text: string,
  attachment: any[]
) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    // port: 587,
    // secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter
    .sendMail({
      sender: email_from,
      from: {
        name: "Memphis Corporations",
        address: process.env.EMAIL_USER || "",
      },
      to: email,
      subject: subject,
      html: text,
      attachments: attachment,
      replyTo: email_from,
    })
    .then((response: any) => {
      if (response) {
        return { message: response };
      } else {
        return { error: response };
      }
    });
};

const generateActivityEmail = async (fullName: string) => {
  return `<div
    style="font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; font-size: 13px; width: 30vw; border: 1px  solid rgba(112, 112, 112, 0.436); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem 2rem; border-radius: 10px; background: white;">
    <p style="width: 90%; letter-spacing: 0.12rem;">
      Hello ${fullName}, thank you for reaching out!
      We have received your request. The team will be sure to reach out to you soon via the contact details you provided.
    </p>
    <p style"color: black;">
    Ignore this mail if you did not engage on any of our websites site.
  </p>
  </div>`;
};

const generateResetPasswordEmailText = async (token: string) => {
  return `<div
  style="font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; font-size: 13px; width: 30vw; border: 1px  solid rgba(112, 112, 112, 0.436); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem 2rem; border-radius: 10px; background: white;">
  <p style="width: 90%; letter-spacing: 0.12rem;">
    You are recieving this email because you have requested to reset your password. Please click on the link below or copy and paste it in your browser:
  </p>
  <a style="margin: 1rem 0; padding: 1rem 2rem; text-decoration: none; letter-spacing: 0.2rem; text-align:center; color: white; background: rgb(16, 160, 16); border-radius: 10px; "
    href=${process.env.CLIENT_URL}/${process.env.PASSWORD_RESET_URL}?${token}
    target="_blank"
  >
    Reset Password
  </a>
  <p style"color: black;">
  Ignore this mail if you did not request a password reset.
</p>
</div>`;
};

export {
  sendEmail,
  sendEmailWithAttachment,
  generateActivityEmail,
  generateResetPasswordEmailText,
};
