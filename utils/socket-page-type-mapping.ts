const socketPageTypeMap = [
  { page: 'catalog', page_type: 'Catalog' },
  { page: 'catalog-product', page_type: 'Product' },
  { page: 'product-category', page_type: 'Category' },
  { page: 'product', page_type: 'Product' },
  { page: 'cart', page_type: 'Cart' },
];

function SocketPageMapper(page: string) {
  const getPageType = socketPageTypeMap?.find((socket: any) => socket.page === page);
  return getPageType;
}
export default SocketPageMapper;
