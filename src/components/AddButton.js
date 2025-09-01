function AddButton({ onSelect, query, index }) {
  return (
    <button className="add-btn" onClick={() => onSelect(query[index])}>
      + Save Image
    </button>
  );
}

export default AddButton;
