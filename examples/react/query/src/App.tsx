import "./App.css";

import { setQueryData, useQuery } from "@guesung/query";

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
	const { data, refetch } = useQuery({
		queryKey: "test",
		queryFn: fetchJsonData,
		isSuspense: true,
	});

	return (
		<div>
			<h4>제목 : {data?.title}</h4>
			<p>{data?.body}</p>
			<button onClick={() => refetch()}>refetch</button>
			<button
				onClick={() =>
					setQueryData("test", {
						title: "test",
						body: "test",
					})
				}
			>
				setQueryData
			</button>
		</div>
	);
}

export default App;
