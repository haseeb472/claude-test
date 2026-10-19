import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Capabilities } from './components/sections/Capabilities'
import { Contact } from './components/sections/Contact/Contact'
import { Hero } from './components/sections/Hero/Hero'
import { Pricing } from './components/sections/Pricing'
import { Testimonials } from './components/sections/Testimonials'
import { TrustedBy } from './components/sections/TrustedBy'
import { Workflow } from './components/sections/Workflow'

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <TrustedBy />
        <Capabilities />
        <Workflow />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
