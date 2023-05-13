import { useCallback, useState, useRef } from "react";
import { read, utils } from "xlsx";

export const useUpload = () => {
  const [jsonData, setJsonData] = useState(null);
  const isMounted = useRef(true);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file || !/\.xlsx?$/.test(file.name)) {
      alert("Please select a valid Excel file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const newJsonData = utils.sheet_to_json(worksheet, { header: 1 });
        if (isMounted.current) {
          setJsonData(newJsonData);
        }
      } catch (error) {
        console.log("Error processing the file. Please try again.", error);
      }
    };
    reader.readAsArrayBuffer(file);

    return () => {
      isMounted.current = false;
    };
  }, []);

  const clearData = () => {
    setJsonData(null);
  };

  return { jsonData, handleFileChange, clearData };
};
