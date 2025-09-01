function SavedList({ saved, onDelete }) {
  return (
    <ul className="output-ul">
      {saved.map((img, index) => (
        <li key={index}>
          <img src={img.url} alt={"nasa"} className="query-image" />
          <button className="btn-remove" onClick={() => onDelete(img)}>
            X
          </button>
          <p className="info">{img.title}</p>
        </li>
      ))}
    </ul>
  );
}

export default SavedList;
