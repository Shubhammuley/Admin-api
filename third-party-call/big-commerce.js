const axios = require("axios");

const apiEndpoint = "https://api.bigcommerce.com/stores";
const storeId = "65yyeodc1d";

const headers = {
  "X-Auth-Client": "h2jiw7fgvtsbb7bcjf41n5re37fcg98",
  "X-Auth-Token": "k17v0a83e7vjlgbl2066g193mhs179h",
};

async function getProductByProductId({ sku }) {
  return axios({
    method: "get",
    url: `${apiEndpoint}/${storeId}/v2/products/skus?sku=${sku}`,
    headers,
  })
    .then(({ data, status }) => {
      return { data, status };
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
    headers,
  })
    .then(({ data, status }) => {
      return { data, status };
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
    headers,
  })
    .then(({ data, status }) => {
      return { data, status };
    })
    .catch((e) => {
      console.log("error-------->", e);
      throw e;
    });
}

async function updateMetaField({
  productId,
  variantId,
  metafieldId,
  ...infoToUpdate
}) {
  return axios({
    method: "put",
    url: `${apiEndpoint}/${storeId}/v3/catalog/products/${productId}/variants/${variantId}/metafields/${metafieldId}`,
    data: { ...infoToUpdate },
    headers,
  })
    .then(({ data, status }) => {
      return { data, status };
    })
    .catch((e) => {
      console.log("error-------->", e);
      throw e;
    });
}

async function createMetaField({
  productId,
  variantId,
  metafieldId,
  ...infoToAdd
}) {
  return axios({
    method: "post",
    url: `${apiEndpoint}/${storeId}/v3/catalog/products/${productId}/variants/${variantId}/metafields`,
    data: { ...infoToAdd },
    headers,
  })
    .then(({ data, status }) => {
      return { data, status };
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
  updateMetaField,
  createMetaField,
});
