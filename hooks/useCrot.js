import { useEffect, useState } from 'react'
import Axios from 'axios'


export const useCrot = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const key = 'bagiBwang';

  useEffect(() => {
    getRandomLink();

  }, [])

  const getRandomLink = async () => {
    try {
      setUrl()
      setLoading(true)
      const resp = await Axios.get(`/api/crot`)
      if (resp.data?.data) {
        setUrl(resp.data.data)
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.log(e);
    }
  }

  return { url, getRandomLink, key, loading }
}
