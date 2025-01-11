test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(201);

  const nullResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(nullResponse.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  const nullResponseBody = await nullResponse.json();
  expect(Array.isArray(nullResponseBody)).toBe(true);
  expect(nullResponseBody.length).toEqual(0);
});
