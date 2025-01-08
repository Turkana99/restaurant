const apiUrl = 'https://api.lezizrestoran.az/api/v1';

export const environment = {
  production: true,
  getCartsUrl: `${apiUrl}/Carts`,
  getCategoriesUrl: `${apiUrl}/Categories/list-by-language`,
  getDiningTablesUrl: `${apiUrl}/DiningTables/list-by-lang`,
  getLanguagesUrl: `${apiUrl}/Languages`,
  getOrdersUrl: `${apiUrl}/Orders`,
  getProductsUrl: `${apiUrl}/Products/list-by-categoryId-with-lang`,
};
