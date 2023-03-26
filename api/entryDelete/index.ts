const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  try {
    // Initialize Cosmos DB client
    require('dotenv').config()
    const endpoint = process.env.endpoint;
    const key = process.env.key;
    const databaseId = process.env.databaseId;
    const containerId = process.env.containerId;
    const client = new CosmosClient({ endpoint, key });

    // Get the ID of the record to delete from the request body
    const { id } = req.body;
    const partitionKey = id;

    // Delete the record from the container
    const { resource: deletedItem } = await client
      .database(databaseId)
      .container(containerId)
      .item(id,partitionKey)
      .delete();

    // Return the deleted record as the response body
    context.res = {
      status: 200,
      body: deletedItem,
    };
  } catch (error) {
    context.log(error);
    context.res = {
      status: 500,
      body: "Internal server error",
    };
  }
};
