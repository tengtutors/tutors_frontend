import "@/styles/globals.css";
import { poppins } from "@/styles/fonts";
import Navbar from "@/components/Navbar";
import NotifWrapper from "@/components/NotifWrapper";

const RootLayout = async ({ children }) => {
    return (
        <html lang="en">
            <body
                className={`${poppins.className} antialiased bg-basePrimary relative text-textPrimary`}
            >
                <Navbar />

                <NotifWrapper>
                    <> {children}</>
                </NotifWrapper>
            </body>
        </html>
    );
};

export default RootLayout;
