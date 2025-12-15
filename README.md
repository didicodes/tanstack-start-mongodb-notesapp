# Notes App - TanStack Start + MongoDB

A simple full-stack notes app built with TanStack Start and MongoDB, showcasing type-safe server functions, SSR, and a clean MongoDB integration.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** (Node.js 22+ recommended for best compatibility)
- **npm**, **pnpm**, or **yarn** package manager
- **MongoDB** - Either:
  - Local MongoDB installation, OR
  - Free MongoDB Atlas account ([sign up here](https://www.mongodb.com/cloud/atlas))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/didicodes/tanstack-start-mongodb-notesapp.git
cd tanstack-start-mongodb-notesapp
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set Up MongoDB

Choose one of these options:

#### Option A: MongoDB Atlas (Recommended for Beginners)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose password authentication
   - Set permissions to "Read and write to any database"
4. Whitelist your IP address:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
5. Get your connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `notes-app`

#### Option B: Local MongoDB

If you have MongoDB installed locally:

**macOS (with Homebrew):**

```bash
brew services start mongodb-community
```

**Linux (with systemd):**

```bash
sudo systemctl start mongod
```

**Windows:**
MongoDB should start automatically as a service.

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
# For MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-app

# For local MongoDB
# MONGODB_URI=mongodb://localhost:27017/notes-app
```

**Important:** Replace `username`, `password`, and `cluster` with your actual values!

### 5. Start the Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)
