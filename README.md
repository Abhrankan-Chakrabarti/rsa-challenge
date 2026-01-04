# 🔐 RSA Factoring Challenge (MERN)

An interactive RSA challenge website rewritten with the **MERN stack**  
(MongoDB, Express, React, Node.js). Each challenge presents a real RSA modulus  
from the historical RSA Factoring Challenge, along with a ciphertext.  
Your goal is to recover the original plaintext. Guesses are verified using SHA‑256  
and recorded on the leaderboard.

---

## 📂 Project Structure

```
rsa-challenge/
├── backend/
│   ├── server.js          # Express server
│   ├── routes/
│   │   ├── leaderboard.js # Leaderboard API
│   │   ├── submit.js      # Submission API
│   │   └── challenges.js  # Challenges API
│   ├── models/
│   │   ├── Solve.js       # Mongoose schema for submissions
│   │   └── Challenge.js   # Mongoose schema for challenge metadata
│   └── seed.js            # Script to load RSA challenges into MongoDB
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # React app entry
│   │   ├── components/    # ChallengeSelect, GuessForm, Leaderboard
│   │   └── rsa_all_ciphertexts_hashed.json # Challenge data (seed source)
│   └── package.json
└── package.json           # Root config with concurrently and seed shortcut
```

---

## 🚀 Getting Started

### 1. Clone & install
```bash
git clone https://github.com/Abhrankan-Chakrabarti/rsa-challenge.git
cd rsa-challenge
npm install
```

### 2. Backend setup
```bash
cd backend
npm install
npm start
```
- Runs Express server at `http://localhost:5000`
- Connects to MongoDB at `mongodb://localhost:27017/rsa_challenge`

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
- Runs Vite dev server at `http://localhost:5173`

### 4. Run both together
At project root:
```bash
npm run dev
```
This uses `concurrently` to start frontend and backend together.

### 5. Seed the database
At project root:
```bash
npm run seed
```
This runs `backend/seed.js` and loads all RSA challenges from  
`rsa_all_ciphertexts_hashed.json` into MongoDB automatically.

---

## 🧩 Features

- **Challenge selection**: Choose RSA‑100, RSA‑110, … from dropdown
- **Guess verification**: SHA‑256 check against stored hash
- **Leaderboard**: Displays top solvers, latest solve, per‑challenge counts
- **Persistence**: MongoDB stores solves with nickname, challenge, timestamp
- **Duplicate protection**: Prevents duplicate submissions for same nickname/challenge
- **Seed script**: Quickly populate MongoDB with all RSA challenges

---

## 📖 RSA‑129 Encoding

Plaintext is encoded as decimal pairs:
- `A = 01, B = 02, …, Z = 26`
- `Space = 00`
- Example:  
  ```
  0805121215002315181204
  → 08 05 12 12 15 00 23 15 18 12 04
  → HELLO WORLD
  ```

---

## 🛠 Development Notes

- Backend: Express + Mongoose, CORS enabled
- Frontend: React + Vite + TypeScript
- Root: `concurrently` for unified dev workflow
- Database: MongoDB with compound index to prevent duplicate solves
- Seeding: `npm run seed` at root loads all challenges into MongoDB

---

## 📜 License

MIT License
