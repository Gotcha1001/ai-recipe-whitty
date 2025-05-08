// "use client";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// // Bright white colors
// const smokeColors = [
//   "rgba(255, 255, 255, 0.85)",
//   "rgba(255, 255, 255, 0.8)",
//   "rgba(255, 255, 255, 0.75)",
//   "rgba(254, 254, 254, 0.9)",
//   "rgba(253, 253, 253, 0.95)",
// ];

// // Purple fade colors
// const purpleColors = [
//   "rgba(31, 4, 58, 0.85)",
//   "rgb(34, 4, 66)",
//   "rgba(12, 1, 22, 0.75)",
//   "rgba(110, 38, 187, 0.9)",
//   "rgba(27, 24, 191, 0.95)",
// ];

// // Type for the props of the SmokeEffect component
// interface SmokeEffectProps {
//   isVisible: boolean;
// }

// const SmokeEffect: React.FC<SmokeEffectProps> = ({ isVisible }) => {
//   const [showSmoke, setShowSmoke] = useState<boolean>(isVisible);

//   useEffect(() => {
//     if (isVisible) {
//       setShowSmoke(true);
//       const timer = setTimeout(() => setShowSmoke(false), 7000);
//       return () => clearTimeout(timer);
//     }
//   }, [isVisible]);

//   if (!showSmoke) return null;

//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
//       <div className="absolute w-full h-full">
//         {[...Array(30)].map((_, i) => {
//           const size = Math.random() * 120 + 60;
//           const startX = Math.random() * 100;
//           const startY = Math.random() * 100;
//           const whiteColor =
//             smokeColors[Math.floor(Math.random() * smokeColors.length)];
//           const purpleColor =
//             purpleColors[Math.floor(Math.random() * purpleColors.length)];
//           const duration = 3.5 + Math.random() * 2;

//           const mid1X = (Math.random() - 0.5) * 100;
//           const mid1Y = (Math.random() - 0.5) * 100 - 50;
//           const mid2X = mid1X + (Math.random() - 0.5) * 80;
//           const mid2Y = mid1Y + (Math.random() - 0.5) * 80 - 50;
//           const endX = mid2X + (Math.random() - 0.5) * 60;
//           const endY = mid2Y + (Math.random() - 0.5) * 60 - 50;

//           return (
//             <motion.div
//               key={`smoke-${i}`}
//               style={{
//                 position: "absolute",
//                 borderRadius: "50%",
//                 width: size,
//                 height: size,
//                 filter: `blur(${size / 3}px) brightness(1.5)`,
//                 left: `${startX}%`,
//                 top: `${startY}%`,
//                 mixBlendMode: "lighten",
//                 pointerEvents: "none",
//               }}
//               initial={{
//                 scale: 0.3,
//                 opacity: 0,
//                 backgroundColor: whiteColor,
//                 boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.5)",
//                 x: 0,
//                 y: 0,
//               }}
//               animate={{
//                 scale: [0.3, 0.7, 1.1, 1.3],
//                 opacity: [0, 0.8, 0.6, 0],
//                 x: [0, mid1X, mid2X, endX],
//                 y: [0, mid1Y, mid2Y, endY],
//               }}
//               transition={{
//                 duration: duration,
//                 ease: "easeInOut",
//                 times: [0, 0.3, 0.7, 1],
//                 delay: Math.random() * 0.5,
//               }}
//             >
//               <motion.div
//                 style={{ position: "absolute", inset: 0, borderRadius: "50%" }}
//                 initial={{
//                   backgroundColor: whiteColor,
//                   boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.5)",
//                 }}
//                 animate={{
//                   backgroundColor: purpleColor,
//                   boxShadow: "0 0 20px 5px rgba(160, 100, 220, 0.5)",
//                 }}
//                 transition={{
//                   duration: 1,
//                   delay: Math.random() * 0.5,
//                   ease: "easeInOut",
//                 }}
//               />
//             </motion.div>
//           );
//         })}

