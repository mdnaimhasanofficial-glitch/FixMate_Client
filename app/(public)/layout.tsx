import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// Every public page gets the navbar and the footer
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
