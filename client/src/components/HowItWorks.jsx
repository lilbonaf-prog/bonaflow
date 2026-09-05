import './HowItWorks.css'

const steps = [
  {
    number: '1',
    title: 'Set up your business',
    description: 'Add your business name, currency and logo. Takes less than two minutes.'
  },
  {
    number: '2',
    title: 'Add your products',
    description: 'List what you sell, set prices and quantities. BonaFlow tracks stock from there.'
  },
  {
    number: '3',
    title: 'Record sales as they happen',
    description: 'Every sale updates your stock, your customer history and your dashboard automatically.'
  }
]

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-inner">
        <h2>Get started in three steps</h2>
        <div className="steps">
          {steps.map(({ number, title, description }) => (
            <div className="step" key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks