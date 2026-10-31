// Reading texts 65–77 (grammar units 65–77: a/an … not + any, no, none).
// A2 up to text 70, B1 from text 71.

export const TEXTS = [
  {
    title: "The Interview",
    level: "A2",
    body: `Last Tuesday Olga had an interview for a job at a small company. It was an important day for her, so she got up an hour earlier than usual. She also took an umbrella because it looked like rain.

The interview was in an old building near the river. A manager and an engineer from the team met her at the door. The manager was a friendly woman with a quiet voice. The engineer was quite young, and he asked a lot of technical questions.

First, they asked Olga to describe a difficult project. She told them about an app for a university. She built it with two friends last year. Then they gave her a short task: she had to find a bug in a small program. She found it in ten minutes.

At the end, the manager said, "We'll send you an email on Friday." Olga is a little nervous now, but she thinks it was a good interview.`,
    questions: [
      { statement: "Olga got up later than usual on the day of the interview.", answer: false },
      { statement: "In the task, Olga had to find a mistake in some code.", answer: true },
      { statement: "Olga feels a bit nervous after the interview.", answer: true },
      { statement: "The company will phone Olga with an answer on Monday.", answer: false },
    ],
  },
  {
    title: "Farm Day with the Kids",
    level: "A2",
    body: `Last Saturday Tom and Anna took their children to a farm outside the city. They didn't take the car. Instead, they went by train and then by bus. The trains were full of families, and the buses were late, but the children didn't mind.

The farm was bigger than they expected. There were sheep, cows, two horses and a lot of chickens. A farmer showed the children how to feed the sheep. Their little son, Max, was a bit afraid of the animals at first, but after ten minutes he was laughing.

For lunch, they had sandwiches and tomatoes from the farm's garden. Max dropped his sandwich in the mud, and his new trousers got dirty too. Luckily, Anna had some wet wipes in her bag, so it wasn't a disaster.

In the evening, all four of them were tired. Their feet hurt, and the children fell asleep on the bus home. The next morning Max asked, "Can we go again next month?"`,
    questions: [
      { statement: "Max loved the animals from the very first minute.", answer: false },
      { statement: "The family travelled to the farm by public transport.", answer: true },
      { statement: "Max's trousers stayed clean all day.", answer: false },
      { statement: "Max wants to visit the farm again.", answer: true },
    ],
  },
  {
    title: "Moving Day at Work",
    level: "A2",
    body: `Hi everyone,

As you know, we are moving to the new office on Monday. Here is some important information about the move.

The new furniture arrived yesterday. Each person will have a desk, a chair and a small cupboard. Please don't bring any old furniture from home, because we have enough. The old computers are going to stay here, but you should take your own keyboard and mouse.

There is a kitchen on the second floor. It has a fridge, a coffee machine and a water cooler, so you won't need to buy bottles of water any more. Please bring a cup for yourself, because we don't have enough cups for all of us yet.

And one piece of advice: come by bus or train on Monday. There isn't much parking near the building, and the traffic is usually terrible in the morning.

If you have any questions, send me a message.

Thanks,
Kate`,
    questions: [
      { statement: "People don't need to bring furniture from home.", answer: true },
      { statement: "Everybody should leave their keyboard in the old office.", answer: false },
      { statement: "Kate suggests driving to the new office on Monday.", answer: false },
      { statement: "There will be drinking water in the new kitchen.", answer: true },
    ],
  },
  {
    title: "Grandma's Birthday Cake",
    level: "A2",
    body: `Last weekend my grandmother turned eighty, and the whole family came to her flat for a party. My sister and I decided to make the cake ourselves. We bought some flour, some butter, a dozen eggs and a big bar of chocolate.

The cake took three hours. While it was in the oven, we made some sandwiches and a bowl of salad. My uncle brought some cheese from the market and a few bottles of juice for the children.

At five o'clock we put the cake on the table, and everyone sang "Happy Birthday". Grandma cut it into twenty pieces. My cousin asked for a second piece, and my uncle had two pieces with a cup of tea. The children didn't want any salad, but they ate a lot of cake.

There was still some cake left at the end of the evening, so Grandma gave us a piece each to take home. She said it was the best birthday cake in eighty years.`,
    questions: [
      { statement: "The family bought the cake in a shop.", answer: false },
      { statement: "Making the cake took several hours.", answer: true },
      { statement: "The grandmother liked the cake very much.", answer: true },
      { statement: "There was no cake left after the party.", answer: false },
    ],
  },
  {
    title: "A Strange Alert",
    level: "A2",
    body: `Yesterday afternoon I was in a café when I got an alert on my phone. A server in our data centre was almost out of disk space. I had a laptop with me, so I opened it and checked the logs.

The logs showed a strange process. The process started every five minutes and created a new file each time. The files weren't very big, but there were thousands of them. I called a colleague, Sam, and asked him about it.

Sam remembered a script from last year. The script was part of an old test, and the team forgot to turn it off after the test. We stopped the script, deleted the files and restarted the server. After that, there was plenty of free space again.

Before I left the café, I wrote a short report for the team. I also added a task to the board: "Check all old scripts." When I finally closed the laptop, my coffee was cold.`,
    questions: [
      { statement: "The problem was caused by a new feature.", answer: false },
      { statement: "The writer wasn't at home when the alert came.", answer: true },
      { statement: "The writer solved the problem completely alone.", answer: false },
      { statement: "The old script was still running because people forgot about it.", answer: true },
    ],
  },
  {
    title: "A Week by the Sea",
    level: "A2",
    body: `Last summer we spent a week by the sea in a small town in the south of the country. Every morning we woke up early and went to the beach before the sun got too hot.

The town was quiet, and the people were very friendly. We stayed in the same little hotel as last year. The owner remembered us and gave us the best room, on the second floor, with a view of the sea.

The only problem was the internet. It worked only in the morning, so I couldn't check my work email. At first I was annoyed, but by the end of the week I didn't care at all. I read three books instead, and in the evenings we listened to the radio on the balcony.

On the last day we climbed to the top of the hill behind the town. The sky was clear, and we could see the whole coast. My photos don't show how beautiful it really was.`,
    questions: [
      { statement: "This time the writer stayed in a different hotel.", answer: false },
      { statement: "The internet connection was a problem.", answer: true },
      { statement: "On the last day the sky was cloudy.", answer: false },
      { statement: "By the end of the week, work email no longer bothered the writer.", answer: true },
    ],
  },
  {
    title: "Two Different Timetables",
    level: "B1",
    body: `Mark is a developer, and his wife, Lena, is a nurse. Their timetables are so different that they sometimes see each other only at breakfast.

Mark usually works at home. He gets up at eight, takes their daughter to school and starts work at nine. Twice a week he goes to the office for meetings. He finishes at six, and in the evening he likes to go to the cinema.

Lena works in a big hospital near the station. When she is on the night shift, she goes to work at eight in the evening and comes home at eight in the morning. Then she has breakfast with Mark and goes to bed while he starts his first meeting.

Last month Lena was ill and spent a week in bed, and for the first time in years they were both at home all day. "It was strange," Mark said, "but it was really nice to have lunch together." Now they are trying to keep one free day a week for the whole family.`,
    questions: [
      { statement: "Lena works only during the day.", answer: false },
      { statement: "Mark works from home on most days.", answer: true },
      { statement: "While Lena was ill, Mark was at the office every day.", answer: false },
      { statement: "Mark enjoyed having lunch with Lena.", answer: true },
    ],
  },
  {
    title: "Learning Without Exams",
    level: "B1",
    body: `I have been learning English for two years, and people often ask me for advice. My answer is simple: don't make it boring.

I love music, so I listen to songs in English every day and read the words while I listen. I like films too, and I watch them with English subtitles. At first I understood very little, but now I can follow most of the story.

I hate exams, and I don't like grammar books much either. They are useful, of course, but they make me sleepy after twenty minutes. Instead, I write short messages to friends in English and ask them to correct my mistakes.

The language is also important for my career. Many companies expect developers to read documentation and talk to clients in English. Last month I had a call with a client from Canada, and for the first time I wasn't nervous at all.

So my advice is this: people learn better when they are happy. Enjoy the process, and the results will come.`,
    questions: [
      { statement: "The writer enjoys taking exams.", answer: false },
      { statement: "The writer watches films with English subtitles.", answer: true },
      { statement: "The writer studies mainly with grammar books.", answer: false },
      { statement: "The writer felt calm during a recent call with a client.", answer: true },
    ],
  },
  {
    title: "Three Weeks in Europe",
    level: "B1",
    body: `Next summer my brother and I are going to travel around Europe for three weeks. We are starting in Amsterdam, the capital of the Netherlands, because a friend of ours lives there and can show us the city. We want to see the canals and visit the Rijksmuseum.

After that, we are taking the train to Germany. We'd like to spend two days in Cologne and take a boat trip on the Rhine. Then we are going south to Switzerland. My brother loves mountains, so we are going to walk in the Alps for a few days. We have already booked two nights at the Park Hotel, a small place near Lake Geneva.

The last part of the trip is Italy. We will fly home from Rome, but before that we want to swim in the Mediterranean and see the Colosseum.

My mother is worried that three weeks is too long, but we think it isn't long enough! Our only problem is money, so we are going to sleep in cheap hostels and cook our own food.`,
    questions: [
      { statement: "Their mother thinks the trip is too short.", answer: false },
      { statement: "They plan to visit four countries.", answer: true },
      { statement: "They are going to fly from Amsterdam to Germany.", answer: false },
      { statement: "They want to spend as little as possible on food and accommodation.", answer: true },
    ],
  },
  {
    title: "A Tour of the Office",
    level: "B1",
    body: `On Monday morning Paul met Nina, the new designer, at the door and offered to show her around. "This is the main room," he said. "These desks are for the developers, and those desks by the window belong to the design team. That one in the corner, next to the window, is yours."

Nina put her bag on the desk and looked around. "And what's that room over there?" she asked.

"That's the quiet room," Paul answered. "You can't make phone calls in there, but it's perfect when you need to concentrate."

Next he took her to the kitchen. "These cups are for everyone, but those on the top shelf belong to the boss, so please don't use them. This machine makes good coffee, but that old one has been broken since March."

Finally, Paul gave her a laptop and a card for the building. "That's all for now," he said. "Is this your first job in IT?"

"No," Nina laughed, "but this is my first job with a desk by the window."`,
    questions: [
      { statement: "Phone calls are allowed in the quiet room.", answer: false },
      { statement: "Nina's desk is in the design team's part of the room.", answer: true },
      { statement: "Both coffee machines in the kitchen work.", answer: false },
      { statement: "This isn't Nina's first job in IT.", answer: true },
    ],
  },
  {
    title: "The Green Running Shoes",
    level: "B1",
    body: `Last Saturday I needed new running shoes because my old ones had a big hole in them. I went to a sports shop in the city centre, and a young assistant came to help me.

"Do you want light ones or ones with more support?" she asked. I told her that I usually run on hard roads, so she brought me three pairs: a black pair, a blue pair and a bright green one.

The black ones were comfortable but too expensive. The blue ones looked nice, but they were a little small, and the shop didn't have a bigger size. The green ones were cheap and fitted perfectly, but the colour was terrible.

I walked around the shop in each pair for a few minutes. In the end I chose the green ones. "Which ones did you buy?" my wife asked when I got home. When I showed her, she laughed for a whole minute.

I wear them every morning now. They are the most comfortable ones I have ever had, and people can see me from very far away.`,
    questions: [
      { statement: "The writer bought the black shoes.", answer: false },
      { statement: "The writer's old shoes were damaged.", answer: true },
      { statement: "The writer is happy with the green shoes.", answer: true },
      { statement: "The writer's wife liked the colour immediately.", answer: false },
    ],
  },
  {
    title: "Before the Release",
    level: "B1",
    body: `It was Thursday evening, and the release was planned for Friday morning. Irina, the team lead, wanted to check everything one more time before she went home.

"Are there any open bugs?" she asked.

"There are some small ones," said Dan, "but there aren't any serious problems. I can fix some of them tonight, if you want."

Irina shook her head. "No, go home. We don't need any heroes. The small bugs can wait until next week."

Then she looked at the tests. Some of them were slow, but all of them passed. She asked the designer if there were any last changes to the interface. "I have some ideas," he said, "but they aren't urgent."

The last question was for the support team: did they have any notes for the users? "Yes," they said, "we wrote some last week. They're in the shared folder."

At seven o'clock Irina finally closed her laptop. She felt calm. On Friday morning the release went well, and there weren't any complaints from users all day.`,
    questions: [
      { statement: "Irina told Dan not to stay late.", answer: true },
      { statement: "Dan said there were several serious bugs.", answer: false },
      { statement: "Some of the tests failed.", answer: false },
      { statement: "The release didn't cause problems for users.", answer: true },
    ],
  },
  {
    title: "Camping in the Rain",
    level: "B1",
    body: `Last month my friends and I went camping in the mountains for the weekend. We wanted a real adventure: no hotels, no work and no plans.

On the first evening we wanted to cook dinner, but most of the wood near the lake was wet. None of our matches worked because they were wet too. Luckily, Lisa had a lighter, so we found a few dry sticks, made a small fire and cooked some pasta.

The next morning it started to rain. We tried to check the weather on Lisa's phone, but there was no signal in the mountains. Our tent was old, and the rain came in through a hole in the roof. By lunchtime none of us had any dry socks.

We decided to walk to the village. The only café there had no menu, just soup and bread, but it was the best meal of the trip.

We didn't see any wild animals or take many photos. Still, we laughed more than on any holiday before. Next year, though, we are going to take a new tent.`,
    questions: [
      { statement: "The friends checked the weather forecast on the phone without any difficulty.", answer: false },
      { statement: "The friends had problems making a fire.", answer: true },
      { statement: "The writer wants to use the same tent next year.", answer: false },
      { statement: "The friends enjoyed the simple meal in the village.", answer: true },
    ],
  },
];
