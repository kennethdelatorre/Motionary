import GamesHeader from '../components/GamesHeader'
import BottomStrip from '../components/BottomStrip'

const PARAGRAPH_ONE = `Although it's often assumed that supposably is only an erroneous form of supposedly, it has its own independent history, derived from supposable, with the meaning "as may be conceived or imagined." Supposedly usually means "allegedly," and the similarity of the two words sometimes leads to their confusion.`

const PARAGRAPH_TWO = `A common complaint about this word is that it is simply a mistaken use of supposedly. Sometimes this is the case, and sometimes it is not. Supposably may be found as far back as the 17th century. It is rarely encountered over the next hundred or so years, but at the beginning of the 19th century we see much more evidence of it being used.`

function GrammarPage() {
  return (
    <div className="grammar-page">
      <GamesHeader active="grammar" />
      <main className="grammar-main">
        <div className="grammar-card">
          <h1 className="grammar-title">&lsquo;Supposably&rsquo; vs. &lsquo;Supposedly&rsquo;</h1>
          <p className="grammar-tagline">They're both real. But which are you supposed to use?</p>

          <h2 className="grammar-section">What to Know</h2>
          <p className="grammar-body">{PARAGRAPH_ONE}</p>

          <h2 className="grammar-section">Supposably and Supposedly Are Different Words</h2>
          <p className="grammar-body">{PARAGRAPH_TWO}</p>
        </div>
      </main>
      <BottomStrip />
    </div>
  )
}

export default GrammarPage