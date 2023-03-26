import { useRef } from "react";
import html2pdf from "html2pdf.js";

const usePDFGenerator = (filename) => {
  const pdfRef = useRef();

  const generatePDF = () => {
    const element = pdfRef.current;

    html2pdf()
      .set({
        filename: filename,
        image: { type: "jpeg", quality: 1 },
        pagebreak: { mode: ["avoid-all"] },
        html2canvas: {
          dpi: 300,
          letterRendering: true,
          scale: 2,
          logging: true,
        },
        margin: 2,
        jsPDF: {
          orientation: "p",
          unit: "em",
          format: "a4",
          floatPrecision: 16,
        },
      })
      .from(element)
      .save();
  };

  return [pdfRef, generatePDF];
};

export default usePDFGenerator;
