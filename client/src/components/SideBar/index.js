// == Import
// import PropTypesLib from 'prop-types';
import { Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonGroup } from '@mui/material';
import { useState } from "react";
import "./index.css";

// == Composant
function SideBar(props) {

    const [selectedWorkflowStatus0, setSelectedWorkflowStatus0] = useState(props.workflowStatus==0);
    const [selectedWorkflowStatus1, setSelectedWorkflowStatus1] = useState(props.workflowStatus==1);
    const [selectedWorkflowStatus2, setSelectedWorkflowStatus2] = useState(props.workflowStatus==2);
    const [selectedWorkflowStatus3, setSelectedWorkflowStatus3] = useState(props.workflowStatus==3);
    const [selectedWorkflowStatus4, setSelectedWorkflowStatus4] = useState(props.workflowStatus==4);
    const [selectedWorkflowStatus5, setSelectedWorkflowStatus5] = useState(props.workflowStatus==5);

    const handleClick = async (e) => {
        if(!props.isAdmin) return;
        if (props.workflowStatus == e.currentTarget.value) return;

        unselectAllButtons();
        console.log("selected : " + e.currentTarget.value);

        if(e.currentTarget.value === "0"){
            // setSelectedWorkflowStatus0(true);    
        }
        else if(e.currentTarget.value === "1"){

            const response = await props.contract.methods.startProposalsRegistering().send({ from: props.accounts[0] });

            const newStatus = response.events.WorkflowStatusChange.returnValues.newStatus;

            if(newStatus == 1){
                setSelectedWorkflowStatus1(true);
                props.setWorkflowStatus(1);
            }

        }
        else if(e.currentTarget.value === "2"){
            // setSelectedWorkflowStatus2(true);
            const response = await props.contract.methods.endProposalsRegistering().send({ from: props.accounts[0] });

            const newStatus = response.events.WorkflowStatusChange.returnValues.newStatus;

            if(newStatus == 2){
                setSelectedWorkflowStatus2(true);
                props.setWorkflowStatus(2);
            }
        }
        else if(e.currentTarget.value === "3"){

            const response = await props.contract.methods.startVotingSession().send({ from: props.accounts[0] });

            const newStatus = response.events.WorkflowStatusChange.returnValues.newStatus;

            if(newStatus == 3){
                setSelectedWorkflowStatus3(true);
                props.setWorkflowStatus(3);
            }
        }
        else if(e.currentTarget.value === "4"){
            const response = await props.contract.methods.endVotingSession().send({ from: props.accounts[0] });

            const newStatus = response.events.WorkflowStatusChange.returnValues.newStatus;

            if(newStatus == 4){
                setSelectedWorkflowStatus4(true);
                props.setWorkflowStatus(4);
            }
        }
        else if(e.currentTarget.value === "5"){
            const response = await props.contract.methods.tallyVotes().send({ from: props.accounts[0] });

            const newStatus = response.events.WorkflowStatusChange.returnValues.newStatus;

            const responseWinningProposalID = await props.contract.methods.winningProposalID().call();
            props.setWinningProposalID(responseWinningProposalID);
  
            if(newStatus == 5){
                setSelectedWorkflowStatus5(true);
                props.setWorkflowStatus(5);
                props.setWinningProposalID(responseWinningProposalID);
            }
        }
    };

    return (
        // <div>
        //     <Typography variant="h1" >
        //         Create new
        //     </Typography>
        // </div>
        <div>
        <h3>Phase actuelle de vote</h3>
        <ToggleButtonGroup
            orientation="vertical"
            color="primary"
            exclusive
        >
            <ToggleButton value="0" selected = {selectedWorkflowStatus0} onClick={handleClick} disabled={!selectedWorkflowStatus0}>1. Enregistrement des votants</ToggleButton>
            <ToggleButton value="1" selected = {selectedWorkflowStatus1} onClick={handleClick} disabled={!selectedWorkflowStatus1 && !selectedWorkflowStatus0}>2. Debut des propositions des votants</ToggleButton>
            <ToggleButton value="2" selected = {selectedWorkflowStatus2} onClick={handleClick} disabled={!selectedWorkflowStatus2 && !selectedWorkflowStatus1}>3. Fin des propositions des votants</ToggleButton>
            <ToggleButton value="3" selected = {selectedWorkflowStatus3} onClick={handleClick} disabled={!selectedWorkflowStatus3 && !selectedWorkflowStatus2}>4. Debut des votes</ToggleButton>
            <ToggleButton value="4" selected = {selectedWorkflowStatus4} onClick={handleClick} disabled={!selectedWorkflowStatus4 && !selectedWorkflowStatus3}>5. Fin des votes</ToggleButton>
            <ToggleButton value="5" selected = {selectedWorkflowStatus5} onClick={handleClick} disabled={!selectedWorkflowStatus5 && !selectedWorkflowStatus4}>6. Dépouillage effectué</ToggleButton>
        </ToggleButtonGroup>
        </div>
        // <ButtonGroup>
        //     <Button> ONE </Button>
        //     <Button> TWO </Button>
        // </ButtonGroup>
    );

    function unselectAllButtons(){
        setSelectedWorkflowStatus0(false);
        setSelectedWorkflowStatus1(false);
        setSelectedWorkflowStatus2(false);
        setSelectedWorkflowStatus3(false);
        setSelectedWorkflowStatus4(false);
        setSelectedWorkflowStatus5(false);
    };
    
};



// // Vérification du type des props
// Events.propTypes = {
//   addresses: PropTypesLib.array.isRequired,
// };

// == Export
export default SideBar;
