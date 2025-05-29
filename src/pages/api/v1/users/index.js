import { createRouter } from "next-connect";
import controller from "src/infra/controller";
import user from "src/models/user";
const router = createRouter(controller);

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userData = request.body;
  const newUser = await user.create(userData);

  response.status(201).json(newUser);
}
