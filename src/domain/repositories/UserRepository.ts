import { User } from "$/domain/entities/User";
import { FutureData } from "$/domain/entities/generic/Future";

export interface UserRepository {
    getCurrent(): FutureData<User>;
}
