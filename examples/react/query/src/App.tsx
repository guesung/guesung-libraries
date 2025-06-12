import "./App.css";

import { useQuery } from "@guesung/query";

const fetchJsonData = async (): Promise<{ title: string }> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  return response.json();
};

function App() {
  const { data } = useQuery({
    queryKey: "test",
    queryFn: fetchJsonData,
    initialData: {
      title: "test",
    },
  });

  return <div>s</div>;
}

export default App;
