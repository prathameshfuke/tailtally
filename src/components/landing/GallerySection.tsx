import { motion } from 'framer-motion';
import { useRef } from 'react';

const images = [
    {
        src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop",
        alt: "Funny dog sticking tongue out",
        className: "col-span-1 row-span-1",
    },
    {
        src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop",
        alt: "Cute cat staring",
        className: "col-span-1 row-span-2",
    },
    {
        src: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1000&auto=format&fit=crop",
        alt: "Golden Retriever puppy",
        className: "col-span-1 row-span-1",
    },
    {
        src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop",
        alt: "Playful puppy",
        className: "col-span-2 row-span-2",
    },
    {
        src: "https://images.unsplash.com/photo-1511044568932-338cba0fb803?q=80&w=1000&auto=format&fit=crop",
        alt: "Cat hiding in box",
        className: "col-span-1 row-span-1",
    },
    {
        src: "https://images.unsplash.com/photo-1472053092455-ee16a8b35c8b?q=80&w=1000&auto=format&fit=crop",
        alt: "Happy dog running",
        className: "col-span-1 row-span-1",
    },
];

export function GallerySection() {
    const containerRef = useRef(null);

    return (
        <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/5 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                        Happy Pets, Happy Wallets
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of pet parents who have found peace of mind with TailTally.
                    </p>
                </motion.div>

                <div
                    ref={containerRef}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] grid-flow-dense"
                >
                    {images.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group ${img.className}`}
                        >
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
