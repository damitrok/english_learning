// Reading texts 52–64 (A2). Each text goes with the grammar unit of the same
// number and uses that unit's structures naturally.

export const TEXTS = [
  {
    title: "Climbing on Thursdays",
    level: "A2",
    body: `Last year I spent too much time at my computer. I wanted to do something different after work, but I didn't know what. I don't enjoy running, and I hate swimming in cold water.

One evening my friend Nina invited me to a climbing gym. I agreed to go with her, but I was nervous.

At first I couldn't climb more than two metres. My arms hurt, and I wanted to give up. Nina said that everybody finds it hard at the start.

Now I go there every Thursday. I really enjoy solving each wall like a small puzzle, and I've stopped thinking about work in the evenings. I'm learning to use my legs more than my arms.

Next year I hope to climb outside on real rocks. And I don't mind falling any more — the rope always catches me.`,
    questions: [
      { statement: "The writer now goes climbing once a week.", answer: true },
      { statement: "At first the writer found climbing easy.", answer: false },
      { statement: "The writer first went to the climbing gym with Nina.", answer: true },
      { statement: "The writer is still afraid of falling.", answer: false },
    ],
  },
  {
    title: "Too Many Requests",
    level: "A2",
    body: `On Monday my team lead, Paula, asked me to fix a bug on the payment page. An hour later the product manager wrote to me. He wanted me to finish a new report for the client by Wednesday. Then the designer asked me to check her new screens.

I tried to do everything at once, and by Tuesday nothing was finished. I felt terrible. My friend Dan, also a team lead, told me to stop and talk to Paula.

The next day I showed Paula my list. She didn't want me to work all night. She told me to fix the bug first, and she asked the product manager to wait until Friday for the report. She also told the designer to send her screens to another developer.

Now I don't say yes to every request straight away. I want people to know my plans first.`,
    questions: [
      { statement: "Paula wanted the writer to work late and finish everything.", answer: false },
      { statement: "The writer tried to do all the tasks at the same time.", answer: true },
      { statement: "The writer had to check the designer's screens in the end.", answer: false },
      { statement: "The report for the client was moved to Friday.", answer: true },
    ],
  },
  {
    title: "A Morning of Errands",
    level: "A2",
    body: `On Saturday I got up early because I had a lot of small jobs to do. First, I went to the bank to pay a bill. The queue inside was very long, so I used the machine outside.

Then I went to the post office to send a birthday present to my cousin in Canada. After that, I walked to the market to buy vegetables for the week.

Later I met my neighbour Olga in the street. She was going to the park to walk her dog, so I went with her to have a short rest. We sat on a bench and talked for half an hour.

When I got home, I opened the fridge to put the vegetables inside, and I saw that we had no milk. I completely forgot to buy it! So I went out again to buy some at the shop on the corner.`,
    questions: [
      { statement: "The writer sent a present to a family member.", answer: true },
      { statement: "The writer paid the bill inside the bank.", answer: false },
      { statement: "The writer remembered to buy everything on the first trip.", answer: false },
      { statement: "Olga and the writer went to the park together.", answer: true },
    ],
  },
  {
    title: "A Week by the Lake",
    level: "A2",
    body: `Every summer my family goes on holiday to a small village by a lake. We don't go abroad — it's only three hours by car, and the children love it.

In the mornings we usually go swimming before breakfast, when the water is still calm. My husband often goes fishing with our son, but they almost never catch anything. My daughter and I prefer to go for a long walk in the forest.

Twice a week we go to the market in the next town. We go shopping there for fresh bread, cheese and fruit. On the last day we always go on a boat trip around the lake.

This year it rained for three days, so we couldn't go out much. We went to the cinema once and played cards at home. But it was still a lovely holiday, and we're already planning to go back next summer.`,
    questions: [
      { statement: "The family buys food at a market in another town.", answer: true },
      { statement: "The family travels to another country every summer.", answer: false },
      { statement: "The rain didn't spoil the holiday.", answer: true },
      { statement: "The father and son usually catch a lot of fish.", answer: false },
    ],
  },
  {
    title: "The Day the Site Went Down",
    level: "A2",
    body: `I got to the office at nine and made a coffee. Five minutes later I got a message from a customer: our website wasn't working. I checked it, and she was right. Soon I was getting more messages, and the situation got worse every minute.

My colleague Omar got in at half past nine. Together we looked at the logs and found the problem: the server didn't have any free disk space. Some old log files were huge. Omar deleted them, and slowly the site got back to normal.

By lunch everything was fine, but I was getting tired, and I had a headache. My manager told me to get some rest, so I left at four.

I got home, got into bed and slept for two hours. The next morning I got an email from our boss. He thanked Omar and me, and he promised to get a better monitoring tool.`,
    questions: [
      { statement: "The site stopped working because of a bug in new code.", answer: false },
      { statement: "The first message about the problem came from a customer.", answer: true },
      { statement: "The boss thanked Omar and the writer the next day.", answer: true },
      { statement: "The writer stayed at work late that day.", answer: false },
    ],
  },
  {
    title: "Learning From Mistakes",
    level: "A2",
    body: `In my first year as a developer, I made a lot of mistakes. Once I made a change on the main branch, and the whole team couldn't work for an hour. I felt awful, but my team lead didn't get angry. Instead, she asked me to do some research and make a short list of team rules.

Now we have a few simple rules. Nobody makes changes without a code review. We do reviews every afternoon, and each review must be done in one day. Before big decisions, we make a plan together.

I still make mistakes, of course. Everybody does. But now I do my best to learn from them. When I make a mistake, I write it down and think about what I can do differently next time.

Last month a new developer joined us and made exactly the same mistake. I made him a cup of tea and told him my story.`,
    questions: [
      { statement: "The writer helped to create rules for the team.", answer: true },
      { statement: "The team lead got angry with the writer.", answer: false },
      { statement: "The writer told the new developer about a similar mistake.", answer: true },
      { statement: "Developers on the team can now change code without a review.", answer: false },
    ],
  },
  {
    title: "Lunch With My Sister",
    level: "A2",
    body: `On Sundays I usually have a long, slow morning. I have breakfast at ten, have a shower and read the news. But last Sunday was different: my sister Anna invited me for lunch.

Anna and her husband have a small house outside the city. They have two cats and a big garden. In spring they also had a baby, a little boy called Max, so the house is never quiet now.

We had lunch in the garden because the weather was warm. Anna made soup and a cake. After lunch, her husband had a rest, and Anna and I had a long chat about our parents. Then I had a look at the baby's room — it's yellow and full of toys.

I had a great time. I don't have any children yet, but I thought about it a lot on the way home. Maybe one day I'll have a noisy house too.`,
    questions: [
      { statement: "Anna lives in a flat in the city centre.", answer: false },
      { statement: "They ate lunch outside.", answer: true },
      { statement: "The writer already has two children.", answer: false },
      { statement: "Anna and her husband have a young son.", answer: true },
    ],
  },
  {
    title: "The New Guy",
    level: "A2",
    body: `Last week a new developer joined our team. His name is Liam, and he comes from Ireland. On his first day I met him at the door and showed him the office. He asked me lots of questions, and I tried to answer them all.

Our team has a tradition: on Fridays we all have lunch together. I invited Liam, and he came with us. The others liked him immediately. They asked him about Ireland, and he told them funny stories about his hometown.

Liam is very good at testing. On Monday the testers asked him to help them with a difficult problem, and he found the answer in an hour. They were really happy with him.

Now he sits next to me, and we often work together. Sometimes he helps me, and sometimes I help him. I think he likes it here. Yesterday he told us that he enjoys working with us.`,
    questions: [
      { statement: "The testers were not pleased with Liam's help.", answer: false },
      { statement: "Liam started working on the team last week.", answer: true },
      { statement: "Nobody invited Liam to the Friday lunch.", answer: false },
      { statement: "Liam and the writer help each other.", answer: true },
    ],
  },
  {
    title: "An Old Family Photo",
    level: "A2",
    body: `On my desk there is an old family photo. It was taken twenty years ago at my grandparents' house. The house isn't there any more, but I still remember its big green door.

In the middle are my grandparents. My grandfather is wearing his favourite brown hat, and my grandmother is holding their dog, Rex.

On the left are my parents. My mother has long hair in the photo — now her hair is short and grey. My father is laughing, and his glasses are on top of his head. On the right are my uncle and aunt with their son, Tom, my favourite cousin.

I'm the small girl at the front with a red ball. My brother is next to me. His face is dirty because he didn't want to wash it that morning.

Our family is bigger now, and we live in different cities. But every time I look at this photo, I feel at home.`,
    questions: [
      { statement: "The writer's mother looks different now.", answer: true },
      { statement: "The writer's grandmother is holding a cat in the photo.", answer: false },
      { statement: "The whole family still lives in one city.", answer: false },
      { statement: "The writer is the girl with the red ball.", answer: true },
    ],
  },
  {
    title: "Whose Charger Is This?",
    level: "A2",
    body: `Every Friday our office manager, Rita, checks the meeting rooms, and every Friday she finds things that people have left behind. This week she put them all on the kitchen table and sent us a message: "Whose things are these? Please take yours home!"

There were three phone chargers, an umbrella, two mugs and a blue scarf. I recognised one of the chargers at once — it was mine. I lost it on Tuesday. The umbrella was Mark's — he forgot it after the rain on Monday.

Nobody knew whose scarf it was. Rita asked Elena, "Is it yours?" But Elena said, "No, it isn't mine. Mine is green." Later Jonas came in and said, "Oh, that's my wife's! She visited the office on Wednesday."

The mugs were a problem. They both had cats on them, and two people said, "That one's mine!" In the end, Rita wrote names on them. Now everybody can see whose mug is whose.`,
    questions: [
      { statement: "Elena's scarf is blue.", answer: false },
      { statement: "One of the chargers belonged to the writer.", answer: true },
      { statement: "Nobody wanted the two mugs.", answer: false },
      { statement: "The scarf belonged to Jonas's wife.", answer: true },
    ],
  },
  {
    title: "Sharing a Flat",
    level: "A2",
    body: `When I moved to the city, I rented a flat with my friend Kira. It was cheaper for both of us. My room is small and hers is bigger, so she pays a little more. That seems fair to me.

At first we had problems. Kira used my plates, and I used her shampoo. Once she ate my cheese and said, "Sorry, I thought it was mine!" I wasn't angry with her, but we decided to make some rules.

Now each of us has a shelf in the fridge: the top one is mine and the bottom one is hers. The pots and pans are ours, so we both use them. We clean together on Sundays. She does the bathroom, and I do the kitchen.

Kira is a great flatmate. She often makes dinner for me when I work late, and I help her with her English homework. Last month her parents visited and brought us a big cake. It was delicious.`,
    questions: [
      { statement: "The writer and Kira each have their own shelf in the fridge.", answer: true },
      { statement: "Kira's room is smaller than the writer's.", answer: false },
      { statement: "Kira sometimes cooks for the writer.", answer: true },
      { statement: "The writer got very angry about the cheese.", answer: false },
    ],
  },
  {
    title: "Teaching Myself English",
    level: "A2",
    body: `I never studied English at school — I learned German there. So when I started working in IT, I had to teach myself. I bought a grammar book and worked through it by myself, one unit a day.

At first I was angry with myself all the time. I couldn't understand films, and I was afraid to speak. In meetings I often asked myself, "What did he just say?" My colleagues were kind, but I wanted to understand them myself, without help.

Then a friend gave me some advice: "Don't push yourself too hard. Enjoy yourself!" So I started watching my favourite series in English and reading blogs about programming. Slowly it became easier.

Now I can talk to clients and write documentation myself. Last month two new colleagues asked me how to learn English, and I told them to be patient and to believe in themselves. They're studying by themselves now, and sometimes we practise together. So remember: you can do it yourself too.`,
    questions: [
      { statement: "The writer worked through a grammar book without a teacher.", answer: true },
      { statement: "The writer studied English at school.", answer: false },
      { statement: "The writer gave some advice to two new colleagues.", answer: true },
      { statement: "A friend told the writer to study harder and stop having fun.", answer: false },
    ],
  },
  {
    title: "My Brother's Wedding",
    level: "A2",
    body: `Last Saturday was my brother's wedding. His name is Pavel, and his wife's name is Sofia. The wedding was at Sofia's parents' house in the country. They have a beautiful garden, perfect for a party.

I came early to help: my job was to look after the children. My cousin's twins, Lena and Mia, are five, and they were very excited. At one point they disappeared, and I found them in the kitchen next to the cook's big chocolate cake! Luckily, they only ate a little piece.

The bride's dress was simple and white. She wore her grandmother's old ring because it was very special to her.

In the evening Pavel's friends from work sang a funny song about him. Everybody laughed, even Sofia's quiet father. The party ended after midnight.

A week later I looked at the photographer's pictures. I was in almost every one of them, always with two little girls next to me.`,
    questions: [
      { statement: "The writer's job at the wedding was to take photos.", answer: false },
      { statement: "The wedding took place at the bride's parents' house.", answer: true },
      { statement: "Sofia wore a ring that was her grandmother's.", answer: true },
      { statement: "The twins ate the whole cake.", answer: false },
    ],
  },
];
