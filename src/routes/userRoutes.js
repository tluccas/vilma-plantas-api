import { Router } from "express";
import UserController from "../controllers/UserController.js";

const routes = new Router();

routes.get("/", UserController.findAll);
routes.get("/:id", UserController.findById);
routes.post("/", UserController.create);

export default routes;