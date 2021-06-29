const axios = require("axios");

const apiEndpoint = 'https://api.bigcommerce.com/stores';
const storeId = '964anr';

async function getProductByProductId({ sku }) {
  return axios({
    method: "get",
    url: `${apiEndpoint}/${storeId}/v2/products/skus?sku=${sku}`,
    data: { ids },
  })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log("error-------->", e);
      throw e;
    });
}

async function getAllProductVariantByProductId({ productId }) {
  return axios({
    method: "get",
    url: `${apiEndpoint}/${storeId}/v3/catalog/products/${productId}/variants`,
    data: { ids },
  })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log("error-------->", e);
      throw e;
    });
}

async function getMetaFieldsByProductIdAndVariantId({ productId, variantId }) {
  return axios({
    method: "get",
    url: `${apiEndpoint}/${storeId}/v3/catalog/products/${productId}/variants/${variantId}/metafields`,
    data: { ids },
  })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log("error-------->", e);
      throw e;
    });
}


module.exports = Object.freeze({
    getProductByProductId,
    getAllProductVariantByProductId,
    getMetaFieldsByProductIdAndVariantId,
});
