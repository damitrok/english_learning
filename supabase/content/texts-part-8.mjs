// Reading texts 104–115 (B1), one per grammar unit: prepositions of time and place,
// adjective/verb + preposition, phrasal verbs.

export const TEXTS = [
  {
    title: "The Weekend Migration",
    level: "B1",
    body: `Last month our team moved the main database to a new server. We planned the work carefully, because the online shop had to be closed while we did it. We chose the quietest time of the week: the website was offline from ten o'clock on Saturday evening until six o'clock on Sunday morning.

I have worked at the company for three years, but this was my first migration. Our team lead, Olga, has been with the company since 2015, so she knows the old system better than anyone else.

From ten until midnight, everything went well. We copied the data, checked it and started the new server. Then, at about one o'clock, we found a problem: some old orders were missing. We searched for the reason for nearly two hours. In the end, Olga noticed that one old table used a different date format, so those orders were never copied.

By four o'clock the data was correct, and we tested the shop until half past five. When the website opened again at six, we were exhausted but happy. I slept from seven in the morning until three in the afternoon. On Monday, our manager thanked everyone, and since then the new server has worked without a single problem.`,
    questions: [
      { statement: "Olga joined the company quite recently.", answer: false },
      { statement: "The website was closed during the night.", answer: true },
      { statement: "It took the team almost two hours to find the reason for the missing orders.", answer: true },
      { statement: "The website opened again later than planned.", answer: false },
    ],
  },
  {
    title: "A Long Night Flight",
    level: "B1",
    body: `My brother lives on the other side of the world, so last winter I took a night flight to visit him. Before the trip, a friend gave me some advice: "Don't drink coffee before you get on the plane, and try to sleep during the flight."

I followed the first part of her advice. At the airport, while I was waiting for boarding, I drank only water and read a book. After we took off, the crew served dinner. It was better than I expected, and I ate everything.

Sleeping during the flight was much more difficult. The man who was sitting next to me snored loudly, and a baby behind us cried for an hour. While everyone else was sleeping, I watched two films and a documentary about whales. At about four o'clock in the morning, I finally fell asleep, but after forty minutes the lights came on for breakfast.

When we landed, my brother was waiting for me outside the airport. During the drive to his flat, I could hardly keep my eyes open. I went to bed after lunch and woke up at ten in the evening, completely confused about the time. Next time, I will take earplugs with me, and I will try to sleep before I get too tired.`,
    questions: [
      { statement: "The writer didn't enjoy the dinner on the plane.", answer: false },
      { statement: "The writer's friend advised against drinking coffee before the flight.", answer: true },
      { statement: "The writer slept for most of the flight.", answer: false },
      { statement: "Next time, the writer wants to bring something to block out noise.", answer: true },
    ],
  },
  {
    title: "Welcome to the Office",
    level: "B1",
    body: `Hi Daniel,

Welcome to the team! We are all looking forward to meeting you on Monday. Here is some information that will help you on your first day.

Our office is on the third floor of a grey building in Park Street. When you arrive, show your passport at the reception desk, and they will give you a card for the doors. There is a lift at the end of the hall, but most people use the stairs.

Your desk is in the big room on the left, by the window. Your new laptop is already on it, and you will find a notebook and some pens in the top drawer. The developers sit at the long tables in the middle of the room, and the designers work in the small room at the back.

The kitchen is on the same floor. There is free coffee in the cupboard, and there is usually some fruit on the table. Please write your name on your food if you leave it in the fridge, because things sometimes disappear!

At ten o'clock we have our standup in the meeting room next to the kitchen. After that, I will sit with you and help you set up your accounts. If you get lost, just ask anyone — people here are very friendly.

See you on Monday!
Kate`,
    questions: [
      { statement: "Daniel's laptop will be waiting for him on his desk.", answer: true },
      { statement: "The office is on the ground floor.", answer: false },
      { statement: "The designers and the developers work in the same room.", answer: false },
      { statement: "Kate will help Daniel after the morning meeting.", answer: true },
    ],
  },
  {
    title: "Grandma's Eightieth Birthday",
    level: "B1",
    body: `Last Saturday was my grandmother's eightieth birthday, and the whole family planned to meet at her house for lunch at one o'clock. It sounded simple, but nothing went as planned.

My cousin Anna was supposed to come by train, but she missed it. In the end, she spent two hours at the station and then sat on a slow bus for another three hours. My uncle couldn't come at all, because he was in hospital after a small operation on his knee.

My brother is at university in another city, and when the lunch started, he was still on a plane, coming back from a student conference. He called us from the airport and said that he would be late. Meanwhile, my parents and I sat in our car in a traffic jam for forty minutes.

So at one o'clock, only my grandmother and her neighbour were at the table. When we finally arrived, Grandma was sitting in the garden, completely calm. "I'm eighty," she said. "I know that families are never on time."

We had lunch at four, and Anna arrived just in time for the cake. In the evening, we called my uncle, who was still in bed at the hospital, and we all sang "Happy Birthday" to Grandma on the phone. It was a strange day, but everyone agreed that it was one of our best family parties.`,
    questions: [
      { statement: "Anna travelled by train, as she had planned.", answer: false },
      { statement: "The writer's uncle missed the birthday lunch.", answer: true },
      { statement: "Grandma was angry because everyone was late.", answer: false },
      { statement: "The family ate much later than planned.", answer: true },
    ],
  },
  {
    title: "Which Place Is Home?",
    level: "B1",
    body: `Six months ago, I moved from a small town to the capital for a new job. People often ask me what the hardest part has been. Honestly, it isn't the work. It's getting from one place to another.

In my town, I walked to work in ten minutes. Now I go to the office by metro, and it takes about fifty minutes each way. I usually get to work at nine, but if there is a problem on the line, I arrive at the office late and stressed. At first I was angry about it, but now I use the time to read and to practise Spanish on my phone.

On Fridays I often go to my parents' house for the weekend. The train arrives in my town at about eight, and my dad meets me at the station. It's strange: when I'm there, I say that I'm going home, and when I'm in the capital, I say exactly the same thing. I'm not sure which place is my real home now.

Last week I went to a concert in the city centre and got home after midnight. The streets were still full of people, and I felt safe and happy. That was the moment when I realised that I was starting to love this city. Next month I'm going to Italy with two new friends from work, and I'm sure we'll argue about the best way to get to the airport.`,
    questions: [
      { statement: "The writer's journey to work is longer now than it used to be.", answer: true },
      { statement: "According to the writer, the new job is the hardest part of moving.", answer: false },
      { statement: "The writer felt nervous in the city centre late at night.", answer: false },
      { statement: "The writer's father meets the train on Fridays.", answer: true },
    ],
  },
  {
    title: "The Missing Keys",
    level: "B1",
    body: `On Tuesday morning I was ready to leave for work, but I couldn't find my keys. I always put them in a small bowl on the shelf next to the front door, but the bowl was empty.

First, I looked in my coat pockets and in my bag. Nothing. Then I searched the living room. I looked under the sofa, between the cushions and behind the TV. I found a pen, two coins and a sock that I lost a year ago, but no keys.

My flatmate, Leo, was in the kitchen, eating his breakfast. "Did you check the bathroom?" he asked. I did: the keys weren't on the shelf above the sink or on the floor below it. I was getting worried, because I had a meeting at nine and the bus stop is ten minutes' walk from our building.

Then I remembered something. The evening before, I came home late with a heavy bag of shopping, and I put everything away in a hurry. I opened the fridge, and there they were: on the top shelf, behind the milk, next to a piece of cheese.

Leo laughed so hard that he almost fell off his chair. I ran to the bus stop opposite the bakery and caught the bus just in time. Now there is a big hook by the front door, and my keys go there the moment I come in.`,
    questions: [
      { statement: "Leo found the keys under the sofa.", answer: false },
      { statement: "The writer usually keeps the keys near the front door.", answer: true },
      { statement: "The keys were in the fridge.", answer: true },
      { statement: "The writer missed the bus that morning.", answer: false },
    ],
  },
  {
    title: "A Walk in the Hills",
    level: "B1",
    body: `Last Sunday my friend Ivan and I decided to spend the day outside the city. We took an early train and got off at a small village at the bottom of the hills.

The path started next to the church. We walked along a river for about an hour, and then we crossed over an old stone bridge. After that, the path went up a steep hill through a dark forest. It was hard work, and we stopped twice to drink some water and catch our breath.

At the top, the view was amazing. We could see the whole valley, the river and the roofs of the village far below us. We sat on a rock, ate our sandwiches and watched some birds flying round in circles above the trees.

On the way down, we chose a different path. It went across a field full of cows, past an old farm and into another forest. Ivan was sure that he knew the way, but after forty minutes we came out of the trees onto a road that neither of us recognised. In the end, we asked a farmer for directions, and he kindly drove us back to the station in his car.

We missed one train, but we caught the next one and got home before dark: tired, muddy and very happy. I'm already looking forward to our next walk, but this time I'll bring a map.`,
    questions: [
      { statement: "The friends crossed the river by bridge.", answer: true },
      { statement: "The path to the top was flat and easy.", answer: false },
      { statement: "Ivan knew the way back perfectly.", answer: false },
      { statement: "A farmer helped them get back to the station.", answer: true },
    ],
  },
  {
    title: "My First Conference Talk",
    level: "B1",
    body: `Last month I gave my first talk at a developer conference. The idea came from my manager. She said that I knew a lot about testing and should share it with other people. I agreed, although I was nervous about speaking in front of hundreds of strangers.

The conference was in another city, so I went there by train. I finished my slides on the way, with my laptop on my knees and a cup of coffee in my hand. My talk was about how our team writes tests for old code that nobody really understands any more.

At the conference, I met lots of interesting people. In the coffee break, a woman with short grey hair told me about a project she worked on twenty years ago, when the internet was much slower. I also met the author of a book about software testing that I read when I was a student. I couldn't believe I was talking to him!

My talk was on the second day, at half past eleven. At first my voice was shaking, but after a few minutes I relaxed. People laughed at my jokes and asked lots of questions at the end. One man even said that it was the best talk of the conference, although I think he was just being kind.

All the talks were filmed, so you can watch mine online. I haven't watched it yet, though. I really don't like hearing my own voice on video.`,
    questions: [
      { statement: "The writer travelled to the conference by plane.", answer: false },
      { statement: "The talk was about testing old code.", answer: true },
      { statement: "Nobody asked any questions after the talk.", answer: false },
      { statement: "The writer felt nervous at the beginning of the talk.", answer: true },
    ],
  },
  {
    title: "Afraid of Speaking",
    level: "B1",
    body: `For years I was good at reading English, but I was afraid of speaking it. I could read technical documentation without using a dictionary, and I was quite good at writing emails. But in meetings with our colleagues from abroad, I usually stayed silent instead of saying what I thought.

The problem wasn't my vocabulary. I was afraid of making mistakes and worried about sounding stupid. Before saying anything, I built the whole sentence in my head, checked the grammar twice and then decided that it was too late to say it anyway.

Last year I got tired of feeling like this. I was interested in a new role in an international team, and I knew I couldn't get it without speaking up. So I started taking online lessons with a teacher twice a week. She was very patient, and she was always interested in hearing about my life, not just my work.

After a few months, something changed. I stopped thinking about every article and every tense, and I focused on explaining my ideas clearly. I still make mistakes, of course, but I'm no longer embarrassed by them. Nobody in my team cares about a missing "the"; they care about whether my idea is good.

Last month I got the new role, and yesterday I ran a meeting in English for the first time. I'm really proud of that, and I'm thinking of starting a second foreign language next year.`,
    questions: [
      { statement: "Before the lessons, the writer found it hard to write emails in English.", answer: false },
      { statement: "The writer's main problem was a fear of mistakes, not a lack of words.", answer: true },
      { statement: "The writer has recently led a meeting in English.", answer: true },
      { statement: "These days, the writer worries about every article and tense.", answer: false },
    ],
  },
  {
    title: "Listen to Your Users",
    level: "B1",
    body: `When I started working as a developer, I thought that good software depended on clean code and fast servers. After eight years, I think it depends mostly on one thing: whether the team listens to its users.

A few years ago, we worked on an app for booking doctors' appointments. We spent weeks talking about new features in our meetings, but nobody talked to the people who actually used the app. When our manager finally asked for feedback, the results surprised us. Users didn't care about our beautiful animations. They were looking for one simple thing: a button to cancel an appointment, which was hidden deep in the settings.

Since then, I have changed the way I work. Every month I spend an afternoon with our support team. I listen to their calls, and I look at the messages that users write to us. Usually they are right, and they are just waiting for someone to fix a problem that they have reported many times.

Of course, you can't do everything users ask for. Some ideas belong in a different product, and some would make the app more complicated for everyone else. You need to think about what people really need, not only about what they say.

Still, my advice to any new developer is simple: before you write a single line of code, find out what happens to real users when they open your app. It will save you weeks of work.`,
    questions: [
      { statement: "Most users wanted better animations in the app.", answer: false },
      { statement: "The writer now believes that listening to users matters more than fast servers.", answer: true },
      { statement: "The writer thinks developers should build everything that users request.", answer: false },
      { statement: "In the booking app, the cancel button was hard to find.", answer: true },
    ],
  },
  {
    title: "A Monday to Forget",
    level: "B1",
    body: `My alarm didn't go off on Monday morning. When I finally woke up, it was already eight o'clock, and my interview for a new job was at nine. I jumped out of bed, got dressed in two minutes and ran out of the flat without breakfast.

The bus was just leaving when I got to the stop. I shouted and waved, and luckily the driver stopped and let me get on. I sat down, took a deep breath and checked the address on my phone. Then, two stops later, the bus broke down, and everyone had to get off and wait for the next one in the rain.

I decided not to wait. I started walking fast, and then running. As I ran round a corner, I fell over a dog's lead and dropped my phone into a puddle. The dog's owner helped me up and apologised again and again, while the dog ran away happily with my scarf.

I arrived at the office at five past nine, wet and out of breath. I wanted to give up and go home, but the receptionist smiled and told me to sit down for a minute. She went away and came back with a cup of tea for me, and later the interviewer and I laughed about my terrible morning.

The interview went well, maybe because I was too tired to be nervous. They called me on Wednesday and offered me the job. I still don't know what happened to my scarf.`,
    questions: [
      { statement: "The writer had no time for breakfast that morning.", answer: true },
      { statement: "The bus took the writer all the way to the office.", answer: false },
      { statement: "The writer didn't get the job.", answer: false },
      { statement: "The writer arrived a little late for the interview.", answer: true },
    ],
  },
  {
    title: "Clearing Out the Flat",
    level: "B1",
    body: `Last weekend my partner and I decided to clear out our flat. After five years there, every cupboard was full of things we never used.

We started in the bedroom on Saturday morning. I took all my clothes out of the wardrobe and put them on the bed. Then I tried them on. If something didn't fit, or if I couldn't remember the last time I wore it, I put it in a bag for the charity shop. I also found a jacket that I borrowed from my brother ages ago, so I put it by the door to give it back to him.

The kitchen was harder. My partner wanted to throw away all the old cups, but I wanted to keep a few because they were presents. In the end, we kept three and gave the rest away to a neighbour who has just moved in.

The worst part was a box of papers under the bed: old bills, instructions for machines that we don't own any more and letters from the bank. We went through them one by one. We put the important documents away in a folder and took the rest down to the recycling bins.

By Sunday evening, there were ten full bags by the door. On Monday I borrowed my dad's car and took them to the charity shop. When I came home and looked round the flat, it felt bigger and lighter. Now we have a rule: if we buy something new, something old has to go.`,
    questions: [
      { statement: "The writer kept all of the old cups.", answer: false },
      { statement: "The writer found something that belongs to a family member.", answer: true },
      { statement: "Sorting the papers was the easiest part of the job.", answer: false },
      { statement: "After the clear-out, the flat seemed more spacious.", answer: true },
    ],
  },
];
