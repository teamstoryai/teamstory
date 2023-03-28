import { config } from '@/config'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getDayOfYear } from 'date-fns'
import { useState } from 'preact/hooks'

const prompts = [
  '“Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.” – Paul J. Meyer',
  '“Productivity is being able to do things that you were never able to do before.” – Franz Kafka',
  '“You can do anything, but not everything.” – David Allen',
  '“One of the true tests of leadership is the ability to recognize a problem before it becomes an emergency.” ~ Arnold Glasow” - ',
  '“The message of the Kaizen strategy is that not a day should go by without some kind of improvement being made somewhere in the company.” – Masaaki Imai',
  '“Continuous improvement is not about the things you do well — that’s work. Continuous improvement is about removing the things that get in the way of your work. The headaches, the things that slow you down, that’s what continuous improvement is all about.” – Bruce Hamilton',
  '“It is not the mountain we conquer, but ourselves.” – Sir Edmund Hillary',
  '“Focus on being productive instead of busy.” -Tim Ferriss',
  '“You have to expect things of yourself before you can do them.” – Michael Jordan',
  '“Improvement usually means doing something that we have never done before.” – Shigeo Shingo',
  '“Nothing is less productive than to make more efficient what should not be done at all.” – Peter Drucker',
  '“Efficiency is doing things right. Effectiveness is doing the right things.” – Peter Drucker',
  '“The trick is to fix the problem you have, rather than the problem you want.” - Bram Cohen',
  '“If we want users to like our software, we should design it to behave like a likeable person.” - Alan Cooper',
  '“Plans are nothing; planning is everything.” – Dwight D. Eisenhower ',
  '“Fall in love with the process, and the results will come.” – Eric Thomas',
  '“If there are nine rabbits on the ground, if you want to catch one, just focus on one.” – Jack Ma',
  '“Engineers like to solve problems. If there are no problems handily available, they will create their own problems."” - - Scott Adams ',
  '“Those who plan do better than those who do not plan, even though they rarely stick to their plan.” ~ Winston Churchill',
  '“Weeks of programming can save you hours of planning.” - Anonymous',
  '“If you need a new process and don’t install it, you pay for it without getting it.” –Ken Stork',
  '“All our productivity, leverage, and insight comes from being part of a community, not apart from it. The goal, I think, is to figure out how to become more dependent, not less.” – Seth Godin',
  '“Until we can manage time, we can manage nothing else.” – Peter Drucker',
  '“Improved productivity means less human sweat, not more.” – Henry Ford',
  '“Drive thy business or it will drive thee.” – Benjamin Franklin',
  '“Software testing is not only ensuring absence of bugs but also ensuring presence of value.” - Amit Kalantri',
  '“There are only two kinds of languages: the ones people complain about and the ones nobody uses." - Bjarne Stroustrup',
  '“A bad system will beat a good person every time.” – W. Edwards Deming',
  '“Communicate more than you think you have to.” — Elizabeth Harrin',
  '“A relentless barrage of “why’s” is the best way to prepare your mind to pierce the clouded veil of thinking caused by the status quo.  Use it often.” – Shigeo Shingo',
  '“The best products are developed by teams with desire to solve a problem; not a company’s need to fulfil a strategy.” - Jeff Weiner',
  '“Start by doing what’s necessary, then what’s possible, and suddenly you are doing the impossible.” – Francis of Assisi',
  '“Quality is never an accident; it is always the result of high intention, sincere effort, intelligent direction and skillful execution; it represents the wise choice of many alternatives.” – William A. Foster',
  '“Stressing output is the key to improving productivity, while looking to increase activity can result in just the opposite.” – Paul Gauguin',
  '“The goal of management is to remove obstacles.” — Paul Orfalea',
  '“Continuous improvement is better than delayed perfection.” – Mark Twain',
  '“If you do not know how to ask the right question, you discover nothing.” – W. Edwards Deming',
  '“Time pressure gradually corrupts an engineer’s standard of quality and perfection. It has a detrimental effect on people as well as products.” - Niklaus Wirth.',
  '“Lean is about constant ticking, not occasional kicking.” – Alex Miller',
  '“Success is not checking a box. Success is having an impact. If you complete all tasks and nothing ever gets better, that’s not success.” – Christina Wodtke',
  '“Do the hard jobs first. The easy jobs will take care of themselves.” – Dale Carnegie',
  '“Peel back the facade of rigorous methodology projects and ask why the project was successful, and the answer is people.” - Jim Highsmith.',
  '“The biggest issue on software teams is making sure everyone understands what everyone else is doing.” - Martin Fowler.',
  '“Lost time is never found again.” – Benjamin Franklin',
  '“Legacy code is code without tests.” - Michael Feathers',
  '“You don’t need more time in your day. You need to decide.” – Seth Godin',
  '“All organizations are perfectly designed to get the results they are now getting. If we want different results, we must change the way we do things.” ― Tom Northup',
  '“The single biggest problem in communication is the illusion that it has taken place.” - George Bernard Shaw',
  '“Good programmers use their brains, but good guidelines save us having to think out every case.” - Francis Glassborow.',
  '“If you always do what you always did, you’ll always get what you’ve always got.” – Henry Ford',
  '“In programming, the hard part isn’t solving problems, but deciding what problems to solve.” - Paul Graham',
  '“It’s better to wait for a productive programmer to become available than it is to wait for the first available programmer to become productive.” - Steve McConnell.',
  '“Great things are done by a series of small things brought together.” – Vincent Van Gough',
  '“There is never enough time to do it right, but there is always enough time to do it over.” – John W. Bergman',
  '“Work hard, have fun, and make history.” – Jeff Bezos',
  '“Don’t expect to find you’re doing everything right — the truth often hurts. The goal is to find your inefficiencies in order to eliminate them and to find your strengths so you can multiply them.” – Tim Ferriss',
  '“There are no unrealistic goals, only unrealistic deadlines.” — Brian Tracy',
  '“Perfection is not attainable. But if we chase perfection, we can catch excellence.” – Vince Lombardi',
  '“If it doesn’t work, it doesn’t matter how fast it doesn’t work.” - Mich Ravera',
  '“Software and cathedrals are much the same; first we build them, then we pray.” - Anonymous',
  '“I’m not a great programmer; I’m just a good programmer with great habits.” - Kent Beck',
  '“Any fool can write code that a computer can understand. Good programmers write code that humans can understand.” - Martin Fowler',
  '“A design that doesn’t take change into account risks major redesign in the future.” - Erich Gamma',
  '“Any Scrum without working product at the end of a sprint is a failed Scrum.” - Jeff Sutherland.',
  '“9 women cannot make a baby in one month.” - Fred Brooks.',
  '“If you define the problem correctly, you almost have the solution.” – Steve Jobs',
  '“Speed is everything. It is the indispensable ingredient to competitiveness.” - Jack Welch',
  '“There’s nothing more permanent than a temporary hack.” - Kyle Simpson',
  '“Nothing is particularly hard when you divide it into small jobs.” – Henry Ford',
  '“As a rule, software systems do not work well until they have been used, and have failed repeatedly, in real applications.” - David Parnas',
  '“Pleasure in the job puts perfection in the work.” – Aristotle',
  "“The Most Dangerous Kind of Waste is the Waste we don't Recognise.” - Shigeo Shingo",
  '“There are many experts on how things have been done up to now. If you think something could use a little improvement, you are the expert.” – Robert Brault',
  '“The tragedy in life doesn’t lie in not reaching your goal. The tragedy lies in having no goal to reach.” – Benjamin E. Mays',
  '“It is not the employer who pays the wages. He only handles the money. It is the product that pays the wages.” – Henry Ford',
  '“Don’t comment bad code — rewrite it.” - Brian Kernighan',
  '“When done well, software is invisible.” - Bjarne Stroustrup.',
  '“Simplicity is prerequisite for reliability.” - Edsger W. Dijkstra',
  '“Coming together is a beginning. Keeping together is progress. Working together is Success.” Henry Ford',
  '“Don’t confuse activity with productivity. Many people are simply busy being busy.” – Robin Sharma',
  '“Code is like humor. When you have to explain it, it’s bad.” - Cory House',
  '“The first rule of management is delegation. Don’t try and do everything yourself because you can’t.” — Anthea Turner',
]

export default function ({ date }: { date: Date }) {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null

  const idx = getDayOfYear(date) + (config.dev ? 1 : 0)
  return (
    <div className="group italic text-gray-500 relative">
      {prompts[idx % prompts.length]}
      <a
        className="hidden group-hover:inline mt-1 ml-1 cursor-pointer absolute"
        title="Hide"
        onClick={() => setHidden(true)}
      >
        <XMarkIcon className="w-3 h-3" />
      </a>
    </div>
  )
}
