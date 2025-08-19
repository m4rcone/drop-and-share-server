export class InternalServerError extends Error {
  action: string;
  statusCode: number;

  constructor({ cause, statusCode }: { cause: Error; statusCode?: number }) {
    super("Aconteceu um erro inesperado no servidor.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o servidor.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  action: string;
  statusCode: number;

  constructor({
    cause,
    message,
    action,
  }: {
    cause?: Error;
    message?: string;
    action?: string;
  }) {
    super(message || "Ocorreu algum erro de validação.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados enviados e tente novamente.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  action: string;
  statusCode: number;

  constructor({
    cause,
    message,
    action,
  }: {
    cause?: Error;
    message?: string;
    action?: string;
  }) {
    super(message || "Requisição não autorizada.", {
      cause,
    });
    this.name = "UnauthorizedError";
    this.action = action || "Verifique sua autorização e tente novamente.";
    this.statusCode = 401;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  action: string;
  statusCode: number;

  constructor({
    cause,
    message,
    action,
  }: {
    cause?: Error;
    message?: string;
    action?: string;
  }) {
    super(message || "O recurso solicitado não foi encontrado no sistema.", {
      cause,
    });
    this.name = "NotFoundError";
    this.action =
      action || "Verifique se os parâmetros da consulta estão corretos.";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
