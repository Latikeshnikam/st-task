import { Button, Input, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import useComponentVisible from "../../../../../hooks/useComponentVisible";
import "./search.table.css";
import InfiniteList from "./infinite.list";

const SearchFilterTable = ({
  handleSearchList,
  handleSelectList,
  loadingList,
  filteredOptions,
  selectedValue,
  handleResetBtnClick,
  showResetButton = true,
}: any) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false); //Note: Hook to show/close the component

  const [visibleItems, setVisibleItems] = useState(5);

  const handleSearch = (value: string) => {
    handleSearchList(value);
    setIsComponentVisible(true);
  };

  const handleSelect = (value: any) => {
    handleSelectList(value);
    setIsComponentVisible(false);
  };

  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 5);
  };

  return (
    <div ref={ref} className="search-wrapper">
      <Input
        value={selectedValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by Name/SKU"
        suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
        style={{
          width: "20rem",
        }}
      />

      {isComponentVisible && (
        <InfiniteList //component of list of menu items with infinite scroll
          items={filteredOptions.slice(0, visibleItems)}
          loading={loadingList}
          renderItem={(item: any) => (
            <List.Item
              className={`custom-dropdown-item ${
                selectedValue === item.label ? "selected" : ""
              }`}
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </List.Item>
          )}
          onLoadMore={handleLoadMore}
        />
      )}

      {showResetButton && (
        <Button onClick={() => handleResetBtnClick()}>Reset</Button>
      )}
    </div>
  );
};

export default SearchFilterTable;
