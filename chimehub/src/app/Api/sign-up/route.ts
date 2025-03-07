import DataBaseConnection from "@/lib/DataBaseConnection";
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import {sendVerificationEmail} from '@/helper/SendVerificationEmail';


export async function POST(request: Request) {
    await DataBaseConnection();

    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            IsUserCodeIsVerified: true,
        });

        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username already exist',
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.IsUserCodeIsVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'Email already exists',
                    },
                    { status: 400 }
                );
            } else {
                existingUserByEmail.password = await bcrypt.hash(password, 10);
                existingUserByEmail.verificationCode = verificationCode;
                existingUserByEmail.verificationCodeExpires = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashed_Password = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                email,
                username,
                password: hashed_Password,
                verificationCode,
                verificationCodeExpires: expiryDate,
                IsUserCodeIsVerified: false,
                IsUserAcceptingMessages: true,
                Messages: [],
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verificationCode
        );
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Registration is successful. please check your email for verification..',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
}
