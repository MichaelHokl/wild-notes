function ImageCard({ url, i, savedIMG, children }) {
  return (
    <li key={i}>
      <img src={url.url} alt="nasa" className="query-image" />
      <p className="info">{url.title}</p>
      {savedIMG.includes(url) ? (
        <p className="add-btn">Already Added</p>
      ) : (
        children
      )}
    </li>
  );
}

export default ImageCard;
