const nodemailer = require("nodemailer");

const sendEmailOtp = async (email, otp) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pjshandreshchintam@gmail.com",
      pass: "zxsa vwmr ngss psxv"
    }
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
<style>

/* DEFAULT LIGHT THEME */
body {
  margin:0;
  padding:0;
  font-family: Arial, sans-serif;
  background:#f3f4f6;
}

/* CARD */
.container {
  max-width:520px;
  margin:40px auto;
  background:#ffffff;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 10px 30px rgba(0,0,0,0.1);
}

/* HEADER */
.header {
  padding:20px;
  text-align:center;
  background:linear-gradient(135deg,#6366f1,#22c55e);
  color:white;
}

/* OTP BOX */
.otp {
  margin:25px auto;
  width:180px;
  padding:18px;
  font-size:28px;
  font-weight:bold;
  letter-spacing:8px;
  text-align:center;
  color:#111827;
  background:#f3f4f6;
  border-radius:12px;
  animation: pulse 1.5s infinite;
}

/* FOOTER */
.footer {
  padding:15px;
  text-align:center;
  font-size:12px;
  color:#6b7280;
  background:#f9fafb;
}

/* ANIMATION */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 🌙 DARK MODE SUPPORT */
@media (prefers-color-scheme: dark) {

  body {
    background:#0f172a;
  }

  .container {
    background:#111827;
    box-shadow:0 10px 30px rgba(0,0,0,0.6);
  }

  .otp {
    background:#1f2937;
    color:#ffffff;
  }

  .footer {
    background:#0b1220;
    color:#9ca3af;
  }

}

</style>
</head>

<body>

  <div class="container" style="border:1px solid #000000;">

    <div class="header">
      <h2>OTP VERIFICATION</h2>
    </div>

    <div style="padding:30px;text-align:center;">

      <p>Hello 👋</p>

      <p style="color:#6b7280;font-size:14px;">
        Use this OTP to verify your account
      </p>

      <div class="otp">
        ${otp}
      </div>

      <p style="color:#ef4444;font-weight:bold;">
        ⚠ Valid for 2 minutes only
      </p>

    </div>

    <div class="footer">
      © ${new Date().getFullYear()} PJSV System
    </div>

  </div>

</body>
</html>
  `;

  await transporter.sendMail({
    from: `"PJSV System" <YOUR_EMAIL@gmail.com>`,
    to: email,
    subject: "🔐 OTP Verification Code",
    html
  });

};

module.exports = sendEmailOtp;