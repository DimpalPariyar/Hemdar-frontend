import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { BASE_URL } from 'config';

export default function useProducts() {
  const [products, setProducts] = useState<any>([]);

  const getProducts = async () => {
    try {
      await axios.get(`${BASE_URL}/advisory/product`).then((response: any) => {
        const hosts = response.data || [];
        setProducts(hosts);
      });
    } catch (error) {
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return { products };
}
