const apiUrl = "https://api.myassistant.vn";


class UserService {
    constructor() {
        if (UserService._instance) {
            return UserService._instance
        }
        UserService._instance = this;
    }

}

export const userService = new UserService();
