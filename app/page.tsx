"use client";

import { useCallback, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import SelectedWork from "@/components/SelectedWork";
import Manifesto from "@/components/Manifesto";
import StatsClients from "@/components/StatsClients";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  // Hero reveal waits for the preloader to finish (or skip).
  const [ready, setReady] = useState(false);
  const handleDone = useCallback(() => setReady(true), []);

  return (
    <SmoothScroll>
      <Preloader onDone={handleDone} />
      <Nav />
      <main>
        <Hero start={ready} />
        <Marquee />
        <SelectedWork />
        <Manifesto />
        <StatsClients />
        <ContactFooter />
      </main>
    </SmoothScroll>
  );
}
