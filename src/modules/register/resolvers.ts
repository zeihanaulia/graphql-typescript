import * as yup from "yup";
import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import {
  emailNotLongEnough,
  passwordNotLongEnough,
  emailNotValid,
  emailDuplicate
} from "./errorMessages";
import { formatYupError } from "../../utils/formatYupError";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(emailNotValid),
  password: yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255)
});

export const resolvers: ResolverMap = {
  Query: {
    bye: () => {
      return "bye";
    }
  },
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (error) {
        return formatYupError(error);
      }

      const { email, password } = args;
      const userAllreadyExists = await User.findOne({
        where: { email },
        select: ["id"]
      });
      if (userAllreadyExists) {
        return [
          {
            path: "email",
            message: emailDuplicate
          }
        ];
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email: email,
        password: hashedPassword
      });
      await user.save();
      return null;
    }
  }
};
