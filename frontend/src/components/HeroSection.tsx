import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../App.css";
export default function HeroSection() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-in-viewport");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        elements.forEach((el) => observerRef.current?.unobserve(el));
      }
    };
  }, []);

  return (
    <section className="relative  pt-20 pb-16  md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -right-[25%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-[60%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-10 md:space-y-12">
          <div className="inline-block rounded-full px-3 py-1 bg-primary/10 text-primary text-xs font-medium animate-in-viewport">
            Campus Exchange, Simplified
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl animate-in-viewport"
            style={{ transitionDelay: "100ms" }}
          >
            <span className="text-primary">Peer-to-Peer</span> Marketplace for
            Campus Needs
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance animate-in-viewport"
            style={{ transitionDelay: "200ms" }}
          >
            Buy and sell textbooks, gadgets, and essentials with fellow
            students. No middlemen, better prices, and campus-based exchanges.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-in-viewport"
            style={{ transitionDelay: "300ms" }}
          >
            <Link to="/login">
              <Button size="lg" className="rounded-full text-base px-8">
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
