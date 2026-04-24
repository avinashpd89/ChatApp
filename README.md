# ChatApp - Secure Real-Time Communication

A modern, high-performance chat application built with the MERN stack, featuring real-time messaging, group conversations, and secure WebRTC-based audio/video calling with End-to-End Encryption.

**Live Demo**: [chatapp-ryiv.onrender.com](https://chatapp-ryiv.onrender.com)

---

## 🚀 Key Features

- **Real-Time Messaging**: Instant message delivery using Socket.io.
- **End-to-End Encryption (E2E)**: Your messages are encrypted on your device and decrypted only by the recipient.
- **High-Quality Calls**: 1-to-1 and Group video/audio calls powered by WebRTC.
- **Call History**: Personal log of all incoming and outgoing calls with call-back functionality.
- **Group Management**: Create groups, manage members, and chat/call within groups.
- **Profile Customization**: Update your profile picture with built-in compression and editing.
- **Search & Filters**: Easily find contacts and filter chats by "All", "Unread", "Groups", or "Calls".
- **Responsive Design**: Fully optimized for Desktop and Mobile (including hidden input boxes during modal interactions).

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, DaisyUI.
- **State Management**: Zustand (with Persistence).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Real-Time Communication**: Socket.io.
- **Peer-to-Peer**: WebRTC (Simple-Peer).
- **Authentication**: JWT & Cookies.

---

## 🔐 How End-to-End Encryption Works

Security is the core of ChatApp. We implement a custom E2E encryption layer:

1.  **Key Generation**: When you first log in, your browser generates a unique set of cryptographic keys.
2.  **Public Key Exchange**: Your Public Key is shared with the server so others can find it, but your **Private Key never leaves your device**.
3.  **Encryption at the Source**: When you send a message, your app fetches the recipient's public key and encrypts the text.
4.  **Decryption at the Destination**: The message travels through our server as a "gibberish" string. Only the recipient, using their local Private Key, can turn it back into readable text.
5.  **Persistence**: Keys are securely stored in your browser's local storage, ensuring your history remains readable to you while staying invisible to us.

---

## 📞 How Video & Audio Calls Work

Our calling system uses **WebRTC (Web Real-Time Communication)** for low-latency, high-quality interaction:

1.  **Signaling**: We use Socket.io as a signaling server to help two devices find each other. They exchange "signals" (ICE candidates and SDP offers/answers).
2.  **Peer-to-Peer Connection**: Once signaled, the two devices connect **directly to each other**. Your video and audio data do not pass through our server, ensuring maximum privacy and speed.
3.  **Dynamic Streams**: The app dynamically switches between audio and video tracks. You can toggle your camera or microphone off/on during a call without disconnecting.
4.  **Group Calling**: We use a mesh network approach where participants connect to each other, allowing for synchronized group video sessions.

---

## 📜 Call History Management

The app features a sophisticated Call History system:
- **User-Specific**: History is tied to your account. If multiple people use the same browser, they will only see their own logs.
- **Quick Actions**: You can call someone back directly from the history list using the specific call type (Audio or Video) from that record.
- **Cleanup**: Easily delete individual records from your log with the hover-to-delete trash icon.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Account

### Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/chatApp.git
    cd chatApp
    ```

2.  **Backend Setup**:
    - Navigate to the `Backend` folder.
    - Create a `.env` file and add your `PORT`, `MONGODB_URI`, and `JWT_TOKEN`.
    - Run `npm install`.
    - Start the server: `npm run dev`.

3.  **Frontend Setup**:
    - Navigate to `Backend/Frontend`.
    - Run `npm install`.
    - Start the dev server: `npm run dev`.

---

## 📁 Directory Structure

```text
├── Backend
│   ├── controller      # API logic
│   ├── models          # Database schemas
│   ├── routes          # API endpoints
│   ├── SocketIO        # Socket logic & Call signaling
│   ├── index.js        # Main entry point
│   └── Frontend        # React application
│       ├── src
│       │   ├── components  # Reusable UI elements
│       │   ├── context     # Auth, Socket, and Call Providers
│       │   ├── home        # Main layout components
│       │   └── zustand     # Global state management
```
