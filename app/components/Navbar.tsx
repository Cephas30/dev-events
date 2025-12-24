'use client'
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo" onClick={() => posthog.capture('navbar_link_clicked', { destination: '/', link_text: 'logo' })}>
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>

        <ul className="list-none">
          <li>
            <Link href="/" onClick={() => posthog.capture('navbar_link_clicked', { destination: '/', link_text: 'Home' })}>Home</Link>
          </li>
          <li>
            <Link href="/events" onClick={() => posthog.capture('navbar_link_clicked', { destination: '/events', link_text: 'Events' })}>Events</Link>
          </li>
          <li>
            <Link href="/create-event" onClick={() => posthog.capture('navbar_link_clicked', { destination: '/create-event', link_text: 'Create Event' })}>Create Event</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
