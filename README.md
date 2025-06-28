Another tech stack has been added to my Batman gadget belt! Here is my dockerized and deployed MERN stack project, where I've replaced the traditional 'R' (React) with Next.js.

After receiving criticism about the design for my previous Spring full-stack project, I took it as a personal challenge to prove to myself that I was capable of producing good design. I decided on making a food delivery website, inspired by a trend at my training institute, TAP Academy, where students often built Java-based applications with a similar theme. I took my unformulated plan to Figma to make sense of how to go about it and built the design purely from my own taste—the color scheme, component positioning, and the overall look.

Suddenly, the plan didn't seem so far-fetched. It felt possible to express myself through my projects. What's more, I was genuinely having fun bringing it all together. For so long, I thought it always had to be bitter work, but here I was, actually enjoying what I do. Wow.

I started building the project's front end on my local system using React as soon as I was done with the designs. I had fun styling each component and embraced the idea of each one possessing its own stylesheet that didn't conflict with others. Usually, I had problems maintaining my vision on code because my mind was tired from making CSS selectors work with each other. A roommate had convinced me to try a new framework, and while it falls short in many areas, he wasn't wrong—it was definitely easier for me to bring my designs to life.

During this phase, a friend approached me to build a landing page for his business idea, "Soul Notes." That project was built and deployed in the middle of this one, and after I returned, I was unsatisfied with continuing my build on the same framework. This was when I was introduced to Next.js. I would later find out that using this React framework for this project was like using a flamethrower to light a fireplace, but I had already decided I was going to push my comfort boundaries.

With a working front end, I started on the backend. I was set on building a MERN stack project, as it was a buzzword thrown around during my college days. MongoDB was not hard to work with due to its flexible query language, although preparing the custom database did take time as I had to manually add each entry. Once the hard part was over, the rest became much easier. After preparing all the tables, I reached the core: Node.js. Actively learning and putting my knowledge to the test helped me grasp the concepts faster. I'll admit it was confusing at first, but once I got the hang of it, I was able to write the code needed for my project. And besides, who doesn't love working with APIs?

I brought all the features together locally and was ready to post it. However, I was also attending interviews and had fortunately gotten placed at a company just as I was nearing completion. I decided to delay the launch to iron out a few creases and focus on my career initialization.

My new role tasked me with familiarizing myself with Docker and Kubernetes, and I saw an alignment with what I wanted to do. This project has now served as proof of my training in Docker. While I haven't mastered it, I learned enough to implement what I needed. After a few trial-and-errors using the learning material on Docker Desktop, I successfully containerized my "MENN" stack project and it was ready for deployment.

I used Vercel for the front end and Render to deploy the backend. I had tried to fix the design to look good across all devices but reverted to the vanilla build when it got out of hand. I do plan to keep working on it, but for now, I wanted to share my journey and the project itself.

Feel free to take a look. I'd advise checking it out on your desktop, as it's still under development for responsive design.

Live Frontend: https://the-foodies-hub.vercel.app/
Backend Deployed On: Render (view the code in the GitHub repo)
