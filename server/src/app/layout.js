import { poppins } from "./font";
import "./globals.css";

export const metadata = {
  title: "Nigotis",
  description: "Nigotis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
