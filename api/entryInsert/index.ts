import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as cosmos from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const name = req.query.name || (req.body && req.body.name);
  const category = req.query.category || (req.body && req.body.category;
  const species = req.query.category || (req.body && req.body.speices;
  const length = req.query.category || (req.body && req.body.length;
  const weight_lb = req.query.category || (req.body && req.body.weight_lb;
  const weight_oz = req.query.category || (req.body && req.body.weight_oz;

  const endpoint = "https://flpoleaderboard.documents.azure.com:443/";
  const key = "9ZR8ABLhbQQycoaEl22ZszR2xAcdRZ0Iru2Ee7GRabwTUFS2bnRDocWPxtY5uXNrO9DxPanbtFhfACDbMSHbHg==";
  const databaseId = "entries";
  const containerId = "Container1";

  const client = new cosmos.CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  const item = { name,category,species,length,weight_lb,weight_oz };

  const { resource: createdItem } = await container.items.create(item);

  context.res = {
    status: 200,
    body: "Data added to container",
  };
};

export default httpTrigger;