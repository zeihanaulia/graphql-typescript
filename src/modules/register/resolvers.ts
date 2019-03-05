import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";

export const resolvers: ResolverMap = {
  Query: {
    bye: () => {
      return "bye";
    }
  },
  Mutation: {
    register: async (
      _,
      args : GQL.IRegisterOnMutationArguments
    ) => {
      
      const {email, password} = args;
      const userAllreadyExists = await User.findOne({
        where: { email },
        select: ["id"]
      });
      if (userAllreadyExists) {
        return [{
          path: "email",
          message: "email already taken"
        }]
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
