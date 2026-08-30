import { FaYoutube, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import { RiTwitterXFill } from "react-icons/ri"
import Link from "next/link"
import { AppLogo } from "./app-logo"
import { AppFooterProps } from "../types/footer"

const links = [
  {
    title: "About",
    href: "/#about",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
  {
    title: "Terms of Service",
    href: "/#terms",
  },
  {
    title: "Privacy Policy",
    href: "/#privacy",
  },
]

export const AppFooter = ({ icon, title }: AppFooterProps) => {
  return (
    <footer className="border-t bg-background px-6 py-2">
      <div className="max-w-screen-3xl mx-auto w-full divide-y">
        <div className="flex flex-col items-center justify-between gap-4 px-2 pt-3 pb-5 sm:flex-row">
          <AppLogo icon={icon} title={title} />

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
            {links.map(({ title, href }) => (
              <li key={title}>
                <Link href={href}>{title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col-reverse items-center justify-between gap-4 px-2 pt-4 pb-2 sm:flex-row">
          <p className="text-sm font-medium text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()} {title}. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/">
              <FaLinkedin className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link href="/">
              <FaInstagram className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link href="/">
              <FaYoutube className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link href="/">
              <FaGithub className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link href="/">
              <RiTwitterXFill className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
