import "@/styles/style.scss";

export const metadata = {
  title: {
    default: "Miracle Exterminating Service Management System",
    template: "%s | Miracle Exterminating Service Management System",
  },
  description:
    "Miracle Exterminating Service Management System — manage customers, service requests, inspections, appointments and payments.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  )
}