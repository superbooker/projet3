function Role(props) {   
    console.log("isAdmin " + props.isAdmin);
  return (
    <div>
        <h3>{(props.isAdmin) ? "Votre role est : Admin" : ""}</h3>
        <h4>{(!props.isVoter && !props.isAdmin) ? "Veuillez demander à l'administrateur de vous ajouter en tant que votant" : ""}</h4>
    </div>
  );
};
 

// == Export
export default Role;

