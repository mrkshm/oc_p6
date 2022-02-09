# OpenClassrooms Projet 6
## Installation

1. Clone this repository and cd into it
_1. Clonez ce repository, puis allez dans le dossier_

```
git clone https://github.com/mrkshm/oc_p6.git
cd oc_p6.git
```

2. Install backend dependencies
_2. Installez les outils nécessaires pour le backend_
```
cd back
npm install
```

3. Install frontend dependencies
_3. Installez les outils nécessaires pour le frontend_
```
cd ..
cd Web-Developer-P6
npm install
```

4. Create a MongoDB Database on Atlas
_4. Créez une base de données MongoDB Atlas_

5. rename the .env2 file in the back directory to .env and add the neccessary information:\
_5. Renommez le fichier .env2 en .env et rajoutez les informations nécessaires_
```
DB_USER=Username-for-your-MongoDB-Database
DB_PWD=Password-for-your-MongoDB-Database
TOKEN_SECRET=Your-Secret-string
DB_CLUSTER_=Cluster-of-your-MongoDB-Database
DB_BASE=Name-of-your-MongoDB-Database
```



## Usage

1. Start backend
_1. Lancez le backend_
```
cd back
nodemon server
```

2. Start frontend
_2. Lancez le frontend_
```
cd Web-Developer-P6
npm start
```

3. Enjoy!
_3. Profitez !_