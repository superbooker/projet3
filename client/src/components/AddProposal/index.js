import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function AddProposal(props) {
  if(!props.isVoter || props.workflowStatus != 1) return;

  let _proposition;
  let response;

  return (
      <div>
          <Box
              component="form"
              sx={{
                  '& > :not(style)': { m: 1, width: '45ch' },
                  flexDirection: 'column',
              }}
              noValidate
              autoComplete="off"
          >
              <h4> Ajouter une proposition </h4>
              <TextField
                  id="outlined-basic"
                  label="Description une proposition"
                  variant="outlined"
                  onChange={(evt) => {
                      _proposition = evt.target.value;
                      console.log("@ " + _proposition);
                  }} />

              {/* <TextField id="filled-basic" label="Adresse à ajouter" variant="filled" /> */}
              {/* <TextField id="standard-basic" label="Adresse à ajouter" variant="standard" /> */}
              <br />
              <Button
                  variant="outlined"
                  style={{ minWidth: '150px' }}
                  onClick={async (e) => {

                    const regex = /([a-f0-9]+)/g;

                    let m;
                    
                    // console.log("addr " + address1 + " match " + regex.exec(str));
        
                    if(_proposition){
                      console.log("_proposition : " + _proposition);
                      // console.log("addr " + _proposition + " match " + regex.exec(str));
                      const response = await props.contract.methods.addProposal(_proposition).send({ from: props.accounts[0] });

                      const valueEvent = response.events.ProposalRegistered.returnValues.proposalId;
                      if(valueEvent){
                          window.alert("Proposition #" + valueEvent + " : '" + _proposition + "' ajoutée");
                          window.location.reload(false);
                      }
                      else{
                          window.alert("Erreur");
                      }
                    }
                    else{
                        window.alert("Vous n'avez rien proposé. Merci de proposer une idée de vote.");
                    }
                  }}
              >
                  Ajouter </Button>
          </Box>
          <hr class="solid" />
      </div>
  );

};
 

// == Export
export default AddProposal;

