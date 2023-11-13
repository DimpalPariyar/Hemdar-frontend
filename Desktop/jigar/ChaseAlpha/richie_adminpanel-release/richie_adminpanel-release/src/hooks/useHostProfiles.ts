import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import axios from 'utils/axios';

const useHostProfiles = () => {
  const [hostProfiles, setHostProfiles] = useState<any>([]);

  const getData = async () => {
    try {
      await axios.get(`${BASE_URL}/hostProfile/all`).then((response: any) => {
        const hosts = response.data || [];
        setHostProfiles(hosts);
      });
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return { hostProfiles, refresh: getData };
};

export default useHostProfiles;
