import "./index.css";


function WinnerView(props) {  
    if (props.workflowStatus != 5)  return;
    
    const winningProposalDesc = props.proposalList[props.winningProposalID].returnValues.description;
    
    return (
    <div>
        <center><h3>Le vote est terminée. <br/> La proposition vainqueure est :</h3></center>
        <h1 id='rcorners'>{"#" + props.winningProposalID + " : " + winningProposalDesc}</h1>
    </div>
  );
};
 

// == Export
export default WinnerView;

