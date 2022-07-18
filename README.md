# TP3 Alex YE
TP3 Alex YE 
Promo Ropsten : Développeur

Ce projet est le 3eme TP à rendre pour la Promo Ropsten : Développeur.

Video du workflow : https://youtu.be/m-57AvvF1cY (à écouter en x2 - désolé pour la lenteur de mon mac :( )

Lien Github Pages : https://superbooker.github.io/projet3/

Travail réalisé de base :
* Revue du code solidity pour enlever la faille DDOS
* Ajout de commentaire sur le code solidity Voting (le meme utilisé pour le projet 2)
* Ajout d'élements de bonnes pratiques apprises
* Développment de la Dapp Système de vote en utilisant toutes les fonctions
* Vidéo du workflow
* Utilisations des 3 façons de récupérer les events du cours
* Affichage du compte utilisé
* Affichage des propositions 
* Déploiement sur Github Pages
* Adaptation du site en fonction du compte utilisé
* Utilisation des composants
* Documentation générée et en ligne sur ipfs : https://ipfs.io/ipfs/QmNzK4cwTuF4AnPHUY5S4kUnSGt8FNLPyTgcSFoxJK9u9S

## Maquette artisanale de la Dapp

![alt text](https://i.postimg.cc/nrD3T8Jg/2022-07-18-03-07.jpg)


## Comment compiler/deployer le Smart Contract et deployer la Dapp

Prérequis : 
- Installer truffle : npm install -g truffle
- Installer ganache : npm install -g ganache-cli


Ouvrir un terminal :

1. git clone https://github.com/superbooker/projet3.git
2. cd projet3/client
3. npm install @openzeppelin/contracts --save
4. npm install @openzeppelin/test-helpers --save
5. npm install web3
6. npm install ethereumjs-tx @truffle/hdwallet-provider dotenv
7. Lancer ganache : ganache
8. cd ../truffle
9. truffle migrate --network ropsten (pour deployer sur ropsten)
10. cd ../client
11. npm run start

## Scénario de la vidéo

1. Montrer le code
2. Montrer la documentation de voting
3. Montrer la maquette
4. Montrer GitHub pages et Heroku

Scénario :
1. Montrer vue Admin
2. Switch vue Non votant
3. Tenter de changer de status de vote
4. Admin : ajouter 3 votants
5. Afficher information des votants
6. Switch vue votant
7. Switch vue non votant
8. Switch admin : Avancer status suivant : ajout propositions
9. Votant 1 ajoute proposition
10. Votant 2 ajoute proposition
11. Votant 3 ajoute proposition
12. Afficher les détails des propositions
13. Check votant 4
14. Switch admin : Avancer status suivant : fin ajout proposition 
15. Check des 4 comptes
16. Switch admin : Avancer status suivant : Debut des votes
17. Votant 1 vote
18. Check de mon vote
19. Votant 1 revote
20. Switch votant 2
21. Votant 2 vote
22. Switch votant 3
23. Votant 3 vote
24. Switch admin : Avancer status suivant : Fin des votes
25. Dépouillage
26. Montrer le vainqueur


## License

The TP3 Alex YE (i.e. all code outside of the `cmd` directory) is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html),
also included in our repository in the `COPYING.LESSER` file.
