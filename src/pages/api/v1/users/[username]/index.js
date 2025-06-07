import { createRouter } from "next-connect";
import controller from "src/infra/controller";
import user from "src/models/user";
const router = createRouter(controller);

router.get(getHandler);
router.patch(updateHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);
  response.status(200).json(userFound);
}
async function updateHandler(request, response) {
  const username = request.query.username;
  const userData = request.body;
  const updatedUser = await user.update(username, userData);
  response.status(200).json(updatedUser);
}
