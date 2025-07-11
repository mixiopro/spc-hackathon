import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// Where CopilotKit will proxy requests to. If you're using Copilot Cloud, this environment variable will be empty.
const runtimeUrl = process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL;
// When using Copilot Cloud, all we need is the publicApiKey.
const publicApiKey = process.env.NEXT_PUBLIC_COPILOT_API_KEY;
// The name of the agent that we'll be using.
const agentName = process.env.NEXT_PUBLIC_COPILOTKIT_AGENT_NAME;

const fontSans = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
  // weight: "400",
  weight: "900",
});

export const metadata: Metadata = {
  title: "Mixio Pro Planner",
  description:
    "Mixio Pro Planner: An Open Source Icon Alternative for generations of Content Plan, Competitor Analysis, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fontSans.variable} ${fontHeading.variable} antialiased`}
      >
        <CopilotKit
          runtimeUrl={runtimeUrl}
          publicApiKey={publicApiKey}
          agent={agentName}
        >
          {children}
          {/* <LayoutClient>{children}</LayoutClient> */}
        </CopilotKit>
      </body>
    </html>
  );
}
