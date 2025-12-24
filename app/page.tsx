
import { events } from '@/lib/constants'
import EventCard from './components/EventCard'
import ExploreBtn from './components/ExploreBtn'

const Page = () => {
  return (
    <section>
      <h1 className='text-center text-5xl'> The Hub for Every Dev <br />Event You Can't Miss</h1>
      <p className='text-center mt-5'>Hackatons, Meetups, and Conferences, All in one place</p>
      <ExploreBtn/>
      <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>
      
      <ul className='list-none events'>
        {events.map((event) => (
        <li key={event.title}>
          <EventCard {...event}/>
        </li>
        ))}
      </ul>
      </div>
    </section>
  )
}

export default Page