import { NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import DataBaseConnection from "@/lib/DataBaseConnection";
import userModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials:{
                username: {label: "Username", type: "text" , placeholder: "Username"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any> {
                await DataBaseConnection()
                try {
                   const user =  await userModel.findOne({
                       $or: [
                           { email: credentials.identifier },
                           { username: credentials.identifier },
                       ],
                    });
                   if (!user) {
                       throw new Error("User does not exist");
                   }
                   if (!user.IsUserCodeIsVerified){
                       throw new Error("verification is not completed!")
                   }
                   const isPasswordCorrect =await bcrypt.compare(credentials.password,  user.password)
                    if (isPasswordCorrect){
                        return user
                    } else {
                        throw new Error("Incorrect password");
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token._id = user.id?.toString();
                token.IsUserCodeIsVerified = user.IsUserCodeIsVerified;
                token.IsUserAcceptingMessages = user.IsUserAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.IsUserCodeIsVerified = token.IsUserCodeIsVerified;
                session.user.IsUserAcceptingMessages = token.IsUserAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/sign-in',
    },

}