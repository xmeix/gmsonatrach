import { useSelector } from "react-redux";
import "./Profile.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const sections = [
    {
      title: "Personal Information",
      fields: [
        { label: "Fonction", value: user?.fonction },
        { label: "Numéro de téléphone", value: user?.numTel },
      ],
    },
    {
      title: "Account Information",
      fields: [{ label: "Email", value: user?.email }],
    },
    {
      title: "Role and Status",
      fields: [
        { label: "Role", value: user?.role },
        user.role === "employe" && {
          label: "État",
          value:
            user?.etat === "non-missionnaire"
              ? "Non-missionnaire"
              : "Missionnaire",
        },
        user.role !== "secretaire" && {
          label: "Structure",
          value: user?.structure,
        },
      ],
    },
  ];
  return (
    <div className="user-profile">
      {user ? (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <AccountCircleIcon className="icon" />
            </div>
            <div className="profile-name">
              {user.prenom} {user.nom}
            </div>
          </div>
          <div className="profile-sections">
            {sections.map((section, index) => (
              <div className="profile-section" key={index}>
                <h2 className="section-title">{section.title}</h2>
                <div className="profile-content">
                  {section.fields.map((field, index) => (
                    <div className="profile-info" key={index}>
                      <div className="profile-info-label">{field.label}</div>
                      <div className="profile-info-value">{field.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default Profile;
