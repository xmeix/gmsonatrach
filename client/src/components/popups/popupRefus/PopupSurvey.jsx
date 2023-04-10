// Import the Popup.css file
import "./../Popup.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// Define a PopupSurvey component that takes in an item and a close function
const PopupSurvey = ({ item, close }) => {
  // Return a popup survey with a title, three options for feedback, and a note
  return (
    <div className="popup-survey">
      <CloseRoundedIcon className="icon" onClick={close} />
      <h2 className="title">Donnez votre avis sur cette mission :</h2>
      <div className="popup-survey-content">
        <button className="feedback-option">Positif</button>
        <button className="feedback-option">Neutre</button>
        <button className="feedback-option">Négatif</button>
      </div>
      <p className="note">
        Remarque : Votre feedback aidera à améliorer notre service.
      </p>
    </div>
  );
};

// Export the PopupSurvey component as the default export
export default PopupSurvey;
