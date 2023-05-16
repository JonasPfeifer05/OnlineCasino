import {User} from "./user";
import {UsersStorage} from "./users.storage";
import {JsonWebTokenData} from "./json-web-token-data";

const jwt = require("jsonwebtoken")

const email_expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export class UsersService {
    storage: UsersStorage;

    constructor() {
        this.storage = new UsersStorage();
    }

    async getUserData(data: User): Promise<User> {
        if (!data.email || !data.password) throw new Error("Email or Password not provided!");

        let error: Error|undefined;
        let result: User = await this.storage.getUserData(data.email, data.password)
            .then(value => value)
            .catch(reason => error = reason);

        if (error) throw new Error("Email or Password is wrong!");
        if (!result) throw new Error("There is no such User!");

        return result;
    }

    async createNewUser(data: User): Promise<User> {
        if (!data.email || !data.password || !data.first_name || !data.last_name || !data.username) throw new Error("Not enough Data passed!")

        data.email = data.email.trim();
        data.password = data.password.trim();
        data.first_name = data.first_name.trim();
        data.last_name = data.last_name.trim();
        data.username = data.username.trim();

        if (data.email.length === 0  || data.password.length === 0  || data.first_name.length === 0  || data.last_name.length === 0  || data.username.length === 0) throw new Error("Invalid Data passed!")

        if (!UsersService.checkPassword(data.password)) throw new Error("Invalid password passed!");
        if (!UsersService.checkEmail(data.email)) throw new Error("Invalid email passed!");

        let user: User|undefined;
        let error: Error|undefined;
        await this.storage.createNewUser(data)
            .then(value => user = value)
            .catch(reason => error = reason);

        if (error) throw new Error("Email or Username is already in use!");
        if (!user) throw new Error("Failed to create User!");

        return user;
    }

    async generateJsonWebToken(data: JsonWebTokenData, token: string|undefined, expire: string): Promise<string> {
        if (!token) throw new Error("Internal Token error!");
        if (!data.email || !data.password) throw new Error("Not enough data passed!");

        let error: Error|undefined;
        await this.getUserData(data as User).catch(reason => error = reason);

        if (error) throw error;

        return jwt.sign(data, token, {expiresIn: expire});
    }

    async authenticateJsonWebToken(authentication_header: string|undefined, token: string|undefined): Promise<JsonWebTokenData> {
        if (!token) throw new Error("Internal Token error!");
        if (!authentication_header) throw new Error("No authentication Header set!");

        let error: Error|undefined;
        let user: JsonWebTokenData|undefined;
        jwt.verify(authentication_header, token, (errorR: any, decoded: any) => {
            error = errorR;
            user = decoded;
        })

        if (error || !user) throw new Error("Token verification failed!");

        return user;
    }

    async login(data: JsonWebTokenData): Promise<[string, string]> {
        let accessToken: string | undefined;
        let refreshToken: string | undefined;

        let error: Error|undefined;

        accessToken = await this.generateJsonWebToken(data, process.env.JWT_AUTH_TOKEN, "10min").catch(reason => error = reason);
        if (error || !accessToken) throw error;
        refreshToken = await this.generateJsonWebToken(data, process.env.JWT_REFRESH_TOKEN, "8h").catch(reason => error = reason);
        if (error || !refreshToken) throw error;

        return [accessToken, refreshToken]
    }

    async refreshAccessToken(refresh_token: string | undefined): Promise<string> {
        let error: Error|undefined;

        let refresh: JsonWebTokenData = await this.authenticateJsonWebToken(refresh_token, process.env.JWT_REFRESH_TOKEN).catch(reason => error = reason);
        if (error) throw error;

        let userData: JsonWebTokenData = {email: refresh.email, password: refresh.password}
        let token = await this.generateJsonWebToken(userData, process.env.JWT_AUTH_TOKEN, "10min").catch(reason => error = reason);
        if (error) throw error;

        return token
    }

    async changeUserData(userData: JsonWebTokenData, data: User): Promise<User> {
        let error: Error|undefined;

        if (!(data.email || data.password || data.last_name || data.first_name || data.username)) throw new Error("Must specify at least one field!")

        let oldUser: User = await this.storage.getUserData(userData.email, userData.password)
            .catch(reason => error = reason);

        if (error) throw new Error("Email or Password is wrong!");
        if (!oldUser) throw new Error("There is no such User!");

        data.users_id = oldUser.users_id;

        if (data.email) data.email = data.email.trim(); else data.email = oldUser.email;
        if (data.password) data.password = data.password.trim(); else data.password = oldUser.password;
        if (data.first_name) data.first_name = data.first_name.trim(); else data.first_name = oldUser.first_name;
        if (data.last_name) data.last_name = data.last_name.trim(); else data.last_name = oldUser.last_name;
        if (data.username) data.username = data.username.trim(); else data.username = oldUser.username;

        if (data.email && data.email.length === 0) throw new Error("Invalid email passed!")
        if (data.password && data.password.length === 0) throw new Error("Invalid password passed!")
        if (data.first_name && data.first_name.length === 0) throw new Error("Invalid first name passed!")
        if (data.last_name && data.last_name.length === 0) throw new Error("Invalid last name passed!")
        if (data.username && data.username.length === 0) throw new Error("Invalid username passed!")

        if (!UsersService.checkPassword(data.password)) throw new Error("Invalid password passed!");
        if (!UsersService.checkEmail(data.email)) throw new Error("Invalid email passed!");

        let newUser: User = await this.storage.changeUserData(data).catch(reason => error = reason);

        if (error) throw new Error("Email or Username is already in use!");

        return newUser;
    }

    async changeActive(userData: JsonWebTokenData, active: boolean) {
        await this.storage.changeActive(userData.email, active);
    }

    static checkPassword(password: string): boolean {
        return password.length >= 8;

    }

    static checkEmail(email: string): boolean {
        return email_expression.test(email);
    }
}

