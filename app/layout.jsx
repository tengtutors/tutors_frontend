import "@/styles/globals.css";
import { poppins } from "@/styles/fonts";
import Navbar from "@/components/Navbar";

const RootLayout = async ({ children }) => {
  return (
    <html lang="en">
        <body className={`${poppins.className} antialiased bg-basePrimary relative text-textPrimary`}>

              <Navbar />
              
              <section className="">
                  {children}
              </section>

        </body>
    </html>
  );
};

export default RootLayout;