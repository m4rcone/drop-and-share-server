import orchestrator from "../../tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /upload", () => {
  test("Without any file", async () => {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: undefined,
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Arquivo não enviado na requisição.",
      action: "Ajuste os dados enviados e tente novamente.",
      status_code: 400,
    });
  });

  test("With invalid file type", async () => {
    const formData = new FormData();
    const fakeFile = new File(["document"], "document.txt", {
      type: "text/plain",
    });

    formData.append("file", fakeFile);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Tipo de arquivo não permitido.",
      action: "Ajuste os dados enviados e tente novamente.",
      status_code: 400,
    });
  });

  test("With file larger than allowed", async () => {
    const formData = new FormData();

    const largeFileSize = 1024 * 1024 * 3; // 3MB
    const largeFileContent = new Uint8Array(largeFileSize);

    const largeFile = new File([largeFileContent], "large-image.jpeg", {
      type: "image/jpeg",
    });

    formData.append("file", largeFile);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Tamanho do arquivo excedeu o limite permitido.",
      action: "Ajuste os dados enviados e tente novamente.",
      status_code: 400,
    });
  });

  test("With valid file size and type", async () => {
    const formData = new FormData();

    const largeFileSize = 1024 * 1024 * 1; // 1MB
    const largeFileContent = new Uint8Array(largeFileSize);

    const largeFile = new File([largeFileContent], "large-image.jpeg", {
      type: "image/jpeg",
    });

    formData.append("file", largeFile);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      message: "Upload concluído com sucesso.",
      url: expect.any(String),
      status_code: 201,
    });
  });
});