//         {/* Smaller detailed particles for subtle depth */}
//         {[...Array(20)].map((_, i) => {
//           const size = Math.random() * 50 + 20;
//           const startX = Math.random() * 100;
//           const startY = Math.random() * 100;
//           const whiteColor =
//             smokeColors[Math.floor(Math.random() * smokeColors.length)];
//           const purpleColor =
//             purpleColors[Math.floor(Math.random() * purpleColors.length)];
//           const duration = 2.5 + Math.random() * 1.5;

//           const midX = (Math.random() - 0.5) * 60;
//           const midY = (Math.random() - 0.5) * 60 - 30;
//           const endX = midX + (Math.random() - 0.5) * 40;
//           const endY = midY + (Math.random() - 0.5) * 40 - 30;

//           return (
//             <motion.div
//               key={`small-${i}`}
//               style={{
//                 position: "absolute",
//                 borderRadius: "50%",
//                 width: size,
//                 height: size,
//                 filter: `blur(${size / 4}px) brightness(1.6)`,
//                 left: `${startX}%`,
//                 top: `${startY}%`,
//                 mixBlendMode: "lighten",
//                 pointerEvents: "none",
//               }}
//               initial={{
//                 scale: 0.2,
//                 opacity: 0,
//                 backgroundColor: whiteColor,
//                 boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.6)",
//                 x: 0,
//                 y: 0,
//               }}
//               animate={{
//                 scale: [0.2, 0.5, 0.8, 1],
//                 opacity: [0, 0.7, 0.5, 0],
//                 x: [0, midX, endX],
//                 y: [0, midY, endY],
//               }}
//               transition={{
//                 duration: duration,
//                 ease: "easeInOut",
//                 times: [0, 0.3, 0.7, 1],
//                 delay: Math.random() * 0.3,
//               }}
//             >
//               <div className="absolute inset-0 rounded-full">
//                 <motion.div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     borderRadius: "50%",
//                   }}
//                   initial={{
//                     backgroundColor: whiteColor,
//                     boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.6)",
//                   }}
//                   animate={{
//                     backgroundColor: purpleColor,
//                     boxShadow: "0 0 15px 5px rgba(160, 100, 220, 0.6)",
//                   }}
//                   transition={{
//                     duration: 0.9,
//                     delay: Math.random() * 0.3,
//                     ease: "easeInOut",
//                   }}
//                 />
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SmokeEffect;

