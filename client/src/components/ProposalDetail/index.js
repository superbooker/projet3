import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function ProposalDetail(props) {
  if(!props.isVoter || props.workflowStatus < 1) return;

  let index;

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
              <h4> Détail d'une proposition </h4>
              <TextField
                  id="outlined-basic"
                  label="index de la proposition"
                  variant="outlined"
                  onChange={(evt) => {
                      index = evt.target.value;
                      console.log("@ " + index);
                  }} />

              {/* <TextField id="filled-basic" label="Adresse à ajouter" variant="filled" /> */}
              {/* <TextField id="standard-basic" label="Adresse à ajouter" variant="standard" /> */}
              <br />
              <Button
                  variant="outlined"
                  style={{ minWidth: '250px' }}
                  onClick={async (e) => {
                      const str = index;

                      const regex = /([0-9]+)/g;

                      let m;

                      // console.log("addr " + index + " match " + regex.exec(str));
                      if ((m = regex.exec(str)) !== null) {
                          const response = await props.contract.methods.getOneProposal(index).call({ from: props.accounts[0] });

                          console.log("ProposalDetail response " + JSON.stringify(response));

                          if (response) {
                            window.alert("Proposition #" + index + "\nDescription : '" + response[0] + "'\nNombre de voix : " + response[1]);
                          }
                          else {
                              window.alert("Erreur");
                          }
                          // console.log(response);            
                      }
                      else {
                          window.alert("Veuillez entrer un index valide");
                      }
                  }}
              >
                  Chercher </Button>
          </Box>
          <hr class="solid"/>
      </div>
  );

};
 

// == Export
export default ProposalDetail;

