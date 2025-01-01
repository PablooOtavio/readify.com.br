function status(request, response) {
  response.setHeader("Content-type", "text/plain; charset=utf-8");
  response.status(200).send("Helló, world!");
}

export default status;
