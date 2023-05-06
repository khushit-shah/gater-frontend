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
  };
  return (
    <div className="mb-6 mr-6">
      <label
        htmlFor="filter"
        className="block mb-2  ml-3 mt-2 text-xl font-medium text-gray"
      >
        Filter: <span className="text-gray-400" title="How many possible tags combination for a question to be selected if there are m (^)(red) and n (v)(green) filte? (m!= 0, n!=0).">(All <span className="text-red-500"> ^ </span> and atleast one  <span className="text-green-500"> v </span> must be present in the tag for a question to be selected. <a target="_blank" rel="noreferrer" href="https://github.com/khushit-shah/gater-frontend#working-of-filters">example</a>)</span>
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
        {selectedTags.map((option) => {
          if (option.startsWith("-")) {
            option = option.substr(1);
          }
          return (
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
                console.log("hrer");
                e.preventDefault();
                return false;
              }}
            >
              {option} x({QuestionService.getCount(option)})
              {!selectedTags.includes("-" + option) ? (
                <button
                  className="mr-1 ml-1 border rounded-full w-25 border-red-600 bg-red-200 pl-3 pr-3"
                  onMouseDown={(e) => {
                    setSelectedTags([
                      ...selectedTags.filter((s) => s !== option),
                      "-" + option,
                    ]);
                  }}
                >
                  ^
                </button>
              ) : (
                <button
                  className="mr-1 ml-1 border rounded-full w-25 border-gray-700 bg-gray-300 pl-3 pr-3"
                  onMouseDown={(e) => {
                    setSelectedTags(
                      selectedTags.filter((s) => s !== "-" + option)
                    );
                  }}
                >
                  -
                </button>
              )}
              {!selectedTags.includes(option) ? (
                <button
                  className="mr-1 ml-1 border rounded-full w-25 border-green-600 bg-green-200 pl-3 pr-3"
                  onMouseDown={(e) => {
                    setSelectedTags([
                      ...selectedTags.filter((s) => s !== "-" + option),
                      option,
                    ]);
                  }}
                >
                  v
                </button>
              ) : (
                <button
                  className="mr-1 ml-1 border rounded-full w-25 border-gray-700 pl-3 pr-3 bg-gray-300"
                  onMouseDown={(e) => {
                    setSelectedTags(selectedTags.filter((s) => s !== option));
                  }}
                >
                  -
                </button>
              )}
            </li>
          );
        })}
      </div>
      {/* <datalist id="tags">
        {tags.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist> */}
      {isMyInputFocused && (
        <ul className="overflow-y-scroll h-full  absolute flex flex-wrap ml-4  z-10 bg-white border rounded-lg shadow-lg ">
          {tags
            .filter((option) =>
              option.toLowerCase().includes(value.toLowerCase())
            )
            .map((option) => (
              <li
                key={option}
                className={`ml-1 px-4 py-2 mr-1 mb-1 mt-1 rounded  hover:bg-gray-100  ${
                  selectedTags.includes(option)
                    ? "bg-green-200"
                    : selectedTags.includes("-" + option)
                    ? "bg-red-200"
                    : "bg-gray-200"
                }`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  return false;
                }}
              >
                {option} x({QuestionService.getCount(option)})
                {!selectedTags.includes("-" + option) ? (
                  <button
                    className="mr-1 ml-1 border rounded-full w-25 border-red-600 bg-red-200 pl-3 pr-3"
                    onMouseDown={(e) => {
                      setSelectedTags([
                        ...selectedTags.filter((s) => s !== option),
                        "-" + option,
                      ]);
                    }}
                  >
                    ^
                  </button>
                ) : (
                  <button
                    className="mr-1 ml-1 border rounded-full w-25 border-gray-700 bg-gray-300 pl-3 pr-3"
                    onMouseDown={(e) => {
                      setSelectedTags(
                        selectedTags.filter((s) => s !== "-" + option)
                      );
                    }}
                  >
                    -
                  </button>
                )}
                {!selectedTags.includes(option) ? (
                  <button
                    className="mr-1 ml-1 border rounded-full w-25 border-green-600 bg-green-200 pl-3 pr-3"
                    onMouseDown={(e) => {
                      setSelectedTags([
                        ...selectedTags.filter((s) => s !== "-" + option),
                        option,
                      ]);
                    }}
                  >
                    v
                  </button>
                ) : (
                  <button
                    className="mr-1 ml-1 border rounded-full w-25 border-gray-700 pl-3 pr-3 bg-gray-300"
                    onMouseDown={(e) => {
                      setSelectedTags(selectedTags.filter((s) => s !== option));
                    }}
                  >
                    -
                  </button>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default FilterTags;
