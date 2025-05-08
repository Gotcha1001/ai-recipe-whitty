import Link from "next/link";
import Image from "next/image";
import MotionWrapperDelay from "./components/FramerMotion/MotionWrapperDelay";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <MotionWrapperDelay
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <Image
          src="/food.jpg"
          alt="Delicious meal"
          width={1200}
          height={400}
          className="w-full h-96 object-cover rounded-lg shadow-lg"
        />
      </MotionWrapperDelay>

      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Recipe Assistant
        </h1>
        <p className="text-lg text-gray-200 mb-6 max-w-md">
          Discover delicious dinner ideas, indulgent cakes, savoury meals, fast
          food, or cocktails to plan your week ahead!
        </p>
        <Link
          href="/recipes"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          View Recipes
        </Link>
      </div>
    </div>
  );
}
