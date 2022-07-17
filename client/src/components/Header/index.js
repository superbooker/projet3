// == Composant
import { Box } from "@mui/material";
import { Paper } from "@mui/material";
import logo from '../../votelogo.jpg';
import "./index.css";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function Header(props) {
  if(!props.addr) return;

  return (
    <div id="displayFlex" class="header">
        <Box
        component="img"
        sx={{
          height: 70,
          width: 70,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
        }}
        alt="The house from the offer."
        src={logo}
      />
        <h2 class="middlePosition">Vote d'amélioration des repas de la cantine Alyra</h2>
        <div>
            <AccountBalanceWalletIcon fontSize='small' class='horizontalCenter'></AccountBalanceWalletIcon> 
            <p class="rightPosition">{props.addr}</p>
        </div>
    </div>
  );
};
 

// == Export
export default Header;

