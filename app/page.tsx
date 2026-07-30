import { AnimatedDivider } from '@/components/layout/section';
import { Comparison } from '@/components/sections/comparison';
import { Compounding } from '@/components/sections/compounding';
import { Contact } from '@/components/sections/contact';
import { Faq } from '@/components/sections/faq';
import { Hero } from '@/components/sections/hero';
import { Performance } from '@/components/sections/performance';
import { Philosophy } from '@/components/sections/philosophy';
import { Principles } from '@/components/sections/principles';
import { Process } from '@/components/sections/process';

/**
 * The page reads as one argument in order: what we believe, why it works
 * mathematically, why the alternative does not, how we actually do it, what we
 * refuse to change, what we will and will not claim, and then the questions.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <AnimatedDivider />
      <Compounding />
      <Comparison />
      <AnimatedDivider />
      <Process />
      <Principles />
      <Performance />
      <Faq />
      <Contact />
    </>
  );
}
