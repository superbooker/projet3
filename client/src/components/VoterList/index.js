import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
  
function VoterList(props) {
  if (props.voterAddresses.length == 0) return;

    console.log("voterAddressList : " + props.voterAddresses);
    // props.voterAddresses.map((event) => {
    //     console.log("addr n° " + event.returnValues.voterAddress);
    // });
    return (
      <div> 
        <br/>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 50, maxWitdh: 50 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><b>Liste des votants enregistrés</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.voterAddresses.map((event) => (
                <TableRow
                  key={event.returnValues.voterAddress}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {event.returnValues.voterAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br/>
      </div>
      );
    };
  
  // == Export
  export default VoterList;
  
  