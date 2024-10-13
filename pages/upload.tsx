import React, { useState } from 'react'
import Layout from '../components/Layout'

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('') // New: Title field
  const [description, setDescription] = useState('')
  const [capsuleDesc, setCapsuleDesc] = useState('') // New: Time Capsule description
  const [response, setResponse] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title) // Append title
    formData.append('description', description)
    formData.append('capsuleDesc', capsuleDesc) // Append time capsule description

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error uploading file:', error)
      setResponse('Error uploading file')
    }
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Upload File</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleFileChange}
            className="border rounded w-full p-2 mb-4"
          />

          {/* New Title Field */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border rounded w-full p-2 mb-4"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="File description"
            className="border rounded w-full p-2 mb-4"
          />

          {/* New Time Capsule Description Field */}
          <input
            type="text"
            value={capsuleDesc}
            onChange={(e) => setCapsuleDesc(e.target.value)}
            placeholder="Time Capsule Description"
            className="border rounded w-full p-2 mb-4"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </form>
        {response && <p className="mt-4 text-green-600">{response}</p>}
      </div>
    </Layout>
  )
}

export default UploadPage
