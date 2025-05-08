"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Purple fade colors
const purpleColors = [
  "rgba(31, 4, 58, 0.85)",
  "rgb(34, 4, 66)",
  "rgba(12, 1, 22, 0.75)",
  "rgba(110, 38, 187, 0.9)",
  "rgba(27, 24, 191, 0.95)",
];

// Blue colors for mandalas
const blueColors = [
  "rgba(25, 25, 112, 0.85)", // Midnight blue
  "rgba(65, 105, 225, 0.9)", // Royal blue
  "rgba(0, 0, 255, 0.8)", // Blue
  "rgba(30, 144, 255, 0.85)", // Dodger blue
  "rgba(0, 191, 255, 0.8)", // Deep sky blue
];

// Define types for the mandala shape
interface MandalaShape {
  id: string;
  centerX: number;
  centerY: number;
  size: number;
  duration: number;
  elements: number;
  rings: number;
  color1: string;
  color2: string;
  rotationSpeed: number;
  delay: number;
  expiry: number;
}

const TriangleMandalas: React.FC = () => {
  const [mandalaShapes, setMandalaShapes] = useState<MandalaShape[]>([]);

  useEffect(() => {
    // Generate initial mandala shapes
    generateMandalaShapes();

    // Set up interval for continuous generation
    const mandalaInterval = setInterval(() => {
      generateMandalaShapes();
    }, 4000); // Create new mandala shapes every 4 seconds

    // Clean up on unmount
    return () => clearInterval(mandalaInterval);
  }, []);

  // Function to generate mandala shapes with triangles
  const generateMandalaShapes = () => {
    const newMandalas: MandalaShape[] = Array(1)
      .fill(0)
      .map((_, i) => {
        const centerX = Math.random() * 80 + 10; // Keep away from extreme edges
        const centerY = Math.random() * 80 + 10;
        const size = Math.random() * 120 + 80;
        const duration = 7 + Math.random() * 4;
        const elements = Math.floor(Math.random() * 4) + 6; // 6-9 elements
        const rings = Math.floor(Math.random() * 2) + 3; // 3-4 rings
        const color1 =
          purpleColors[Math.floor(Math.random() * purpleColors.length)];
        const color2 =
          blueColors[Math.floor(Math.random() * blueColors.length)];
        const rotationSpeed = Math.random() > 0.5 ? 1 : -1; // Clockwise or counter-clockwise

        return {
          id: `mandala-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          centerX,
          centerY,
          size,
          duration,
          elements,
          rings,
          color1,
          color2,
          rotationSpeed,
          delay: Math.random() * 0.8,
          expiry: Date.now() + duration * 1000 + 800, // Duration + buffer
        };
      });

    setMandalaShapes((current) => [...current, ...newMandalas]);

    // Clean up expired mandalas
    setMandalaShapes((current) => current.filter((m) => m.expiry > Date.now()));
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <AnimatePresence>
        {mandalaShapes.map((mandala) => (
          <motion.div
            key={mandala.id}
            {...{ className: "absolute" }}
            style={{
              left: `${mandala.centerX}%`,
              top: `${mandala.centerY}%`,
              width: 0,
              height: 0,
              transformOrigin: "center",
              pointerEvents: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          >
            {/* Render triangle rings */}
            {Array.from({ length: mandala.rings }).map((_, ringIndex) => {
              // Calculate ring size from small to large (inside to outside)
              const ringSize = (mandala.size / mandala.rings) * (ringIndex + 1);
              const ringDelay =
                mandala.delay + (ringIndex / mandala.rings) * 0.8; // Stagger delay from center outward

              return (
                <motion.div
                  key={`ring-${ringIndex}`}
                  {...{ className: "absolute" }}
                  style={{
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0,
                    transformOrigin: "center",
                  }}
                  initial={{
                    scale: 0,
                    rotate: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    rotate: 360 * mandala.rotationSpeed,
                    opacity: [0, 0.8, 0.6],
                  }}
                  transition={{
                    duration: mandala.duration,
                    ease: "easeInOut",
                    delay: ringDelay,
                    times: [0, 0.3, 1],
                  }}
                >
                  {/* Render triangles in the ring */}
                  {Array.from({ length: mandala.elements }).map(
                    (_, elementIndex) => {
                      const angle =
                        (Math.PI * 2 * elementIndex) / mandala.elements;
                      const triangleSize = ringSize / 2;
                      const distance = ringSize / 2;
                      const x = distance * Math.cos(angle);
                      const y = distance * Math.sin(angle);
                      const triangleColor =
                        elementIndex % 2 === 0
                          ? mandala.color1
                          : mandala.color2;

                      return (
                        <motion.div
                          key={`triangle-${ringIndex}-${elementIndex}`}
                          {...{ className: "absolute" }}
                          style={{
                            left: 0,
                            top: 0,
                            width: 0,
                            height: 0,
                            transformOrigin: "center",
                          }}
                          initial={{
                            x: 0,
                            y: 0,
                            scale: 0,
                            opacity: 0,
                          }}
                          animate={{
                            x: x,
                            y: y,
                            scale: 1,
                            opacity: 1,
                          }}
                          transition={{
                            duration: 1.5,
                            delay:
                              ringDelay +
                              (elementIndex / mandala.elements) * 0.3,
                            ease: "easeOut",
                          }}
                        >
                          <motion.svg
                            width={triangleSize}
                            height={triangleSize}
                            viewBox="-50 -50 100 100"
                            style={{
                              position: "absolute",
                              left: -triangleSize / 2,
                              top: -triangleSize / 2,
                              transform: `rotate(${angle + Math.PI / 2}rad)`,
                            }}
                          >
                            <motion.polygon
                              points="0,-40 -35,20 35,20"
                              fill={triangleColor}
                              stroke={
                                triangleColor === mandala.color1
                                  ? mandala.color2
                                  : mandala.color1
                              }
                              strokeWidth="1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            />
                          </motion.svg>
                        </motion.div>
                      );
                    }
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TriangleMandalas;
