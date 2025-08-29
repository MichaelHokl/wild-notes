function Header({ value, setInputValue, onSubmit }) {
  return (
    <header>
      <Logo />
      <SearchForm
        value={value}
        setInputValue={setInputValue}
        onSubmit={onSubmit}
      />
    </header>
  );
}

function Logo() {
  return <div className="logo">Universe On Screen</div>;
}

function SearchForm({ value, setInputValue, onSubmit }) {
  return (
    <form className="search-form" id="form-submit" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="e.g. Moon"
        value={value}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
export default Header;
