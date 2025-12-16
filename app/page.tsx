
import HuanguelenSection from '@/components/HuanguelenSection'
import LaSextaSection from '../components/LaSextaSection' // Changed import
import AgroSection from '@/components/AgroSection'
import Footer from '../components/Footer'
import PrincipalSection from '@/components/PrincipalSection'
import NoticiasImportantesSection from '@/components/NoticiasImportantesSection'
import ClimaSection from '@/components/ClimaSection'
import FarmaciasDeTurno from '@/components/FarmaciasDeTurno'
import AdPlaceholder from '@/components/AdPlaceholder'
import VolgaTVSection from '@/components/VolgaTVSection'
import PueblosAlemanesSection from '@/components/PueblosAlemanesSection'
import MobileNavBar from '@/components/MobileNavBar'
import { fetchSectionArticles } from '@/utils/api'
import { fetchLatestHeadlines } from '@/utils/api'
import SidelinesLayout from '@/components/SidelinesLayout'
import { SkyscraperAd, SidebarRectangleAd } from '@/components/ads/SkyscraperAd'
import DollarRates from '@/components/DollarRates'
import NewsTicker from '@/components/NewsTicker'
import { fetchYouTubeRSS } from '@/lib/youtube/fetchYouTubeRSS'
import MobileDollarRates from '@/components/MobileDollarRates'
import WeatherWidget from '@/components/WeatherWidget'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import RecetasSection from '@/components/RecetasSection'
import ActualidadSection from '@/components/ActualidadSection'


export const dynamic = 'force-static'
export const revalidate = 300
export const fetchCache = 'default-cache'
export const runtime = 'nodejs'
export const maxDuration = 30


// This is a Server Component
export default async function Home() {

  const [
    principalSectionArticles,
    noticiasImportantesArticles,
    pueblosAlemanesArticles,
    huanguelenArticles,
    laSextaArticles,
    youtubeVideos,
    actualidadArticles,
    latestHeadlines,
    agroArticles,
    lifestyleArticles,
    recetasSection,
  ] = await Promise.all([
    fetchSectionArticles('PrincipalSection'),
    fetchSectionArticles('NoticiasImportantesSection'),
    fetchSectionArticles('PueblosAlemanesSection'),
    fetchSectionArticles('HuanguelenSection'),
    fetchSectionArticles('LaSextaSection'),
    fetchYouTubeRSS(process.env.CHANNEL_ID!),
    fetchSectionArticles('ActualidadSection'),
    fetchLatestHeadlines(),
    fetchSectionArticles('AgroSection'),
    fetchSectionArticles('LifestyleSection'),
    fetchSectionArticles('RecetasSection'),
  ])

  const featuredVideo = youtubeVideos[0] || null
  const recentVideos = youtubeVideos.slice(1, 4)




  // Define custom ads for sidelines (optional)
  const sidelineWidth = 15
  const leftSideAds = (
    <div className="space-y-4">
      <SkyscraperAd position="left" />
    </div>
  )

  const rightSideAds = (
    <div className="space-y-4">
      <SkyscraperAd position="right" />
      <SidebarRectangleAd />
    </div>
  )

  return (
    <>
      {/* MOBILE VERSION - NO SidelinesLayout */}
      <div className="md:hidden pt-[184px]">
        <PWAInstallPrompt />
        <div className="container mx-auto max-w-[1600px] px-4">
          {/* Currency rates */}
          <div className="hidden md:block border-b border-gray-200 overflow-x-auto">
            <DollarRates />
          </div>

          <div className="pt-12 md:pt-0"></div>

          {/* Breaking news ticker */}
          <div className="hidden md:block border-b border-light-gray overflow-x-auto">
            <div className="py-2 flex items-center text-sm space-x-2 whitespace-nowrap">
              <NewsTicker headlines={latestHeadlines} />
            </div>
          </div>
          {/* Main content */}
          <PrincipalSection serverData={principalSectionArticles} />

          <div className="md:hidden">
            <MobileDollarRates />
          </div>

          <NoticiasImportantesSection
            serverData={noticiasImportantesArticles}
          />

          <VolgaTVSection
            featuredVideo={featuredVideo}
            recentVideos={recentVideos}
          />

          <PueblosAlemanesSection serverData={pueblosAlemanesArticles} />

          <FarmaciasDeTurno />

          {/* Weather section */}
          <ClimaSection />

          <HuanguelenSection serverData={huanguelenArticles} />

          <LaSextaSection serverData={laSextaArticles} />

          <ActualidadSection serverData={actualidadArticles} />

          {/* Advertisement banner */}
          <div className="py-6">
            <div className="bg-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">AD</p>
              <div className="h-16 flex items-center justify-center">
                <p className="text-gray-400">Advertisement Banner</p>
              </div>
            </div>
          </div>

          <AdPlaceholder />

          {/* Agro Four Column Grid Section */}
          <section className="py-6 border-t border-gray-200">
            <AgroSection serverData={agroArticles} />
          </section>

          <RecetasSection serverData={recetasSection} />

          <AdPlaceholder />

          <Footer />
        </div>
      </div>

      {/* DESKTOP VERSION - WITH SidelinesLayout */}
      <div className="hidden md:block">
        <SidelinesLayout
          leftAd={leftSideAds}
          rightAd={rightSideAds}
          sidelineWidth={sidelineWidth}
        >
          <div className="pt-[100px]">
            <div className="container mx-auto max-w-[1600px] px-4">
              {/* Currency rates + Weather */}
              <div className="hidden md:flex border-b border-gray-200 overflow-x-auto">
                <div className="flex-1">
                  <DollarRates />
                </div>
                <WeatherWidget />
              </div>

              <div className="pt-12 md:pt-0"></div>

              {/* Breaking news ticker */}
              <div className="hidden md:block border-b border-light-gray overflow-x-auto">
                <div className="py-2 flex items-center text-sm space-x-2 whitespace-nowrap">
                  <NewsTicker headlines={latestHeadlines} />
                </div>
              </div>
              {/* Main content */}
              <PrincipalSection serverData={principalSectionArticles} />

              <div className="md:hidden">
                <MobileDollarRates />
              </div>

              <NoticiasImportantesSection
                serverData={noticiasImportantesArticles}
              />

              <VolgaTVSection
                featuredVideo={featuredVideo}
                recentVideos={recentVideos}
              />

              <PueblosAlemanesSection serverData={pueblosAlemanesArticles} />

              <FarmaciasDeTurno />

              {/* Weather section */}
              <ClimaSection />

              <HuanguelenSection serverData={huanguelenArticles} />

              <LaSextaSection serverData={laSextaArticles} />

              <ActualidadSection serverData={actualidadArticles} />

              {/* Advertisement banner */}
              <div className="py-6">
                <div className="bg-gray-100 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">AD</p>
                  <div className="h-16 flex items-center justify-center">
                    <p className="text-gray-400">Advertisement Banner</p>
                  </div>
                </div>
              </div>

              <AdPlaceholder />

              {/* Agro Four Column Grid Section */}
              <section className="py-6 border-t border-gray-200">
                <AgroSection serverData={agroArticles} />
              </section>

              <RecetasSection serverData={recetasSection} />

              <AdPlaceholder />

              <Footer />
            </div>
          </div>
        </SidelinesLayout>
      </div>

      <MobileNavBar />
    </>
  )
}
