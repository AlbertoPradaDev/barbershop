import Nav from './components/Nav/Nav'
import Services from './components/Services/Services'
import Gallery from './components/Gallery/Gallery'
import About from './components/About/About'
import Hero from './components/Hero/Hero'
import Booking from './components/Booking/Booking'
import Footer from './components/Footer/Footer'
import Cursor from './components/Cursor'

export default function App() {
  return (
    <main className='bg-primary text-text'>
      <Cursor />
      <Nav />
      <Hero />
      <Services />
      <Gallery />
      <About />
      <Booking />
      <Footer />
    </main>
  )
}