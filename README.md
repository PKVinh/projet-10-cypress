# Installation du projet
1. Téléchargez ou clonez le dépôt
2. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `sudo docker-compose up --build`
3. Ouvrez le site depuis la page http://localhost:8080 

# Installation / Configuration de Cypress
1. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `npm install cypress --save-dev`

2. Dans le même terminal, lancer la commande : `npx cypress open`

3. Dans la fenêtre ouverte, cliquer sur `E2E Testing` 

4. Cliquer sur `Continue` pour installer le dossier `Cypress`

5. Dans le fichier `cypress.config.js`, dans e2e, écrire 

baseUrl: "http://localhost:8080/"

6. Dans le même fichier, dans defineConfig mais en dehors de e2e, écrire

env: {
apiUrl: "http://localhost:8081", //Lien de l'API
baseUrl: "http://localhost:8080" //Lien du site
}

# Lancer la campagne de tests

1. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `npm i --save-dev cypress-mochawesome-reporter`

2. Dans le fichier cypress.config.js dans defineConfig, ajouter les lignes : 

reporter: "cypress-mochawesome-reporter",
reporterOptions: {
reportDir: "cypress/reports/mochawesome",
overwrite: false,
html: false,
json: true
}

3. Dans le fichier cypress.config.js dans setupNodeEvents(on, config), ajouter la ligne : `require("cypress-mochawesome-reporter/plugin")(on)`

4. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `npx cypress run`

5. Le rapport se trouve dans le dossier : cypress/reports/mochawesome

# Lancer un test spécifique

1. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `npx cypress open`

2. Dans la fenêtre ouverte, cliquer sur `E2E Testing` 

3. Cliquer sur le navigateur souhaité (Chrome ou Mozilla), puis cliquer sur `Start E2E testing`

4. Cliquer sur le test pour le lancer



