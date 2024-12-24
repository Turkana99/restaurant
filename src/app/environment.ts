const apiUrl = 'http://188.245.226.20:8080/api/v1';

export const environment = {
  production: false,
  getCartsUrl: `${apiUrl}/Carts`,
  getCategoriesUrl: `${apiUrl}/Categories/list-by-language`,
  getDiningTablesUrl: `${apiUrl}/DiningTables/list-by-lang`,
  getLanguagesUrl: `${apiUrl}/Languages`,
  getOrdersUrl: `${apiUrl}/Orders`,
  getProductsUrl: `${apiUrl}/Products/list-by-categoryId-with-lang`,
};
