import "./App.css";

import { Funnel, useFunnelContext } from "@guesung/funnel";

function App() {
  return (
    <Funnel>
      <Funnel.Step index={1}>
        <Step1 />
      </Funnel.Step>
      <Funnel.Step index={2}>
        <Step2 />
      </Funnel.Step>
      <Funnel.Step index={3}>
        <Step3 />
      </Funnel.Step>
    </Funnel>
  );
}

export default App;

function Step1() {
  const { goNextStep } = useFunnelContext();
  return (
    <div>
      <h1>Step 1</h1>
      <button onClick={goNextStep}>Next</button>
    </div>
  );
}

function Step2() {
  const { goNextStep } = useFunnelContext();
  return (
    <div>
      <h1>Step 2</h1>
      <button onClick={goNextStep}>Next</button>
    </div>
  );
}

function Step3() {
  const { resetStep } = useFunnelContext();
  return (
    <div>
      <h1>Step 3</h1>
      <button onClick={resetStep}>Reset</button>
    </div>
  );
}
