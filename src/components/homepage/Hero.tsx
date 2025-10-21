import { Button } from "@/components/ui/button";

export default function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
			{/* Background gradient effect */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
				<div className="absolute top-1/4 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
			</div>

			<div className="absolute top-20 left-10 text-primary/40 text-4xl animate-pulse">✨</div>
			<div className="absolute top-40 right-20 text-primary/30 text-3xl animate-pulse">✨</div>
			<div className="absolute bottom-32 left-1/4 text-primary/30 text-2xl animate-pulse">✨</div>
			<div className="absolute top-1/3 right-1/4 text-primary/25 text-5xl">✨</div>
			<div className="absolute bottom-1/4 right-10 text-primary/25 text-4xl">✨</div>

			<div className="max-w-3xl mx-auto text-center space-y-8">
				<div className="space-y-6">
					<h1 className="text-6xl sm:text-6xl lg:text-6xl font-bold leading-tight text-balance text-foreground">
						Understand and Improve Your <span className="text-primary">Learning Habits</span>
					</h1>
					<p className="text-base sm:text-base leading-relaxed max-w-2xl mx-auto">
						Learnalyzer gives you deep insights into your learning patterns. Track your study time, analyze your
						understanding, and visualize your progress like never before.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						size="lg"
						className="bg-white hover:bg-white/90 text-lg font-light text-black rounded-full px-8 h-14 w-60 cursor-target"
					>
						Get Started
					</Button>
					<Button
						size="lg"
						variant="default"
						className="border border-white/30 text-lg font-light text-white/50 hover:bg-primary/10 rounded-full px-8 h-14 w-60 bg-transparent cursor-target"
					>
						Learn More
					</Button>
				</div>
			</div>
		</section>
	);
}
