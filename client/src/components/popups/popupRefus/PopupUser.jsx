const PopupUser = ({ item }) => {
  const {
    createdAt,
    _id,
    email,
    etat,
    fonction,
    nom,
    numTel,
    prenom,
    role,
    structure,
  } = item;
  const OmLabelLine = ({ label, content }) => (
    <div className="om-label-line">
      <div className="om-label">{label}</div>
      <div className="om-content" style={{ flex: 1 }}>
        {content}
      </div>
    </div>
  );
  return (
    <div className="popup-user">
      <div className="title">User profile</div>
      <div className="om-body">
        {" "}
        <OmLabelLine label="Matricule" content={": " + _id} />
      </div>
      <div className="om-body">
        <OmLabelLine label="role" content={": " + role} />
        {role === "employe" && (
          <OmLabelLine label="etat" content={": " + etat} />
        )}
      </div>
      <div className="om-body">
        <OmLabelLine label="Nom & Prénom" content={": " + `${nom} ${prenom}`} />
        <OmLabelLine label="structure" content={": " + structure} />
        <OmLabelLine label="fonction" content={": " + fonction} />

        <OmLabelLine label="email" content={": " + email} />
        <OmLabelLine label="numero de téléphone" content={": " + numTel} />
      </div>
     </div>
  );
};

export default PopupUser;
