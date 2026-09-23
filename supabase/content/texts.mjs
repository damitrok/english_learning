// Starter reading texts, written for this app (A1–A2, IT topics). They reuse the
// seeded vocabulary so the reading screen has words to highlight, and follow the
// grammar order: A1 texts stay in present simple/continuous, A2 add past simple.
// Each text gets two true/false checks — meaning-focused, not a quiz on details.

export const TEXTS = [
  {
    title: "My Name Is Alex",
    level: "A1",
    body: `Hello! My name is Alex. I am a developer. I work in a small team. There are five people in my team. We make software for online shops.

Every day I start work at nine o'clock. First, I read my email. Then we have a short meeting. We call it a standup. Each person answers three questions: What did I do yesterday? What will I do today? Do I have a problem?

After the standup, I write code. Sometimes I fix a bug. Sometimes I work on a new feature. I like my work because every day is different.`,
    questions: [
      { statement: "Alex works in a big team of fifty people.", answer: false },
      { statement: "The standup is a short meeting.", answer: true },
    ],
  },
  {
    title: "A Bug in the App",
    level: "A1",
    body: `Maria is a tester. She tests the app before every release. Today she has a problem. The app does not open on her phone. She sees an error on the screen.

Maria writes a task for the team. In the task, she explains the problem: what she did, what she expected and what happened. She also adds a screenshot.

Ben is a backend developer. He reads the task and looks at the code. After one hour, he finds the bug. It is a small mistake in one function. Ben fixes it, and Maria tests the app again. Now it works!`,
    questions: [
      { statement: "Ben finds the bug in the code.", answer: true },
      { statement: "Maria fixes the bug.", answer: false },
    ],
  },
  {
    title: "Office or Home?",
    level: "A1",
    body: `Our office is in the city centre. It is not big, but it is nice. There are ten desks, a kitchen and two meeting rooms.

I come to the office three days a week. On the other two days, I work from home. At home, I have a desk, a computer and a good chair. It is quiet, so I can think about my tasks.

In the office, I talk to my friends from the team. We have lunch together, and we often help each other with difficult questions. I think both are good: the office is for people, and home is for quiet work.`,
    questions: [
      { statement: "The writer works from home two days a week.", answer: true },
      { statement: "The office has five meeting rooms.", answer: false },
    ],
  },
  {
    title: "English for Work",
    level: "A1",
    body: `Many developers need English. Documentation, error messages and questions on the internet are often in English. In many companies, the team speaks English at meetings too.

You don't need perfect English to start. Try to learn a few new words every day, and read short texts about things you know. It is easier to understand a text about code than a text about history or art.

Practice is important. Listen to podcasts, write your commit messages in English and don't be afraid of mistakes. Every week, your level improves a little.`,
    questions: [
      { statement: "You need perfect English before you start.", answer: false },
      { statement: "It is easier to read about things you know.", answer: true },
    ],
  },
  {
    title: "My First Week",
    level: "A2",
    body: `Last month I started a new job. My first week was busy but interesting.

On Monday, I met the team and got my laptop. I didn't write any code that day. I installed programs and read the documentation.

On Tuesday, my team lead explained the project to me. It is an app for doctors and their patients. I had a lot of questions, and she answered all of them.

On Wednesday, I fixed my first bug. It was very small, but I was happy. On Thursday, I made my first pull request, and on Friday, it went into the release. It was a good start!`,
    questions: [
      { statement: "On Monday, the writer wrote a lot of code.", answer: false },
      { statement: "The writer's first pull request went into the release on Friday.", answer: true },
    ],
  },
  {
    title: "The Sprint",
    level: "A2",
    body: `Our team works in sprints. A sprint is two weeks long. At the start of every sprint, we have a planning meeting. We look at the list of tasks and decide what we can finish in two weeks.

Every task has a size. Small tasks take one or two days, and big tasks take a week. We don't take too many tasks, because we want to finish the sprint on time.

At the end of the sprint, we show our new features to the client. Then we have one more meeting and talk about the sprint: what went well, what went badly and what we can change next time.`,
    questions: [
      { statement: "A sprint is one month long.", answer: false },
      { statement: "The team shows new features to the client at the end of the sprint.", answer: true },
    ],
  },
  {
    title: "Why Do We Write Tests?",
    level: "A2",
    body: `A test is a small program that checks another program. For example, a function adds two numbers. A test calls the function with 2 and 3 and checks that the answer is 5.

Why do developers write tests? Because code changes all the time. When you change one part of the app, you can break another part and not notice it. Tests run automatically after every commit and find these problems early.

Writing tests takes time, but it saves more time later. It is much cheaper to find a bug on your computer than in production, when real users see it.`,
    questions: [
      { statement: "Tests help to find problems early.", answer: true },
      { statement: "Writing tests takes no time at all.", answer: false },
    ],
  },
  {
    title: "What Is an API?",
    level: "A2",
    body: `Many programs need to talk to each other. For example, a weather app on your phone does not know the weather. It asks a server. The app sends a request, and the server sends a response with the data.

The rules for this conversation are called an API. An API says what requests you can send and what responses you get back. Each address for a request is called an endpoint, for example /weather/today.

Some APIs are free. Others need a token — a secret key that shows who you are. Without the correct token, the server answers with an error.`,
    questions: [
      { statement: "The weather app knows the weather without a server.", answer: false },
      { statement: "A token is a secret key.", answer: true },
    ],
  },
  {
    title: "Git in Five Minutes",
    level: "A2",
    body: `Git is a tool that saves the history of your code. The code and its history live in a repository.

When you start a new task, you usually create a branch. A branch is your own copy of the code, so your changes do not break the work of other people. When you finish a small step, you make a commit. A commit is like a photo of your code at one moment, with a short message about the change.

When the task is ready, you open a pull request. Your colleagues review the code and write comments. When everybody agrees, you merge the branch into the main code.`,
    questions: [
      { statement: "You usually create a branch for a new task.", answer: true },
      { statement: "You merge the branch before the review.", answer: false },
    ],
  },
  {
    title: "The Cache",
    level: "A2",
    body: `Imagine a server that takes two seconds to answer a request. If a thousand users send the same request, the server does the same slow work a thousand times.

A cache helps with this problem. The first time, the server does the work and saves the answer in the cache. The next time somebody sends the same request, the server takes the answer from the cache. This is very fast.

But a cache has one danger: old data. If the data in the database changes, the answer in the cache is not correct anymore. So developers need to decide when to update the cache or remove old answers from it.`,
    questions: [
      { statement: "A cache can make answers faster.", answer: true },
      { statement: "Data in a cache is always correct.", answer: false },
    ],
  },
  {
    title: "A Bad Friday",
    level: "A2",
    body: `Last Friday, at five o'clock in the evening, our website stopped working. Users saw an error page, and nobody could buy anything.

First, we looked at the logs. The server was fine, but the database was very slow. Then we found the problem: a new update sent the same request to the database thousands of times.

We didn't try to fix the code on a Friday evening. Instead, we went back to the old version. After ten minutes, the website worked again. On Monday, we fixed the bug, added a test and deployed the update again.`,
    questions: [
      { statement: "The problem was in the requests to the database.", answer: true },
      { statement: "The team fixed the code on Friday evening.", answer: false },
    ],
  },
  {
    title: "An Email to the Client",
    level: "A2",
    body: `Hi Sarah,

Thank you for your message. We looked at the problem with the login page yesterday. You were right: some users couldn't log in from their phones. The reason was an old version of one library.

We updated the library and tested the login page on five different phones. Everything works now. The new version is on the test server today, and we plan to deploy it to production on Thursday.

Please let me know if you have any questions.

Best regards,
Alex`,
    questions: [
      { statement: "Some users couldn't log in from their phones.", answer: true },
      { statement: "The new version is already in production.", answer: false },
    ],
  },
];