"use client";
import React, { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Bright white colors
const smokeColors: string[] = [
  "rgba(255, 255, 255, 0.85)",
  "rgba(255, 255, 255, 0.8)",
  "rgba(255, 255, 255, 0.75)",
  "rgba(254, 254, 254, 0.9)",
  "rgba(253, 253, 253, 0.95)",
];

// Purple fade colors
const purpleColors: string[] = [
  "rgba(31, 4, 58, 0.85)",
  "rgb(34, 4, 66)",
  "rgba(12, 1, 22, 0.75)",
  "rgba(110, 38, 187, 0.9)",
  "rgba(27, 24, 191, 0.95)",
];

interface SmokeEffectProps {
  isVisible: boolean;
}

// Function to generate deterministic particle data
const generateParticles = (count: number, isSmall = false) => {
  // Empty array before client-side hydration
  if (typeof window === "undefined") {
    return [];
  }

  return [...Array(count)].map((_, i) => {
    const size = isSmall ? 20 + (i % 5) * 10 : 60 + (i % 12) * 10;

    // Use deterministic positioning based on index
    const startX = (i * 7) % 100;
    const startY = (i * 11) % 100;

    // Use index-based selection for colors
    const whiteColor = smokeColors[i % smokeColors.length];
    const purpleColor = purpleColors[i % purpleColors.length];

    // More predictable animation timing
    const duration = isSmall ? 2.5 + (i % 3) * 0.5 : 3.5 + (i % 4) * 0.5;

    // Generate movement patterns based on index
    const mid1X = ((i * 17) % 100) - 50;
    const mid1Y = ((i * 13) % 100) - 50;
    const mid2X = mid1X + ((i * 7) % 80) - 40;
    const mid2Y = mid1Y + ((i * 11) % 80) - 40;
    const endX = mid2X + ((i * 5) % 60) - 30;
    const endY = mid2Y + ((i * 9) % 60) - 30;

    // Smaller particles have simpler paths
    if (isSmall) {
      return {
        id: `small-${i}`,
        size,
        startX,
        startY,
        whiteColor,
        purpleColor,
        duration,
        midX: ((i * 17) % 60) - 30,
        midY: ((i * 13) % 60) - 30,
        endX: ((i * 7) % 40) - 20,
        endY: ((i * 11) % 40) - 20,
        delay: (i % 6) * 0.05,
      };
    }

    return {
      id: `smoke-${i}`,
      size,
      startX,
      startY,
      whiteColor,
      purpleColor,
      duration,
      mid1X,
      mid1Y,
      mid2X,
      mid2Y,
      endX,
      endY,
      delay: (i % 10) * 0.05,
    };
  });
};

function SmokeEffect({ isVisible }: SmokeEffectProps): JSX.Element | null {
  const [showSmoke, setShowSmoke] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
    if (isVisible) {
      setShowSmoke(true);
      const timer = setTimeout(() => setShowSmoke(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Don't render anything during SSR or if smoke shouldn't be shown
  if (!isClient || !showSmoke) return null;

  // Generate particles only on the client side
  const largeParticles = generateParticles(30);
  const smallParticles = generateParticles(20, true);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute w-full h-full">
        {largeParticles.map((particle) => (
          <motion.div
            key={particle.id}
            style={{
              position: "absolute",
              borderRadius: "9999px",
              width: particle.size,
              height: particle.size,
              filter: `blur(${particle.size / 3}px) brightness(1.5)`,
              left: `${particle.startX}%`,
              top: `${particle.startY}%`,
              mixBlendMode: "lighten",
              pointerEvents: "none",
            }}
            initial={{
              scale: 0.3,
              opacity: 0,
              backgroundColor: particle.whiteColor,
              boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.5)",
              x: 0,
              y: 0,
            }}
            animate={{
              scale: [0.3, 0.7, 1.1, 1.3],
              opacity: [0, 0.8, 0.6, 0],
              x: [0, particle.mid1X, particle.mid2X, particle.endX],
              y: [0, particle.mid1Y, particle.mid2Y, particle.endY],
            }}
            transition={{
              duration: particle.duration,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1],
              delay: particle.delay,
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "9999px",
              }}
              initial={{
                backgroundColor: particle.whiteColor,
                boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.5)",
              }}
              animate={{
                backgroundColor: particle.purpleColor,
                boxShadow: "0 0 20px 5px rgba(160, 100, 220, 0.5)",
              }}
              transition={{
                duration: 1,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}

        {/* Smaller detailed particles for subtle depth */}
        {smallParticles.map((particle) => (
          <motion.div
            key={particle.id}
            style={{
              width: particle.size,
              height: particle.size,
              filter: `blur(${particle.size / 4}px) brightness(1.6)`,
              left: `${particle.startX}%`,
              top: `${particle.startY}%`,
              mixBlendMode: "lighten",
              pointerEvents: "none",
              position: "absolute",
              borderRadius: "9999px",
            }}
            initial={{
              scale: 0.2,
              opacity: 0,
              backgroundColor: particle.whiteColor,
              boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.6)",
              x: 0,
              y: 0,
            }}
            animate={{
              scale: [0.2, 0.5, 0.8, 1],
              opacity: [0, 0.7, 0.5, 0],
              x: [0, particle.midX, particle.endX],
              y: [0, particle.midY, particle.endY],
            }}
            transition={{
              duration: particle.duration,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1],
              delay: particle.delay,
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "9999px",
              }}
              initial={{
                backgroundColor: particle.whiteColor,
                boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.6)",
              }}
              animate={{
                backgroundColor: particle.purpleColor,
                boxShadow: "0 0 15px 5px rgba(160, 100, 220, 0.6)",
              }}
              transition={{
                duration: 0.9,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default SmokeEffect;
