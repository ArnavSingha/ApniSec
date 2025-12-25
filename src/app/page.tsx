

'use client';
import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, ArrowRight, Award, TrendingUp, Handshake, BrainCircuit, Shield, GitBranch, ShieldAlert, ShieldCheck, FileSearch, Target, UserCheck, Eye, BarChart } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import DraggableBubble from '@/components/DraggableBubble';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

export default function Home() {
    const dashboardImage = PlaceHolderImages.find(p => p.id === 'dashboard-dark');
  const services = [
    {
      title: "Dark Eye Watcher",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
      ),
      features: [
        "Monitor The Dark Web For Compromised Data.",
        "Tracking Data Breaches 24x7",
        "Threat Intelligence Platform",
        "Data Loss Prevention (DLP)",
        "Brand Protection Services"
      ],
      bgColor: "bg-gray-500/10",
      iconColor: "text-gray-400"
    },
    {
      title: "Cloud Watcher",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
      ),
      features: [
        "Asset Monitoring",
        "Cloud Security Posture Management",
        "Microservices Security",
        "Cloud Attack Emulation",
      ],
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400"
    },
    {
      title: "Red Team Assessment",
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 9.5 3 21"/><path d="m21 3-9.5 9.5"/><path d="M7 3h14v14"/><path d="M3 21v-4.5"/><path d="M3 21h4.5"/></svg>
      ),
      features: [
        "Social Engineering Simulation Campaigns & Evaluation",
        "Assess Vulnerabilities In System And Processes",
        "On-Site Network Firewall And Process Audits",
        "Cloud Attack Emulation"
      ],
      bgColor: "bg-red-500/10",
      iconColor: "text-red-400"
    },
    {
      title: "End-to-End VAPT",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>
      ),
      features: [
        "Web, API & Mobile Application Security",
        "Secure Code Review",
        "Vulnerability Assessment & Penetration Testing",
        "Network Security"
      ],
       bgColor: "bg-green-500/10",
      iconColor: "text-green-400"
    },
     {
      title: "Virtual CISO",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
      ),
      features: [
        "Continuous Vulnerability Scanning & Asset Monitoring",
        "Auditing Weekly Feature Releases",
        "DevSecOps - Shift Left Culture",
        "Zero Trust Security Model",
        "Threat Modelling",
        "Social Engineering Simulations & Awareness Trainings",
        "Information Security Policy & Cyber Risk Maturity Plan",
        "Secure Architecture Review",
        "Bug Bounty Program Management",
        "Vendor Monitoring System",
        "Compliance As A Service",
        "ISO 27001, SOC2, GDPR, RBI Audits & Compliance",
        "Third Party Risk Assessment"
      ],
       bgColor: "bg-teal-500/10",
      iconColor: "text-teal-400"
    },
  ];

  const clientLogos = [
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/asus.svg", alt: "asus" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/google.svg", alt: "google" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/amazon.svg", alt: "amazon" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/redbull.svg", alt: "redbull" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/dell.svg", alt: "dell" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/apple.svg", alt: "apple" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/microsoft.svg", alt: "microsoft" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/dominos.svg", alt: "dominos" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/figma.svg", alt: "figma" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/flipkart.svg", alt: "flipkart" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/atlanssian.svg", alt: "atlanssian" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/jira.svg", alt: "jira" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/licious.svg", alt: "licious" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/facebook.svg", alt: "facebook" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/mastercard.svg", alt: "mastercard" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/nciipc.svg", alt: "nciipc" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/yahoo.svg", alt: "yahoo" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/zomato.svg", alt: "zomato" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/paytm.svg", alt: "paytm" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/sony.svg", alt: "sony" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/github.svg", alt: "github" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/gitlab.svg", alt: "gitlab" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/cybrary.svg", alt: "cybrary" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/hackerone.svg", alt: "hackerone" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/brex.svg", alt: "brex" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/bugcrowd.svg", alt: "bugcrowd" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/netflix.svg", alt: "netflix" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/coinbase.svg", alt: "coinbase" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/cloudflare.svg", alt: "cloudflare" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/home/brands/oneshoppingcart.svg", alt: "oneshoppingcart" },
  ];

  const securedBrands = [
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/oziva.svg", alt: "oziva" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/blackbuck.svg", alt: "blackbuck" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/livspace.svg", alt: "livspace" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/axio.svg", alt: "axio" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/wearerangde.svg", alt: "wearerangde" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/workindia.svg", alt: "workindia" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/tribytey.svg", alt: "tribytey" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/freshtohome.svg", alt: "freshtohome" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/preciisa.svg", alt: "preciisa" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/tanx.svg", alt: "tanx" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/purplle.svg", alt: "purplle" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/mcaffeine.svg", alt: "mcaffeine" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/truemeds.svg", alt: "truemeds" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/tatvacare.svg", alt: "tatvacare" },
    { src: "https://assets.apnisec.com/public/apnisec-ui/brands/crowdchem.svg", alt: "crowdchem" }
  ];
  
  const teamMembers = [
    { name: "Rajat Moury", role: "Founder", image: "https://assets.apnisec.com/public/apnisec-ui/home/team/rajat.svg", linkedin: "https://www.linkedin.com/in/rajatmoury/" },
    { name: "Muthu D", role: "Security Engineer", image: "https://assets.apnisec.com/public/apnisec-ui/home/team/muthu.svg", linkedin: "#" },
    { name: "Atish Thakur", role: "Software Engineer", image: "https://assets.apnisec.com/public/apnisec-ui/home/team/atish.svg", linkedin: "#" },
    { name: "Nishan Agarwal", role: "UI/UX Designer", image: "https://assets.apnisec.com/public/apnisec-ui/home/team/nishan.svg", linkedin: "#" },
  ];
  
  const testimonials = [
    {
      name: 'Moiz Arsiwala',
      role: 'Co-founder',
      text: "Working with Apni has been a game-changer for our organization. Their penetration testing services provided us with critical insights into our vulnerabilities, allowing us to strengthen our defenses before any real threats emerged. The risk assessment process was thorough and eye-opening, identifying potential gaps we hadn't considered. Most importantly, their mitigation strategies were practical,...",
      avatar: 'https://i.imgur.com/A52yvct.png'
    },
    {
      name: 'Aditya Sharma',
      role: 'CTO, InnovateTech',
      text: "ApniSec's proactive approach to security is unparalleled. They identified critical vulnerabilities we didn't know we had and helped us build a much more resilient system. Their team is professional, skilled, and an absolute pleasure to work with.",
      avatar: 'https://picsum.photos/seed/avatar1/100/100'
    },
    {
      name: 'Priya Mehta',
      role: 'Head of Engineering, SecurePay',
      text: "The insights from their VAPT were a game-changer for us. ApniSec delivered a comprehensive report that was easy to understand and act upon. We've integrated their recommendations and our security posture has never been stronger.",
      avatar: 'https://picsum.photos/seed/avatar2/100/100'
    }
  ]

  const stats = [
    { value: '849M+', label: 'Lines Of Code Reviewed' },
    { value: '3Bn+', label: 'Records Scraped' },
    { value: '15K+', label: 'Assets Monitored', className: 'text-accent' },
    { value: '200TB+', label: 'Data Analysed' },
    { value: '99.99%', label: 'Threat Mitigation' },
  ];

  const timelineItems = [
    {
      icon: FileSearch,
      title: "Identify Critical Assets",
      description: "Primary Customer And Internet Facing Applications",
      side: "left",
    },
    {
      icon: Target,
      title: "Vulnerability Assessment",
      description: "Security Testing By Expertise Team Of Certified Hackers",
      side: "right",
    },
    {
      icon: Eye,
      title: "Watcher Onboarding",
      description: "Asset Monitoring, SCM, Dark Eye Watcher For Overall Monitoring",
      side: "left",
    },
    {
      icon: UserCheck,
      title: "vCISO",
      description: "Acting As A Security Team With Regular Threat Modelling And Architecture & Code Reviews",
      side: "right",
    },
    {
      icon: BarChart,
      title: "Reporting And Mitigation",
      description: "Regular Reporting, Patching, Re-Testing Patches With PR Reviews & Audit Certificate",
      side: "left",
    },
  ];
  
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10"></div>
          <Image
            src="https://picsum.photos/seed/hero-bg/1920/1080"
            alt="Abstract cybersecurity background with digital nodes and connections"
            fill
            className="object-cover z-0 opacity-20"
            data-ai-hint="cybersecurity abstract"
            priority
          />
          <div className="relative z-20 container mx-auto px-4 md:px-6 flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-300 to-primary drop-shadow-lg">
              Defend Against Cyber Threats Before They Strike
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-foreground/80 drop-shadow-md">
              Elevate your security posture with advanced VAPT and Cloud Security, fortified by AI-powered insights and a team of elite ethical hackers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
               <Button size="lg" asChild className="bg-primary/90 text-primary-foreground hover:bg-primary/80">
                  <Link href="/register">Get Started Free</Link>
               </Button>
               <Button size="lg" variant="outline" asChild>
                 <Link href="#">Book a Demo</Link>
               </Button>
            </div>
             <div className="mt-12 md:mt-16 w-full max-w-6xl">
                <p className="text-sm text-center uppercase text-muted-foreground tracking-widest mb-4">Trusted by industry leaders</p>
                 <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                  <div className="flex w-max animate-scroll">
                      {[...clientLogos, ...clientLogos].map((client, index) => (
                          <div key={index} className="relative flex-shrink-0 w-24 md:w-32 h-16 flex items-center justify-center mx-2 md:mx-4">
                              <Image 
                                src={client.src} 
                                alt={client.alt}
                                fill
                                className="object-contain" 
                              />
                          </div>
                      ))}
                  </div>
              </div>
             </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">Services</Badge>
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Comprehensive Cybersecurity Solutions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <ServiceCard service={services[0]} />
                <ServiceCard service={services[1]} />
              </div>

              {/* Middle Column */}
              <div className="space-y-8">
                <ServiceCard service={services[2]} />
                <ServiceCard service={services[3]} />
              </div>
              
              {/* Right Column */}
              <div className="md:col-span-2 lg:col-span-1">
                 <ServiceCard service={services[4]} />
              </div>
            </div>
          </div>
        </section>
        
        {/* Data/Stats Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-16">
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                  Numbers Don't Lie. <br />
                  <span className="relative">
                    Data speaks for itself,
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-primary/50 -mb-1"></span>
                  </span>
                  <br />make informed decisions.
                </h2>
                <p className="text-muted-foreground text-lg">
                  All in One Cyber Defence platform
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-8 pt-8">
                    <div key={stats[0].label}>
                        <p className={`text-3xl md:text-4xl font-bold ${stats[0].className || 'text-foreground'}`}>
                            {stats[0].value}
                        </p>
                        <p className="text-muted-foreground text-sm md:text-base">{stats[0].label}</p>
                    </div>
                </div>
              </div>
              <div className="relative aspect-video rounded-xl shadow-2xl shadow-primary/10 overflow-hidden border-4 border-primary/20">
                {dashboardImage && (
                    <Image
                      src={dashboardImage.imageUrl}
                      alt={dashboardImage.description}
                      fill
                      className="object-cover"
                      data-ai-hint={dashboardImage.imageHint}
                    />
                )}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
               <div key={stats[1].label} className="text-center md:text-left">
                  <p className={`text-3xl md:text-4xl font-bold ${stats[1].className || 'text-foreground'}`}>
                    {stats[1].value}
                  </p>
                  <p className="text-muted-foreground text-sm md:text-base">{stats[1].label}</p>
                </div>
              {stats.slice(2).map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <p className={`text-3xl md:text-4xl font-bold ${stat.className || 'text-foreground'}`}>
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold font-headline">How We <span className="relative">Do It<span className="absolute left-0 bottom-0 w-full h-1 bg-primary/50 -mb-1"></span></span></h2>
              </div>
              <div className="relative">
                {/* Vertical Line for Desktop */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" aria-hidden="true"></div>

                {timelineItems.map((item, index) => {
                  const Icon = item.icon;
                  const isLeft = item.side === 'left';
                  return (
                     <div key={index} className="mb-12 md:mb-0">
                        <div className="flex md:items-center flex-col md:flex-row">
                          
                          {/* Content Block (Left on Desktop) */}
                          <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-8' : 'md:pl-8'} ${isLeft ? 'md:text-right order-1' : 'order-3'}`}>
                             <div className={`pl-12 md:pl-0 md:inline-block`}>
                                <div className={`flex items-center gap-4 mb-2 md:inline-flex ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                                  <Icon className="w-8 h-8 text-primary" />
                                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                                </div>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                          </div>

                          {/* Dot */}
                          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-full md:w-auto order-2 my-4 md:my-0">
                              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                          </div>

                          {/* Spacer/Empty Block */}
                          <div className={`w-full md:w-1/2 ${isLeft ? 'order-3' : 'order-1'}`}></div>
                        </div>
                      </div>
                  );
                })}
              </div>
            </div>
        </section>


        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-card/5">
            <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-headline">Our Mission</h2>
                    <p className="text-muted-foreground">To provide cutting-edge, proactive cybersecurity solutions that empower businesses to innovate without fear. We are committed to staying ahead of threats, securing digital assets, and fostering a culture of security.</p>
                     <h3 className="text-xl font-bold pt-4">Our Expert Team of Hackers</h3>
                     <div className="flex flex-wrap gap-4">
                         <div className="bg-muted p-3 rounded-lg"><Award className="w-8 h-8 text-primary"/></div>
                         <div className="bg-muted p-3 rounded-lg"><ShieldCheck className="w-8 h-8 text-primary"/></div>
                         <div className="bg-muted p-3 rounded-lg"><TrendingUp className="w-8 h-8 text-primary"/></div>
                     </div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold font-headline">Why Choose Us</h2>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-4">
                            <ShieldCheck className="w-6 h-6 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-bold">Expert-Led</h4>
                                <p className="text-muted-foreground">Our team consists of world-class ethical hackers and security researchers.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <BrainCircuit className="w-6 h-6 text-primary mt-1 shrink-0" />
                            <div>
                                <h4 className="font-bold">AI-Powered</h4>
                                <p className="text-muted-foreground">We leverage AI for predictive threat intelligence and rapid response.</p>
                            </div>
                        </li>

                        <li className="flex items-start gap-4">
                            <Handshake className="w-6 h-6 text-primary mt-1 shrink-0" />
                             <div>
                                <h4 className="font-bold">Customer-Centric</h4>
                                <p className="text-muted-foreground">We act as a true partner, tailoring our solutions to your specific needs.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        
        {/* Secured Brands Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 relative min-h-[400px]">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="text-6xl md:text-8xl font-bold text-gray-800/10 opacity-50 whitespace-nowrap -rotate-6 scale-150">
                      FINTECH LOGISTICS HEALTHCARE RECRUITECH ECOMMERCE
                  </div>
              </div>
              <div className="relative z-10 text-center">
                  <h2 className="text-3xl font-bold font-headline mb-4">
                      Our <span className="relative">Secured Brands<span className="absolute left-0 bottom-0 w-full h-1 bg-primary/50 -mb-1"></span></span>
                  </h2>
                  <p className="text-muted-foreground mb-12">Retained 100% Customers Since Inception From Various Industries</p>
              </div>
              <div className="absolute inset-0 top-32">
                {securedBrands.map((logo, index) => {
                  return (
                    <DraggableBubble
                      key={index}
                      animationDuration={15 + Math.random() * 10}
                      animationDelay={Math.random() * 15}
                      size={80 + Math.random() * 40}
                    >
                      <Image 
                        src={logo.src} 
                        alt={logo.alt} 
                        fill
                        className="w-full h-full object-contain p-2 pointer-events-none"
                      />
                    </DraggableBubble>
                  );
                })}
              </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-card/5">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-center text-3xl font-bold font-headline mb-12">
                  Meet Our <span className="relative">Team<span className="absolute left-0 bottom-0 w-full h-1 bg-primary/50 -mb-1"></span></span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map(member => (
                       <div key={member.name} className="bg-background text-foreground p-1 rounded border hover:shadow-[0px_0px_20px_0px_rgba(0,255,178,0.15)] border-border/20 overflow-hidden">
                        <Image
                            alt={member.name}
                            loading="lazy"
                            width="200"
                            height="200"
                            className="object-cover w-full h-auto rounded mix-blend-luminosity hover:mix-blend-multiply"
                            src={member.image}
                          />
                        <div className="p-4 flex justify-between items-center">
                          <div>
                            <h3 className="text-lg">{member.name}</h3>
                            <p className="opacity-[0.8] text-sm">{member.role}</p>
                          </div>
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`Link to ${member.name}'s LinkedIn profile`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                              <path d="M6.94048 5.78313C6.94011 6.59744 6.44608 7.33022 5.69134 7.63593C4.9366 7.94165 4.07187 7.75925 3.5049 7.17475C2.93793 6.59024 2.78195 5.72035 3.1105 4.97527C3.43906 4.23019 4.18654 3.7587 5.00048 3.78313C6.08155 3.81558 6.94097 4.70157 6.94048 5.78313ZM7.00048 9.26313H3.00048V21.7831H7.00048V9.26313ZM13.3205 9.26313H9.34048V21.7831H13.2805V15.2131C13.2805 11.5531 18.0505 11.2131 18.0505 15.2131V21.7831H22.0005V13.8531C22.0005 7.68313 14.9405 7.91313 13.2805 10.9431L13.3205 9.26313Z" fill="currentColor"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-center text-3xl font-bold font-headline mb-12">
                    Our secured <span className="relative">Client's<span className="absolute left-0 bottom-0 w-full h-1 bg-primary/50 -mb-1"></span></span> says it all
                </h2>
                <TestimonialCarousel testimonials={testimonials} />
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
            <div className="container max-w-3xl mx-auto px-4 md:px-6">
                <h2 className="text-center text-3xl font-bold fontheadline mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What makes ApniSec different from other cybersecurity firms?</AccordionTrigger>
                        <AccordionContent>
                            Our unique blend of elite human expertise and AI-powered technology allows us to provide predictive, proactive, and continuous security that adapts to the evolving threat landscape.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does a typical assessment take?</AccordionTrigger>
                        <AccordionContent>
                            The duration varies based on the scope and complexity of the target environment. A standard VAPT can range from one to four weeks, while a full Red Team engagement may be longer. We provide a detailed timeline with every proposal.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Do you offer customized security packages?</AccordionTrigger>
                        <AccordionContent>
                            Absolutely. We understand that every business is unique. We work closely with you to tailor our services to your specific needs, budget, and risk appetite.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>What industries do you specialize in?</AccordionTrigger>
                        <AccordionContent>
                            We have extensive experience across various sectors, including FinTech, Healthcare, E-commerce, and SaaS. Our methodologies are adaptable to the specific compliance and regulatory requirements of any industry.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Shield className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold font-headline">ApniSec</span>
              </Link>
            </div>

            <div className="md:col-span-2 md:col-start-7">
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Home</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Solutions</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Process</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Report</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Services</Link></li>
                <li>
                  <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    Careers <Badge variant="outline" className="bg-green-400/20 text-green-400 border-green-400/30">Active</Badge>
                  </Link>
                </li>
                 <li>
                  <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    Bug Bounty <Badge variant="outline" className="bg-green-400/20 text-green-400 border-green-400/30">Active</Badge>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Dark Eye Watcher</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Cloud Security</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Virtual CISO</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Red Team Assessment</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">VAPT</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2 flex md:justify-end items-start">
               <div className="flex items-center gap-4">
                  <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><LinkedinIcon className="w-5 h-5" /></Link>
                  <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><TwitterIcon className="w-5 h-5" /></Link>
                  <Link href="#" aria-label="Youtube" className="text-muted-foreground hover:text-primary"><YoutubeIcon className="w-5 h-5" /></Link>
               </div>
            </div>
          </div>
          
          <div className="mt-12 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Apni Sec. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
               <Link href="#" className="hover:text-primary">Privacy Policy</Link>
               <Link href="#" className="hover:text-primary">Terms And Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


const ServiceCard = ({ service }: { service: any }) => {
  return (
    <Card className="glass-panel flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
        <div className={`p-2 rounded-full ${service.bgColor}`}>
          <div className={service.iconColor}>
            {service.icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {service.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <Check className="w-4 h-4 mr-3 mt-1 text-green-500 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <Link href="#" className="text-primary hover:underline flex items-center">
          Learn More <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </Card>
  )
}

const TestimonialCarousel = ({ testimonials }: { testimonials: any[] }) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div>
        <Carousel setApi={setApi} className="testimonial-carousel" opts={{ loop: true }}>
            <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card className="bg-primary/5 border-primary/20 p-6 md:p-8 rounded-lg">
                                <CardContent className="p-0 relative">
                                    <span className="absolute -top-4 -left-4 text-6xl text-primary/20 font-serif">“</span>
                                    <p className="text-muted-foreground z-10 relative">
                                        {testimonial.text}
                                        <Link href="#" className="text-primary font-medium ml-1">Read More</Link>
                                    </p>
                                    <div className="flex items-center mt-6">
                                        <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full mr-4" />
                                        <div>
                                            <h4 className="font-bold">{testimonial.name}</h4>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className='hidden md:inline-flex'/>
            <CarouselNext className='hidden md:inline-flex'/>
        </Carousel>
        <div className="testimonial-dots">
            {testimonials.map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`dot ${current === index ? 'dot--active' : ''}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    </div>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )
}
  
function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
    )
}


    
