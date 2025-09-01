function UserTab({ title, onToggle, open }) {
  return (
    <div className={open ? "tab open" : "tab"} onClick={onToggle}>
      <h2>{title}</h2>
    </div>
  );
}

export default UserTab;
