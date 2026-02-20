import AdBanner from './AdBanner'

const AD_URL =
  'https://res.cloudinary.com/dptdloagw/image/upload/v1771608172/Agregar_un_t%C3%ADtulo_otoo4l.gif'

export default function RightAd() {
  return (
    <AdBanner
      imageUrl={AD_URL}
      alt="Right sidebar advertisement"
      width={160}
      height={600}
    />
  )
}
