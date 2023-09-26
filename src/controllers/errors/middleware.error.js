import EErrors from "./enums.js";
import { createLogger } from "../../utils.js";

const logger = createLogger();

export default (error, req, res, next) => {
  logger.error(Date.now() + " / " + error.cause);

  switch (error.code) {
    case EErrors.INVALID_TYES_ERROR:
      res.status(400).send({
        status: "error",
        error: error.name,
        cause: error.cause,
      });
      break;
    default:
      res.send({
        status: "error",
        error: "Error no manejado",
        cause: "Desconocida",
      });
      break;
  }
};
