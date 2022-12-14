import express from "express";
import { home, search } from '../controllers/videoContrillers';
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userControllers";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);

export default rootRouter;