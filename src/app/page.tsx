import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Cloud, Repeat, Bot } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ApniSec - Proactive Cybersecurity',
  description: 'Elevate your security posture with advanced VAPT and Cloud Security, defended by AI-powered insights.',
};

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-security');

  const features = [
    {
      title: "Cloud Security",
      description: "Secure your cloud infrastructure with our comprehensive assessment and continuous monitoring.",
      icon: Cloud
    },
    {
      title: "Reteam Assessment",
      description: "Test your defenses with our elite red team, and improve with our expert blue team.",
      icon: Repeat
    },
    {
      title: "Vulnerability Assessment",
      description: "Identify and mitigate vulnerabilities in your web and mobile applications with our VAPT services.",
      icon: ShieldCheck
    },
    {
        title: "AI-Powered Defense",
        description: "Leverage artificial intelligence to predict, detect, and respond to threats in real-time.",
        icon: Bot
    }
  ];

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <main className="flex-1">
        <section className="relative w-full h-[80vh] md:h-[90vh] flex items-center justify-center text-center overflow-hidden">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover z-0 opacity-20"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
          <div className="relative z-10 container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-300 to-primary drop-shadow-lg">
              Defend Against Cyber Threats Before They Strike
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80 drop-shadow-md">
              Elevate your security posture with advanced VAPT and Cloud Security, defended by AI-powered insights.
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-primary/90 text-primary-foreground hover:bg-primary animate-pulse-glow">
                Explore Solutions
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="glass-panel p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="p-4 bg-primary/20 rounded-full mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ApniSec. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
