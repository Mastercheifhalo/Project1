"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    delay?: number;
    duration?: number;
    distance?: number;
    className?: string;
    staggerChildren?: number;
    once?: boolean;
}

const ScrollReveal = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.8,
    distance = 40,
    className = '',
    staggerChildren = 0,
    once = true,
}: ScrollRevealProps) => {
    const getInitialProps = () => {
        switch (direction) {
            case 'up': return { y: distance, opacity: 0 };
            case 'down': return { y: -distance, opacity: 0 };
            case 'left': return { x: distance, opacity: 0 };
            case 'right': return { x: -distance, opacity: 0 };
            case 'none': return { opacity: 0 };
            default: return { y: distance, opacity: 0 };
        }
    };

    return (
        <motion.div
            initial={getInitialProps()}
            whileInView={{
                x: 0,
                y: 0,
                opacity: 1,
                transition: {
                    duration,
                    delay,
                    ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for premium feel
                    staggerChildren,
                },
            }}
            viewport={{ once }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
