import MotionWrapperDelay from "./components/FramerMotion/MotionWrapperDelay";
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Recipe Assistant",
  description: "Get quirky recipes from Chef Quirky",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="gradient-background2 font-sans text-gray-200">
        <nav className="bg-gradient-to-r from-purple-800 to-black p-4">
          <div className="container mx-auto flex justify-between items-center p-2">
            <MotionWrapperDelay
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              variants={{
                hidden: { opacity: 0, x: 100 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              {" "}
              <Link href="/">
                <img
                  src="/header.jpg"
                  alt="Recipe Assistant Logo"
                  className="h-10 w-auto rounded-sm"
                />
              </Link>{" "}
            </MotionWrapperDelay>

            <div>
              <Link
                href="/"
                className="px-4 text-gray-200 hover:text-purple-400"
              >
                Home
              </Link>
              <Link
                href="/recipes"
                className="px-4 text-gray-200 hover:text-purple-400"
              >
                Recipes
              </Link>
            </div>
          </div>
        </nav>
        <MotionWrapperDelay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          {" "}
          <div className="container mx-auto p-6">{children}</div>{" "}
        </MotionWrapperDelay>
      </body>
    </html>
  );
}
