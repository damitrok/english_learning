// Reading texts 26–38 (grammar units 26–38: going to, will/shall, might, can/could,
// must, should, have to, would like, imperatives, used to, there is / there was).

export const TEXTS = [
  // 26 — I'm going to …
  {
    title: "My Running Plan",
    level: "A2",
    body: `Next month I'm going to run my first 10 km race. I'm not a very sporty person, so I'm going to start slowly. My friend Kate runs every weekend, and she's going to help me.

Here is my plan. I'm going to run three times a week, before work. I'm not going to run on Mondays, because Monday is my busiest day. I'm also going to eat better and go to bed earlier.

Am I going to win? Of course not! But I'm going to finish the race. Kate says I'm going to love it.`,
    questions: [
      { statement: "The writer is going to run on Mondays.", answer: false },
      { statement: "Kate is going to help the writer get ready.", answer: true },
      { statement: "The writer hopes to win the race.", answer: false },
      { statement: "The writer plans to run before work.", answer: true },
    ],
  },
  // 27 — will/shall 1
  {
    title: "A Late Call",
    level: "A2",
    body: `It is ten o'clock at night, and Sam's phone rings. It is Anna, his team lead. "The payment service is down," she says. "Customers can't pay."

"OK, I'll look at it now," Sam answers. He opens his laptop and checks the logs. The problem is simple: the disk on the server is full.

"Shall I call Tom? He knows the server well," Anna asks.

"No, it's OK. I'll delete the old log files first. I think that will help."

Twenty minutes later, the service is working again. "Thank you, Sam," says Anna. "Now go to bed. I'll write the report tomorrow morning."`,
    questions: [
      { statement: "Sam decides to call Tom for help.", answer: false },
      { statement: "Anna phones Sam late in the evening.", answer: true },
      { statement: "The server stopped working because its disk was full.", answer: true },
      { statement: "Sam is going to write the report.", answer: false },
    ],
  },
  // 28 — will/shall 2
  {
    title: "Weekend Weather",
    level: "A2",
    body: `Here is the weather for the weekend. On Saturday morning, it will be cold and grey, and it will probably rain in the city centre. Take an umbrella if you go out! The rain won't last long, though. In the afternoon, the sun will come out, and it will be warmer — about fifteen degrees.

Sunday will be a beautiful day: sunny and warm, with no wind. It will be perfect for a walk in the park or a picnic by the river.

But don't put your umbrella away. Next week will be wet again, and we'll see more rain from Monday to Thursday.`,
    questions: [
      { statement: "Sunday will be a good day for a picnic.", answer: true },
      { statement: "It will rain all day on Saturday.", answer: false },
      { statement: "Saturday afternoon will be warmer than the morning.", answer: true },
      { statement: "Next week will be dry.", answer: false },
    ],
  },
  // 29 — might
  {
    title: "Ready by Friday?",
    level: "A2",
    body: `Our release is on Friday, but we might not be ready. There are still four bugs in the app, and one of them is serious. Lena thinks it might take two days to fix.

Yesterday our manager asked me, "Will you finish on time?" I said I wasn't sure. We might finish on Thursday, but we might need one more week. I don't know yet.

The client might not be happy about a delay. But a bad release might be even worse. Tomorrow we're going to talk to the client and explain the problem. They might agree to wait — I hope so.`,
    questions: [
      { statement: "One of the bugs is serious.", answer: true },
      { statement: "The writer is sure the team will finish on Thursday.", answer: false },
      { statement: "The team isn't going to tell the client about the problem.", answer: false },
      { statement: "The writer thinks a bad release could be worse than a delay.", answer: true },
    ],
  },
  // 30 — can and could
  {
    title: "Grandma's First Smartphone",
    level: "A2",
    body: `When my grandmother was young, she couldn't use a computer — nobody had one at home. Last year she got her first smartphone. At first, she couldn't do anything with it. She couldn't even answer a call!

I visited her every Sunday and showed her the basics. "Can you write a message for me?" she asked once. "No, Grandma, but I can show you how," I said.

Now she can do almost everything. She can send photos, make video calls and read the news. Last week she sent me a funny video, and I couldn't stop laughing. She still can't type very fast, but she's learning.`,
    questions: [
      { statement: "The grandmother could answer calls from the first day.", answer: false },
      { statement: "The writer helped her on Sundays.", answer: true },
      { statement: "She types very quickly now.", answer: false },
      { statement: "Now she is able to make video calls.", answer: true },
    ],
  },
  // 31 — must, mustn't, don't need to
  {
    title: "Welcome to the Team",
    level: "A2",
    body: `Welcome to the team! Here are a few rules for your first weeks with us.

You must lock your laptop when you leave your desk. You mustn't share your password with anybody, not even with your team lead. If you get a strange email with a link, you mustn't click it. You must tell the security team at once.

Some things are not so strict. You don't need to come to the office every day — two days a week is enough. You don't need to understand our whole system; nobody does! And please don't be afraid to ask questions. That's how we all learned.`,
    questions: [
      { statement: "New team members must come to the office every day.", answer: false },
      { statement: "You can't even tell your team lead your password.", answer: true },
      { statement: "You should report strange emails to the security team.", answer: true },
      { statement: "New people must understand the whole system quickly.", answer: false },
    ],
  },
  // 32 — should
  {
    title: "Tired All the Time",
    level: "A2",
    body: `Dear Dr Green, I'm always tired. I work at a computer all day, and in the evening I'm too tired to do anything. What should I do? — Paul

Dear Paul, you aren't the only one! Here is my advice. First, you should go to bed earlier: seven or eight hours of sleep is best. You shouldn't look at your phone in bed.

Second, you should take short breaks at work. Stand up, walk a little and look out of the window. And you shouldn't drink coffee after four o'clock.

I also think you should see your doctor and have a blood test. It's probably nothing serious, but it's better to check.`,
    questions: [
      { statement: "The doctor says coffee in the evening is a good idea.", answer: false },
      { statement: "Paul spends his working day at a computer.", answer: true },
      { statement: "The doctor thinks Paul's problem is probably serious.", answer: false },
      { statement: "Paul should take short breaks during the day.", answer: true },
    ],
  },
  // 33 — I have to …
  {
    title: "Working for a Bank",
    level: "A2",
    body: `I work as a developer for a big bank. It's a good job, but it has a lot of rules. Every change has to go through two code reviews. Before each release, we have to write a report for the security team.

I don't have to wear a suit, but I have to come to the office four days a week. Last year we had to change our passwords every month. Now we only have to change them once a year, which is much better.

Do I have to work at weekends? Almost never. My friend at a startup often has to work on Saturdays, so I'm happy where I am.`,
    questions: [
      { statement: "At the bank, one code review is enough for a change.", answer: false },
      { statement: "The writer doesn't need to wear a suit.", answer: true },
      { statement: "The writer's friend often works on Saturdays.", answer: true },
      { statement: "Now they change their passwords every month.", answer: false },
    ],
  },
  // 34 — Would you like …? I'd like …
  {
    title: "Dinner for Two",
    level: "A2",
    body: `Last Friday, Olga and her husband went to a small Italian restaurant. The waiter came to their table. "Good evening. Would you like something to drink?"

"I'd like a glass of red wine, please," said Olga. "And I'd like some water," said her husband.

Ten minutes later, the waiter came back. "Are you ready to order?"

"Yes. I'd like the mushroom soup and then the fish," Olga said. "And I'd like the pasta with chicken," said her husband.

"Would you like some bread with that?" "Yes, please."

After dinner, the waiter asked, "Would you like to see the dessert menu?" But they were full, so they just asked for the bill.`,
    questions: [
      { statement: "Olga's husband ordered the fish.", answer: false },
      { statement: "Olga asked for a glass of red wine.", answer: true },
      { statement: "The couple didn't want any bread.", answer: false },
      { statement: "They didn't have dessert because they were full.", answer: true },
    ],
  },
  // 35 — Do this! Don't do that! Let's do this!
  {
    title: "Setting Up Your Laptop",
    level: "A2",
    body: `Hi Mark, welcome! Here is how to set up your laptop before our meeting.

First, turn on the laptop and connect to the office Wi-Fi. Don't use the guest network — it's too slow. Then open the terminal and install the tools from the list in our wiki. Don't change any settings yet.

Next, download the project code and run the tests. Don't worry if one or two tests fail; that's normal on a new machine. Just write down the errors.

When you finish, send me a message. Let's meet at eleven in room 4 and look at the errors together. And let's have lunch after that!

Irina`,
    questions: [
      { statement: "Irina wants Mark to change the settings at once.", answer: false },
      { statement: "It's OK if a few tests fail.", answer: true },
      { statement: "Mark should use the guest network.", answer: false },
      { statement: "Irina suggests having lunch together after the meeting.", answer: true },
    ],
  },
  // 36 — I used to …
  {
    title: "The Town by the Sea",
    level: "A2",
    body: `I grew up in a small town by the sea. When I was a child, it used to be very quiet. There didn't use to be any big shops — only a market in the main square. People used to know each other, and everybody used to say hello in the street.

My father used to work at the port, and on Sundays I used to go fishing with him.

Now the town is very different. There is a big shopping centre and a new hotel, and in summer the streets are full of tourists. I don't live there any more, but I still visit my parents. Sometimes I miss the old, quiet town.`,
    questions: [
      { statement: "In the past, the town had a big shopping centre.", answer: false },
      { statement: "As a child, the writer often went fishing on Sundays.", answer: true },
      { statement: "Today, a lot of tourists come to the town in summer.", answer: true },
      { statement: "The writer still lives in the town.", answer: false },
    ],
  },
  // 37 — there is, there are
  {
    title: "The New Office",
    level: "A2",
    body: `Last month our company moved to a new office, and I really like it. There are three floors. On the ground floor, there is a big kitchen with a coffee machine and a long table. There is always fresh fruit there, and there are biscuits too.

Our team sits on the first floor. There are twelve desks, and there is a big screen on the wall for meetings. There isn't a printer on our floor, but nobody prints anything anyway.

On the second floor, there are two quiet rooms. Is there a gym? No, there isn't, but there is a place for bikes near the door. Are there any problems? Only one: there aren't enough meeting rooms.`,
    questions: [
      { statement: "There is a printer on the writer's floor.", answer: false },
      { statement: "The new office has three floors.", answer: true },
      { statement: "The office has a gym.", answer: false },
      { statement: "The team needs more meeting rooms.", answer: true },
    ],
  },
  // 38 — there was/were, there has/have been, there will be
  {
    title: "Storm Hits the City",
    level: "A2",
    body: `There was a strong storm in the city last night. This morning there were fallen trees on many roads, and in some parts of the city there was no electricity for six hours. Luckily, nobody was hurt.

This is not the first storm this month. There have been three storms since the start of October, and there has been a lot of damage to roofs and cars.

There will be some problems with trains today, so please check the timetable before you leave home. There won't be any classes at the city's schools today or tomorrow.

The weather is calmer now, but there will be more wind and rain at the weekend.`,
    questions: [
      { statement: "Some parts of the city had no electricity for six hours.", answer: true },
      { statement: "This was the only storm this month.", answer: false },
      { statement: "There will be classes at the city's schools tomorrow.", answer: false },
      { statement: "More bad weather is expected at the weekend.", answer: true },
    ],
  },
];
