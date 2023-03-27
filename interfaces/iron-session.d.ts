import "iron-session";
import {User} from "./index";

declare module "iron-session" {
    interface IronSessionData {
        user?: User
    }
}
