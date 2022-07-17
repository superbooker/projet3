// == Import npm
import { useState, useEffect } from "react";
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

// == Import assets
import "./App.css";

// == Import Components
import Events from './components/Events';
import SideBar from './components/SideBar';
import Header from './components/Header';
import Role from './components/Role';
import AddVoter from './components/AddVoter';
import VoterList from './components/VoterList';
import InfoVoter from './components/InfoVoter';
import AddProposal from './components/AddProposal';
import ListProposals from './components/ListProposals';
import VotingFor from './components/VotingFor';
import WinnerView from './components/WinnerView';
import ProposalDetail from './components/ProposalDetail';


/*
  On a déploy un contrat Voting sur ganache.
  Ce contrat permet de set une valeur dans une variable d'état et de recup cette valeur.

  On va se créer un Front en React pour intéragir avec ce contrat. Pour ça onn va utiliser la librairie web3js.
  L'initialisation et la configuration de web3 dans notre Front se fait depuis le fichier getWeb3.js.
  Il nous permet de recup les infos depuis Metamask.

  Au montage du composant on va utiliser le provider web3 (metamask) pour plusieurs chose:
  - Recup les comptes => dans le state
  - Recup le network sur lequel l'utilisateur est connecté et sur lequel le contrat a été déployé (ganache)
  - Pouvoir se faire une nouvelle instance de ce contrat => dans le state
  - Recup la valeur de la variable d'état pour l'afficher => dans le state

  Maintenant on va pouvoir intéragir avec ce contrat en executant ses fonctions
  - Recup la variable d'état
  - Ecrire dans cette variable d'état
  - Recup les events pour les afficher

  Il existe trois façon de recup les events d'un contrat :
  - Lorsqu'on déclenche une Tx, on peut recup l'instance de cette Tx et recup l'event qu'elle a émit.
      => Les console.log dans la fonction handleClick
  - Recup tous les events antérieurs.
      => Au moment du montage du composant dans le hook useEffect
  - Ecouter les events du contrat en direct. Dès qu'un account va déclencher l'event qu'on écoute, on va pouvoir le recup.
      => Au moment du montage du composant dans le hook useEffect

*/

