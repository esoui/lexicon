const jokes = [
  "\"How is your wife,\" asked Zalither. \"She's in bed with laryngitis,\" replied Harlyth. \"Is that Argonian bastard back in town again?\"",
  "\"I keep seeing spots before my eyes.\" \"Have you seen a healer?\" \"No, just spots.\"",
  "A big Nord named Julgen was set on by a gang of thieves. He fought them furiously, but in the end, they beat him into semiconsciousness. They searched his pockets and discovered that he only had three gold pieces on him. \"Do you mean to tell us you fought us like a mad lupe for three lousy gold pieces?\" sneered one of the thieves. \"No,\" answered Julgen. \"I was afraid you were after the four hundred gold pieces in my boot.\"",
  "During the War of Betony, the Bretons in the Isle of Craghold were under siege for several days. After the island was liberated, Lord Bridwell found the ruins of the castle where a crowd of survivors were hidden away in the dark. It was going to be a difficult job freeing them, as part of the roof had collapsed trapping them all within. Bridwell stuck his head in the only opening and shouted to the Bretons below: \"Are there any expectant mothers down there?\" \"It's hard to say, your Lordship,\" said a young woman. \"We've only been down here for a few days.\"",
  "An elderly Breton met with a contemporary of his at a guild meeting. \"Harryston, old man, I wanted to express my sympathy. I hear that you buried your wife last week.\" \"Had to, old boy,\" replied Harryston. \"Dead, you know.\"",
  "Why was the Sentinel army so useless during the War of Betony? The cannons were too heavy, so all three garbage scows sunk.",
  "What does a new Sentinel private learn first as a combat technique? How to retreat.",
  "What is the thinnest book in the world? Redguard Heroes of the War of Betony.",
  "A Dark Elf man killed his wife after catching her making love with another man. When the magistrate asked him why he killed her instead of her lover, the man replied, \"I considered it better to kill one woman than a different man every week.\"",
  "A Dark Elf woman was being shown around Daggerfall. When she was shown the magnificent Castle Daggerfall, she smiled sweetly to her guide and whispered, \"It reminds me of sex.\" \"That's odd,\" said her guide. \"Why does our Castle Daggerfall remind you of sex?\" The Dark Elf sighed, \"Everything does.\"",
  "Yelithah told Vathysah that she was having dinner with a Dark Elf named Morleth that night. \"I hear he's an animal,\" said Vathysah. \"He'll rip your dress right off you.\" \"Thank you for telling me,\" said Yelithah, \"I'll be sure to wear an old dress.\"",
  "How do you separate sailors in the Khajiiti navy? With a hammer and tongs.",
  "\"This orchard has sentimental value to me,\" said Mojhad, the Khajiit, to his friend, Hasillid. \"Under that tree, for example, is where I first made love. And that tree, is where her mother stood, watching us.\" \"She watched you while you made love to her daughter?\" said Hasillid, clearly impressed. \"Didn't she say anything?\" \"Meow.\"",
  "What do you call a Wood Elf who doesn't lie or cheat or steal? A dead Wood Elf.",
  "Why does Dagoth Ur always carry asprin with him? To help in case of a heart attack.",
  "Why did the shoe store go out of business? It was in Argonia.",
  "What makes Sheogorath stand out above the other Daedra? A ladder.",
  "Two mudcrabs are eating a dead Argonian. One says \"I hate sea food.\" The other says \"OH MY GOSH! A TALKING MUDCRAB!!!\"",
  "Argonian in Morrowind: \"All I wanted was a pair of boots.\"",
  "A Nord decides to cut down a tree. What does he tell it? \"You will die where ya stand!\"",
  "Why does Fargoth smell? So blind people can hate him too.",
  "Altmer asks Dunmer: Do you know how to save 5 drowning Bosmer? Dunmer answers: No. Altmer says: Good.",
  "What do you call a Nord with two brain cells? Pregnant.",
  "What do you call a Bosmer everyone likes? Dead",
  "A blind Dunmer is sitting in a tavern when he suddenly pipes up. \"Hey, anyone wanna hear a joke about a dumb Nord?\" The man next to the blind Dunmer speaks up, \"Before you tell this joke, there's a few things you need to know.\" \"Sure,\" says the Dunmer, \"What's that?\" \"Well, for one thing, the bartender is a Nord.\" the man says, \"And so is the doorman. And the man next to you, he's a Nord, too. And the two very large men in the corner by the door, they're Nords, as well. In fact, I'm a Nord, too.\" The man leans in really closely to the blind Dunmer. \"So, you still want to tell that joke about a dumb Nord?\" The blind Dunmer cleared his throat and smiled, \"Nah... not if I'm going to have to explain it 6 fetchin' times!\"",
  "A Khajiit walks into a bar and the bar tender says, \"Why the long face?\"",
  "What does an Imperial Guard recruit do for fun? Himself.",
  "An Orc walks into a bar in Cyrodiil with an ugly, one eyed, mangled parrot on his shoulder. The barkeeper looks up, jumps back, and proclaims, \"God what an ugly thing. Where did you get it?\" The parrot responded, \"Orsinium. They are all over the #$%&# place.\"",
  "A pair of fair-haired Breton lasses decided to make a pilgrimage to the capitol of Cyrodiil. Near the end of the journey they happened upon a fork in the road with a sign that read: ~Imperial City Left~. Disheartened, they turned around and went home.",
  "Why did the Bosmer fall out of the tree? Because he was dead.",
  "How many Nords does it take to change a lantern? Six. One to hold the lantern and the other five to drink till the room spins.",
  "How many Dunmer does it take to change a lantern? Just the one.... but in the great old days, hundreds of slaves would change thousands of lanterns, at their every whim!",
  "How many Altmer does it take to change a lantern? None. The humans burned the lantern out, let THEM change it!",
  "A Nord, Dunmer, and Khajiit walk up to the local tavern. The Nord and Dunmer walk in. Slaves stay outside.",
  "What do you get when you cross a Nord, a Dunmer, and an Argonian? Violently Murdered! Blood for the Pact!",
  "What's the best way to convince even the most pompous Altmer that you have a good point? Stab them in the chest with it.",
  "What do you wear to dinner in Vallenwood? Barbeque Sauce.",
  "An Altmer, a Nord and an Imperial were passengers on a boat. The weather got real bad, it was Clear the boat was in big trouble. \"We're overloaded!\" the captain shouted. \"There's only one solution: One of you must jump overboard!\" \"I do this for the Aldmeri Dominion!\" the Altmer shouted, and threw himself overboard. It helped for a while, but then the captain informed that the boat was still overloaded, there was nothing else to do, one more passenger needed to jump. \"I do this for Skyrim!\" the Nord shouted, and threw the Imperial overboard.",
  "A group of three Nords are exploring Valenwood when they are captured by some Bosmer. They are brought before the King, who tells them they are to be cooked and eaten for an upcoming feast. The men are tied up and lowered into a giant pot of water. Two of the Nords start screaming and shouting, but the third starts laughing hysterically. His friends ask him, \"What is so funny? We're about to be boiled alive, you know!\". The laughing Nord grins and says, \"I just crapped in their soup!\"",
  "Why do Khajiit lick their butts? To get the taste of Khajiit cooking out of their mouths!",
  "A Nord was standing in the woods, wondering why an arrow seemed to be getting bigger and bigger. And then it hit him.",
  "Two Bosmer try chicken for the first time. Says the one: \"Tastes like human.\""
];

module.exports = {
  pattern: '(tell me a )?joke',
  reply: function(message, match, reply) {
    const i = Math.floor(Math.random() * jokes.length);
    reply(jokes[i]);
  }
};
