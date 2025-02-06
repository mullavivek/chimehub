import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from "@react-email/components";

interface VerificationCodeEmailProps {
    username: string;
    verificationCode: string;
}

export default function VerificationCodeEmail({
                                                  username,
                                                  verificationCode,
                                              }: VerificationCodeEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Your Verification Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Your verification code: {verificationCode}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello {username},</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for signing up! Please use the verification code below to
                        complete your registration:
                    </Text>
                </Row>
                <Row>
                    <Text
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            textAlign: "center",
                            padding: "10px",
                            border: "2px dashed #007bff",
                            display: "inline-block",
                            backgroundColor: "#f8f9fa",
                        }}
                    >
                        {verificationCode}
                    </Text>
                </Row>
                <Row>
                    <Text>
                        This code will expire in **10 minutes**. If you did not request this
                        verification, please ignore this email.
                    </Text>
                </Row>
            </Section>
        </Html>
    );
}
