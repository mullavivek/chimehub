import {resend} from "@/lib/resend";

import VerificationCodeEmail from "../../Emails/VerificationEmail";

import {ApiResponse} from "@/types/ApiResponse";


export async function sendVerificationEmail(email: string,
                                            username: string,
                                            verifyCode: string): Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Chime hub verification code",
            react: VerificationCodeEmail({username, verificationCode: verifyCode})
        })
        return {success: true, message:"successfully sent verification email to the email given"};
    } catch (emailError){
        console.error("Error sending verification email", emailError);
        return {success: false, message:"Error sending verification email"};
    }
}