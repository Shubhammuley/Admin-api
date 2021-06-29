const { findOneWorkload } = require("../models/db-collection");

async function processingCron() {
  const record = await findOneWorkload();
  try {
      
  } catch (e) {
      
  }
}

module.exports = Object.freeze({
  processingCron,
});
