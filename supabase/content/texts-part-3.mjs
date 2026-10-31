// Reading texts 39–51 (A2), one per grammar unit in Murphy order.

export const TEXTS = [
  // 39 — It …
  {
    title: "A Windy Day by the Sea",
    level: "A2",
    body: `It was Saturday, and it was sunny in the morning, so Anna and her brother Tom decided to go to the sea. It is about forty kilometres from their town. It usually takes an hour by car, but that day it took almost two because of the traffic.

When they arrived, it was cold and very windy. "It's hard to believe that it was warm at breakfast," Tom said. They walked along the beach for a while. It was nice to watch the waves, but after half an hour it started to rain.

They found a small café near the beach. It was warm and quiet inside, and the fish soup was excellent. "The weather doesn't matter," Anna said. "It was a good day."`,
    questions: [
      { statement: "The sea is very close to Anna and Tom's town.", answer: false },
      { statement: "The trip took longer than usual because of the traffic.", answer: true },
      { statement: "It was warm and sunny when they arrived at the beach.", answer: false },
      { statement: "Anna liked the day, although the weather was bad.", answer: true },
    ],
  },
  // 40 — I am, I don't etc.
  {
    title: "Not a Morning Person",
    level: "A2",
    body: `Kate and Leo work in the same team, but they are very different. Kate is a morning person. Leo isn't. Kate starts work at seven, and Leo doesn't start before ten.

Kate likes meetings, but Leo doesn't. Leo can work for hours without a break, but Kate can't. She needs a short walk every hour.

When the team lead asked, "Who wants to give the demo on Friday?", Kate said, "I do!" Leo didn't say anything. But when the system went down on Sunday night, Leo was online in five minutes. Kate wasn't. She was asleep.

"Are you angry with me?" she asked on Monday. "No, I'm not," Leo laughed. "We're a good team. You do the talking, and I do the night shifts."`,
    questions: [
      { statement: "Leo can't work for long without a break.", answer: false },
      { statement: "Kate offered to give the demo.", answer: true },
      { statement: "Leo was angry with Kate on Monday.", answer: false },
      { statement: "Leo starts work later than Kate.", answer: true },
    ],
  },
  // 41 — Have you? Are you? Don't you?
  {
    title: "An Old Friend at the Station",
    level: "A2",
    body: `Last week I met my old school friend Sam at the station. It was our first meeting in ten years, so we went for a coffee.

"I live in Berlin now," Sam said. "Do you? How long have you lived there?" I asked. "Five years. I'm a chef in a restaurant." "Are you? But you hated cooking at school!" "I know. People change. And I've got two children now." "Have you? That's wonderful!"

Then it was my turn. "I play the guitar in a band," I said. "Do you? I play too. We should play together some time."

Sam's train left at six, so we didn't have much time. But we exchanged numbers, and he's coming to visit me in May.`,
    questions: [
      { statement: "Sam didn't like cooking when he was at school.", answer: true },
      { statement: "The writer and Sam see each other often.", answer: false },
      { statement: "Sam is going to visit the writer.", answer: true },
      { statement: "Sam doesn't have any children.", answer: false },
    ],
  },
  // 42 — so am I / neither do I
  {
    title: "Neither Do I",
    level: "A2",
    body: `Ella met Mark through a friend, and they went to a small Italian restaurant for their first date.

"I love pasta," said Mark. "So do I," said Ella. "I don't eat meat," she added. "Neither do I," he answered. They were both surprised.

It continued all evening. Mark didn't like football, and neither did Ella. Ella was learning Spanish, and so was Mark. "I've never been to Spain," she said. "Neither have I!" Mark could play the piano, and so could Ella.

Then the waiter brought the dessert menu. "I'm going to have the chocolate cake," said Ella. "I'm not," said Mark. "I hate chocolate." Ella looked at him for a long moment, and then she laughed. "Good. Finally something different. I was starting to worry."`,
    questions: [
      { statement: "Ella has been to Spain.", answer: false },
      { statement: "Neither Mark nor Ella eats meat.", answer: true },
      { statement: "Ella was happy to find something different about Mark.", answer: true },
      { statement: "Mark wanted the chocolate cake too.", answer: false },
    ],
  },
  // 43 — negatives
  {
    title: "What Didn't Work",
    level: "A2",
    body: `On Tuesday our new release didn't go well. The app didn't crash, but users couldn't log in for about forty minutes. Here is what happened.

The change wasn't big, just a few lines in the login service. Two people reviewed it, but nobody tested it with real accounts. Our tests didn't catch the problem, because they don't use real data. We haven't got an alert for failed logins, so we didn't notice anything for twenty minutes. A customer told us first.

We aren't going to blame anyone. That isn't how we work. But we are going to make some changes. We'll add the alert this week, and nobody will release a login change without testing it with a real account first.`,
    questions: [
      { statement: "The team learned about the problem from a customer.", answer: true },
      { statement: "The app stopped working completely and crashed.", answer: false },
      { statement: "The team wants to find the person who made the mistake and blame them.", answer: false },
      { statement: "The tests didn't use real data.", answer: true },
    ],
  },
  // 44 — questions 1
  {
    title: "The Online Interview",
    level: "A2",
    body: `Lena had her first job interview in English last week. She applied for a junior developer job. The interview was online, and it was an hour long.

First, the manager asked some easy questions. "Are you working at the moment? Have you used Python before? Do you like working in a team?" Lena answered them without problems.

Then the questions got harder. "Can you explain this code? Why did you choose this solution? Is there a faster way?" Lena was nervous, but she thought about each question carefully.

At the end, the manager said, "Do you have any questions for us?" Lena did. "Is the job remote? Will I have a mentor? When will I hear from you?" The manager smiled. The answers were: no, yes, and on Friday.`,
    questions: [
      { statement: "The interview was at the company's office.", answer: false },
      { statement: "The second part of the interview was more difficult for Lena.", answer: true },
      { statement: "Lena didn't have any questions for the manager.", answer: false },
      { statement: "The job isn't remote.", answer: true },
    ],
  },
  // 45 — Who saw you? Who did you see?
  {
    title: "Who Ate My Lunch?",
    level: "A2",
    body: `There are two fridges in our office kitchen: one for personal food and one for food for everybody. On Monday Daniel was in a hurry, and he put his lunch, a big box of his mother's pasta, in the wrong one.

At one o'clock he opened the fridge. The box was there, but it was empty. "Who ate my lunch?" he asked the room. Nobody answered. "Who did you see in the kitchen?" he asked Rita. "I saw Paul and Mark," she said.

Daniel went to Paul. "Did you eat my pasta?" "No! Who told you that?" Paul asked. "I only made tea." Mark only made tea too.

Then a message came in the team chat from Olga, the team lead: "Who brought the pasta? It was delicious. Thanks for sharing!" Now Daniel writes his name on everything.`,
    questions: [
      { statement: "Rita saw two people in the kitchen.", answer: true },
      { statement: "Paul ate Daniel's pasta.", answer: false },
      { statement: "Daniel put his box in the right fridge.", answer: false },
      { statement: "Olga thought the pasta was for everybody.", answer: true },
    ],
  },
  // 46 — Who is she talking to? What is it like?
  {
    title: "What Is the City Like?",
    level: "A2",
    body: `Two months ago Jonas moved from a small village to a big city. Now everybody at home asks him questions.

"What is the city like?" his grandmother asks on the phone every Sunday. "It's big and noisy," he says, "but it's never boring."

"What's your flat like?" asks his sister. It's small, and the kitchen window looks out on a park. "Who do you live with?" she wants to know. He shares the flat with a student called Pedro. "What does he study?" Medicine. "And what is he like?" Friendly, but he talks too much in the morning.

His best friend asks: "Who do you go out with? What do you do at weekends?" Jonas doesn't have an answer. "What are you waiting for?" his friend says. "Join a club!" Last week Jonas did. It's a hiking club.`,
    questions: [
      { statement: "Jonas's flatmate studies medicine.", answer: true },
      { statement: "Jonas lives alone.", answer: false },
      { statement: "Jonas joined a club recently.", answer: true },
      { statement: "Jonas thinks the city is boring.", answer: false },
    ],
  },
  // 47 — What …? Which …? How …?
  {
    title: "Which Bike?",
    level: "A2",
    body: `Ana wants a bike for getting to work. She's tired of the crowded bus. On Saturday she went to a bike shop.

"What kind of bike are you looking for?" the shop assistant asked. "Something simple," Ana said. "How much is that blue one?" "Four hundred euros." That was too expensive.

Then he showed her two other bikes. "Which one is lighter?" she asked. "The green one. But the black one is stronger." "And which is more comfortable?" He smiled. "Try them and see."

Ana rode both bikes around the car park. The black one was heavier, but it felt safer. "How long is the guarantee?" she asked. "Two years." "Then I'll take the black one." She paid two hundred and eighty euros and rode it home. It took twenty minutes, which is faster than the bus.`,
    questions: [
      { statement: "Ana bought the blue bike.", answer: false },
      { statement: "The green bike is lighter than the black one.", answer: true },
      { statement: "Ana tried the bikes before she chose one.", answer: true },
      { statement: "The ride home took longer than the bus.", answer: false },
    ],
  },
  // 48 — How long does it take …?
  {
    title: "How Long Will It Take?",
    level: "A2",
    body: `"How long will it take?" Every developer hears this question. Last month our manager, Irina, asked me about a new search feature. "Two days," I said. It took two weeks.

What went wrong? I only thought about writing the code. How long does it take to write tests? About as long as the code. How long does a code review take? In our team, often a day or two. And how long does it take to fix the bugs that the testers find? Nobody knows.

Now I estimate differently. I break the task into small parts and ask, "How long will this part take?" for each one. Then I add them up and add a little extra. Last week it took me an hour just to make the plan, but my estimate was right: four days.`,
    questions: [
      { statement: "The search feature took much longer than the writer said.", answer: true },
      { statement: "At first, the writer remembered to include time for tests.", answer: false },
      { statement: "In the writer's team, a code review can take a day or more.", answer: true },
      { statement: "The writer's latest estimate was wrong again.", answer: false },
    ],
  },
  // 49 — Do you know where …?
  {
    title: "Lost at the Station",
    level: "A2",
    body: `Last summer Olga travelled to the coast by train. At the huge station in the capital, she got lost almost immediately.

She stopped a man in a uniform. "Excuse me, do you know where platform twelve is?" But he didn't understand English. Then she asked a woman with a suitcase. "Sorry, I don't know where it is. I'm not from here either."

At the information desk, Olga asked, "Could you tell me what time the train to the coast leaves?" "At a quarter past ten."

Now she had another problem. Two trains were waiting at platform twelve, and she didn't know which one was hers. "Do you know if this train goes to the coast?" she asked a young man. "I hope so," he laughed. "I'm going there too." They sat together and talked all the way.`,
    questions: [
      { statement: "The man in the uniform helped Olga find the platform.", answer: false },
      { statement: "The woman with the suitcase didn't know the station well.", answer: true },
      { statement: "Olga found out the time of her train at the information desk.", answer: true },
      { statement: "Olga didn't talk to anyone on the train.", answer: false },
    ],
  },
  // 50 — reported speech
  {
    title: "What the Reviewer Said",
    level: "A2",
    body: `Last week I sent my first big pull request to Martin, our most experienced developer.

The next morning I saw twenty comments from him. I was upset at first, so I told my mentor, Sara, about it. She asked me what kind of comments they were.

Martin said that my code was clean and easy to read. He told me that two functions were too long and that I should split them. He also said that I didn't need a new library for dates, because we already had one.

Sara laughed. She said that twenty comments was normal for a first pull request. She told me that Martin left even more comments on her first one. I fixed everything in a day, and then Martin approved my code. He said that it was ready, and he added two words: "Good work."`,
    questions: [
      { statement: "The writer felt good about the comments at first.", answer: false },
      { statement: "Martin thought the code was easy to read.", answer: true },
      { statement: "The team didn't have a library for dates.", answer: false },
      { statement: "Martin approved the code after the writer made the changes.", answer: true },
    ],
  },
  // 51 — work/working, go/going, do/doing
  {
    title: "Learning to Cook",
    level: "A2",
    body: `A year ago I couldn't cook at all. I didn't even know how to boil an egg properly. I ate in cafés or ordered food every evening.

Then my flatmate moved out, and I had to do something. I bought a simple cookbook and started with soup. My first soup wasn't very good, but I ate it anyway. I cooked almost every evening that winter, and slowly it got better.

Now I can make about thirty dishes, and I've learned to bake bread too. Last weekend I invited six friends and cooked a three-course dinner for them. They didn't believe that I did it all myself.

What's next? I'm going to take a class in Thai cooking. I'll probably make a lot of mistakes, but that's part of learning. My advice? Don't wait. Buy some vegetables and start with soup.`,
    questions: [
      { statement: "A year ago the writer cooked dinner every evening.", answer: false },
      { statement: "The writer's friends found it hard to believe that the writer cooked the dinner without help.", answer: true },
      { statement: "The writer's first soup was perfect.", answer: false },
      { statement: "The writer wants to learn a new kind of cooking.", answer: true },
    ],
  },
];
