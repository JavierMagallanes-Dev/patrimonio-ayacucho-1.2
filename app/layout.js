import 'leaflet/dist/leaflet.css';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Patrimonio Cultural de Ayacucho",
  description: "Descubre el patrimonio cultural e histórico de Ayacucho, Perú. Explora sitios patrimoniales, rutas temáticas y servicios turísticos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}