import { useEffect, useState } from "react";
import "../index.css";
import Header from "./Header";
import Main from "./main";

function App() {
  const [search, setSearch] = useState("");

  return (
    <div className="App">
      <Header search={search} setSearch={setSearch} />
      <Main search={search} />
    </div>
  );
}

export default App;
