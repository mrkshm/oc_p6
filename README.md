# oc_p6
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

4. create a .env file for the backend
```
cd ..
cd back
touch .env
```

5. Paste the following into the .env file:
```
PORT=3000
DB_USER=mrks
DB_PWD=qweasd
TOKEN_SECRET=13fE43Fd96gXd
```

## Usage

1. Start backend
```
cd back
nodemon server
```

2. Start frontend
```
cd ..
cd Web-Developer-P6
npm start
```

3. Enjoy