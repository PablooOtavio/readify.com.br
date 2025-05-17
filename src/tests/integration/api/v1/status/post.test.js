import orchestrator from "src/tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Method not allowed in status endpoint", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        statusCode: 405,
        name: "MethodNotAllowedError",
        message: "Method not allowed",
        action: "Use one of the allowed methods.",
      });
    });
  });
});
