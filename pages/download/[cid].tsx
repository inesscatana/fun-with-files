import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const DownloadPage: React.FC = () => {
  const router = useRouter()
  const { cid } = router.query

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!cid) return

    setLoading(true) // Start loading
    setError(null) // Reset error state

    try {
      const response = await fetch(`/api/files/${cid}`)

      if (!response.ok) {
        throw new Error('Failed to download the file')
      }

      // Handle the file as a blob (binary data)
      const blob = await response.blob()

      // Generate a download URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary anchor element to initiate the download
      const a = document.createElement('a')
      a.href = url

      // Infer file extension from MIME type if possible
      const mimeType =
        response.headers.get('Content-Type') || 'application/octet-stream'
      const extension = mimeType.split('/')[1] // e.g., 'png', 'pdf'

      a.download = `file-${cid}.${extension}` // Custom file name with inferred extension
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Clean up the URL object to prevent memory leaks
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
      setError('Failed to download the file. Please try again.')
    } finally {
      setLoading(false) // End loading state
    }
  }

  return (
    <Layout>
      <div>
        <h2>Download File</h2>
        {cid ? (
          <div>
            <p>Click the button below to download the file:</p>
            <button onClick={handleDownload} disabled={loading}>
              {loading ? 'Downloading...' : 'Download'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        ) : (
          <p>No file found.</p>
        )}
      </div>
    </Layout>
  )
}

export default DownloadPage
