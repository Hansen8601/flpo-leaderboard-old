import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as cosmos from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  //const age_group = req.query.age_group || (req.body && req.body.age_group);

  require('dotenv').config()
  const endpoint = process.env.endpoint;
  const key = process.env.key;
  const databaseId = process.env.databaseId;
  const containerId = process.env.containerId;

  const client = new cosmos.CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  const querySpec = {
    query: "SELECT * FROM c WHERE c.age_group in ('Adult','Child')",
    //query: "SELECT * FROM c WHERE c.age_group = @age_group",
    //parameters: [
    //  {
    //    name: "@age_group",
    //    value: age_group,
    //  },
    //],
  };

  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  if (items.length === 0) {
    context.res = {
      status: 404,
      body: "Data not found",
    };
  } else {
    context.res = {
      status: 200,
      body: items,
    };
  }
};

export default httpTrigger;
