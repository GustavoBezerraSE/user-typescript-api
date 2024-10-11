import { User } from "../../../models/user";
import { IGetUsersRepository } from "../../get-users/protocols";

export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    return [
      {
        firstName: "Gustavo",
        lastName: "Bezerra",
        email: "gustavobezerrase@gmail.com",
        password: "1234",
      },
    ];
  }
}
