import Header from '../components/common/Header'
import Banner from '../components/home/Banner'
import SearchForm from '../components/home/SearchForm'
import Steps from '../components/home/Steps'
import PopularRoutes from '../components/home/PopularRoutes'
import WhyChooseUs from '../components/home/WhyChooseUs'
import Services from '../components/home/Services'
import Footer from '../components/common/Footer'

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Banner />
      <div className="container mx-auto px-4">
        <SearchForm />
        <Steps />
        <PopularRoutes />
        <WhyChooseUs />
        <Services />
      </div>
      <Footer />
    </div>
  )
}
