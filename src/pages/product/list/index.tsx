import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResultString from "../../../components/content/result.content";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";
import { PAGINATION_LIMIT } from "../../../constants/app.constants";
import { PaginateDataType, UrlType } from "../../../interface/common";
import { listProducts } from "../../../services/products";
import { debounceFunction, getQueryFromUrl } from "../../../utils/common.utils";
import ProductsTable from "./components/ProductsTable/products.table";
import SearchFilterTable from "./components/SearchTable/search.table";
import { listContacts } from "../../../services/contacts";

const fixedListParams = {
  paginate: true,
};

const ProductList: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoding] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginateDataType>({
    next: null,
    prev: null,
    count: null,
    resultsCount: 0,
    offset: null,
    hasOffset: true,
    limit: PAGINATION_LIMIT,
  });
  const [selectedValue, setSelectedValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const searchParamsLimit = searchParams.get("limit");
  const searchParamsOffset = searchParams.get("offset");
  const searchParamsContact = searchParams.get("contact");

  //Function to search the contacts
  const searchContacts = useCallback(
    async (queryParams?: Record<string, any>, callbck?: any) => {
      let query = queryParams || {};
      setSearchLoading(true);
      try {
        const res = await listContacts({
          query: { ...query },
        });
        callbck(res?.data?.results);
      } catch (err) {
        console.log(err);
      }
      setSearchLoading(false);
    },
    []
  );

  const getContactSearchListCallbackRes = (data: any) => {
    if (data?.length) {
      const menuFilterOption = data.map((item: any) => ({
        id: item.id,
        label: item.code,
        value: item.code,
      }));
      setFilteredOptions(menuFilterOption);
    } else {
      setFilteredOptions([]);
      return [];
    }
  };

  const debouncedGetSearchUsersList = useMemo(
    () =>
      debounceFunction((searchValue: string) => {
        if (!searchValue) {
          setFilteredOptions([]);
          return;
        }
        searchContacts(
          { search: searchValue, paginate: true },
          getContactSearchListCallbackRes
        );
      }, 2000),
    [searchContacts]
  );

  const init = async (contact?: Number) => {
    loadProducts(contact);
  };

  const loadProducts = async (
    contact?: Number,
    queryParams?: Record<string, any>
  ) => {
    let query = queryParams || {};
    if (contact) {
      query = { ...query, contact };
    }
    setLoding(true);
    try {
      const res = await listProducts({
        query: { ...fixedListParams, ...query },
      });

      setProducts(res.data.results);
      setPagination((prev) => {
        return {
          ...prev,
          next: res.data.next,
          prev: res.data.previous,
          count: res.data.count,
          resultsCount: res.data.results.length,
          offset: query?.offset ? Number(query.offset) : null,
        };
      });
    } catch (err) {
      console.log(err);
    }
    setLoding(false);
  };

  const handleNext = (next: UrlType) => {
    if (next === null) {
      return;
    }
    let query = getQueryFromUrl(next);

    loadProducts(0, query);
  };

  const handlePrev = (prev: UrlType) => {
    if (prev === null) {
      return;
    }
    let query = getQueryFromUrl(prev);
    loadProducts(0, query);
  };

  const handleSearch = (value: string) => {
    debouncedGetSearchUsersList(value);
    setSelectedValue(value);
  };

  const handleSelect = (value: any) => {
    init(value.id);
    setSelectedValue(value.label);
  };

  //function to reset the value selected and any query params if any
  const handleResetSearch = () => {
    setFilteredOptions([]);
    init();
    setSelectedValue("");

    searchParams.delete("limit");
    searchParams.delete("offset");
    searchParams.delete("contact");
    searchParams.delete("paginate");

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  //To load the products list as per the query params present
  useEffect(() => {
    if (searchParamsContact || searchParamsLimit || searchParamsOffset) {
      let query = getQueryFromUrl(window.location.href);
      loadProducts(0, query);
    } else {
      init();
    }
  }, []);

  return (
    <>
      <div className="heading-wrapper">
        <Heading titleLevel={2}>Products</Heading>
      </div>
      <div className="layout-wrapper">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          {/*Component for search filter on table */}
          <div>
            <SearchFilterTable
              loadingList={searchLoading}
              handleSearchList={handleSearch}
              handleSelectList={handleSelect}
              selectedValue={selectedValue}
              filteredOptions={filteredOptions}
              handleResetBtnClick={handleResetSearch}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <ResultString
                loading={loading}
                pagination={pagination}
                pageString={"product"}
              />
            </div>
            <div>
              <Pagination
                next={pagination.next}
                prev={pagination.prev}
                onNextClick={handleNext}
                onPrevClick={handlePrev}
              />
            </div>
          </div>
        </div>
        <div className="product-table">
          <ProductsTable list={products} loading={loading} />
        </div>
        <div>
          <Pagination next={pagination.next} prev={pagination.prev} />
        </div>
      </div>
    </>
  );
};

export default ProductList;
