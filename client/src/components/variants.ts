export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07
        }
    }
};

export const itemVariants = {
    hidden: { opacity: 0, x: -2 },
    visible: { opacity: 1, x: 0 }
};