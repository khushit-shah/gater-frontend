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
    <div className="mb-6 mr-6 relative">
      <label
        htmlFor="filter"
        className="block mb-2  ml-3 mt-2 text-xl font-medium text-gray"
      >
        Filter:
      </label>
      <input
        // onBlur={(e) => setIsMyInputFocused(false)}
        onFocus={() => setIsMyInputFocused(true)}
        type="text"
        id="filter"
        className="ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full overflow-visible p-2"
        placeholder="gate-2023"
        required
        list="tags"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex flex-wrap ml-3 list-none">
        {selectedTags.map((option) => {
          return (
            <li className="rounded border ml-1 px-4 py-2 mr-1 mb-1 mt-1">
              <input
                type="checkbox"
                checked={true}
                key={option}
                id={option}
                className={`border-black border ml-1 px-4 py-2 mr-1 mb-1 mt-1`}
                onChange={(e) => {
                  setSelectedTags(selectedTags.filter((e) => e !== option));
                }}
              />
              <label className="text-black" htmlFor={option}>
                {option} x({QuestionService.getCount(option)})
              </label>
            </li>
          );
        })}
      </div>

      {isMyInputFocused && (
        <ul className="float flex flex-wrap  absolute top-0 left-0  z-10 bg-white border rounded-lg shadow-lg ">
          <button className="fixed right-7 mr-5 mt-3 text-2xl border border-black  p-0.5" onClick={(e) => {
            setIsMyInputFocused(false)
          }}> x </button>

          <div className="flex-none w-[300px]">
            <p className="text-bold text-xl m-4"> Paper: </p>
            {tags
              .filter(
                (option) =>
                  option.toLowerCase().includes(value.toLowerCase()) &&
                  option.toLowerCase().startsWith("gate")
              )
              .map((option) => (
                <li className="rounded border ml-1 px-4 py-2 mr-1 mb-1 mt-1">
                  <input
                    type="checkbox"
                    key={option}
                    id={option}
                    checked={selectedTags.includes(option)}
                    onChange={(e) => {
                      if (selectedTags.includes(option)) {
                        setSelectedTags(
                          selectedTags.filter((s) => s !== option)
                        );
                      } else {
                        setSelectedTags([...selectedTags, option]);
                      }
                    }}
                  />
                  <label className="ml-4" htmlFor={option}>
                    {option} x({QuestionService.getCount(option)})
                  </label>
                </li>
              ))}
          </div>
          <div className="flex-1 ">
            <p className="text-bold text-xl m-4"> Tags: </p>
            <div className="flex flex-wrap">
              {tags
                .filter(
                  (option) =>
                    option.toLowerCase().includes(value.toLowerCase()) &&
                    !option.toLowerCase().startsWith("gate")
                )
                .map((option) => {
                  console.log(option);
                  return (
                    <>
                      <li className="rounded border ml-1 px-4 py-2 mr-1 mb-1 mt-1">
                        <input
                          type="checkbox"
                          key={option}
                          id={option}
                          checked={selectedTags.includes(option)}
                          onChange={(e) => {
                            if (selectedTags.includes(option)) {
                              setSelectedTags(
                                selectedTags.filter((s) => s !== option)
                              );
                            } else {
                              setSelectedTags([...selectedTags, option]);
                            }
                          }}
                        />
                        <label className="ml-4" htmlFor={option}>
                          {option} x({QuestionService.getCount(option)})
                        </label>
                      </li>
                    </>
                  );
                })}
            </div>
          </div>
        </ul>
      )}
    </div>
  );
};

export default FilterTags;
