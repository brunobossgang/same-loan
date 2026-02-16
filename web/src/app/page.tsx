import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import RateComparison from "@/components/RateComparison";
import Calculator from "@/components/Calculator";
import IncomeAnalysis from "@/components/IncomeAnalysis";
import StateCards from "@/components/StateCards";
import TakeAction from "@/components/TakeAction";
import About from "@/components/About";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <RateComparison />
      <Calculator />
      <IncomeAnalysis />
      <StateCards />
      <TakeAction />
      <About />
    </>
  );
}
