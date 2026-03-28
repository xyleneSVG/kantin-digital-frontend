"use client";

import { House, NotebookTabs, Bell, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { ASSETS } from "@/src/constants/assets";

export function NavbarComponent() {
	const pathname = usePathname();

	const hideNavbarRoutes = ["/login", "/onboarding"];

	if (hideNavbarRoutes.includes(pathname)) {
		return null;
	}

	return (
		<div className="bg-dark fixed bottom-0 z-999 flex w-full justify-center shadow-md rounded-t-xl">
			<div className="flex w-full max-w-82 flex-row items-center justify-between py-5">
				<Link href="/">
					<House
						className={cn(
							"size-7 transition-colors",
							pathname === "/" ? "text-primary" : "text-primary-foreground"
						)}
					/>
				</Link>

				<Link href="/list">
					<NotebookTabs
						className={cn(
							"size-7 transition-colors",
							pathname === "/list" ? "text-primary" : "text-primary-foreground"
						)}
					/>
				</Link>

				<Link href="/notifications">
					<Bell
						className={cn(
							"size-7 transition-colors",
							pathname === "/notifications" ? "text-primary" : "text-primary-foreground"
						)}
					/>
				</Link>

				<Link href="/messages">
					<MessageCircle
						className={cn(
							"size-7 transition-colors",
							pathname === "/messages" ? "text-primary" : "text-primary-foreground"
						)}
					/>
				</Link>

				<Link href="/profile">
					<Image
						src={ASSETS.PROFILE}
						alt={""}
						width={1920}
						height={1920}
						className={cn(
							"size-7 object-cover rounded-full border",
							pathname === "/profile" ? "border-primary" : "border-primary-foreground"
						)}
					/>
				</Link>
			</div>
		</div>
	);
}