import React, { useState } from "react";
import topicData from "../topics/topicData.json";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function CustomTopicSelectDropdown({
  selectedTopic,
  onSelectTopic,
  styleSelector
}: {
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
  styleSelector?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function handleSelectTopic(topic: string) {
    onSelectTopic(topic);
    setIsOpen(false);
    console.log("Selected topic:", topic);
  }

  function handleClearSelection() {
    onSelectTopic('');
    setIsOpen(false);
  }

  return (
    <div
      className={`relative border border-gray-300 bg-gray-100 rounded p-1 ${
        selectedTopic ? "text-black" : "text-gray-400"
      } ${styleSelector === 'feed' ? 'w-96' : ''}`}
    >
      <button
        type="button"
        className={`cursor-pointer w-full flex items-center gap-2 ${styleSelector === 'feed' ? 'border border-gray-300 flex justify-center text-black' : ''}`}
        onClick={toggleDropdown}
      >
        {selectedTopic || "Select Topic"}
        {isOpen ? <IoIosArrowUp size={22} /> : <IoIosArrowDown size={22} />}
      </button>
      {isOpen && (
        <div className="absolute z-50 left-0 mx-4 bg-white border rounded p-2 text-center shadow-2xl">
          <ul className="border bg-gray-100">
            {topicData.map((t) => (
              <li
                className="inline-block px-2 py-1 rounded-full cursor-pointer m-1 shadow-lg"
                style={{
                  backgroundColor: t.textBackground,
                  color: t.textColor,
                }}
                key={t.topic}
                onClick={() => handleSelectTopic(t.topic)}
              >
                {t.topic}
              </li>
            ))}
            <li className="inline-block px-2 py-1 rounded-full cursor-pointer m-1 shadow-lg border border-red-400 text-black" onClick={handleClearSelection}>
              Clear Selection
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
