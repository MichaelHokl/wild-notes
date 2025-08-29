import { useState, useEffect, use } from "react";

function Main({ search, setSearch }) {
  const [query, setQuery] = useState([]);
  const [spaceImgIsOpen, setSpaceImgIsOpen] = useState(true);
  const [savedImgsIsOpen, setSavedImgsIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedIMG, setSavedImg] = useState(() => {
    const stored = localStorage.getItem("savedIMG");
    return stored ? JSON.parse(stored) : [];
  });

  function handleSpaceImgToggle() {
    setSpaceImgIsOpen((isOpen) => !isOpen);
    setSavedImgsIsOpen(false);
  }

  function handleSavedImgsToggle() {
    setSavedImgsIsOpen((isOpen) => !isOpen);
    setSpaceImgIsOpen(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        setSpaceImgIsOpen(true);
        setSavedImgsIsOpen(false);
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(
            search
          )}&media_type=image&page_size=80`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Something went wrong!");
        const data = await res.json();
        const imageData = data.collection.items
          .map((item) => {
            const url = item.links.find(
              (link) =>
                (link.render === "image" && link.href.includes("medium")) ||
                link.href.includes("orig")
            )?.href;

            if (!url) return null;

            return {
              url,
              title: item.data[0]?.title || "Untitled",
              description:
                item.data[0]?.description || "No description available.",
            };
          })
          .filter(Boolean);

        setQuery(imageData);
        if (imageData.length === 0) {
          setError(`No images found for "${search}"`);
          setQuery([]);
        } else {
          setQuery(imageData);
          setError("");
        }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (search.length < 3) {
      setQuery([]);
      setError("");
      return;
    }
    fetchData();
    return function () {
      controller.abort();
    };
  }, [search]);

  useEffect(() => {
    localStorage.setItem("savedIMG", JSON.stringify(savedIMG));
  }, [savedIMG]);

  function handleImgSelection(url) {
    setSavedImg((prev) => {
      if (prev.includes(url)) return prev;
      return [...prev, url];
    });
  }
  function handleDelete(url) {
    setSavedImg((prev) => prev.filter((item) => item !== url));
  }

  return (
    <main>
      <UserTabs>
        <UserTab
          title="Images"
          onToggle={handleSpaceImgToggle}
          open={spaceImgIsOpen}
        ></UserTab>
        <UserTab
          title="Saved Images"
          onToggle={handleSavedImgsToggle}
          open={savedImgsIsOpen}
        />
      </UserTabs>
      {spaceImgIsOpen && (
        <OutputContainer>
          {isLoading && <Loader />}
          {error && <Error error={error} />}
          {!isLoading &&
            !error &&
            (query.length === 0 ? (
              <p className="message">
                Start typing to explore our universe. Some suggestions are
                "Orion Nebula" or "Sun". Both incredibly beautiful.{" "}
              </p>
            ) : (
              <Output
                query={query}
                onSelect={handleImgSelection}
                savedIMG={savedIMG}
              />
            ))}
        </OutputContainer>
      )}
      {savedImgsIsOpen && (
        <OutputContainer>
          {savedIMG.length === 0 ? (
            <p className="message">No saved pictures yet.</p>
          ) : (
            <SavedList saved={savedIMG} onDelete={handleDelete} />
          )}
        </OutputContainer>
      )}
    </main>
  );
}

function UserTabs({ children }) {
  return <div className="user-tabs">{children}</div>;
}

function UserTab({ title, onToggle, open }) {
  return (
    <div className={open ? "tab open" : "tab"} onClick={onToggle}>
      <h2>{title}</h2>
    </div>
  );
}

function OutputContainer({ children }) {
  return <div className="output-container">{children}</div>;
}

function Output({ query, onSelect, savedIMG }) {
  return (
    <div className="output">
      <ul className="output-ul">
        {query?.map((url, index) => (
          <li key={index}>
            <img src={url} alt="nasa" className="query-image" />
            {savedIMG.includes(url) ? (
              <p className="add-btn">Already Added</p>
            ) : (
              <AddButton onSelect={onSelect} query={query} index={index} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Error({ error }) {
  return <p className="message">{error}</p>;
}

function AddButton({ onSelect, query, index }) {
  return (
    <button className="add-btn" onClick={() => onSelect(query[index])}>
      + Save Image
    </button>
  );
}

function SavedList({ saved, onDelete }) {
  return (
    <ul className="output-ul">
      {saved.map((img, index) => (
        <li key={index}>
          <img src={img} alt={"nasa"} className="query-image" />
          <button className="btn-remove" onClick={() => onDelete(img)}>
            X
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Main;
