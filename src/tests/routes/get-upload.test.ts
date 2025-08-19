import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /uploads/[id]", () => {
  test("Without param 'id'", async () => {
    const response = await fetch("http://localhost:3000/uploads/");

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Parâmetro não enviado na requisição.",
      action: "Ajuste os dados enviados e tente novamente.",
      status_code: 400,
    });
  });

  test("With non-existent 'id'", async () => {
    const response = await fetch(
      "http://localhost:3000/uploads/non-existent-id",
    );

    expect(response.status).toBe(404);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "NotFoundError",
      message: "O recurso solicitado não foi encontrado no sistema.",
      action: "Verifique se os parâmetros da consulta estão corretos.",
      status_code: 404,
    });
  });

  test("With existent id", async () => {
    const formData = new FormData();

    const largeFileSize = 1024 * 1024 * 1; // 1MB
    const largeFileContent = new Uint8Array(largeFileSize);

    const largeFile = new File([largeFileContent], "large-image.jpeg", {
      type: "image/jpeg",
    });

    formData.append("file", largeFile);

    const newUpload = await fetch("http://localhost:3000/uploads", {
      method: "POST",
      body: formData,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newUploadBody: any = await newUpload.json();

    const response = await fetch(
      `http://localhost:3000/uploads/${newUploadBody.id}`,
    );

    expect(response.status).toBe(200);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseBody: any = await response.json();

    expect(responseBody).toEqual({
      id: responseBody.id,
      file_name: responseBody.file_name,
      remote_key: responseBody.remote_key,
      remote_url: responseBody.remote_url,
      created_at: responseBody.created_at,
      expires_at: responseBody.expires_at,
    });
  });
});
