import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function InfoVoter(props) {
  if(!props.isVoter) return;

  let address1;
  let response;

  return (
      <div>
          <h3>{(props.isVoter) ? "Vous êtes un votant" : ""}</h3>

          <Box
              component="form"
              sx={{
                  '& > :not(style)': { m: 1, width: '45ch' },
                  flexDirection: 'column',
              }}
              noValidate
              autoComplete="off"
          >
              <h4> Information sur le votant </h4>
              <TextField
                  id="outlined-basic"
                  label="Adresse à du votant"
                  variant="outlined"
                  onChange={(evt) => {
                      address1 = evt.target.value;
                      console.log("@ " + address1);
                  }} />

              {/* <TextField id="filled-basic" label="Adresse à ajouter" variant="filled" /> */}
              {/* <TextField id="standard-basic" label="Adresse à ajouter" variant="standard" /> */}
              <br />
              <Button
                  variant="outlined"
                  style={{ minWidth: '250px' }}
                  onClick={async (e) => {
                      const str = address1;

                      const regex = /(0x[a-f0-9]*)/g;

                      let m;

                      // console.log("addr " + address1 + " match " + regex.exec(str));
                      if ((m = regex.exec(str)) !== null) {
                          const response = await props.contract.methods.getVoter(address1).call({ from: props.accounts[0] });

                          console.log("InfoVoter response " + JSON.stringify(response));

                          if (response) {
                            if(!response[1]){
                                window.alert("Votant : " + address1 + "\nEnregistré : " + (response[0] ? "Oui" : "Non") + "\nA voté : " + (response[1] ? "Oui" : "Non"));
                            }
                            else{
                                window.alert("Votant : " + address1 + "\nEnregistré : " + (response[0] ? "Oui" : "Non") + "\nA voté : " + (response[1] ? "Oui" : "Non") + "\nIndex de la proposition votée : " + response[2]);
                            }
                          }
                          else {
                              window.alert("Erreur");
                          }

                          // console.log(response);            
                      }
                      else {
                          window.alert("Veuillez entrer une adresse valide");
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
export default InfoVoter;

