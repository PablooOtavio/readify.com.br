import { createRouter } from "next-connect";
import controller from "src/infra/controller";
import migrator from "src/models/migrator";
const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const result = await migrator.listPendingMigrations();
  return response.status(200).send(result);
}

async function postHandler(request, response) {
  const result = await migrator.runPendingMigrations();
  if (result.length > 0) {
    return response.status(201).send(result);
  }
  response.status(200).send(result);
}
