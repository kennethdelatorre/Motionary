import GamesHeader from '../components/GamesHeader'
import BottomStrip from '../components/BottomStrip'

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const DEFINITION = `Zeugma refers to wordplay in which a single word relates to other words in such a way that it means something different in each case, as in "building a boat and a reputation" and "open a book along with your mind."`

const EXAMPLE = `A clever use of zeugma was demonstrated by Groucho Marx's character Rufus T. Firefly in Duck Soup (1933): "You can leave in a taxi. If you can't get a taxi, you can leave in a huff. If that's too soon, you can leave in a minute and a huff."`

function WotdPage() {
  const today = DATE_FORMATTER.format(new Date())
  return (
    <div className="wotd-page">
      <GamesHeader active="wotd" />
      <main className="wotd-main">
        <div className="wotd-card">
          <p className="wotd-date">Word of the Day : {today}</p>
          <h1 className="wotd-word">Zeugma</h1>
          <p className="wotd-pronunciation">noun | ZOOG-muh</p>
          <h2 className="wotd-section">What It Means</h2>
          <p className="wotd-definition">{DEFINITION}</p>
          <p className="wotd-example">{EXAMPLE}</p>
        </div>
      </main>
      <BottomStrip />
    </div>
  )
}

export default WotdPage