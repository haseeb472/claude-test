import { Header } from './components/layout/Header'
import { Capabilities } from './components/sections/Capabilities'
import { Hero } from './components/sections/Hero/Hero'
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
      </main>
    </>
  )
}
