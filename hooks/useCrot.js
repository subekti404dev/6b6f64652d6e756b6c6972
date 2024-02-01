import { useEffect, useState } from 'react'
import Axios from 'axios'


export const useCrot = () => {
  const [url, setUrl] = useState('');

  const key = 'bagiBwang';

  useEffect(() => {
    getRandomLink();

  }, [])

  const getRandomLink = async () => {
    setUrl()
    const resp = await Axios.get(`https://crot-bareng.vercel.app/v1/crot/random`)
    if (resp.data?.data) {
      setUrl(resp.data.data)
    }

  }

  return { url, getRandomLink, key }
}
