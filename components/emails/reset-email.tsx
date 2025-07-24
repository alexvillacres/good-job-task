import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface PasswordResetProps {
  userEmail: string
  resetUrl: string
  requestTime: string
}

const PasswordReset = ({ userEmail, resetUrl, requestTime }: PasswordResetProps) => {

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Reset your password - expires in 1 hour</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] max-w-[500px] mx-auto p-[32px]">
            {/* Header */}
            <Heading className="text-[24px] font-bold text-gray-900 m-0 mb-[24px] text-center">
              Reset Your Password
            </Heading>

            {/* Main Content */}
            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
              Hi,
            </Text>
            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
              We received a request to reset the password for <strong>{userEmail}</strong>. Click the button below to create a new password.
            </Text>

            {/* Request Time */}
            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[24px]">
              <strong>Request Time:</strong> {requestTime}
            </Text>

            {/* Reset Button */}
            <Section className="text-center mb-[24px]">
              <Button
                href={resetUrl}
                className="bg-red-600 text-white px-[24px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border inline-block"
              >
                Reset Password
              </Button>
            </Section>

            {/* Alternative Link */}
            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px]">
              Or copy this link: <Link href={resetUrl} className="text-blue-600 break-all">{resetUrl}</Link>
            </Text>

            {/* Security Notice */}
            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[24px]">
              This link expires in 1 hour. If you didn&apos;t request this, please ignore this email.
            </Text>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[16px]">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                © {new Date().getFullYear()} Your Company. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PasswordReset.PreviewProps = {
  userEmail: "hello@alexvillacres.com",
  resetUrl: "https://example.com/reset-password?token=xyz789",
  requestTime: "July 23, 2025 at 4:57 PM PST",
};

export default PasswordReset;