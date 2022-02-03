# OpenClassrooms Projet 6
## Installation

1. Clone this repository and cd into it
```
git clone https://github.com/mrkshm/oc_p6.git
cd oc_p6.git
```

2. Install backend dependencies
```
cd back
npm install
```

3. Install frontend dependencies
```
cd ..
cd Web-Developer-P6
npm install
```

4. Create a MongoDB Database on Atlas

5. rename the .env2 file in the back directory to .env and add the neccessary information:
DB_USER=Username-for-your-MongoDB-Database
DB_PWD=Password-for-your-MongoDB-Database
TOKEN_SECRET=Your-Secret-string
DB_CLUSTER_=Cluster-of-your-MongoDB-Database
DB_BASE=Name-of-your-MongoDB-Database



## Usage

1. Start backend
```
cd back
nodemon server
```

2. Start frontend
```
cd Web-Developer-P6
npm start
```

3. Enjoy