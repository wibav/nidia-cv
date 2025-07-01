import { Inter } from "next/font/google";
import "./globals.css";
import Dashboard from "./components/Dashboard";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nidia Nahas CV",
  description: "Curriculum Vitae Nidia Nahas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Dashboard />
      </body>
    </html>
  );
}
