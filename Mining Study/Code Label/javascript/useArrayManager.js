const useArrayManager = (items, setItems) => {
  let setSingleItem = (item, index) => {
    let newItems = [...items];
    newItems[index] = item;
    setItems(newItems);
  };

  let add = (item) => setItems([...items, item]);

  let remove = (index) => {
    let newItems = [...items]; // thanks copilot
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return [setSingleItem, add, remove];
};

export default useArrayManager;
