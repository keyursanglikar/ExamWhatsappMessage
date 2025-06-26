const PDFDocument = require("pdfkit");
const fs = require("fs");

function generatePDF(resultData, path) {
  return new Promise((resolve, reject) => {
    try {
      console.log("📝 Starting PDF generation...");

      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(path);

      writeStream.on("error", (err) => {
        console.error("❌ File write error:", err);
        reject(err);
      });

      writeStream.on("finish", () => {
        console.log("✅ PDF successfully written to:", path);
        resolve(path);
      });

      doc.pipe(writeStream);

      // Add content to PDF
      doc.fontSize(20).text(`Exam Result: ${resultData.examName || "Untitled Exam"}`, { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Student Name: ${resultData.studentName || "N/A"}`);
      doc.text(`Parent No: ${resultData.parentNo || "N/A"}`);
      doc.moveDown();

      if (Array.isArray(resultData.questions)) {
        resultData.questions.forEach((q, index) => {
          doc.fontSize(12).text(`${index + 1}. ${q.question}`);
          q.options.forEach(opt => {
            const selected = opt === q.selected ? "(Selected)" : "";
            const correct = opt === q.correct ? "(Correct)" : "";
            doc.text(`- ${opt} ${selected} ${correct}`);
          });
          doc.moveDown();
        });
      } else {
        doc.text("No questions found.");
      }

      doc.end();
    } catch (err) {
      console.error("❌ Exception in generatePDF:", err);
      reject(err);
    }
  });
}

module.exports = generatePDF;
