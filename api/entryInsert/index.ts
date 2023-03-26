import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as cosmos from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const name = req.query.name || (req.body && req.body.name);
  const age_group = req.query.age_group || (req.body && req.body.age_group);
  const species = req.query.species || (req.body && req.body.species);
  const length = req.query.length || (req.body && req.body.length);
  const weight_lb = req.query.weight_lb || (req.body && req.body.weight_lb);
  const weight_oz = req.query.weight_oz || (req.body && req.body.weight_oz);

  require('dotenv').config()
  const endpoint = process.env.endpoint;
  const key = process.env.key;
  const databaseId = process.env.databaseId;
  const containerId = process.env.containerId;

  const client = new cosmos.CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  const item = { name,age_group,species,length,weight_lb,weight_oz };

  try {
    const { resource: createdItem } = await container.items.create(item);

    context.res = {
      status: 200,
      body: item,
    };
  
  } catch (error) {
    context.log(error);
    context.res = {
      status: 500,
      body: "Internal server error",
    };
};
}
export default httpTrigger;

