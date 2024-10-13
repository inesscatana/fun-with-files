import axios from 'axios'
import FormData from 'form-data'

const pinataApiKey = process.env.PINATA_API_KEY
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY

export const uploadToPinata = async (fileContent: Buffer, fileName: string) => {
  const formData = new FormData()
  formData.append('file', fileContent, fileName)

  const pinataResponse = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${
          (formData as any)._boundary
        }`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    }
  )

  return pinataResponse.data
}
