import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function AddVoter(props) { 
    console.log("isAdmin " + props.isAdmin);
    if(props.isAdmin == false || props.workflowStatus != 0) return null;

    let address1;

    return (
        <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '45ch' },
          flexDirection: 'column',
        }}
        noValidate
        autoComplete="off"
      >
        <h4> Ajouter un votant </h4>
        <TextField 
        id="outlined-basic" 
        label="Adresse à ajouter" 
        variant="outlined" 
        onChange={(evt) => {
            address1 = evt.target.value;
            console.log("@ " + address1);}} /> 

        {/* <TextField id="filled-basic" label="Adresse à ajouter" variant="filled" /> */}
        {/* <TextField id="standard-basic" label="Adresse à ajouter" variant="standard" /> */}
        <br/>
        <Button 
        variant="outlined"
        style={{minWidth: '250px'}}
        onClick={async (e) => { 
            const str = address1;

            const regex = /(0x[a-f0-9]*)/g;

            let m;
            
            // console.log("addr " + address1 + " match " + regex.exec(str));

            if((m = regex.exec(str)) !== null){
                const response = await props.contract.methods.addVoter(address1).send({ from: props.accounts[0] });
            
                const valueEvent = response.events.VoterRegistered.returnValues.voterAddress;
                if(valueEvent){
                    props.setNumberOfVoter(props.numberOfVoter+1);
                    window.alert("Votant ajouté " + valueEvent);
                    
                    window.location.reload(false);
                }
                else{
                    window.alert("Erreur");
                }
    
                // console.log(response);            
            }
            else{
                window.alert("Veuillez entrer une adresse valide");
            }
         }}
        >
            Ajouter</Button>
            <hr class="solid"/>
      </Box>
  
  

    //   <div>
    //     <h4> Ajouter un votant </h4>
    //       Votre role est : {props.role}
    //   </div>
    );
  };
   
  
  // == Export
  export default AddVoter;
  
  