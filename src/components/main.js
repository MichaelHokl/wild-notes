import { useState, useEffect } from "react";
import AddButton from "./AddButton";
import UserTabs from "./UserTabs";
import UserTab from "./UserTab";
import OutputContainer from "./OutputContainer";
import Output from "./Output";
import ImageCard from "./ImageCard";
import SavedList from "./SavedList";
import Loader from "./Loader";
import Error from "./Error";
import Msg from "./Msg";

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
              <Msg
                text="Start typing to explore our universe. Some suggestions are 'Orion Nebula'
      or 'Sun'. Both incredibly beautiful."
              />
            ) : (
              <Output query={query}>
                {query.map((img, i) => (
                  <ImageCard key={i} url={img} i={i} savedIMG={savedIMG}>
                    <AddButton
                      onSelect={handleImgSelection}
                      query={query}
                      index={i}
                    />
                  </ImageCard>
                ))}
              </Output>
            ))}
        </OutputContainer>
      )}
      {savedImgsIsOpen && (
        <OutputContainer>
          {savedIMG.length === 0 ? (
            <Msg text="No saved pictures yet." />
          ) : (
            <SavedList saved={savedIMG} onDelete={handleDelete} />
          )}
        </OutputContainer>
      )}
    </main>
  );
}

export default Main;
