import React, { useState, useEffect } from 'react';
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [inputPublicKey, setInputPublicKey] = useState('');
  const [inputSignature, setInputSignature] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [error, setError] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Set the hash function for ed25519
    ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
  }, []);

  // Utility function to convert Uint8Array to hex string
  const toHexString = (bytes) => {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  };

  // Utility function to convert hex string to Uint8Array
  const fromHexString = (hexString) => {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  };

  // Generate key pair
  const generateKeyPair = async () => {
    try {
      const privateKeyBytes = ed.utils.randomPrivateKey();
      const publicKeyBytes = await ed.getPublicKey(privateKeyBytes);

      setPublicKey(toHexString(publicKeyBytes));
      setPrivateKey(toHexString(privateKeyBytes));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Download key as a file
  const downloadKey = (key, keyType) => {
    const element = document.createElement("a");
    const file = new Blob([key], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${keyType}_key.txt`;
    document.body.appendChild(element); 
    element.click();
  };

  // Share key via WhatsApp or Discord
  const shareKey = (platform) => {
    let url = '';
    const messageToSend = `Here is my public key: ${publicKey}`;

    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageToSend)}`;
    } else if (platform === 'discord') {
      url = `https://discord.com/channels/@me`;
    }

    window.open(url, '_blank');
  };

  // Sign message
  const signMessage = async () => {
    try {
      if (!message) throw new Error('Message is required to generate signature');
      const privateKeyBytes = fromHexString(privateKey);
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await ed.sign(messageBytes, privateKeyBytes);
      setSignature(toHexString(signatureBytes));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Verify Signature
  const verifySignature = async () => {
    try {
      if (!message || !inputSignature || !inputPublicKey) throw new Error('Message, Signature, or Public Key is missing');
      const publicKeyBytes = fromHexString(inputPublicKey);
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = fromHexString(inputSignature);

      const isValid = await ed.verify(signatureBytes, messageBytes, publicKeyBytes);
      setVerificationResult(isValid ? 'Valid Signature' : 'Invalid Signature');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`App ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <h1>Ed25519 Signature System</h1>

      {/* Theme Change Button */}
      <button onClick={toggleTheme}>
        {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      </button>

      {/* Navigation Buttons */}
      <div>
        <button onClick={() => setView('generate')}>Go to Key Generation</button>
        <button onClick={() => setView('verify')}>Go to Signature Verification</button>
      </div>

      {/* Key Generation Section */}
      {view === 'generate' && (
        <div>
          <h2>Generate Key Pair</h2>
          <button onClick={generateKeyPair}>Generate Keys</button>
          {publicKey && privateKey && (
            <div>
              <p><b>Public Key:</b> {publicKey}</p>
              <p><b>Private Key:</b> {privateKey}</p>

              {/* Download Buttons */}
              <button onClick={() => downloadKey(publicKey, 'public')}>Download Public Key</button>
              <button onClick={() => downloadKey(privateKey, 'private')}>Download Private Key</button>

              {/* Share Buttons */}
              <button onClick={() => shareKey('whatsapp')}>Share via WhatsApp</button>
              <button onClick={() => shareKey('discord')}>Share via Discord</button>

              {/* Signature Generation */}
              <h3>Generate Signature</h3>
              <textarea
                placeholder="Enter message to sign"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={signMessage}>Generate Signature</button>
              {signature && (
                <div>
                  <p><b>Signature:</b> {signature}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Signature Verification Section */}
      {view === 'verify' && (
        <div>
          <h2>Verify Signature</h2>

          {/* Message Input */}
          <textarea
            placeholder="Enter the message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <br />

          <textarea
            placeholder="Enter Public Key for verification"
            value={inputPublicKey}
            onChange={(e) => setInputPublicKey(e.target.value)}
          />
          <textarea
            placeholder="Enter Signature for verification"
            value={inputSignature}
            onChange={(e) => setInputSignature(e.target.value)}
          />
          <br />
          <button onClick={verifySignature}>Verify Signature</button>
          {verificationResult && (
            <div>
              <p><b>Verification Result:</b> {verificationResult}</p>
            </div>
          )}
        </div>
      )}

      {/* Error Handling */}
      {error && <div className="error"><p>{error}</p></div>}
    </div>
  );
}

export default App;