import Link from 'next/link'
import Layout from '../components/Layout'

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-full">
        <h1 className="text-5xl font-bold text-blue-600 mb-6">Time Capsule</h1>
        <p className="text-xl text-gray-700 mb-8 text-center max-w-2xl">
          Capture and store your most cherished memories. Upload photos, share
          with friends, and preserve your moments forever in your personal time
          capsule.
        </p>
        <div className="space-x-4">
          <Link
            href="/upload"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Upload a Memory
          </Link>
          <Link
            href="/gallery"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            View Capsule
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
