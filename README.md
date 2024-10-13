# Fun With Files - Time Capsule

**Fun With Files** is a decentralized file-sharing platform where users can upload, view, and preserve their most cherished memories. Using Pinata to integrate with IPFS, the platform ensures decentralized and secure file storage. The application is built with **Next.js**, **MongoDB**, and **Tailwind CSS** for a modern, responsive user experience.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [File Upload Workflow](#file-upload-workflow)
- [API Endpoints](#api-endpoints)

## Features

- **File Upload to IPFS:** Upload images with titles, descriptions, and tags. Files are stored on IPFS through Pinata.
- **File Gallery:** Browse uploaded images in a grid format, with metadata.
- **View Details:** Click on an image to view the full details including title, description, and tags.
- **Download Images:** Download your files from the gallery in their original format.
- **Metadata Storage:** Metadata about each file (like the title and description) is stored in MongoDB.

## Technologies Used

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Next.js API routes, MongoDB (for metadata storage)
- **File Storage:** IPFS via Pinata API
- **Styling:** Tailwind CSS for a responsive and modern design

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/fun-with-files.git
   cd fun-with-files

   ```

2. **Install dependencies:**

   ```bash
    npm install
   ```

3. **Set up environment variables:**

Create a .env.local file in the root directory and add your MongoDB connection string and Pinata API keys:

```bash
  MONGODB_URI=your-mongodb-connection-string
  PINATA_API_KEY=your-pinata-api-key
  PINATA_SECRET_API_KEY=your-pinata-secret-key
```

4. **Run the development server:**

```bash
  npm run dev
```

The application will be available at http://localhost:3000.
