import { useState } from "react";
import "../index.css";
import Header from "./Header";
import Main from "./Main";

function App() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputValue) return;
    setSearch(inputValue);
  }

  return (
    <div className="App">
      <Header
        value={inputValue}
        setInputValue={setInputValue}
        onSubmit={handleSubmit}
      />
      <Main search={search} setSearch={setSearch} />
    </div>
  );
}

export default App;
