"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const MotionWrapperDelay = ({
    children,
    initial,
    whileInView,
    viewport,
    transition,
    variants,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: viewport?.amount || 0.1,
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [viewport]);

    return (
        <motion.div
            ref={ref}
            initial={initial}
            animate={isVisible ? whileInView : initial}
            viewport={viewport}
            transition={transition}
            variants={variants}
            style={{ opacity: isVisible ? 1 : 0 }}
        >
            {children}
        </motion.div>
    );
};

export default MotionWrapperDelay;