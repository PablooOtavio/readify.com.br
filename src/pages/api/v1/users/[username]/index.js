import { createRouter } from "next-connect";
import controller from "src/infra/controller";
import user from "src/models/user";
const router = createRouter(controller);

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);
  response.status(200).json(userFound);
}
