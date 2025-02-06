import 'next-auth'

declare module 'next-auth' {
    interface User{
        _id: string;
        IsUserCodeIsVerified: boolean;
        IsUserAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session {
        user: {
            _id?: string;
            IsUserCodeIsVerified?: boolean;
            IsUserAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }

    declare module 'next-auth/jwt' {
        interface JWT {
            _id?: string;
            IsUserCodeIsVerified?: boolean;
            IsUserAcceptingMessages?: boolean;
            username?: string;
        }
    }
}