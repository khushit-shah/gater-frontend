import React, { useState } from "react";
import { QuestionService } from "../QuestionService";

const FilterTags = (props) => {
  let tags = QuestionService.getTags();
  const [selectedTags, setSelectedTags1] = useState([]);
  const [value, setValue] = useState("");
  const [isMyInputFocused, setIsMyInputFocused] = useState(false);

  const setSelectedTags = (selectedTags) => {
    setSelectedTags1(selectedTags);
    props.tagsSelected(selectedTags);

  }
  return (
    <div className="mb-6 mr-6">
      <label
        htmlFor="filter"
        className="block mb-2  ml-3 mt-2 text-xl font-medium text-gray"
      >
        Filter:
      </label>
      <input
        onBlur={(e) => setIsMyInputFocused(false)}
        onFocus={() => setIsMyInputFocused(true)}
        type="text"
        id="filter"
        className="ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full overflow-visible p-2"
        placeholder="gate-2023"
        required
        list="tags"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex flex-wrap ml-3">
        {selectedTags.map((option) => (
          <li
            key={option}
            className={`px-4 py-2 mr-1 mb-1 mt-1 rounded  hover:bg-gray-100 cursor-pointer ${
              !option.startsWith("-")
                ? "bg-green-200  hover:bg-blue-100"
                : "bg-red-200 hover:bg-gray-100"
            }`}
            onContextMenu={(e) => {
                console.log("hrer")
                e.preventDefault();
              return false;
            }}
            onMouseDown={(e) => {
              e.preventDefault();

              console.log(option);
              if (
                !selectedTags.includes(option) &&
                !selectedTags.includes("-" + option)
              )
                setSelectedTags([
                  ...selectedTags,
                  e.button === 2 ? "-" + option : option,
                ]);
              else if (e.button === 2 && !option.startsWith("-")) {
                setSelectedTags([
                  ...selectedTags.filter((val) => val !== option),
                  "-" + option,
                ]);
              } else if (e.button !== 2 && option.startsWith("-")) {
                setSelectedTags([
                  ...selectedTags.filter((val) => val !== option),
                  option.substr(1),
                ]);
              } else {
                setSelectedTags(selectedTags.filter((val) => val !== option));
              }
            }}
          >
            {option.startsWith("-") ? option.substr(1) : option} x
            {QuestionService.getCount(
              option.startsWith("-") ? option.substr(1) : option
            )}
          </li>
        ))}
      </div>
      {/* <datalist id="tags">
        {tags.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist> */}
      {isMyInputFocused && (
        <ul className="absolute overflow-y-scroll flex flex-wrap ml-4 left-0 right-0 z-10 bg-white border rounded-lg shadow-lg">
          {tags
            .filter((option) =>
              option.toLowerCase().includes(value.toLowerCase())
            )
            .map((option) => (
              <li
                key={option}
                className={`px-4 py-2 mr-1 mb-1 mt-1 rounded  hover:bg-gray-100 cursor-pointer ${
                  selectedTags.includes(option)
                    ? "bg-green-200  hover:bg-blue-100"
                    : selectedTags.includes("-" + option)
                    ? "bg-red-200 hover:bg-gray-100"
                    : "bg-blue-100 hover:bg-green-100"
                }`}
                onContextMenu={(e) => {
                    e.preventDefault();
                  return false;
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  console.log(e.button);
                  console.log(option);
                  if (
                    !selectedTags.includes(option) &&
                    !selectedTags.includes("-" + option)
                  )
                    setSelectedTags([
                      ...selectedTags,
                      e.button === 2 ? "-" + option : option,
                    ]);
                  else if (e.button === 2 && selectedTags.includes(option)) {
                    setSelectedTags([
                      ...selectedTags.filter((val) => val !== option),
                      "-" + option,
                    ]);
                  } else if (
                    e.button !== 2 &&
                    selectedTags.includes("-" + option)
                  ) {
                    setSelectedTags([
                      ...selectedTags.filter((val) => val !== "-" + option),
                      option,
                    ]);
                  } else {
                    setSelectedTags(
                      selectedTags.filter((val) => val !== option)
                    );
                  }
                }}
              >
                {option} x{QuestionService.getCount(option)}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default FilterTags;
