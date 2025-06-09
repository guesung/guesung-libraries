import { useState } from "react";
import "./App.css";

import { Funnel } from "@guesung/funnel";

function App() {
  const [count, setCount] = useState(0);

  console.log(Funnel);

  return (
    <>
      <Funnel></Funnel>
    </>
  );
}

export default App;
