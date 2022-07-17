// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title Smart contrat de système de vote
/// @author Alyra school
/// @notice Ce Smart contrat permet de gérer un vote où les votants peuvent emettre des propositions de votes et voter
/// @dev Ce smart contrat a été testé unitairement dans le projet2
contract Voting is Ownable {

    /// @notice index de la proposition gagnante
    uint public winningProposalID;
    
    struct Voter {
        /// @notice booleen permettant de savoir si le votant est inscrit
        bool isRegistered;

        /// @notice booleen permettant de savoir si le votant a voté
        bool hasVoted;
        
        /// @notice index de la proposition votée
        uint votedProposalId;
    }

    struct Proposal {
        /// @notice description de la proposition
        string description;

        /// @notice nombre de voix obtenue de la proposition
        uint voteCount;
    }

    enum  WorkflowStatus {
        /// @notice statut : Enregistrement des votants
        RegisteringVoters,
        /// @notice statut : Debut des propositions des votants
        ProposalsRegistrationStarted,
        /// @notice statut : Fin des propositions des votants
        ProposalsRegistrationEnded,
        /// @notice statut : Debut des votes
        VotingSessionStarted,
        /// @notice statut : Fin des votes
        VotingSessionEnded,
        /// @notice statut : Dépouillage effectué
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;

    /// @notice Notifie lorsqu'un votant est ajouté
    /// @dev Envoie un emit de l'event VoterRegistered
    /// @param voterAddress adresse du votant ajoutée
    event VoterRegistered(address voterAddress); 

    /// @notice notifie lorsque le statut de l'election est changé
    /// @dev Envoie un emit de l'event WorkflowStatusChange avec le statut avant et apres le changement
    /// @param previousStatus WorkflowStatus précédent le changement
    /// @param newStatus WorkflowStatus après le changement
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    
    /// @notice notifie lorsqu'une proposition est ajoutée
    /// @dev Envoie un emit de l'event ProposalRegistered
    /// @param proposalId index de la proposition ajoutée
    /// @param description description de la proposition
    event ProposalRegistered(uint proposalId, string description);

    /// @notice notifie lorsqu'un vote a été effectué
    /// @dev Envoie un emit de l'event Voted avec l'adresse du votant et l'index de la proposition
    /// @param voter adresse du votant ajouté
    /// @param proposalId index de la proposition votée
    event Voted (address voter, uint proposalId);

    /// @notice notifie lorsque de l'argent est envoyé au contrat
    /// @param _addr adresse de la personne ayant envoyée l'argent
    event LogDepositReceived (address _addr);

    /// @dev modifier qui revert si la fonction est appelée par un non votant
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }
    
    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Retourne un votant à partir de son adresse dans le map d'adresses de votant
    /// @dev Retourne Voter(false,false,0) si addresse non trouvé dans le map voters. Revert si appelé par un non votant
    /// @param _addr adresse d'un votant
    /// @return Voter Retourne un objet Voter représentant le votant
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
    /// @notice Retourne la prosition à partir de son index dans le tableau des propositions
    /// @dev Revert si _id va est delà de la la taille du tableau. Revert si appelé par un non votant
    /// @param _id index de la proposition dans le tableau de proposition proposalsArray
    /// @return Proposal Retourne un objet Proposal représentant la proposition
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

 
    // ::::::::::::: REGISTRATION ::::::::::::: // 

    /// @notice Ajoute un votant dans le tableau de votants voters
    /// @dev Revert si appelé par une personne non propriétaire du contrat
    /// @param _addr adresse du votant
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 

    // ::::::::::::: PROPOSAL ::::::::::::: // 
    /// @notice Ajoute une proposition dans le tableau des propositions proposalsArray
    /// @dev Revert si appelé par non votant. Revert si proposition vite. Revert si appelé dans un mauvais workflowStatus
    /// @param _desc description de la proposition. J'ai passé de memory à callData comme nous changeons pas la donnée afin d'optimiser du gas
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        require(proposalsArray.length < 1000, '1000 proposals reached, the amount is limited');

        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1,proposal.description);
    }

    // ::::::::::::: VOTE ::::::::::::: //
    /// @notice Enregistre le vote d'un votant
    /// @dev Revert si appelé par non votant. Revert si le votant a déjà. Revert si appelé dans un mauvais workflowStatus. Revert si l'index de la proposition est en dehors des limites du tableau de propositions
    /// @param _id index de la proposition dans le tableau de propositions
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        /// @dev Pour eviter une attaque DDOS nous enregistrons ici le gagnant temporaire afin de ne pas faire de boucle for dans tallyVotes()
        if (proposalsArray[_id].voteCount > proposalsArray[winningProposalID].voteCount) {
            winningProposalID = _id;
        }


        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /// @notice Demarre la session d'ajout de propositions
    /// @dev Revert si appelé par une personne non propritaire. Revert si appelé dans un mauvais workflowStatus.
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice Clot la session d'ajout de propositions
    /// @dev Revert si appelé par une personne non propritaire. Revert si appelé dans un mauvais workflowStatus.
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Demarre la session de vote
    /// @dev Revert si appelé par une personne non propritaire. Revert si appelé dans un mauvais workflowStatus.
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice Clot la session de vote
    /// @dev Revert si appelé par une personne non propritaire. Revert si appelé dans un mauvais workflowStatus.
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @notice Clot la session de vote et le vainqueur temporaire devient le vainqueur final
    /// @dev Revert si appelé par une personne non propritaire. Revert si appelé dans un mauvais workflowStatus.
   function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
    /// @dev Plus besoin de la boucle for pour trouver le vainqueur car il est déja calculé dans la fonction vote()
    //    uint _winningProposalId;
    //   for (uint256 p = 0; p < proposalsArray.length; p++) {
    //        if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
    //            _winningProposalId = p;
    //       }
    //    }
    //    winningProposalID = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    /// @notice Reinitialise le vote apres le décompte
    /// @dev Revert si appelé par une personne non propritaire. Revert si appelé dans un mauvais workflowStatus.
    function resetVote() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotesTallied, "Current status is not tallied");
        
        winningProposalID = 0;
        delete proposalsArray;
        // delete voters;
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }

    /// @notice Fonction fallback lorsqu'on appelle contrat par une fonction inexistante
    /// @dev Revert s'il a de la data. Bonne pratique.
    fallback() external payable{
        require(msg.data.length == 0);
        emit LogDepositReceived(msg.sender);
    }
}
