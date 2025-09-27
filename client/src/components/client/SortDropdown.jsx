import { useState } from "react";
export default function SortDropdown({ sortOption, setSortOption }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "price-low-to-high", label: "Price: Low to High" },
    { value: "price-high-to-low", label: "Price: High to Low" },
    { value: "name-a-z", label: "Alphabetically: A-Z" },
    { value: "name-z-a", label: "Alphabetically: Z-A" },
    { value: "old-new", label: "Item, Old to new" },
    { value: "new-old", label: "Item, New to old" },
  ];

  const handleSelect = (option) => {
    setSortOption(option.value);
    setOpen(false);
  };

  const selected = options.find((opt) => opt.value === sortOption);

  return (
    <div className="sort-wrapper">
      <div className="sort-toggle" onClick={() => setOpen(!open)}>
        {selected.label}{" "}
        <span className={`arrow ${open ? "open" : ""}`}>▾</span>
      </div>

      <div className={`sort-dropdown ${open ? "open" : ""}`}>
        {options.map((option) => (
          <div
            key={option.value}
            className={`sort-option ${
              option.value === sortOption ? "active" : ""
            }`}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
