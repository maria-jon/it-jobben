import "./App.css";
import { getJobs } from "./services/jobService";

function App() {
  return <>
  <button onClick={getJobs}></button>
  </>;
}

export default App;
