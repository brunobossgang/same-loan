import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import RateComparison from "@/components/RateComparison";
import Calculator from "@/components/Calculator";
import IncomeAnalysis from "@/components/IncomeAnalysis";
import USMap from "@/components/USMap";
import StateCards from "@/components/StateCards";
import Trends from "@/components/Trends";
import TakeAction from "@/components/TakeAction";
import About from "@/components/About";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <RateComparison />
      <Calculator />
      <USMap />
      <IncomeAnalysis />
      <StateCards />
      <Trends />
      <TakeAction />
      <About />
    </>
  );
}
