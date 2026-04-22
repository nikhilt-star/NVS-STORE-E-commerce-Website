import { Cloud, Flower2, Hand } from 'lucide-react'
import { footerBenefits, tickerItems } from '../../data/mockData'

const iconMap = {
  Hand,
  Cloud,
  Flower2,
}

function Footer() {
  return (
    <footer className="bg-nvs-beige pt-5">
      <div className="overflow-hidden border-y border-nvs-brown/10 bg-nvs-beige py-3">
        <div className="nvs-marquee flex min-w-max items-center gap-10 whitespace-nowrap pr-10">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center gap-6 font-display text-[1.1rem] font-semibold text-nvs-brown"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ffbf2e] text-lg">
                {index % 3 === 0 ? '✿' : index % 3 === 1 ? '☼' : '✦'}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-shell grid gap-10 px-6 py-16 md:grid-cols-3 md:px-10">
        {footerBenefits.map((benefit) => {
          const Icon = iconMap[benefit.icon]

          return (
            <div key={benefit.id} className="text-center">
              <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center text-nvs-brown">
                <Icon size={32} strokeWidth={1.6} />
              </div>
              <h3 className="font-display text-[2rem] font-semibold text-nvs-brown">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-nvs-brown/70">{benefit.body}</p>
            </div>
          )
        })}
      </div>
    </footer>
  )
}

export default Footer
