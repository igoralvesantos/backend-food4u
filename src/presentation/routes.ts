import express from "express";
import cors from "cors";
import { signupEndpoint } from "./endpoints/user/signUp";
import { loginEndpoint } from "./endpoints/user/login";
import { getUserDataEndpoint } from "./endpoints/user/getUserData";
import { createRecipeEndpoint } from "./endpoints/recipe/createRecipe";
import { followUserEndpoint } from "./endpoints/user/followUser"
import { getFeedEndpoint } from "./endpoints/feed/getFeed";
import { changePasswordEndpoint } from "./endpoints/user/changePassword";
import { updateUserEndpoint } from "./endpoints/user/updateUser";

const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());

app.post('/signup', signupEndpoint);

app.post('/login', loginEndpoint);

app.get('/user', getUserDataEndpoint);

app.post("/user/follow", followUserEndpoint);

app.post("/change/password", changePasswordEndpoint);

app.post("/update/user", updateUserEndpoint);

app.post("/recipes", createRecipeEndpoint);

app.get("/feed", getFeedEndpoint);


export default app;