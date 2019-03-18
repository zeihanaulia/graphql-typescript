import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import { loginInvalid, emailNotConfirmed } from "./errorMessages";

const errorResponse = [
  {
    path: "email",
    message: loginInvalid
  }
];

export const resolvers: ResolverMap = {
  Query: {
    bye: () => {
      return "bye";
    }
  },
  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session }
    ) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: emailNotConfirmed
          }
        ];
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return errorResponse;
      }

      session.userId = user.id;
    
      return null;
    }
  }
};
