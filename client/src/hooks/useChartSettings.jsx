import { useState } from "react";
import Select from "react-select";
import "./../pages/profilAdmin/Dashboards/Dashboard.css";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: 150, // Add this line to set the width
    borderRadius: 5,
    backgroundColor: "var(--gray3)",
    color: "var(--white)",
    border: "1px solid var(--light-gray)",
    boxShadow: "none",
    "&:hover": {
      border: "1px solid var(--light-gray)",
    },
    "&:focus": {
      border: "1px solid var(--light-gray)",
    },
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: "11px", // Add this line to set the label font size
    fontWeight: "600",
  }),
  menu: (provided, state) => ({
    ...provided,
    fontSize: "11px", // Add this line to set the label font size
    fontWeight: "500",
  }),
};

const useChartSettings = (options1, options2, options3) => {
  const [option1, setOption1] = useState(options1 ? options1[0] : "");
  const [option2, setOption2] = useState(options2 ? options2[0] : "");
  const [option3, setOption3] = useState(options3 ? options3[0] : "");
  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClickWithActive = (buttonId) => {
    setActiveButton(buttonId);
    handleButtonClick(buttonId);
  };
  const handleOption1 = (option) => {
    setOption1(option);
  };
  const handleOption2 = (option) => {
    setOption2(option);
  };
  const handleOption3 = (option) => {
    setOption3(option);
  };

  const customSelect = () => {
    return (
      <>
        <div>setting icon</div>
        <div className="custom-options">
          {options1 && (
            <Select
              className="select"
              value={option1}
              options={options1}
              placeholder="{entry.placeholder}"
              styles={customStyles}
              onChange={handleOption1}
            />
          )}
          {options2 && (
            <Select
              className="select"
              value={option2}
              options={options2}
              placeholder="{entry.placeholder}"
              styles={customStyles}
              onChange={handleOption2}
            />
          )}
          {options3 && (
            <Select
              value={option3}
              className="select"
              options={options3}
              placeholder="{entry.placeholder}"
              styles={customStyles}
              onChange={handleOption3}
            />
          )}
        </div>
      </>
    );
  };

  return {
    option1,
    option2,
    option3,
    customSelect,
    handleOption1,
    handleOption2,
    handleOption3,
  };
};
export default useChartSettings;
