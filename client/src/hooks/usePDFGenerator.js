import { useRef } from "react";
import html2pdf from "html2pdf.js";

const usePDFGenerator = () => {
  const pdfRef = useRef();

  const generatePDF = () => {
    const element = pdfRef.current;

    html2pdf()
      .set({ jsPDF: { unit: "in", format: "letter", orientation: "portrait" } })
      .from(element)
      .save();
  };

  return [pdfRef, generatePDF];
};

export default usePDFGenerator;
