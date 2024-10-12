import validator from "validator";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";
import {
  CreateUserParams,
  ICreateUserController,
  ICreateUserRepository,
} from "./protocols";

export class CreateUserController implements ICreateUserController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User>> {
    try {
      //verificar campos obrigatórios
      const requiredFields = ["firstName", "lastName", "email", "password"];
      const missingFields: string[] = [];

      for (const field of requiredFields) {
        const value = httpRequest?.body?.[field as keyof CreateUserParams];

        if (!value) {
          missingFields.push(field); //adiciona ao array se o campo estiver ausente ou vazio
        }
      }

      //se houver campos faltantes, retorna erro com todos eles
      if (missingFields.length > 0) {
        return {
          statusCode: 400,
          body: `Field(s) ${missingFields.join(", ")} are required`,
        };
      }

      const emailIsValid = validator.isEmail(httpRequest.body!.email);

      if (!emailIsValid) {
        return {
          statusCode: 400,
          body: "E-mail is invalid.",
        };
      }

      const user = await this.createUserRepository.createUser(
        httpRequest.body!
      );

      return {
        statusCode: 201,
        body: user,
      };
    } catch {
      return {
        statusCode: 500,
        body: "Something went wrong.",
      };
    }
  }
}
