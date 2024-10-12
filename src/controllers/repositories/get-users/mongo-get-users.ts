import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/user";
import { IGetUsersRepository } from "../../get-users/protocols";

export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    const users = await MongoClient.db
      .collection<User>("users")
      .find()
      .toArray();

    return users;
  }
}
