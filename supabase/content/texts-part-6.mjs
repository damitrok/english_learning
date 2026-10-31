// Reading texts 78–90 (B1), one per grammar unit: nobody/nothing, somebody/anywhere,
// every/all, all/most/none, both/either/neither, a lot/much/many, (a) little/(a) few,
// adjectives, adverbs, comparatives, "than", "not as … as", superlatives.

export const TEXTS = [
  {
    title: "The Silent Weekend",
    level: "B1",
    body: `Last Saturday, Olga was on call for her team. It was a quiet morning, and she didn't expect anything unusual. At eleven o'clock, her phone suddenly rang with an alert: the payment service was down.

Olga opened her laptop and checked the logs, but she couldn't find anything useful there. Nothing looked wrong. She called the backend developer, but nobody answered. Then she wrote in the team chat. Again, no-one replied. It was the weekend, and everybody was busy with their own plans.

For an hour, Olga tried everything she knew. She restarted the service twice, but nothing changed. She didn't want to disturb anybody else, but finally she called her manager, Tom. He answered immediately.

Together they found the problem. Somebody changed a setting on Friday evening and didn't tell anyone about it. It was a small mistake, but it stopped all the payments.

On Monday, the team had a long conversation. Now nobody can change settings without a review, and nothing goes to production on Friday evenings.`,
    questions: [
      { statement: "Olga quickly found the cause of the problem in the logs.", answer: false },
      { statement: "At first, her colleagues did not reply to her messages.", answer: true },
      { statement: "Tom did not pick up the phone.", answer: false },
      { statement: "The team made new rules after the incident.", answer: true },
    ],
  },
  {
    title: "Somewhere to Sleep",
    level: "B1",
    body: `Last summer, Daniel and his sister Anna travelled around the south of the country by car. They didn't book anything before the trip. "We'll find somewhere to stay every night," Daniel said. "It's easy."

For the first week, he was right. They always found somewhere nice: a small hotel, a farm, once even a room above a café. But on the eighth day, they arrived in a little town late in the evening, and there was a festival there. Every hotel was full. They asked everywhere, but there was nowhere to sleep.

Anna was tired and a bit angry. "Do you know anybody here?" she asked. Of course, Daniel didn't know anyone. They went to a restaurant because they wanted something to eat, at least.

The waiter heard their conversation. "My aunt has a spare room," he said. "It's nothing special, but it's clean." Half an hour later, they were in a quiet house with a garden, and the aunt was making them tea.

Now Anna books something before every trip. Daniel still says it's more fun without a plan.`,
    questions: [
      { statement: "Daniel and Anna arranged all their hotels before the trip.", answer: false },
      { statement: "During the first week, finding a place to stay was not a problem.", answer: true },
      { statement: "The waiter's aunt let them stay in her house.", answer: true },
      { statement: "After the trip, both of them prefer to travel without a plan.", answer: false },
    ],
  },
  {
    title: "A Week in Support",
    level: "B1",
    body: `In our company, every developer spends one week a year in the support team. All of us hated the idea at first. "I'm a programmer, not a support agent," everybody said. But after my week there, I changed my mind.

Every morning, the support team reads all the new messages from customers. Every message gets an answer on the same day, even when the answer is only "We're looking at it." They work hard all day, and they don't have much time for lunch.

During my week, I answered about forty messages. All of them were different. Some customers couldn't log in, some found real bugs, and one man wanted a new feature "for all his friends". Every day I learned something new about our product and about our users.

But the really useful thing was simple: I saw the problems that happen all the time. Back in my own team, I fixed three of them in a week. Now I think every developer should try this at least once.`,
    questions: [
      { statement: "Customers usually get a reply on the day they write.", answer: true },
      { statement: "At first, the developers were happy about the support week.", answer: false },
      { statement: "After the support week, the writer fixed some common problems.", answer: true },
      { statement: "All the messages the writer answered were about the same problem.", answer: false },
    ],
  },
  {
    title: "A Street Without Cars",
    level: "B1",
    body: `Last month, our city closed the main street to cars for one Sunday. Before the day, the local newspaper asked people what they thought. Most of them liked the idea, some of them didn't care, and a few were against it, mostly shop owners.

On the day itself, the weather was perfect. All of the cafés put tables outside, and most of the shops stayed open. Children rode bikes in the middle of the road, and some of the older people brought chairs and sat in the sun. None of the shop owners closed early, because they were too busy.

In the evening, the newspaper asked the same questions again. This time, almost all of the people said yes. Some of them asked for a car-free Sunday every month. None of the shop owners were against it any more. "I sold more coffee today than in any normal week," one of them said.

The city hasn't decided anything yet, but most people think the street will be free of cars again next summer.`,
    questions: [
      { statement: "Most shops did not close on the car-free Sunday.", answer: true },
      { statement: "Before the event, every person in the city supported the idea.", answer: false },
      { statement: "One shop owner complained about selling less than usual that day.", answer: false },
      { statement: "The city has not made a final decision yet.", answer: true },
    ],
  },
  {
    title: "Two Job Offers",
    level: "B1",
    body: `Last year, Irina got two job offers in the same week. Both companies wanted a frontend developer, and both offered almost the same salary. She had to choose one of them by Friday.

The first company was large and well known. The second was a small start-up with twelve people. Neither of them was perfect. At the big company, the work was stable, but the project was old and boring. At the start-up, the project was exciting, but nobody knew anything about the future of the company.

Irina asked her friends for advice. Two of them answered quickly, but neither of them helped much. "Either choice is fine," said one. "You can't lose," said the other. Her mother had a clear opinion: "Take the big one, of course."

In the end, Irina called both teams again and asked to talk to a developer, not a manager. Both conversations were friendly, but at the start-up she laughed a lot and asked a hundred questions. That told her everything.

She accepted the second offer. Six months later, she doesn't regret it, and the start-up is growing.`,
    questions: [
      { statement: "Irina's friends did not really help her decide.", answer: true },
      { statement: "The two companies offered very different salaries.", answer: false },
      { statement: "Her mother advised her to choose the start-up.", answer: false },
      { statement: "Irina is happy with her decision.", answer: true },
    ],
  },
  {
    title: "Cooking for Twelve",
    level: "B1",
    body: `Last Saturday was my grandmother's eightieth birthday, and I offered to cook dinner for the whole family. There were twelve of us. I don't cook much, so it was a brave idea.

I chose a simple menu: soup, roast chicken with vegetables, and a chocolate cake. On Friday, I went to the market. How many potatoes do you need for twelve people? How much chicken? I had no idea, so I bought a lot of everything.

On Saturday morning, I started early. There were too many things to do and not much space in my small kitchen. The soup took a lot of time, and I didn't have many big pots, so I borrowed two from my neighbour. The cake was the hardest part. I made a lot of mistakes, but in the end it looked fine.

The dinner was a great success. Everybody ate a lot, and my grandmother asked for more soup. But there was so much food left that each guest took a box home.

Next time, I'll buy less. Not much less, though. My family really likes to eat.`,
    questions: [
      { statement: "The writer did not know how much food to buy.", answer: true },
      { statement: "The writer often cooks for big groups.", answer: false },
      { statement: "After dinner, there was still a lot of food.", answer: true },
      { statement: "The writer's kitchen had plenty of space.", answer: false },
    ],
  },
  {
    title: "A Few Spare Days",
    level: "B1",
    body: `Our team had a big release planned for the end of the month. Three weeks before it, everything looked fine. We had a few small bugs, but very little real work was left. Or so we thought.

Then the client sent a new list of changes. There weren't many of them, only a few, but one was serious: a completely new payment page. We had very little time, and few people on the team knew the payment system well. In fact, only Kate knew it, and she was on holiday for a week.

Our manager asked us for an estimate. Few of us wanted to give a number, because we had very little information. Finally, we said, "Ten days, maybe more." The client wasn't happy, but they accepted it.

We worked hard. Kate came back and helped a lot. We had little sleep in the last few days, but we finished the page two days before the release.

What did we learn? Ask the client about changes early, and always leave a little extra time in every estimate. A few spare days can save a project.`,
    questions: [
      { statement: "The client asked for a lot of changes, and all of them were small.", answer: false },
      { statement: "Three weeks before the release, the team thought most of the work was done.", answer: true },
      { statement: "The team finished the payment page before the release date.", answer: true },
      { statement: "Several people on the team knew the payment system well.", answer: false },
    ],
  },
  {
    title: "A Flat With a View",
    level: "B1",
    body: `After two years in a dark little flat near the station, Sam decided to move. He wanted something bright and quiet, with a small balcony. His budget wasn't big, so it wasn't easy.

The first flat he saw looked wonderful in the photos. In real life, it was cold and damp, and the walls were thin. He could hear the neighbours' TV from every room. The second flat was clean and modern, but the kitchen was tiny and the rent was too high.

The third flat was on the top floor of an old building without a lift. Sam was tired and a little angry after five floors of stairs. But when he opened the door, he forgot about the stairs. The rooms were large and sunny, the wooden floors were warm, and from the balcony he could see the whole city and the river.

The owner was a friendly old lady with a sharp voice and kind eyes. "The heating is slow," she said honestly. "But the view is free."

Sam signed the contract the same evening. He is still happy there, and the stairs are now his daily workout.`,
    questions: [
      { statement: "In the first flat, the noise from the neighbours was a problem.", answer: true },
      { statement: "Sam's old flat was bright and sunny.", answer: false },
      { statement: "The third flat had a lift.", answer: false },
      { statement: "The owner told Sam about a problem with the flat.", answer: true },
    ],
  },
  {
    title: "Slowly but Carefully",
    level: "B1",
    body: `When Leo joined the team as a junior developer, he worked very quickly. He finished his tasks fast and proudly sent them for review. Unfortunately, his code often came back with a lot of comments.

His mentor, Nadia, was a calm, patient woman. She always explained things clearly and never spoke angrily. One day she said, "Leo, you type fast, but you read badly. Before you send your code, read it slowly, line by line, like a reviewer."

At first, Leo found it hard. Reading his own code carefully felt boring and took a lot of time. But he tried. He also started to write tests regularly, not only when somebody asked him.

The results came surprisingly quickly. After a month, his pull requests had far fewer comments, and reviewers approved them easily. Nadia smiled happily when she saw his latest change: one small comment, and only about a name.

Now Leo gives the same advice to new people on the team. "Working fast is easy," he says. "Working well is the real skill. Go slowly at first, and speed comes naturally."`,
    questions: [
      { statement: "Nadia often got angry with Leo.", answer: false },
      { statement: "At the beginning, Leo's code needed a lot of corrections.", answer: true },
      { statement: "At first, Leo found it easy and fun to check his own code.", answer: false },
      { statement: "After a month, reviewers had fewer problems with Leo's code.", answer: true },
    ],
  },
  {
    title: "Life in a Small Town",
    level: "B1",
    body: `Three years ago, Marta and her husband left the capital and moved to a small town by the sea. Their friends thought it was a crazy idea. Now Marta writes a blog about the change, and her answer is clear: life is slower, but it is better.

Some things are easier now. Their new house is bigger, but the rent is lower. Fresh fish and vegetables from the market are cheaper too, and they taste better. The air is cleaner, and the nights are quieter. Marta sleeps longer and feels healthier.

Of course, some things are harder. The shops close earlier, and there are fewer restaurants. The hospital is forty minutes away by car. In winter, the town is emptier and the evenings feel longer. Also, the internet is slower, and that is a real problem, because Marta works remotely as a designer.

"People often ask me if I'm happier here," she writes. "The answer is yes, but not every day. I miss my old friends and the theatre. But I'm calmer, and our life is simpler. For us, that matters more."`,
    questions: [
      { statement: "Food from the local market is cheaper and tastier.", answer: true },
      { statement: "Marta's friends supported the move from the start.", answer: false },
      { statement: "A slow internet connection is not important for Marta's job.", answer: false },
      { statement: "Marta admits she misses some things about her old life.", answer: true },
    ],
  },
  {
    title: "Server Room or Cloud?",
    level: "B1",
    body: `For ten years, our company kept all its services on one old server in a small room next to the kitchen. Last year, the management asked our team a simple question: should we move everything to the cloud?

We made a comparison. The cloud was more flexible than our server, and it was much easier to grow there. With the cloud, we could add new machines in minutes, not weeks. It was also safer than our little room, because the data was in three places, not one.

But the cloud was more expensive than we expected. Our old server cost us almost nothing every month, except electricity. The monthly cloud bill was bigger than the salary of a junior developer. The cloud was also more complicated than our simple setup, and some of us needed training.

In the end, we chose a mix. Important customer data moved to the cloud, because it was more reliable there. Old internal tools stayed on the server, because they were cheaper to run in our own room.

Six months later, everyone agrees: our system is better than before, although our bills are higher.`,
    questions: [
      { statement: "The cloud turned out to cost more than the team thought.", answer: true },
      { statement: "The team thought the cloud was less flexible than the old server.", answer: false },
      { statement: "The team moved all its services to the cloud.", answer: false },
      { statement: "The company's system works better now than before.", answer: true },
    ],
  },
  {
    title: "Swimming Instead of Running",
    level: "B1",
    body: `Last spring, Pavel decided to get fit. He was forty-two, he worked at a desk all day, and he wasn't as strong as he was at twenty. His doctor said, "Start running. Twenty minutes, three times a week."

Running wasn't as easy as Pavel thought. After a week, his knees hurt, and he didn't enjoy it at all. His friend Lena is a swimming coach, and she suggested the pool. "Swimming isn't as hard on your knees as running," she said. "And it's not as boring."

Pavel tried it. At first, he wasn't as fast as the other people in the pool, and he felt a bit silly. But he went every Tuesday and Friday, and slowly he got better. Swimming wasn't as exciting as football, his old hobby, but it was calm and pleasant, and his knees stopped hurting.

Six months later, Pavel feels much healthier. He isn't as heavy as before, and he sleeps better. He still isn't as fast as Lena, of course, but he doesn't care.

"Forget about the hardest sport," he says now. "Find something fun and do it regularly. That's the whole secret."`,
    questions: [
      { statement: "Pavel's doctor advised him to start swimming.", answer: false },
      { statement: "Running caused problems with Pavel's knees.", answer: true },
      { statement: "Pavel now feels better than he did before.", answer: true },
      { statement: "From the start, Pavel was one of the fastest swimmers in the pool.", answer: false },
    ],
  },
  {
    title: "Our Team Awards",
    level: "B1",
    body: `Every December, our team has a small party with its own awards. Nobody wins money, but everybody wants to win. This year, I prepared the list, so here are the results.

The award for the strangest bug went to Mike. In March, our app showed the wrong date, but only on Tuesdays, and only for users in one country. It was the most confusing problem of the year, and it took him four days to find the cause.

The best code reviewer was Sofia, again. Her comments are the clearest and the most helpful on the team, and she is never rude. The fastest learner was Ivan, our newest developer. He joined in June with almost no experience, and now he leads small tasks on his own.

The funniest moment came in October. Our manager shared her screen during a client call and showed everyone her shopping list instead of the project plan.

The most important award, "Hero of the Year", went to the whole support team. They answered thousands of messages during the worst outage in the company's history, and they stayed calm the entire time.

Next year, I hope for fewer heroes and more boring days.`,
    questions: [
      { statement: "Mike needed several days to solve the date problem.", answer: true },
      { statement: "The winners of the awards get money.", answer: false },
      { statement: "The support team stayed calm during a serious outage.", answer: true },
      { statement: "Ivan had a lot of experience when he joined the team.", answer: false },
    ],
  },
];
