function Header({ search, setSearch }) {
  return (
    <header>
      <Logo />
      <SearchForm search={search} setSearch={setSearch} />
    </header>
  );
}

function Logo() {
  return (
    <div className="logo">
      <img src="/logo.png" alt="wild notes logo" />
    </div>
  );
}

function SearchForm({ search, setSearch }) {
  return (
    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="e.g. Mouse"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
export default Header;
