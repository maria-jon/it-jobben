import "./App.css";
import { getJobById, getJobs } from "./services/jobService";

// Hard coded id and buttons to fetch all job ads 
// and single job ad can be removed whren the routing is in place 

const id = "29997240"

function App() {
  return <>
  <button onClick={getJobs}>Alla jobb</button>
  <button onClick={() => getJobById(id)}>Enskilt jobb</button>
  </>;
}

export default App;
