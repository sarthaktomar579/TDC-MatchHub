import "./globals.css";

export const metadata = {
  title: "TDC MatchHub | The Date Crew",
  description: "Matchmaker Dashboard MVP for The Date Crew",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
