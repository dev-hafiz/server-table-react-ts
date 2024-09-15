import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ArtworkTable from "./components/DataTable";

function App() {
  return (
    <div className="table-container">
      <ArtworkTable />
    </div>
  );
}

export default App;
