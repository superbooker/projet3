import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function VotingFor(props) {
  if(!props.isVoter || props.workflowStatus != 3) return;

  let _id;
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
              <h4> Je vote pour </h4>
              <TextField
                  id="outlined-basic"
                  label="Index de la proposition"
                  variant="outlined"
                  onChange={(evt) => {
                      _id = evt.target.value;
                      console.log("@ " + _id);
                  }} />

              {/* <TextField id="filled-basic" label="Adresse à ajouter" variant="filled" /> */}
              {/* <TextField id="standard-basic" label="Adresse à ajouter" variant="standard" /> */}
              <br />
              <Button
                  variant="outlined"
                  style={{ minWidth: '250px' }}
                  onClick={async (e) => {

                    const regex = /([0-9]+)/g;

                    let m;
                    
                    // console.log("addr " + address1 + " match " + regex.exec(str));
        
                    if(_id){
                      // console.log("addr " + _id + " match " + regex.exec(str));
                      const response = await props.contract.methods.setVote(parseInt(_id)).send({ from: props.accounts[0] });


                      const valueEvent = response.events.Voted.returnValues.proposalId;
                      
                      console.log("_id : " + _id + " props.proposalList[_id] :" + props.proposalList[_id].returnValues.description + " valueEvent " + valueEvent);

                      if(valueEvent){
                          window.alert("Vous avez voté pour la proposition #" + valueEvent + " : '" + props.proposalList[_id].returnValues.description + "'");
                        //   window.location.reload(false);
                      }
                      else{
                          window.alert("Erreur");
                      }
                    }
                    else{
                        window.alert("Mauvais index");
                    }
                  }}
              >
                  Voter </Button>
          </Box>
          <hr class="solid"/>
      </div>
  );

};
 

// == Export
export default VotingFor;

