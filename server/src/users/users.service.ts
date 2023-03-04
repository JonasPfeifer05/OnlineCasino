import {User} from "./user";
import {UsersStorage} from "./users.storage";

export class UsersService {

    storage: UsersStorage;

    constructor() {
        this.storage = new UsersStorage();
    }

    async getUser(data: User): Promise<User> {
        if (!data.email || !data.password) throw new Error("Email or Password not passed!");

        let error: Error|undefined;
        let result: User = await this.storage.getUser(data.email, data.password)
            .catch(reason => error = reason);

        if (error) throw new Error("Email or Password is wrong!");
        if (!result) throw new Error("There is no such User!");

        return result;
    }

    async createUser(data: User): Promise<User> {
        if (!data.email || !data.password || !data.first_name || !data.last_name || !data.username) throw new Error("Not enough Data passed!")

        data.email = data.email.trim();
        data.password = data.password.trim();
        data.first_name = data.first_name.trim();
        data.last_name = data.last_name.trim();
        data.username = data.username.trim();

        if (data.email.length === 0  || data.password.length === 0  || data.first_name.length === 0  || data.last_name.length === 0  || data.username.length === 0) throw new Error("Invalid Data passed!")

        let user: User|undefined;
        let error: Error|undefined;
        await this.storage.createUser(data)
            .then(value => user = value)
            .catch(reason => error = reason);

        if (error) throw new Error("Email or Username is already in use!");
        if (!user) throw new Error("Failed to create User!");

        return user;
    }
}

