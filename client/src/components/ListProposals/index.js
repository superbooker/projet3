import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
  
function ListProposals(props) {
  if(!props.isVoter || props.workflowStatus < 1) return;

    console.log("proposalList : " + JSON.stringify(props.proposalList));
    // props.voterAddresses.map((event) => {
    //     console.log("addr n° " + event.returnValues.voterAddress);
    // });
    return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 50, maxWitdh: 50 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><b>Liste des propositions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.proposalList.map((event, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {"Proposition #" + index + " : " + event.returnValues.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    };
  
  // == Export
  export default ListProposals;
  
  