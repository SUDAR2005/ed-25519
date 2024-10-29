# Ed25519 Signature System

This project provides a simple web interface for generating and verifying digital signatures using the Ed25519 algorithm. The app allows users to generate key pairs, sign messages, verify signatures, and download/share keys.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- 
## Project Overview

The Ed25519 Signature System is a web-based application that implements digital signature functionality with the Ed25519 algorithm. Users can securely generate keys, sign messages, and verify signatures, which are fundamental operations in modern cryptography for authentication and data integrity.

## Features
- **Key Generation**: Generate Ed25519 public and private keys.
- **Signature Generation**: Sign a custom message using a generated private key.
- **Signature Verification**: Verify the authenticity of a signature given the public key, message, and signature.
- **Key Download**: Download generated keys for offline storage.
- **Share Key**: Share public keys through WhatsApp or Discord.
- **Dark/Light Theme Toggle**: Switch between dark and light modes.

## Tech Stack
- **React** for building the frontend UI
- **@noble/ed25519** for Ed25519 digital signatures
- **@noble/hashes/sha512** for SHA-512 hashing

## Installation

### Prerequisites
Ensure you have Node.js and npm installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ed25519-signature-system.git
   cd ed25519-signature-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. **Start the Development Server**
   ```bash
   npm start
   ```

2. **Open the App**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### Available Scripts
In the project directory, you can run:
- **`npm start`**: Runs the app in the development mode.
- **`npm run build`**: Builds the app for production to the `build` folder.

## Project Structure

```
.
├── public                 # Public assets
├── src
│   ├── components         # UI components
│   ├── App.js             # Main app component
│   ├── index.js           # Entry point for React
│   └── sha.js             # Ed25519 signature logic
├── .gitignore
├── package.json           # Project configuration and dependencies
└── README.md              # Project documentation
```

## Key Files and Functions
- **App.js**: Contains the main UI logic and components for switching between views, generating/verifying signatures, and sharing keys.
- **sha.js**: Ed25519 digital signature logic using the `@noble/ed25519` library.
