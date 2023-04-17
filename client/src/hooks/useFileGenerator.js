import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import FileSaver from "file-saver";

const useFileGenerator = (FileItem, path, name) => {
  const generateDocument = async () => {
    const response = await fetch(path);
    const buffer = await response.arrayBuffer();
    const zip = new PizZip();
    zip.load(buffer);
    const doc = new Docxtemplater();
    doc.loadZip(zip); // Set the data for the document
    doc.setData(FileItem);

    // Render the document
    doc.render();

    // Generate a binary file from the document and return it
    const output = doc.getZip().generate({ type: "blob" });
    FileSaver.saveAs(output, name);
  };

  return [generateDocument];
};

export default useFileGenerator;
