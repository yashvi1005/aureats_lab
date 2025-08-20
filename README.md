### Aureates Pokemon - Backend (Node/Express/MongoDB)

Run the backend:

Create `.env` inside `server` directory with 
```
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/aureates-pokemon
CORS_ORIGIN=http://localhost:3000
```
Then run:

```
cd server
npm install
npm run dev
```

### Aureates Pokemon - Frontend (React + Vite + MUI)


Run the frontend:

```
cd client
npm install
npm run dev
```

Create `.env` if needed with 
```
VITE_API_BASE_URL=http://localhost:4000
```



The app expects the backend on `http://localhost:4000` by default.
