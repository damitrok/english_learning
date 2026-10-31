// Reading texts 13–25 (grammar units 13–25: past continuous → present continuous for the future).
// Same shape as texts.mjs; entry j goes with text number 13 + j.

export const TEXTS = [
  {
    title: "When the Lights Went Out",
    level: "A1",
    body: `Yesterday there was a big storm in our town. At eight o'clock in the evening, the lights went out in every house on our street.

What was everybody doing at that moment? I was cooking dinner. My husband was watching a film, and our son was doing his homework on the computer. Our neighbour Olga was taking a shower!

For the next hour, we sat in the kitchen with candles and talked. It was actually a nice evening.`,
    questions: [
      { statement: "The writer's son was watching a film.", answer: false },
      { statement: "The power went off at eight in the evening.", answer: true },
      { statement: "The family had a terrible evening because of the storm.", answer: false },
    ],
  },
  {
    title: "A Call During Lunch",
    level: "A1",
    body: `On Tuesday, I was having lunch in a café when my phone rang. It was Dan, our team lead. "The website isn't working," he said.

I ran back to the office. When I arrived, two developers were looking at the logs, and Dan was talking to the client.

While we were checking the server, I noticed something strange. Somebody was running a very big report on the database. We stopped the report, and the website started working again.`,
    questions: [
      { statement: "The writer was at the office when Dan called.", answer: false },
      { statement: "A big report on the database caused the problem.", answer: true },
      { statement: "After the team stopped the report, the website worked again.", answer: true },
    ],
  },
  {
    title: "Where Are My Keys?",
    level: "A1",
    body: `Oh no! I've lost my keys. I've looked in my bag and in the pockets of my jeans. I've checked the kitchen and the bathroom too, but I can't find them anywhere.

My flatmate has come home, and now she's helping me. She has looked under the sofa and behind the door. Nothing.

Wait! She has found them. They were in my jacket all the time! It has a lot of pockets, and I forgot about that one.`,
    questions: [
      { statement: "The writer has already checked the bag.", answer: true },
      { statement: "The keys were under the sofa.", answer: false },
      { statement: "The flatmate found the keys.", answer: true },
    ],
  },
  {
    title: "Ready for the Release?",
    level: "A1",
    body: `Hi Kate,

Here is a quick update on Friday's release. We've already fixed the two bugs from the last test, and Tom has just finished the new search page. The designers have checked it, and they like it.

But we haven't updated the documentation yet, and the testers haven't checked the payment page yet. I've already asked Anna to help them.

I can send you another update tomorrow.

Best,
Mark`,
    questions: [
      { statement: "The team has already updated the documentation.", answer: false },
      { statement: "Tom has completed the new search page.", answer: true },
      { statement: "The testers have finished their work on the payment page.", answer: false },
    ],
  },
  {
    title: "Have You Ever…?",
    level: "A1",
    body: `Last week I had a job interview. The interviewer asked me a lot of "Have you ever…?" questions.

"Have you ever worked with large databases?" Yes, I have. "Have you ever led a team?" No, I haven't, but I've helped new developers many times. "Have you ever made a big mistake in production?"

I told the truth. Once I deleted some important data. We got it back from a backup, but I've never forgotten that day. The interviewer smiled. "Good answer," she said.`,
    questions: [
      { statement: "The writer has never been a team leader.", answer: true },
      { statement: "The deleted data was lost forever.", answer: false },
      { statement: "The interviewer didn't like the answer about the mistake.", answer: false },
    ],
  },
  {
    title: "My Neighbour Peter",
    level: "A1",
    body: `Last weekend I met my neighbour, Peter. He's eighty years old and very friendly.

"How long have you lived in this house?" I asked. "For fifty years," he said. "My wife and I have been married for fifty-five years."

Peter has a small dog and a big garden with apple trees. "How long have you had the dog?" I asked. "Only two years. He's young, but he's my best friend."

I've lived here for three months, and I already feel at home.`,
    questions: [
      { statement: "Peter's dog is very old.", answer: false },
      { statement: "Peter has lived in his house for half a century.", answer: true },
      { statement: "The writer already feels at home in the new place.", answer: true },
    ],
  },
  {
    title: "Six Months of English",
    level: "A1",
    body: `I got my first job in IT three years ago. I was a tester then. A year ago, I moved to the development team, and I've been a developer since then.

I started learning English in May, so I've studied it for six months now. I have a lesson every Tuesday.

My English isn't perfect, but things are easier now. Two weeks ago, I spoke to a client in English for the first time. I was nervous, but it went well.`,
    questions: [
      { statement: "The writer started in IT as a developer.", answer: false },
      { statement: "The writer has worked in IT for three years.", answer: true },
      { statement: "The first call with a client in English went badly.", answer: false },
    ],
  },
  {
    title: "What's New This Month",
    level: "A1",
    body: `Our app has changed a lot this month. Here is what we've done.

We've added a dark theme. Many users asked for it last year, and now it's finally here. We've also made the app faster: the main page now opens in one second.

There was a problem with notifications in the last version. Some users didn't get any messages for two days. We found the reason on Monday and fixed it the same day.

Have you tried the new version yet? Tell us what you think!`,
    questions: [
      { statement: "The main page opens more slowly now.", answer: false },
      { statement: "Users wanted a dark theme before this month.", answer: true },
      { statement: "The notification problem was fixed on the day the team found it.", answer: true },
    ],
  },
  {
    title: "From Bean to Cup",
    level: "A1",
    body: `Coffee is drunk all over the world, but where does it come from? It is grown in hot countries, such as Brazil and Ethiopia.

The coffee fruit is often picked by hand, and the beans are dried in the sun. Then they are sent to other countries by ship. The beans are usually roasted in the country where they are sold, because fresh coffee tastes better.

Finally, the beans are ground, and the coffee is made — in your kitchen or in a café. More than two billion cups are drunk every day.`,
    questions: [
      { statement: "Coffee is grown in cold countries.", answer: false },
      { statement: "The beans are dried in the sun.", answer: true },
      { statement: "Fresh coffee usually tastes better.", answer: true },
    ],
  },
  {
    title: "Our Office Is Changing",
    level: "A1",
    body: `Hi everyone,

As you know, our office is being renovated this month. Here is a short update.

The kitchen has already been finished, and a new coffee machine has been installed. The meeting rooms on the first floor are being painted this week, so please book a room on the second floor for your meetings.

New chairs have been ordered, but they haven't been delivered yet. Until then, the old chairs are being used. Sorry about the noise — the work is being done as quickly as possible.

Thanks,
Lena`,
    questions: [
      { statement: "The kitchen is still being renovated.", answer: false },
      { statement: "Some meeting rooms can't be used this week.", answer: true },
      { statement: "The new chairs have already arrived.", answer: false },
    ],
  },
  {
    title: "A Rainy Saturday",
    level: "A1",
    body: `It was raining on Saturday morning, and my daughter was bored. "What do you want to do?" I asked.

"I don't know. Is the museum open today?" she said.

"Yes, it is, but we were there last month. Have you finished your book?"

"No, I haven't. It's boring." Then she had an idea. "Do we have any flour and eggs? Can we make a cake?"

We didn't have any eggs, so I went to the shop and bought some. We baked the cake together, and it was delicious.`,
    questions: [
      { statement: "It was sunny on Saturday morning.", answer: false },
      { statement: "The writer bought eggs for the cake.", answer: true },
      { statement: "The daughter is enjoying her book.", answer: false },
    ],
  },
  {
    title: "A Weekend in the Mountains",
    level: "A1",
    body: `Last summer, my friend Sam and I went to the mountains for a weekend. We took the train on Friday and slept in a small hotel.

On Saturday, we got up early and walked for six hours. We saw a lake, climbed a hill and ate our sandwiches at the top. The view was amazing.

On the way down, it began to rain. We didn't have umbrellas, so we got very wet. But we found a little café, drank hot tea and laughed about it.

I've been to many places, but that weekend is still my favourite.`,
    questions: [
      { statement: "The weather was good all day on Saturday.", answer: false },
      { statement: "The friends travelled to the mountains by train.", answer: true },
      { statement: "They had umbrellas with them.", answer: false },
    ],
  },
  {
    title: "Plans for Next Week",
    level: "A2",
    body: `Hi Tom,

Next week is very busy for our team, so here is the plan.

On Monday, we're meeting the new client at ten o'clock. Anna is showing them the demo, and I'm answering their questions about the timeline. On Tuesday, two new developers are starting, and Max is helping them with their laptops and accounts.

I'm not working on Wednesday, because my sister is getting married. What are you doing on Thursday? Are you coming to the office? We're having a small party for Max's birthday after work.

Best,
Kate`,
    questions: [
      { statement: "The new developers are starting on Monday.", answer: false },
      { statement: "Kate is taking Wednesday off.", answer: true },
      { statement: "The party on Thursday is in the morning.", answer: false },
      { statement: "Anna is giving the demo at the client meeting.", answer: true },
    ],
  },
];
