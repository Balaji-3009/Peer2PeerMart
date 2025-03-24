import { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import FeatureCard from "../components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "../App.css";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  Shield,
  RefreshCw,
  MessageSquare,
  Users,
} from "lucide-react";

const Home = () => {
  // Observer for animation-on-scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-in-viewport");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-in-viewport">
              Why P2PMart?
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl animate-in-viewport"
              style={{ transitionDelay: "100ms" }}
            >
              Built specifically for campus needs, our platform makes exchanging
              goods simple, safe, and student-friendly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Campus Specific"
              description="Exchange items with students on your campus, making it convenient to meet up and complete transactions."
              delay={200}
            />
            <FeatureCard
              icon={<CreditCard className="h-6 w-6" />}
              title="Better Pricing"
              description="Get better deals than retail by cutting out the middleman and dealing directly with other students."
              delay={300}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Safe & Secure"
              description="Our platform verifies all users with institutional emails for a secure trading environment."
              delay={400}
            />
            <FeatureCard
              icon={<RefreshCw className="h-6 w-6" />}
              title="Circular Economy"
              description="Reduce waste by giving items a second life within the campus community."
              delay={500}
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Direct Communication"
              description="Chat directly with buyers or sellers to negotiate prices or arrange meetups."
              delay={600}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Community Ratings"
              description="Build trust through our reputation system that showcases reliable community members."
              delay={700}
            />
          </div>
        </div>
      </section>
      {/* CTA Section */}
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center gap-12">
            <div className="flex flex-col items-center animate-in-viewport">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to join the campus marketplace?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Start browsing items or list your own in minutes. Our campus
                community is waiting for you.
              </p>
              <div className="flex gap-4">
                <Link to="/products">
                  <Button size="lg" className="rounded-full">
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </div>
            <div
              className="w-full max-w-md animate-in-viewport"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-primary/5 rounded-2xl transform -rotate-3"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Students collaborating on campus"
                    className="w-full aspect-video object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