// == Composant
function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [voterAddresses, setVoterAddresses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVoter, setIsVoter] = useState(false);
  const [numberOfVoter, setNumberOfVoter] = useState(0);
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [proposalList, setProposalList] = useState([]);
  const [numberOfProposal, setNumberOfProposal] = useState(0);
  const [winningProposalID, setWinningProposalID] = useState(null);
  

  // Rendu initial du composant
  useEffect(
    // On veut recup les infos du contrat déployé au moment du montage du composant
    // Pour ça on doit déclarer une fonction async dans le hook useEffect
    () => {
      async function setUpWeb3() {
        try {
          // On recup le provider Metamask installé sur le navigateur
          const web3Provider = await getWeb3();
    
          // On recup les comptes
          const accounts = await web3Provider.eth.getAccounts();
    
          // On recup l'id du network
          const networkId = await web3Provider.eth.net.getId();
          // On recup le network sur lequel on a deploy le contrat avec truffle migrate (on a l'info dans l'ABI du contrat ./contracts)
          const deployedNetwork = Voting.networks[networkId];
          // On crée une nouvelle instance du contrat via son ABI, le network et l'adresse sur laquel le contrat a été déployé
          const instance = new web3Provider.eth.Contract(
            Voting.abi,
            deployedNetwork && deployedNetwork.address,
          );

          let options = {
            fromBlock: 0,
            toBlock: 'latest'
          };
    
          let options1 = {
            fromBlock: 'latest'
          };
    
          // // On recup tous les events passés du contrat
          let _voterAddresses = await instance.getPastEvents('VoterRegistered', options);

          setVoterAddresses(_voterAddresses);
          setNumberOfVoter(_voterAddresses.length);

          // Ici on se met en écoute des émissions d'events. On rajoute chaque nouvel event dans le state
          // L'avantage ici c'est qu'onv apouvoir recup tous les nouveaux events, même ceux déclenchés par d'autres accounts
          await instance.events.VoterRegistered(options1).on('data', event => {
            _voterAddresses.push(event);
            voterAddresses.push(event);
          });
          console.log("AAA _voterAddresses : " + JSON.stringify(_voterAddresses));
          console.log("AAA accounts[0] : " + accounts[0]);
          setIsVoter(_voterAddresses.find((event)=> event.returnValues.voterAddress === accounts[0]) ? true : false);


          //Récupération des propositions
          let optionsProposals = {
            fromBlock: 0,
            toBlock: 'latest'
          };
    
          let optionsProposals1 = {
            fromBlock: 'latest'
          };
    
          // // On recup tous les events passés du contrat
          let _proposalList = await instance.getPastEvents('ProposalRegistered', optionsProposals);

          setProposalList(_proposalList);
          setNumberOfProposal(_proposalList.length);

          // Ici on se met en écoute des émissions d'events. On rajoute chaque nouvel event dans le state
          // L'avantage ici c'est qu'onv apouvoir recup tous les nouveaux events, même ceux déclenchés par d'autres accounts
          await instance.events.ProposalRegistered(optionsProposals1).on('data', event => {
            _proposalList.push(event);
            proposalList.push(event);
          });


          //Récupération du workflowStatus
          const _workflowStatus = await instance.methods.workflowStatus().call();
          console.log("workflowStatus " + _workflowStatus);

          setWorkflowStatus(_workflowStatus);
          
          const response = await instance.methods.winningProposalID().call();
          setWinningProposalID(response);
          console.log('setWinningProposalID : ' + response);

          const ownerAddress = await instance.methods.owner().call();
          console.log("ownerAddress : " + ownerAddress + " accounts[0] : " + accounts[0]);
          if(ownerAddress == accounts[0]){
            setIsAdmin(true);
          }

          // On mémorise dans le state les infos
          // setStorageValue(response);
          setWeb3(web3Provider); 
          setAccounts(accounts);
          setContract(instance);
          // setVoterAddresses(listVoterAddress);
        } catch (error) {
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        };
      };

      // On doit executer la fonction async
      setUpWeb3();
    },
    []
  );

  const handleClick = async () => {
    // // On ecrit sur la BC, donc await
    // const receipt = await contract.methods.set(value).send({ from: accounts[0] });
    // // On recup la nouvelle valeur
    // const newValue = await contract.methods.get().call();
    
    // // On recup un event d'une transaction qu'on vient d'émettre !
    // // Attention cependant : si on rajoute déjà les transactions dans le state depuis le useEffet,
    // // le faire ici aussi fera doublon.
    // // => Juste console.log() histoire de tester quand même
    // console.log("l'adresse est celle ci: " + receipt.events.SetValue.returnValues.addr);
    // console.log("la data est celle ci: " + receipt.events.SetValue.returnValues.newValue);
    // console.log(receipt);

    // // O la mémorise la nouvelle value dans le state
    // setStorageValue(newValue);

    // // UX: on vide le champ
    // setValue("");

    // const receipt = await contract.methods.resetVote().send({ from: accounts[0] });
    // console.log("receipt : " + receipt);  

    const response = await contract.methods.winningProposalID().call();
    console.log(response);
  }



  if (!web3 || !accounts) {
    console.log("no web3 found " + accounts);
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  else{
    console.log("web3 found " + accounts);
    return (
      <div className="App">  
        <Header addr={accounts[0]}/>

        <div class="sideBar">
          <SideBar isAdmin={isAdmin} workflowStatus={workflowStatus} setWorkflowStatus={setWorkflowStatus} contract={contract} accounts={accounts} winningProposalID={winningProposalID} setWinningProposalID={setWinningProposalID}/>        
        </div>

        <div class="principal">
          <br/>
          {/* 1 */}
          <Role isAdmin={isAdmin} isVoter={isVoter}/>

          {/* 3 */}
          <AddVoter isAdmin={isAdmin} contract={contract} accounts={accounts} numberOfVoter={numberOfVoter} setNumberOfVoter={setNumberOfVoter} workflowStatus={workflowStatus} />

          {/* 6 */}
          <InfoVoter isVoter={isVoter} contract={contract} accounts={accounts} />

          {/* 7 */}
          <AddProposal isVoter={isVoter} contract={contract} accounts={accounts} workflowStatus={workflowStatus} />

          
          {/* 8 */}
          <ProposalDetail isVoter={isVoter} contract={contract} accounts={accounts} workflowStatus={workflowStatus} />

          {/* 9 */}
          <VotingFor isVoter={isVoter} proposalList={proposalList} contract={contract} accounts={accounts} workflowStatus={workflowStatus} />

          {/* 10 */}
          <WinnerView proposalList={proposalList} contract={contract} accounts={accounts} winningProposalID={winningProposalID} workflowStatus={workflowStatus}/>

        </div>

        <div class="rightSideBar">
          {/* 4 */}
          <VoterList voterAddresses={voterAddresses}/>

          {/* 2 */}
          <ListProposals isVoter={isVoter} proposalList={proposalList} numberOfProposal={numberOfProposal} setNumberOfProposal={setNumberOfProposal} workflowStatus={workflowStatus}/>

        </div>
    
      </div>
    );  
  }

}

// == Export
export default App;
