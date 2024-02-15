import userModel ,{ IUser } from "../models/user_model";
import createController from "./base_controller";

const userController = createController<IUser>(userModel);

export default userController