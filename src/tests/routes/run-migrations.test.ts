import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /migrations", () => {
  test("With valid migration secret", async () => {
    const response = await fetch("http://localhost:3000/migrations", {
      method: "POST",
      headers: {
        "migration-secret": process.env.MIGRATION_SECRET,
      },
    });

    expect(response.status).toBe(201);
  });

  test("With invalid migration secret", async () => {
    const response = await fetch("http://localhost:3000/migrations", {
      method: "POST",
      headers: {
        "migration-secret": "invalid-secret",
      },
    });

    expect(response.status).toBe(401);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Requisição não autorizada.",
      action: "Verifique sua autorização e tente novamente.",
      status_code: 401,
    });
  });

  test("Without migration secret", async () => {
    const response = await fetch("http://localhost:3000/migrations", {
      method: "POST",
    });

    expect(response.status).toBe(401);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Requisição não autorizada.",
      action: "Verifique sua autorização e tente novamente.",
      status_code: 401,
    });
  });
});
