import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'

interface ImageData {
  cid: string
  title: string
  description: string
  capsuleDesc: string
}

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch the images from the API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/gallery')
        const data = await res.json()
        setImages(data)
      } catch (error) {
        console.error('Error fetching images:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading...</div>
      </Layout>
    )
  }

  if (images.length === 0) {
    return (
      <Layout>
        <div className="text-center">No images uploaded yet.</div>
      </Layout>
    )
  }

  const handleDownload = async (cid: string, title: string) => {
    try {
      const response = await fetch(`/api/files/${cid}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.cid}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={`https://gateway.pinata.cloud/ipfs/${image.cid}`}
                alt={image.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{image.title}</h2>
                <p className="text-gray-600">{image.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Capsule: {image.capsuleDesc}
                </p>

                <div className="mt-4 flex space-x-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => handleDownload(image.cid, image.title)}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default GalleryPage
