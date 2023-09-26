import twilio from "twilio";
import { Router } from "express";
import passport from "passport";
import { passportAuthenticateApi } from "../utils.js";
import UserDto from "../dto/user.dto.js";
import config from "../config/config.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const client = twilio(config.TWILIO_SID, config.TWILIO_AT);
    const result = await client.messages.create({
      body: "PRUEBA",
      from: config.TWILIO_PH,
      to: "+ 54 1121743449",
    });
    res.send("result:[object Object]");
  } catch (error) {
    res.status(400).send(error);
  }
});
export default router;
