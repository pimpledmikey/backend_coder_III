// entrega-1-mascotas/src/controllers/sessions.controller.js
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import { UserServices } from "../services/user.services.js";

export class SessionsController {
  constructor() {
    this.userServices = new UserServices();
  }

  register = async (req, res, next) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password)
        return res.status(400).send({ status: "error", error: "Incomplete values" });

      let user;
      try {
        user = await this.userServices.getUserByEmail(email);
        return res.status(400).send({ status: "error", error: "User already exists" });
      } catch (error) {
        if (error.message.includes("User with email")) {
          const hashedPassword = await createHash(password);
          user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
          };
          let result = await this.userServices.create(user);
          return res.status(201).send({ status: "success", payload: result }); // Ensure payload is included in response
        } else {
          throw error;
        }
      }
    } catch (error) {
      next(error);
    }
  };


  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });

      const user = await this.userServices.getUserByEmail(email);

      if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });

      const isValidPassword = await passwordValidation(user, password);

      if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });

      const userDto = UserDTO.getUserTokenFrom(user);

      const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });

      res.cookie("coderCookie", token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" });

    } catch (error) {
      next(error);
    }
  };

  current = async (req, res, next) => {
    try {
      const cookie = req.cookies["coderCookie"];
      const user = jwt.verify(cookie, "tokenSecretJWT");
      if (user) return res.send({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  };

  unprotectedLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
      const user = await this.userServices.getUserByEmail(email);
      if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
      const isValidPassword = await passwordValidation(user, password);
      if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
      const userDto = UserDTO.getUserTokenFrom(user);
      const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });
      res
          .cookie("unprotectedCookie", token, { maxAge: 3600000 })
          .send({ status: "success", message: "Unprotected Logged in" });
    } catch (error) {
      next(error);
    }
  };

  unprotectedCurrent = async (req, res, next) => {
    try {
      const cookie = req.cookies["unprotectedCookie"];
      const user = jwt.verify(cookie, "tokenSecretJWT");
      if (user) return res.send({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  };
}