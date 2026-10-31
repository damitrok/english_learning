// Reading texts 91–103 (B1). Each text goes with the grammar unit of the same number
// and uses that unit's grammar naturally (enough, too, word order, still/yet/already,
// conjunctions, when/if clauses, relative clauses, at/on/in for time).

export const TEXTS = [
  {
    title: "Not Enough Time to Test",
    level: "B1",
    body: `Last month our team had a big problem: we didn't have enough time. The client wanted a new payment page by Friday, and our manager agreed without asking us first. Four days is not enough for a feature like that, especially when only two developers are free.

We worked late every evening, and by Thursday the code was ready. But was it good enough? Nobody was sure. Lena, our tester, said that she needed at least two more days, because one day wasn't enough to check every type of card and every browser.

The manager decided to release it anyway. On Saturday morning, some customers couldn't pay. The page worked well on a fast connection, but on slow phones it wasn't quick enough, and the request simply stopped after ten seconds.

We fixed the bug on Monday, and after that the manager changed the rules. Now every estimate includes time for testing, and when the team says there isn't enough time, he talks to the client before he promises anything. It isn't a perfect system, but it works well enough, and we are much less tired.`,
    questions: [
      { statement: "The developers agreed to the Friday deadline before the manager did.", answer: false },
      { statement: "Lena thought that one day was too short for testing.", answer: true },
      { statement: "The payment page had problems on slow phones.", answer: true },
      { statement: "After the incident, estimates still didn't include any time for testing.", answer: false },
    ],
  },
  {
    title: "Too Hot to Sleep",
    level: "B1",
    body: `This summer my city had the hottest July in forty years, and honestly, I wasn't ready for it. My flat is on the top floor, and it gets too hot by ten in the morning. I don't have air conditioning, because I always thought it was too expensive for a climate like ours.

The first week was the worst. At night it was too hot to sleep, so I lay on the floor next to an open window and listened to the traffic. In the morning I was too tired to work properly, and I made silly mistakes in simple emails.

Then I changed a few things. I bought a small fan, which wasn't too expensive. I started closing the curtains early in the morning, before the sun reached my side of the building. I also moved my desk to the kitchen, because it stays cooler there.

Some people told me to go for a run in the evening, but for me it was too warm even at nine o'clock. Instead, I went swimming with friends in a lake outside the city. The water was a little too cold at first, but after a few minutes it felt wonderful.`,
    questions: [
      { statement: "The writer already had air conditioning before the summer.", answer: false },
      { statement: "The writer's flat gets hot early in the day.", answer: true },
      { statement: "Running in the evening was a good solution for the writer.", answer: false },
      { statement: "At first, the lake felt cold to the writer.", answer: true },
    ],
  },
  {
    title: "Greetings from the Language School",
    level: "B1",
    body: `Hi Mum,

I'm sorry I didn't write last week. The course keeps me very busy, but I'm enjoying it a lot. We have classes every morning from nine until one, and in the afternoon I usually study in the library for two hours.

My teacher, Carmen, speaks English very well, but in class she speaks only Spanish to us. At first I understood almost nothing, but now I can follow most of her explanations. Yesterday I asked a question in Spanish without any notes, and she said my pronunciation was getting better.

I live with a family near the old market. They are very kind. Every evening we have dinner together at the big table in the kitchen, and they correct my mistakes patiently. Their son, Pablo, plays the guitar quite badly, but he plays it every night, so I hear a lot of songs!

On Saturday I went to the beach with two students from my group. We walked along the coast for three hours and ate fresh fish in a small restaurant. I'll send you some photos tomorrow.

Love,
Anna`,
    questions: [
      { statement: "Carmen speaks English to the students in class.", answer: false },
      { statement: "Anna has her lessons in the morning.", answer: true },
      { statement: "Pablo is a very good guitar player.", answer: false },
      { statement: "Anna's Spanish has improved since the start of the course.", answer: true },
    ],
  },
  {
    title: "My Remote Work Routine",
    level: "B1",
    body: `I have worked from home for three years now, and people often ask me how I stay productive. The honest answer is routine. I don't always follow it perfectly, but it usually works.

I always start at the same time, at half past eight, even when nobody else is online yet. I never check social media before lunch, because one short look can easily become forty minutes. The first two hours are usually the quietest, so I use them for the most difficult tasks, like writing new code or reviewing a big pull request.

Meetings are normally in the afternoon. Our team works in three time zones, so we hardly ever meet before eleven. I sometimes take calls from the sofa, but I am never in bed during a meeting. That is my rule.

The hardest part is stopping. In the office, you can see that everyone has gone home. At home, there is always one more message. So at six I close the laptop, and I often go for a walk around the block to "leave the office". It sounds silly, but it really helps me switch off.

Have you got a routine? I'd love to hear about it in the comments.`,
    questions: [
      { statement: "The writer often checks social media in the morning.", answer: false },
      { statement: "The writer uses the first hours of the day for the hardest tasks.", answer: true },
      { statement: "The team rarely has meetings early in the day.", answer: true },
      { statement: "The writer usually keeps working late into the evening.", answer: false },
    ],
  },
  {
    title: "Are We Ready Yet?",
    level: "B1",
    body: `It's Thursday afternoon, and the release is planned for six o'clock. Our team lead, Omar, is walking around the office with his checklist and asking everyone the same question: "Are we ready yet?"

Kate has already finished the database changes, and she has tested them twice. That's good news. Then Omar comes to my desk. I still haven't fixed one small bug in the settings screen. I've already found the reason, but I haven't written the test yet, and our rule is simple: no test, no merge.

"How long do you still need?" Omar asks. "Twenty minutes," I say. He looks at his watch and nods.

The bigger problem is the translations. The German texts still haven't arrived. The translator promised them for Monday, and it's already Thursday. Omar has written to her twice, but she hasn't answered yet.

At half past five, my fix is in, and Kate has already prepared the release notes. We still don't have the German texts, so Omar decides to release the update in English for German users and add the translations tomorrow. "It isn't perfect," he says, "but it's better than waiting another week."`,
    questions: [
      { statement: "The writer hasn't found the cause of the bug yet.", answer: false },
      { statement: "Kate's part of the work is finished before the release.", answer: true },
      { statement: "Omar decides not to wait for the translations.", answer: true },
      { statement: "The translator sent the German texts on time.", answer: false },
    ],
  },
  {
    title: "The Borrowed Drill",
    level: "B1",
    body: `Last weekend I wanted to put up some shelves in my new flat, but I didn't have a drill. So I knocked on my neighbour's door. Mr Petrov is a retired engineer, and he has a whole room full of tools.

"Of course," he said. "Wait a minute." He came back with a heavy box and gave it to me. Then he showed me how to change the drill bits. "Bring it back on Sunday," he said. "I need it for my garden."

The shelves took me all of Saturday. On Sunday my friend Dima came round and saw the drill. "Lend it to me for a day," he said. "I want to fix a cupboard." I didn't want to say no, so I gave it to him and asked him to return it in the evening.

Dima didn't come back that evening. On Monday morning Mr Petrov knocked on my door and asked for his drill. I felt terrible. I called Dima, and he brought it to me an hour later, with apologies and a box of chocolates.

I gave the drill back to Mr Petrov and offered him the chocolates too. He laughed and said, "Keep them. But next time, ask me before you lend my things to your friends."`,
    questions: [
      { statement: "Dima returned the drill on Sunday evening.", answer: false },
      { statement: "The neighbour lent the writer his drill.", answer: true },
      { statement: "Mr Petrov didn't like that his tool went to someone else without his permission.", answer: true },
      { statement: "Mr Petrov kept the chocolates.", answer: false },
    ],
  },
  {
    title: "Should Juniors Ask Questions?",
    level: "B1",
    body: `When I started my first job as a developer, I was afraid to ask questions. I thought my colleagues were too busy, and I didn't want them to think I was slow. So I spent hours looking for answers alone, and sometimes I found nothing at all.

After a month, my team lead noticed this and invited me for a coffee. She said that a good question saves time for everyone, but a long silence can cost the team a whole day. That changed my mind.

I have now worked in the industry for six years, and I often work with juniors myself. My advice is simple. Try to solve the problem alone for thirty minutes, because you learn a lot from trying. But if you are still stuck after that, ask someone. Explain what you have tried and what you expected, so the other person can help you quickly.

Of course, some questions are better for the documentation or a search engine, and some are better for a person. You will learn the difference with time. Juniors who ask good questions usually grow faster, and seniors who answer them become better teachers. Everybody wins, or at least nobody loses.`,
    questions: [
      { statement: "At the start of the writer's career, asking for help felt easy.", answer: false },
      { statement: "The team lead believed that staying silent can waste more time than asking.", answer: true },
      { statement: "The writer advises juniors to ask for help at once, before trying anything.", answer: false },
      { statement: "According to the writer, both juniors and seniors gain from good questions.", answer: true },
    ],
  },
  {
    title: "A Long Day of Travel",
    level: "B1",
    body: `When I travel, I usually plan everything carefully. But last spring, nothing went according to plan.

When I arrived at the airport, I saw that my flight was delayed by three hours. I wasn't too worried, because I had a book and some snacks. But when the new departure time came, the flight was cancelled completely. A tired woman at the airline desk gave me a ticket for the next morning and a voucher for a hotel.

The hotel was forty minutes away by bus. When I finally got there, it was almost midnight, and the receptionist couldn't find my booking. I showed him the voucher, and after twenty minutes he gave me the key to a small room on the fifth floor. When I opened the door, I saw that the window didn't close, and it was raining outside.

I slept for about four hours. When the alarm rang, I took the first bus back to the airport. This time the plane left on time, and I landed just in time for my sister's birthday dinner.

When I told the story at the table, everybody laughed. Now it's a funny memory, but I still take a second book and an extra charger whenever I fly.`,
    questions: [
      { statement: "In the end, the writer's flight left three hours late.", answer: false },
      { statement: "The airline gave the writer a place to stay for the night.", answer: true },
      { statement: "There was a problem with the window in the hotel room.", answer: true },
      { statement: "The writer arrived too late for the birthday dinner.", answer: false },
    ],
  },
  {
    title: "If the Build Fails",
    level: "B1",
    body: `Welcome to the team! This short guide explains what to do when something goes wrong in your first weeks. Read it now and keep it open, because you will need it.

If the build fails on your computer, don't panic. First, pull the latest changes from the main branch. If the problem is still there, delete the folder with old dependencies and install them again. This fixes most problems. If it doesn't, write in the team chat, and someone will help you.

If you find a bug in production, never fix it directly on the server. Create a ticket, add the steps to reproduce it and tell the person on duty. If the bug affects payments or customer data, call them instead of writing, because it is urgent.

If you are not sure about a task, ask your mentor. Nobody will think you are stupid. If you wait until the end of the week, you will lose time, and the problem will probably get bigger.

Finally, if you break something (and you will, because everyone does), tell us immediately. We won't be angry. We will only be angry if you hide it. Mistakes are normal here; secrets are not.

Good luck, and enjoy your first sprint!`,
    questions: [
      { statement: "New developers should fix production bugs directly on the server.", answer: false },
      { statement: "According to the guide, reinstalling dependencies solves most build problems.", answer: true },
      { statement: "For a bug with payments, the guide recommends a phone call rather than a message.", answer: true },
      { statement: "The team will be angry with anyone who breaks something.", answer: false },
    ],
  },
  {
    title: "If I Lived by the Sea",
    level: "B1",
    body: `I have lived in a big city all my life, and I like it. But sometimes, usually in grey November, I imagine a different life. What would happen if I lived by the sea?

First of all, my mornings would be different. If I had a house near the beach, I would go swimming before breakfast instead of standing on a crowded train. I would probably be healthier, and maybe calmer too. My job is remote, so I could work from anywhere if I had a good internet connection.

On the other hand, I know myself. If I lived in a small town, I would miss the theatres, the late-night cafés and my friends. In winter, seaside towns are often empty and quiet, and I'm not sure I would enjoy that for more than a month. If my friends wanted to visit me, they would need to travel for six hours.

So would I really move? Probably not forever. But if I found a cheap flat for the summer, I would rent it without thinking twice. Maybe that is the answer: the city in winter and the sea in summer. If only my bank account agreed with me!`,
    questions: [
      { statement: "The writer's job doesn't allow working remotely.", answer: false },
      { statement: "The writer has always lived in a city.", answer: true },
      { statement: "The writer has decided to move to the sea for good.", answer: false },
      { statement: "The writer thinks a seaside town might feel too quiet in winter.", answer: true },
    ],
  },
  {
    title: "The Interviewer Who Smiled",
    level: "B1",
    body: `Last year I applied for a job at a company that makes software for hospitals. I had two interviews there, and they were completely different.

The first interviewer was a man who didn't smile once. He asked questions that had only one correct answer, and he wrote my answers in a notebook which he never showed me. After forty minutes I felt like a student who was failing an important exam.

The second interview was with Sara, the team lead. She was a person who listened more than she talked. She showed me a real problem that her team had solved the month before and asked how I would approach it. When I didn't know something, she didn't stop me. Instead, she gave me a hint that helped me continue.

I got the job, and now Sara is my manager. Later I asked her why her interview was so different. She said that she wasn't looking for people who know everything. She wanted someone who could think aloud, ask questions and work well with others.

Now I sometimes interview candidates myself, and I try to be the kind of interviewer who smiles. People who are relaxed show you much more of what they can really do.`,
    questions: [
      { statement: "Sara gave the writer a hint during the interview.", answer: true },
      { statement: "The two interviews felt very similar to the writer.", answer: false },
      { statement: "Sara looks for people who can think and work with others, not people who know everything.", answer: true },
      { statement: "The first interviewer was friendly and relaxed.", answer: false },
    ],
  },
  {
    title: "The Hotel We Stayed At",
    level: "B1",
    body: `Last October my husband and I spent a week in a small town in the mountains. Here are a few notes for anyone who is planning a similar trip.

The hotel we stayed at was a family business in an old stone house. The room we got was simple but clean, and the view from the balcony was the best thing we saw all week. The owner, a man everyone in the town seems to know, cooked breakfast himself every morning. The bread he baked was still warm when it arrived at the table.

The town itself is tiny. Most of the people we met were friendly, although few of them spoke English. The phrases we learned before the trip were very useful, especially "thank you" and "how much is it?".

The best day was a hike to a lake the owner told us about. The path we took was steep in places, but the water was so clear that we could see the stones at the bottom. The restaurant we went to that evening served fish from that same lake.

One warning: the bus you need to get there runs only twice a day, so check the timetable before you leave. Would we go back? Without a doubt.`,
    questions: [
      { statement: "The owner made breakfast for the guests himself.", answer: true },
      { statement: "The hotel belongs to a big international chain.", answer: false },
      { statement: "Buses to the town run every hour.", answer: false },
      { statement: "Learning some local phrases before the trip turned out to be helpful.", answer: true },
    ],
  },
  {
    title: "The Family Calendar",
    level: "B1",
    body: `In our family everybody is busy, so in January my wife and I bought a big paper calendar and hung it on the kitchen wall. It sounds old-fashioned, but it has changed our life.

Every Sunday evening we sit down at seven o'clock and plan the week. The children's activities go in green. On Mondays and Wednesdays our daughter has swimming at five, and on Tuesdays our son goes to a chess club at half past four. My wife works late on Thursdays, so I always cook dinner on that day.

Bigger events go in red. My parents are coming at the end of March, and in April we're going to the seaside for a week. In summer we usually spend two weeks at a lake, but this year we want to go in September instead, because it's cheaper and less crowded then.

The calendar has also solved an old problem: birthdays. My mother-in-law's birthday is on the 2nd of May, and I have forgotten it twice. Last year I remembered it at midnight, which was not a good moment to call! This year it's on the wall in big red letters.

At the weekend the children stand in front of the calendar and count the days until the holidays.`,
    questions: [
      { statement: "The family plans the week with a phone app.", answer: false },
      { statement: "The writer cooks dinner on Thursdays.", answer: true },
      { statement: "This year the family wants to go to the lake in summer, as usual.", answer: false },
      { statement: "The writer has forgotten a family birthday before.", answer: true },
    ],
  },
];
