import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface CollapsibleProps {
  onSelectRows: (count: number) => void;
}

const Collapsible: React.FC<CollapsibleProps> = ({ onSelectRows }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggle = () => setIsOpen(!isOpen);

  const handleSubmit = () => {
    const count = parseInt(inputValue, 10);
    if (!isNaN(count)) {
      onSelectRows(count);
    }
  };

  return (
    <div className="collapsible-container">
      <button className="collapsible-header" onClick={toggle}>
        <span className="arrow">
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </button>
      {isOpen && (
        <div className="collapsible-content">
          <input
            type="number"
            className="input-row"
            placeholder="Select rows..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Collapsible;
