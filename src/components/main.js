import { useState, useEffect } from "react";

function Main({ search }) {
  const [favoritesIsOpen, setFavoritesIsOpen] = useState(false);
  const [categoriesIsOpen, setCategoriesIsOpen] = useState(false);

  function handleFavoriteToggle() {
    setFavoritesIsOpen((isOpen) => !isOpen);
    setCategoriesIsOpen(false);
  }

  function handleCategoriesToggle() {
    setCategoriesIsOpen((isOpen) => !isOpen);
    setFavoritesIsOpen(false);
  }
  const [animal, setAnimal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function fetchAnimals() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://api.api-ninjas.com/v1/animals?name=${search}`,
          {
            signal: controller.signal,
            headers: {
              "X-Api-Key": "Oog+IjsjGwM8A2+jmi73Tw==Moq3ZP64sDIhIxxj",
            },
          }
        );
        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        console.log(data);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (search.length < 3) {
      setAnimal([]);
      setError("");
      return;
    }
    fetchAnimals();
    return function () {
      controller.abort();
    };
  }, [search]);
  return (
    <main>
      <UserTabs>
        <UserTab title="My favorites" onToggle={handleFavoriteToggle} />
        <UserTab title="Categories" onToggle={handleCategoriesToggle} />
      </UserTabs>
      <OutputContainer>
        {favoritesIsOpen && (
          <Output onDelete={handleFavoriteToggle}>
            <h2>My favorites</h2>
            <p>
              Far far away, behind the word mountains, far from the countries
              Vokalia and Consonantia, there live the blind texts. Separated
              they live in Bookmarksgrove right at the coast of the Semantics, a
              large language ocean. A small river named Duden flows by their
              place and supplies it with the necessary regelialia. It is a
              paradisematic country, in which roasted parts of sentences fly
              into your mouth. Even the all-powerful Pointing has no control
              about the blind texts it is an almost unorthographic life One day
              however a small line of blind text by the name of Lorem Ipsum
              decided to leave for the far World of Grammar.{" "}
            </p>
          </Output>
        )}
        {categoriesIsOpen && (
          <Output onDelete={handleCategoriesToggle}>
            <h2>Categories</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
              imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
              mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
              semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
              porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem
              ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
              viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean
              imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper
              ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus,
              tellus eget condimentum rhoncus, sem quam semper libero, sit amet
              adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus
              pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt
              tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam
              quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis
              leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis
              magna. Sed consequat, leo eget bibendum sodales, augue velit
              cursus nunc,
            </p>
          </Output>
        )}
      </OutputContainer>
    </main>
  );
}

function UserTabs({ children }) {
  return <div className="user-tabs">{children}</div>;
}

function UserTab({ title, onToggle }) {
  return (
    <div className="tab" onClick={onToggle}>
      <h2>{title}</h2>
    </div>
  );
}

function OutputContainer({ children }) {
  return <div className="output-container">{children}</div>;
}

function Output({ children, onDelete }) {
  return (
    <div className="output">
      <button className="btn-delete" onClick={onDelete}>
        X
      </button>
      {children}
    </div>
  );
}

export default Main;
