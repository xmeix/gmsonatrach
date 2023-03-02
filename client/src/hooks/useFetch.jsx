import { useEffect } from "react";

const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(
    async (url) => {
      setLoading(true);
      await axios
        .get(url)
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    },
    [url]
  );

  return [data, loading, error];
};

export default useFetch;
