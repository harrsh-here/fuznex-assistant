// routes/auth.js (Express)
/*
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
  await sendOtp(email, otp);
  user.resetToken = otp;
  user.resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  res.json({ success: true, message: "OTP sent to email" });
});

router.post("/notify-password-change", async (req, res) => {
  const { email } = req.body;

  try {
    await resend.emails.send({
      from: "FuzNex <noreply@fuznex.com>",
      to: [email],
      subject: "Your password was changed",
      html: `<p>Hello,<br>Your password was successfully changed. If this wasn't you, please contact support immediately.</p>`,
    });

    res.json({ message: "Password change notification sent" });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ error: "Failed to send notification" });
  }
});


router.post("/notify-login", async (req, res) => {
  const { email } = req.body;

  try {
    await resend.emails.send({
      from: "FuzNex <noreply@fuznex.com>",
      to: [email],
      subject: "New Login to FuzNex",
      html: `<p>Hello,<br>You just logged into your FuzNex account. If this wasn't you, please secure your account immediately.</p>`,
    });

    res.json({ message: "Login notification sent" });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ error: "Failed to send login notification" });
  }
});

router.post("/notify-signup", async (req, res) => {
  const { email } = req.body;

  try {
    await resend.emails.send({
      from: "FuzNex <noreply@fuznex.com>",
      to: [email],
      subject: "Welcome to FuzNex!",
      html: `<p>
Hello,<br>
Welcome to FuzNex! We're excited to have you on board. Your account has been successfully created. If this wasn't you, please take steps to secure your account immediately.<br><br>
Enjoy your experience and feel free to explore everything FuzNex has to offer.
</p>

`,
    });

    res.json({ message: "SignUp notification sent" });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ error: "Failed to send login notification" });
  }
});

*/