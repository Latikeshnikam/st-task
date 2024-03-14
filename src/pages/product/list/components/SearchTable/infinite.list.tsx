import { List } from "antd";
import { useCallback, useLayoutEffect, useRef } from "react";
import "./search.table.css";

interface IInfiniteList {
  loading: boolean;
  items: any;
  renderItem: any;
  onLoadMore: () => void;
}
const InfiniteList = ({
  loading,
  items,
  renderItem,
  onLoadMore,
}: IInfiniteList) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const intersectionObserverCallback: IntersectionObserverCallback =
    useCallback(
      (entries, observer) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          observer.disconnect();
          onLoadMore();
        }
      },
      [onLoadMore]
    );
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(intersectionObserverCallback);
    if (targetRef.current) observer.observe(targetRef.current);
    return () => {
      observer.disconnect();
    };
  }, [intersectionObserverCallback]);
  return (
    <List
      loading={loading}
      className="custom-dropdown"
      dataSource={items}
      renderItem={(item, index) => {
        if (index === items.length - 1) {
          return (
            <>
              {renderItem(item)}
              <div ref={targetRef} />
            </>
          );
        }
        return renderItem(item);
      }}
    />
  );
};
export default InfiniteList;
