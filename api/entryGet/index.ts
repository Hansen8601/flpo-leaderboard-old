import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as cosmos from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const email = req.query.email || (req.body && req.body.email);

  const endpoint = "https://flpoleaderboard.documents.azure.com:443/";
  const key = "9ZR8ABLhbQQycoaEl22ZszR2xAcdRZ0Iru2Ee7GRabwTUFS2bnRDocWPxtY5uXNrO9DxPanbtFhfACDbMSHbHg==";
  const databaseId = "entries";
  const containerId = "Container1";

  const client = new cosmos.CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  const querySpec = {
    query: "SELECT * FROM c", // WHERE c.email = @email",
    //parameters: [
    //  {
    //    name: "@email",
    //    value: email,
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
    const item = items[0];

    context.res = {
      status: 200,
      body: item,
    };
  }
};

export default httpTrigger;
