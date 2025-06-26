// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const twilio = require("twilio");
// const generatePDF = require("./genratepdf");
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static("results")); 
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// app.post("/api/send-result", async (req, res) => {
//   const data = req.body;
//   const filename = `result_${Date.now()}.pdf`;
//   const filepath = path.resolve(__dirname, "results", filename);

//   try {
//     console.log("📨 Received request with data:", JSON.stringify(data, null, 2));

//     await generatePDF(data, filepath);


//     if (!fs.existsSync(filepath)) {
//       console.error("❌ PDF file not found:", filepath);
//       return res.status(500).json({ error: "PDF was not generated" });
//     }

//     const stats = fs.statSync(filepath);
//     console.log("📄 PDF created:", filepath, "| Size:", stats.size, "bytes");

//     console.log("☁️ Uploading to Cloudinary...");
//     const cloudRes = await cloudinary.uploader.upload(filepath, {
//       resource_type: "raw",
//       folder: "exam-results",
//     });

//     console.log("✅ Uploaded to Cloudinary:", cloudRes.secure_url);

//     fs.unlinkSync(filepath);

//     // Send WhatsApp
//     const toNumber = data.parentNo.startsWith('+') ? data.parentNo : `+91${data.parentNo}`;
//     console.log("📲 Sending WhatsApp to:", toNumber);

    // await client.messages.create({
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: `whatsapp:${toNumber}`,
    //   body: `Hello, here is your child's exam result.`,
    //   mediaUrl: [cloudRes.secure_url],
    // });

//     await client.messages.create({
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: `whatsapp:${toNumber}`,
//       body: `📄 Hello, here is your child's exam result. Tap to view the PDF:\n${cloudRes.secure_url}`,
//     })

//     console.log("✅ WhatsApp message sent.");
//     res.status(200).json({ message: "Result sent via WhatsApp!" });

//   } catch (err) {
//     console.error("❌ Error while sending result:", err);
//     res.status(500).json({ error: "Failed to send result" });
//   }
// });

// app.listen(5000, () => {
//   console.log("✅ Server running on http://localhost:5000");
// });









// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const twilio = require("twilio");
// const generatePDF = require("./genratepdf");

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static("results")); // Serve the PDF folder as static

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// app.post("/api/send-result", async (req, res) => {
//   const data = req.body;
//   const filename = `result_${Date.now()}.pdf`;
//   const filepath = path.resolve(__dirname, "results", filename);

//   try {
//     console.log("📨 Received data:", data);

//     // Generate the PDF and save to results folder
//     await generatePDF(data, filepath);

//     if (!fs.existsSync(filepath)) {
//       console.error("❌ PDF not found at:", filepath);
//       return res.status(500).json({ error: "PDF generation failed" });
//     }

//     const stats = fs.statSync(filepath);
//     console.log("✅ PDF saved:", filepath, "| Size:", stats.size, "bytes");

//     // Create full downloadable URL
//     const hostURL = "http://localhost:5000"; // or ngrok URL in production
//     const fileUrl = `https://whtsappmessage.onrender.com/results/${filename}`;

//     const toNumber = data.parentNo.startsWith('+') ? data.parentNo : `+91${data.parentNo}`;
//     console.log("📲 Sending WhatsApp to:", toNumber);
//     console.log("🔗 PDF link:", fileUrl);

    
//     await client.messages.create({
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: `whatsapp:${toNumber}`,
//       body: `Here is your child's exam result.`,
//       mediaUrl: [fileUrl], // use Render-hosted PDF
//     });

//     console.log("✅ WhatsApp message sent.");
//     res.status(200).json({ message: "Result sent via WhatsApp!", url: fileUrl });

//   } catch (err) {
//     console.error("❌ Error:", err);
//     res.status(500).json({ error: "Failed to send result." });
//   }
// });

// app.listen(5000, () => {
//   console.log("✅ Server running at http://localhost:5000");
// });







require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const twilio = require("twilio");
const generatePDF = require("./genratepdf");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Twilio config
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post("/api/send-result", async (req, res) => {
  const data = req.body;
  const filename = `result_${Date.now()}.pdf`;
  const filepath = path.resolve(__dirname, filename); // Temp save in root

  try {
    console.log("📨 Received data for PDF:", data);

    // Generate PDF
    await generatePDF(data, filepath);

    if (!fs.existsSync(filepath)) {
      return res.status(500).json({ error: "PDF generation failed" });
    }

    console.log("📄 PDF generated:", filepath);

    // ✅ Upload to Cloudinary (as raw file)
   const uploadResult = await cloudinary.uploader.upload(filepath, {
  resource_type: "raw",
  folder: "exam-results",
  type: "upload", // <== This makes the PDF publicly accessible
});
    console.log("☁️ Cloudinary uploaded:", uploadResult.secure_url);

    // ✅ Delete local PDF
    fs.unlinkSync(filepath);

    // ✅ Format number
    const toNumber = data.parentNo.startsWith('+') ? data.parentNo : `+91${data.parentNo}`;

    // ✅ Send WhatsApp
    await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `whatsapp:${toNumber}`,
      body: `📄 Hello! Your child's result is ready.\nView PDF: ${uploadResult.secure_url}`,
      // OR use this to send as attachment (depends on Twilio sandbox):
      // mediaUrl: [uploadResult.secure_url],
    });

    console.log("✅ WhatsApp sent to:", toNumber);
    res.status(200).json({ message: "Result sent successfully!", url: uploadResult.secure_url });

  } catch (err) {
    console.error("❌ Error:", err.message || err);
    res.status(500).json({ error: "Failed to send result." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("✅ WhatsApp PDF Result Sender is live!");
});
