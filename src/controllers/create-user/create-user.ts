import validator from "validator";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { CreateUserParams, ICreateUserRepository } from "./protocols";
import { badRequest, created, serverError } from "../helpers";

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User | string>> {
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
        return badRequest(`Field(s) ${missingFields.join(", ")} are required`);
      }

      const emailIsValid = validator.isEmail(httpRequest.body!.email);

      if (!emailIsValid) {
        return badRequest("E-mail is invalid.");
      }

      const user = await this.createUserRepository.createUser(
        httpRequest.body!
      );

      return created<User>(user);
    } catch {
      return serverError();
    }
  }
}
