import "./App.css";

import { useQuery } from "@guesung/query";

interface Response {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const fetchJsonData = async (): Promise<Response> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  return response.json();
};

function App() {
  const { data } = useQuery({
    queryKey: "test",
    queryFn: fetchJsonData,
    initialData: {
      userId: 0,
      id: 0,
      title: "",
      body: "",
    },
  });

  return (
    <div>
      <h4>제목 : {data?.title}</h4>
      <p>{data?.body}</p>
    </div>
  );
}

export default App;
