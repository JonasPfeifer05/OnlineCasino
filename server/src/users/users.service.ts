import {User} from "./user";
import {UsersStorage} from "./users.storage";
import {UserToken} from "./user-token";

const jwt = require("jsonwebtoken")

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

    async generateJWT(data: UserToken, token: string|undefined, expire: string): Promise<string> {
        if (!token) throw new Error("Internal Token error!");
        if (!data.email || !data.password) throw new Error("Not enough data passed!");

        let error: Error|undefined;
        await this.getUser(data as User).catch(reason => error = reason);

        if (error) throw error;

        return jwt.sign(data, token, {expiresIn: expire});
    }

    async authenticateJWT(authentication_header: string|undefined, token: string|undefined): Promise<UserToken> {
        if (!token) throw new Error("Internal Token error!");
        if (!authentication_header) throw new Error("No Auth Header set!");

        let error: Error|undefined;
        let user: UserToken|undefined;
        jwt.verify(authentication_header, token, (errorR: any, decoded: any) => {
            error = errorR;
            user = decoded;
        })

        if (error || !user) throw new Error("Token verification failed!");

        return user;
    }

    async login(data: UserToken): Promise<[string, string]> {
        let accessToken: string | undefined;
        let refreshToken: string | undefined;

        let error: Error|undefined;

        accessToken = await this.generateJWT(data, process.env.JWT_AUTH_TOKEN, "10min").catch(reason => error = reason);
        if (error || !accessToken) throw error;
        refreshToken = await this.generateJWT(data, process.env.JWT_REFRESH_TOKEN, "8h").catch(reason => error = reason);
        if (error || !refreshToken) throw error;

        return [accessToken, refreshToken]
    }

    async refreshToken(refresh_token: string | undefined): Promise<string> {
        let error: Error|undefined;

        let refresh: UserToken = await this.authenticateJWT(refresh_token, process.env.JWT_REFRESH_TOKEN).catch(reason => error = reason);
        if (error) throw error;

        let userData: UserToken = {email: refresh.email, password: refresh.password}
        let token = await this.generateJWT(userData, process.env.JWT_AUTH_TOKEN, "10min").catch(reason => error = reason);
        if (error) throw error;

        return token
    }

    async changeUser(userData: UserToken, data: User): Promise<User> {
        let error: Error|undefined;

        let result: User = await this.storage.getUser(userData.email, userData.password)
            .catch(reason => error = reason);

        if (error) throw new Error("Email or Password is wrong!");
        if (!result) throw new Error("There is no such User!");

        if (!(data.email || data.password || data.last_name || data.first_name || data.username)) throw new Error("Must specify at least one field!")

        if (data.email) data.email = data.email.trim();
        if (data.password) data.password = data.password.trim();
        if (data.first_name) data.first_name = data.first_name.trim();
        if (data.last_name) data.last_name = data.last_name.trim();
        if (data.username) data.username = data.username.trim();

        if (data.email && data.email.length === 0) throw new Error("Invalid Data passed!")
        if (data.password && data.password.length === 0) throw new Error("Invalid Data passed!")
        if (data.first_name && data.first_name.length === 0) throw new Error("Invalid Data passed!")
        if (data.last_name && data.last_name.length === 0) throw new Error("Invalid Data passed!")
        if (data.username && data.username.length === 0) throw new Error("Invalid Data passed!")

        let user: User = await this.storage.changeUser(data, result).catch(reason => error = reason);

        if (error) throw new Error("Email or Username is already in use!");
        if (!user) throw new Error("Failed to create User!");

        return user;
    }
}

