"use client";

import LiquidEther from "@/components/animation/LiquidEther";
import Features from "@/components/homepage/Feature";
import Footer from "@/components/homepage/Footer";
import Hero from "@/components/homepage/Hero";
import Navbar from "@/components/homepage/Navbar";
import Testimonials from "@/components/homepage/Testimonials";

export default function Home() {
	return (
		<main className="min-h-screen bg-background text-foreground relative">
			{/* <TargetCursor spinDuration={4} hideDefaultCursor={true} /> */}
			{/* Background Component */}
			<div className="fixed inset-0 w-full h-full z-0">
				<div style={{ width: "100%", height: "100vh", position: "relative" }}>
					<LiquidEther
						colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
						mouseForce={20}
						cursorSize={100}
						isViscous={false}
						viscous={30}
						iterationsViscous={32}
						iterationsPoisson={32}
						resolution={0.5}
						isBounce={false}
						autoDemo={true}
						autoSpeed={0.5}
						autoIntensity={2.2}
						takeoverDuration={0.25}
						autoResumeDelay={3000}
						autoRampDuration={0.6}
					/>
				</div>
			</div>

			{/* Content with higher z-index */}
			<div className="relative z-10">
				<Navbar />
				<Hero />
				<Features />
				<Testimonials />
				{/* <FinalCTA /> */}
				<Footer />
			</div>
		</main>
	);
}
