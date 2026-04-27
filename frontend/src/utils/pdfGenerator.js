import { jsPDF } from "jspdf";

export const generateExamPDF = async (examData) => {
    const { title, questions, difficulty, totalMarks, duration, examId } = examData;
    
    if (!questions || questions.length === 0) return;

    const doc = new jsPDF();
    const leftMargin = 8;
    const rightMargin = 20;
    const contentWidth = 210 - leftMargin - rightMargin;
    let y = 20;

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => {
          console.error("Image load error:", url, err);
          reject(err);
        };
      });
    };

    // Header Color
    doc.setFillColor(37, 99, 235); // matches blue-600
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("PrepKaro", leftMargin + 2, 20);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("AI-Generated Mock Examination Paper", leftMargin + 2, 30);

    y = 50;

    // Exam Metadata
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(leftMargin, y, contentWidth, 25, 3, 3, 'FD');

    doc.setFont("helvetica", "bold");
    doc.text(`Exam: ${title}`, leftMargin + 5, y + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`Difficulty: ${difficulty.toUpperCase()} | Total Marks: ${totalMarks} | Time: ${duration} mins`, leftMargin + 5, y + 18);

    y += 40;

    // Questions Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Questions Section", leftMargin, y);
    y += 10;
    doc.setDrawColor(37, 99, 235);
    doc.line(leftMargin, y, leftMargin + 40, y);
    y += 15;

    // Questions Loop
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    for (const [index, q] of questions.entries()) {
      // Check for page overflow
      if (y > 260) {
        doc.addPage();
        y = 30;
      }

      // Question Number & Text
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      const qNum = `${index + 1}. `;
      const qText = q.questionText || "";
      const questionLines = doc.splitTextToSize(qNum + qText, contentWidth);
      
      doc.text(questionLines, leftMargin, y);
      y += (questionLines.length * 6) + 4;

      // Image support
      if (q.picture) {
        try {
          const img = await loadImage(q.picture);
          const imgWidth = img.width;
          const imgHeight = img.height;
          
          if (imgWidth > 0 && imgHeight > 0) {
            // Scale image to fit content width
            const maxWidth = contentWidth - 10;
            const scale = Math.min(maxWidth / imgWidth, 1, 120 / imgHeight);
            const displayWidth = imgWidth * scale;
            const displayHeight = imgHeight * scale;

            if (y + displayHeight > 275) {
              doc.addPage();
              y = 30;
            }

            const format = q.picture.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
            doc.addImage(img, format, leftMargin + 5, y, displayWidth, displayHeight, undefined, 'FAST');
            y += displayHeight + 10;
          }
        } catch (error) {
          console.error(`Failed to include image for question ${index + 1}:`, error);
        }
      }

      // Options
      if (q.options && q.options.length > 0) {
        doc.setFont("helvetica", "normal");
        for(let optIdx = 0; optIdx < q.options.length; optIdx++) {
          const opt = q.options[optIdx];
          if (y > 280) {
            doc.addPage();
            y = 30;
          }
          const optPrefix = `${String.fromCharCode(65 + optIdx)}) `;
          const optLines = doc.splitTextToSize(optPrefix + opt, contentWidth - 10);
          doc.text(optLines, leftMargin + 5, y);
          y += (optLines.length * 6) + 2;
        }
      } else if (q.questionType?.toUpperCase() === 'NAT') {
        if (y > 280) {
          doc.addPage();
          y = 30;
        }
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text("[ Numerical Answer Type Question - Please write your numeric answer ]", leftMargin + 5, y);
        doc.setTextColor(30, 41, 59);
        y += 7;
      }
      
      y += 10; // Spacing between questions
    }

    // Footer on each page
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount} | Generated via PrepKaro`, 105, 290, { align: 'center' });
    }

    doc.save(`${examId || "Examination_Paper"}.pdf`);
};
