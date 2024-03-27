import "@/styles/globals.css";
import { poppins } from "@/styles/fonts";
import Navbar from "@/components/Navbar";

const RootLayout = async ({ children }) => {
  return (
    <html lang="en">
        <body className={`${poppins.className} antialiased bg-basePrimary relative text-textPrimary min-h-screen`}>

              <Navbar />
              
              <div className="">
                  {children}
              </div>

        </body>
    </html>
  );
};

export default RootLayout;