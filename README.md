# TP3 Alex YE
TP3 Alex YE 
Promo Ropsten : Développeur

Ce projet est le 3eme TP à rendre pour la Promo Ropsten : Développeur.

Video du workflow : 

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



## License

The TP1 Alex YE (i.e. all code outside of the `cmd` directory) is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html),
also included in our repository in the `COPYING.LESSER` file.