"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ShinyText from "../animation/ShinyText";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isDarkBackground, setIsDarkBackground] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			setIsDarkBackground(scrollY < 850);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const textColor = isDarkBackground ? "text-white" : "text-black";
	const textColorSecondary = isDarkBackground ? "text-gray-100" : "text-gray-700";
	const hoverColor = isDarkBackground ? "hover:text-purple-300" : "hover:text-purple-600";

	return (
		<nav className="fixed top-5 w-full z-50 pt-4 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 shadow-lg">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<div className="flex-shrink-0">
							<ShinyText text="Learnalyzer" disabled={false} speed={5} className="text-2xl font-bold" />
						</div>

						{/* Desktop Navigation */}
						<div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-8">
							<a
								href="#home"
								className="text-purple-500 hover:text-purple-500 transition-colors text-sm cursor-target font-semibold"
							>
								Home
							</a>
							<a
								href="#features"
								className={`${textColorSecondary} ${hoverColor} transition-colors text-sm cursor-target font-medium`}
							>
								Feature
							</a>
							<a
								href="#testimonials"
								className={`${textColorSecondary} ${hoverColor} transition-colors text-sm cursor-target font-medium`}
							>
								Testimonials
							</a>
							<a
								href="#pricing"
								className={`${textColorSecondary} ${hoverColor} transition-colors text-sm cursor-target font-medium`}
							>
								Contact
							</a>
						</div>

						{/* Desktop Buttons */}
						<div className="hidden md:flex items-center gap-4">
							<Link href="#">
								<Button
									variant="default"
									// className="bg-transparent text-gray-100 hover:text-gray-100 hover:bg-gray-800 px-6 text-sm font-medium rounded-full"
									className={`bg-transparent ${textColorSecondary} ${hoverColor} ${
										isDarkBackground ? "hover:bg-gray-800" : "hover:bg-gray-100"
									} px-6 text-sm font-medium rounded-full transition-colors cursor-target`}
								>
									Sign in
								</Button>
							</Link>
							<Link href="#">
								{/* <Button className="bg-white hover:bg-gray-200 text-black rounded-full px-6 text-sm font-medium"
								> */}
								<Button
									className={`${
										isDarkBackground ? "bg-white hover:bg-gray-200 text-black" : "bg-black hover:bg-gray-800 text-white"
									} rounded-full px-6 text-sm font-medium transition-colors cursor-target`}
								>
									Try Free
								</Button>
							</Link>
						</div>

						{/* Mobile menu button */}
						<button className="md:hidden text-black" onClick={() => setIsOpen(!isOpen)}>
							{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>

					{/* Mobile Navigation */}
					{isOpen && (
						<div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
							<a href="#features" className="block px-4 py-2 text-gray-700 hover:text-black text-sm">
								Features
							</a>
							<a href="#insights" className="block px-4 py-2 text-gray-700 hover:text-black text-sm">
								Templates
							</a>
							<a href="#testimonials" className="block px-4 py-2 text-gray-700 hover:text-black text-sm">
								Pricing
							</a>
							<a href="#pricing" className="block px-4 py-2 text-gray-700 hover:text-black text-sm">
								Blog
							</a>
							<div className="flex gap-2 px-4 pt-2">
								<Link href="#">
									<Button
										variant="ghost"
										className="flex-1 text-gray-700 hover:border-2 hover:border-gray-300 hover:bg-transparent text-sm rounded-full"
									>
										Sign in
									</Button>
								</Link>
								<Link href="#">
									<Button className="flex-1 bg-black hover:bg-gray-900 text-white rounded-full text-sm">
										Try Free
									</Button>
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
