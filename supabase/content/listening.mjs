// Listening material for step 3.
// DIALOGUES are written for this app (A1–A2 workplace situations) and voiced by
// the browser's speech synthesis, one voice per speaker. The transcript is exact,
// so shadowing can be checked word by word.
// VIDEOS are external extra listening (B2, native speed, no transcript). Every
// video ID below was checked to exist via YouTube's oEmbed endpoint before adding.

const line = (speaker, text) => ({ speaker, text });

export const DIALOGUES = [
  {
    title: "Good Morning, Team",
    level: "A1",
    lines: [
      line("Anna", "Good morning, everyone. Let's start the standup."),
      line("Tom", "Hi! Yesterday I fixed the login bug."),
      line("Tom", "Today I'm writing tests for it."),
      line("Anna", "Great. Do you have any problems?"),
      line("Tom", "No, everything is fine."),
      line("Anna", "Thanks, Tom. Maria, what about you?"),
      line("Maria", "I'm working on the new search page. I need help with the API."),
      line("Anna", "OK, let's talk after the meeting."),
    ],
  },
  {
    title: "A New Colleague",
    level: "A1",
    lines: [
      line("Sam", "Hi, I'm Sam. I'm the new developer."),
      line("Lena", "Nice to meet you, Sam. I'm Lena. I'm a tester."),
      line("Sam", "Nice to meet you too. Which team are you in?"),
      line("Lena", "I'm in the mobile team. We make the Android app."),
      line("Sam", "Cool! I work on the backend."),
      line("Lena", "Great. Do you want a coffee?"),
      line("Sam", "Yes, please. Where is the kitchen?"),
      line("Lena", "It's next to the meeting room. Come with me."),
    ],
  },
  {
    title: "A Slow Laptop",
    level: "A1",
    lines: [
      line("Kate", "Hi, Mike. Can you help me? My laptop is very slow."),
      line("Mike", "Sure. What programs are open?"),
      line("Kate", "Only the browser and the code editor."),
      line("Mike", "How many tabs do you have in the browser?"),
      line("Kate", "Hmm, about fifty."),
      line("Mike", "That's the problem! Close some tabs."),
      line("Kate", "Oh, you're right. Now it's much faster. Thanks!"),
    ],
  },
  {
    title: "Working from Home",
    level: "A1",
    lines: [
      line("Dan", "Hi, Emma! Are you in the office today?"),
      line("Emma", "No, I'm working from home."),
      line("Dan", "Lucky you! Is it quiet at home?"),
      line("Emma", "Yes, very quiet. But I miss my colleagues."),
      line("Dan", "Do you want to join our call at eleven?"),
      line("Emma", "Sure. Send me the link, please."),
      line("Dan", "OK, I'm sending it now."),
    ],
  },
  {
    title: "Code Review",
    level: "A2",
    lines: [
      line("Alex", "Hi, Nina. Did you look at my pull request?"),
      line("Nina", "Yes, I did. The code is good, but I have two comments."),
      line("Alex", "Sure. What are they?"),
      line("Nina", "First, the function is too long. Can you split it into two?"),
      line("Alex", "OK. And the second one?"),
      line("Nina", "There are no tests for the new feature."),
      line("Alex", "You're right. I'll add them today."),
      line("Nina", "Great. Then I'll approve it."),
    ],
  },
  {
    title: "Planning the Sprint",
    level: "A2",
    lines: [
      line("Olga", "OK, team, let's plan the next sprint. We have ten tasks in the backlog."),
      line("Ivan", "The payment bug is the most important. Users can't pay by card."),
      line("Olga", "I agree. Ivan, can you take it?"),
      line("Ivan", "Yes. I think it'll take two days."),
      line("Sara", "I can work on the new profile page."),
      line("Olga", "Good. Is the design ready?"),
      line("Sara", "Not yet. The designer will send it on Monday."),
      line("Olga", "Fine. Let's start with the bug and the tests."),
    ],
  },
  {
    title: "A Call with a Client",
    level: "A2",
    lines: [
      line("Peter", "Hello, this is Peter from Green Shop. Our website isn't working."),
      line("Julia", "Hello, Peter. I'm sorry to hear that. What do you see on the screen?"),
      line("Peter", "When I click Buy, I see an error message."),
      line("Julia", "Can you send me a screenshot, please?"),
      line("Peter", "Yes, I'm sending it now."),
      line("Julia", "Thank you. I can see the problem. We'll fix it in an hour."),
      line("Peter", "Great. Please call me when it's ready."),
      line("Julia", "Of course. I'll call you as soon as it works."),
    ],
  },
  {
    title: "The Server Is Down",
    level: "A2",
    lines: [
      line("Max", "Is the website down? I can't open it."),
      line("Olga", "Yes. We got an alert five minutes ago."),
      line("Max", "What happened?"),
      line("Olga", "The database stopped responding. I'm restarting it now."),
      line("Max", "Can I help?"),
      line("Olga", "Yes, please check the logs and tell me if you see any errors."),
      line("Max", "OK. I see a lot of timeout errors."),
      line("Olga", "Thanks. The database is running again. Let's watch it for ten minutes."),
    ],
  },
  {
    title: "Asking for Help",
    level: "A2",
    lines: [
      line("Chris", "Sorry to bother you, Anna. Do you have a minute?"),
      line("Anna", "Sure, what's up?"),
      line("Chris", "I don't understand this error. The tests pass on my laptop, but they fail on the server."),
      line("Anna", "Did you check the versions? Maybe the server uses an old version of Node."),
      line("Chris", "Hmm, I didn't check that. How can I see it?"),
      line("Anna", "Look at the pipeline log. The version is in the first lines."),
      line("Chris", "You're right! It's version eighteen, and I use twenty. Thank you!"),
    ],
  },
  {
    title: "End of the Week",
    level: "A2",
    lines: [
      line("Paul", "The week is almost over. How was it for you?"),
      line("Mia", "It was busy. We released the new version on Wednesday."),
      line("Paul", "Did everything go well?"),
      line("Mia", "Mostly. We found a small bug after the release, but we fixed it quickly."),
      line("Paul", "Nice. Any plans for the weekend?"),
      line("Mia", "I want to relax and read a book. And you?"),
      line("Paul", "I'm going to the mountains with my family."),
      line("Mia", "Sounds great. Have a nice weekend!"),
      line("Paul", "You too!"),
    ],
  },
];

// Fireship "… in 100 Seconds": fast, dense, native speed — B2 stretch listening.
export const VIDEOS = [
  { title: "Git Explained in 100 Seconds", id: "hwP7WQkmECE" },
  { title: "SQL Explained in 100 Seconds", id: "zsjvFFKOm3c" },
  { title: "Docker in 100 Seconds", id: "Gjnup-PuquQ" },
  { title: "JavaScript in 100 Seconds", id: "DHjqpvDnNGE" },
  { title: "TypeScript in 100 Seconds", id: "zQnBQ4tB3ZA" },
  { title: "Python in 100 Seconds", id: "x7X9w_GIm1s" },
  { title: "React in 100 Seconds", id: "Tn6-PIqc4UM" },
];
