import { useState } from "react";

const C = {
  bg:"#080E14", surface:"#0C1520", panel:"#101C2A", card:"#142030",
  border:"#1C3040", borderLight:"#2A4560", forest:"#0D3D2A",
  green:"#1A6A48", greenLight:"#22A070", gold:"#C8A020", goldLight:"#E0BC40",
  bone:"#F0E4C8", boneDim:"#8A7A60", muted:"#3A5060", red:"#8A2010",
};

// ── ALL SCRAPED DATA FROM ANOMPA.CHICKASAW.NET ────────────────────────────────
const ALL_ENTRIES = [
  // GREETINGS & ESSENTIAL
  {c:"Halito / Chokma",p:"hah-LEE-toh / CHOHK-mah",e:"Hello",cat:"Greetings",ctx:"Standard Chickasaw greeting used when meeting someone.",q:"How do you say hello in Chickasaw?",a:"Halito or Chokma (hah-LEE-toh / CHOHK-mah) means hello in Chikashshanompa'. It is the standard greeting used when meeting someone."},
  {c:"Yakoke",p:"YAH-koh-keh",e:"Thank you",cat:"Greetings",ctx:"Universal expression of gratitude used in all contexts.",q:"How do you say thank you in Chickasaw?",a:"Yakoke (YAH-koh-keh) means thank you in Chikashshanompa'. It is one of the most important and commonly used words in the Chickasaw language."},
  {c:"Chinchokma?",p:"chin-CHOHK-mah",e:"How are you?",cat:"Greetings",ctx:"Literally 'are you good?' — the standard way to ask how someone is doing.",q:"How do you ask 'how are you' in Chickasaw?",a:"Chinchokma? (chin-CHOHK-mah) means 'how are you?' in Chickasaw — literally asking 'are you good?'"},
  {c:"Anchokma",p:"an-CHOHK-mah",e:"I am fine / I am good",cat:"Greetings",ctx:"The standard response to Chinchokma. Literally 'I am good.'",q:"How do you say 'I am fine' in Chickasaw?",a:"Anchokma (an-CHOHK-mah) means 'I am fine' or 'I am good' in Chickasaw. It is the standard response when someone asks how you are."},
  {c:"Chikashsha saya",p:"chik-ASH-shah SAH-yah",e:"I am Chickasaw",cat:"Greetings",ctx:"A statement of identity and pride — declaring oneself as a member of the Chickasaw Nation.",q:"How do you say 'I am Chickasaw' in the Chickasaw language?",a:"Chikashsha saya (chik-ASH-shah SAH-yah) means 'I am Chickasaw' in Chikashshanompa'. It is a proud declaration of identity and Nation membership."},
  {c:"Saholhchifoat...",p:"sah-HOHLH-chee-foat",e:"My name is...",cat:"Greetings",ctx:"Used to introduce yourself by name in Chickasaw.",q:"How do you introduce yourself in Chickasaw?",a:"Saholhchifoat (sah-HOHLH-chee-foat) followed by your name means 'my name is...' in Chickasaw. It is used when introducing yourself."},
  {c:"Nanta chilholhchifo?",p:"NAN-tah chil-HOHLH-chee-foh",e:"What is your name?",cat:"Greetings",ctx:"The standard way to ask someone's name.",q:"How do you ask someone their name in Chickasaw?",a:"Nanta chilholhchifo? (NAN-tah chil-HOHLH-chee-foh) means 'what is your name?' in Chickasaw."},
  {c:"Anowa chipisala'cho",p:"ah-NOH-wah chih-pih-SAH-lah-choh",e:"Until I see you again",cat:"Greetings",ctx:"A farewell phrase meaning until we meet again.",q:"How do you say goodbye in Chickasaw?",a:"Anowa chipisala'cho (ah-NOH-wah chih-pih-SAH-lah-choh) means 'until I see you again' in Chickasaw — a warm farewell phrase."},
  {c:"Chikashshanompa' ishanompolitaa?",p:"chik-ash-shah-NOM-pah ish-ah-nom-poh-LIH-tah",e:"Do you speak Chickasaw?",cat:"Greetings",ctx:"Used to ask if someone speaks the Chickasaw language.",q:"How do you ask 'do you speak Chickasaw?'",a:"Chikashshanompa' ishanompolitaa? means 'do you speak Chickasaw?' — a question used to find fellow speakers of Chikashshanompa'."},
  {c:"Akostinichili",p:"ah-koh-stih-NIH-chih-lih",e:"I understand",cat:"Essential Phrases",ctx:"Used to confirm understanding in conversation.",q:"How do you say 'I understand' in Chickasaw?",a:"Akostinichili (ah-koh-stih-NIH-chih-lih) means 'I understand' in Chickasaw. Use it to confirm you have understood what was said."},
  {c:"Akostinicho",p:"ah-koh-stih-NIH-choh",e:"I do not understand",cat:"Essential Phrases",ctx:"Used when you do not understand what was said.",q:"How do you say 'I do not understand' in Chickasaw?",a:"Akostinicho (ah-koh-stih-NIH-choh) means 'I do not understand' in Chickasaw. It is important for language learners to know this phrase."},
  {c:"Aachi anowa",p:"AH-chee ah-NOH-wah",e:"Say it again",cat:"Essential Phrases",ctx:"Used to ask someone to repeat what they said.",q:"How do you ask someone to repeat themselves in Chickasaw?",a:"Aachi anowa (AH-chee ah-NOH-wah) means 'say it again' in Chickasaw — useful for language learners when learning new words."},
  {c:"Nanta",p:"NAN-tah",e:"What",cat:"Essential Phrases",ctx:"The Chickasaw question word for 'what'.",q:"How do you say 'what' in Chickasaw?",a:"Nanta (NAN-tah) means 'what' in Chickasaw. It is a foundational question word used in many phrases."},
  {c:"Kata",p:"KAH-tah",e:"Who",cat:"Essential Phrases",ctx:"The Chickasaw question word for 'who'.",q:"How do you say 'who' in Chickasaw?",a:"Kata (KAH-tah) means 'who' in Chickasaw. It is used to ask about people and identity."},
  {c:"Katiyakta",p:"kah-tih-YAK-tah",e:"Where",cat:"Essential Phrases",ctx:"The Chickasaw question word for 'where'.",q:"How do you say 'where' in Chickasaw?",a:"Katiyakta (kah-tih-YAK-tah) means 'where' in Chickasaw."},
  {c:"Yappa nanta?",p:"YAP-pah NAN-tah",e:"What is this?",cat:"Essential Phrases",ctx:"Used to ask what something nearby is — a foundational learning phrase.",q:"How do you ask 'what is this?' in Chickasaw?",a:"Yappa nanta? (YAP-pah NAN-tah) means 'what is this?' in Chickasaw — one of the most useful phrases for language learners pointing to nearby objects."},
  // NUMBERS
  {c:"Chaffa",p:"CHAHF-fah",e:"One",cat:"Numbers",ctx:"The number one in Chikashshanompa'.",q:"How do you say 'one' in Chickasaw?",a:"Chaffa (CHAHF-fah) means one in Chikashshanompa'."},
  {c:"Toklo",p:"TOHK-loh",e:"Two",cat:"Numbers",ctx:"The number two in Chikashshanompa'.",q:"How do you say 'two' in Chickasaw?",a:"Toklo (TOHK-loh) means two in Chikashshanompa'."},
  {c:"Tochchina",p:"toh-CHEE-nah",e:"Three",cat:"Numbers",ctx:"The number three in Chikashshanompa'.",q:"How do you say 'three' in Chickasaw?",a:"Tochchina (toh-CHEE-nah) means three in Chikashshanompa'."},
  {c:"Oshta",p:"OSH-tah",e:"Four",cat:"Numbers",ctx:"The number four in Chikashshanompa'.",q:"How do you say 'four' in Chickasaw?",a:"Oshta (OSH-tah) means four in Chikashshanompa'."},
  {c:"Talhlhapi",p:"tahl-HAH-pee",e:"Five",cat:"Numbers",ctx:"The number five in Chikashshanompa'.",q:"How do you say 'five' in Chickasaw?",a:"Talhlhapi (tahl-HAH-pee) means five in Chikashshanompa'."},
  {c:"Hannali",p:"hah-NAH-lee",e:"Six",cat:"Numbers",ctx:"The number six in Chikashshanompa'.",q:"How do you say 'six' in Chickasaw?",a:"Hannali (hah-NAH-lee) means six in Chikashshanompa'."},
  {c:"Ontoklo",p:"on-TOHK-loh",e:"Seven",cat:"Numbers",ctx:"The number seven in Chikashshanompa'.",q:"How do you say 'seven' in Chickasaw?",a:"Ontoklo (on-TOHK-loh) means seven in Chikashshanompa'."},
  {c:"Ontochchina",p:"on-toh-CHEE-nah",e:"Eight",cat:"Numbers",ctx:"The number eight in Chikashshanompa'.",q:"How do you say 'eight' in Chickasaw?",a:"Ontochchina (on-toh-CHEE-nah) means eight in Chikashshanompa'."},
  {c:"Chakkali",p:"chahk-KAH-lee",e:"Nine",cat:"Numbers",ctx:"The number nine in Chikashshanompa'.",q:"How do you say 'nine' in Chickasaw?",a:"Chakkali (chahk-KAH-lee) means nine in Chikashshanompa'."},
  {c:"Pokkoli",p:"pohk-KOH-lee",e:"Ten",cat:"Numbers",ctx:"The number ten in Chikashshanompa'.",q:"How do you say 'ten' in Chickasaw?",a:"Pokkoli (pohk-KOH-lee) means ten in Chikashshanompa'."},
  {c:"Talhipa chaffa",p:"tahl-HEE-pah CHAHF-fah",e:"One hundred",cat:"Numbers",ctx:"One hundred in Chikashshanompa'.",q:"How do you say 'one hundred' in Chickasaw?",a:"Talhipa chaffa (tahl-HEE-pah CHAHF-fah) means one hundred in Chikashshanompa'."},
  // COLORS
  {c:"Lakna",p:"LAHK-nah",e:"Yellow",cat:"Colors",ctx:"The Chickasaw word for the color yellow.",q:"How do you say 'yellow' in Chickasaw?",a:"Lakna (LAHK-nah) means yellow in Chikashshanompa'."},
  {c:"Homma",p:"HOH-mah",e:"Red",cat:"Colors",ctx:"The Chickasaw word for the color red.",q:"How do you say 'red' in Chickasaw?",a:"Homma (HOH-mah) means red in Chikashshanompa'. Red is a significant color in Chickasaw ceremonial traditions."},
  {c:"Okchamali",p:"ohk-chah-MAH-lee",e:"Green / Blue",cat:"Colors",ctx:"Used for both green and blue in Chickasaw — the language uses one word for this color range.",q:"How do you say 'green' or 'blue' in Chickasaw?",a:"Okchamali (ohk-chah-MAH-lee) means both green and blue in Chikashshanompa'. The Chickasaw language uses a single word for this range of color."},
  {c:"Losa",p:"LOH-sah",e:"Black",cat:"Colors",ctx:"The Chickasaw word for the color black.",q:"How do you say 'black' in Chickasaw?",a:"Losa (LOH-sah) means black in Chikashshanompa'."},
  {c:"Tohbi",p:"TOH-bee",e:"White",cat:"Colors",ctx:"The Chickasaw word for the color white.",q:"How do you say 'white' in Chickasaw?",a:"Tohbi (TOH-bee) means white in Chikashshanompa'."},
  {c:"Shobokoli",p:"shoh-BOH-koh-lee",e:"Gray",cat:"Colors",ctx:"The Chickasaw word for gray.",q:"How do you say 'gray' in Chickasaw?",a:"Shobokoli (shoh-BOH-koh-lee) means gray in Chikashshanompa'."},
  {c:"Nakbatepoli",p:"nahk-bah-teh-POH-lee",e:"Rainbow",cat:"Colors",ctx:"The Chickasaw word for rainbow.",q:"How do you say 'rainbow' in Chickasaw?",a:"Nakbatepoli (nahk-bah-teh-POH-lee) means rainbow in Chikashshanompa'."},
  // ANIMALS
  {c:"Ofi",p:"OH-fee",e:"Dog",cat:"Animals",ctx:"Dogs were valued companions and working animals in traditional Chickasaw life.",q:"How do you say 'dog' in Chickasaw?",a:"Ofi (OH-fee) means dog in Chikashshanompa'. Dogs were important companions in traditional Chickasaw life."},
  {c:"Nita",p:"NIH-tah",e:"Bear",cat:"Animals",ctx:"The bear held spiritual significance in many southeastern tribal traditions including Chickasaw.",q:"How do you say 'bear' in Chickasaw?",a:"Nita (NIH-tah) means bear in Chikashshanompa'. The bear held spiritual significance in Chickasaw and other southeastern tribal traditions."},
  {c:"Issi",p:"IH-see",e:"Deer",cat:"Animals",ctx:"Deer were central to Chickasaw subsistence — providing food, clothing, and trade goods.",q:"How do you say 'deer' in Chickasaw?",a:"Issi (IH-see) means deer in Chikashshanompa'. Deer were central to traditional Chickasaw subsistence, providing food, hides for clothing, and goods for trade."},
  {c:"Osi",p:"OH-see",e:"Eagle",cat:"Animals",ctx:"The eagle is a sacred bird across many Indigenous traditions including Chickasaw.",q:"How do you say 'eagle' in Chickasaw?",a:"Osi (OH-see) means eagle in Chikashshanompa'. The eagle is a sacred bird of great significance in Chickasaw and many Indigenous traditions."},
  {c:"Foshi",p:"FOH-shee",e:"Bird",cat:"Animals",ctx:"The general word for bird in Chickasaw.",q:"How do you say 'bird' in Chickasaw?",a:"Foshi (FOH-shee) means bird in Chikashshanompa'."},
  {c:"Nashoba",p:"nah-SHOH-bah",e:"Wolf",cat:"Animals",ctx:"The wolf — a significant animal in Chickasaw oral tradition and stories.",q:"How do you say 'wolf' in Chickasaw?",a:"Nashoba (nah-SHOH-bah) means wolf in Chikashshanompa'. The wolf appears in Chickasaw oral tradition and stories."},
  {c:"Soba",p:"SOH-bah",e:"Horse",cat:"Animals",ctx:"Horses transformed Chickasaw culture and warfare after their introduction. The Chickasaw became renowned horse breeders.",q:"How do you say 'horse' in Chickasaw?",a:"Soba (SOH-bah) means horse in Chikashshanompa'. The Chickasaw became renowned horse breeders after horses were introduced — their horses were prized across the Southeast."},
  {c:"Chukfi",p:"CHOOK-fee",e:"Rabbit",cat:"Animals",ctx:"Rabbit appears frequently in Chickasaw stories and oral tradition.",q:"How do you say 'rabbit' in Chickasaw?",a:"Chukfi (CHOOK-fee) means rabbit in Chikashshanompa'. Rabbit is a common figure in Chickasaw stories and oral tradition."},
  {c:"Nani",p:"NAH-nee",e:"Fish",cat:"Animals",ctx:"Fish were an important food source for the Chickasaw in their southeastern homeland.",q:"How do you say 'fish' in Chickasaw?",a:"Nani (NAH-nee) means fish in Chikashshanompa'. Fish were an important food source in the Chickasaw's original southeastern homeland."},
  {c:"Sinti",p:"SIN-tee",e:"Snake",cat:"Animals",ctx:"The Chickasaw word for snake. Certain snakes held spiritual significance in southeastern Indigenous traditions.",q:"How do you say 'snake' in Chickasaw?",a:"Sinti (SIN-tee) means snake in Chikashshanompa'."},
  {c:"Fala",p:"FAH-lah",e:"Crow",cat:"Animals",ctx:"The crow in Chickasaw — appears in oral traditions and stories.",q:"How do you say 'crow' in Chickasaw?",a:"Fala (FAH-lah) means crow in Chikashshanompa'."},
  {c:"Loksi",p:"LOHK-see",e:"Turtle",cat:"Animals",ctx:"Turtle shells were used as instruments in traditional Chickasaw stomp dance.",q:"How do you say 'turtle' in Chickasaw?",a:"Loksi (LOHK-see) means turtle in Chikashshanompa'. Turtle shells were historically used as shakers in traditional Chickasaw stomp dance ceremonies."},
  {c:"Yanash",p:"YAH-nash",e:"Buffalo",cat:"Animals",ctx:"Buffalo were hunted by Chickasaw warriors on westward expeditions.",q:"How do you say 'buffalo' in Chickasaw?",a:"Yanash (YAH-nash) means buffalo in Chikashshanompa'. Chickasaw warriors traveled westward to hunt buffalo, which provided food, hides, and other materials."},
  {c:"Chalokloha",p:"chah-lohk-LOH-hah",e:"Turkey",cat:"Animals",ctx:"Wild turkey was an important food source and featured in Chickasaw seasonal traditions.",q:"How do you say 'turkey' in Chickasaw?",a:"Chalokloha (chah-lohk-LOH-hah) means turkey in Chikashshanompa'. Wild turkey was an important food source in traditional Chickasaw life."},
  {c:"Kowi",p:"KOH-wee",e:"Cat",cat:"Animals",ctx:"The Chickasaw word for cat.",q:"How do you say 'cat' in Chickasaw?",a:"Kowi (KOH-wee) means cat in Chikashshanompa'."},
  {c:"Funi",p:"FOO-nee",e:"Squirrel",cat:"Animals",ctx:"Squirrel was hunted for food in traditional Chickasaw life.",q:"How do you say 'squirrel' in Chickasaw?",a:"Funi (FOO-nee) means squirrel in Chikashshanompa'. Squirrel was hunted as a food source in traditional Chickasaw life."},
  // KINSHIP
  {c:"Ishki",p:"ISH-kee",e:"Mother",cat:"Family",ctx:"Mother — in the matrilineal Chickasaw society, the mother's clan determined a child's identity and inheritance.",q:"How do you say 'mother' in Chickasaw?",a:"Ishki (ISH-kee) means mother in Chikashshanompa'. In the matrilineal Chickasaw society, a mother's clan determined her children's identity, inheritance, and social standing."},
  {c:"Inki",p:"IHN-kee",e:"Father",cat:"Family",ctx:"Father in Chickasaw. In the matrilineal system, a father belonged to a different clan than his children.",q:"How do you say 'father' in Chickasaw?",a:"Inki (IHN-kee) means father in Chikashshanompa'. In the traditional matrilineal Chickasaw system, fathers belonged to different clans than their children."},
  {c:"Appossi",p:"ah-POH-see",e:"Grandmother",cat:"Family",ctx:"Grandmother — held great authority in traditional matrilineal Chickasaw society.",q:"How do you say 'grandmother' in Chickasaw?",a:"Appossi (ah-POH-see) means grandmother in Chikashshanompa'. Grandmothers held great cultural authority in the matrilineal Chickasaw society and were central to passing down language and traditions."},
  {c:"Imafossi",p:"ih-mah-FOH-see",e:"Grandfather",cat:"Family",ctx:"Grandfather — respected as an elder and knowledge keeper.",q:"How do you say 'grandfather' in Chickasaw?",a:"Imafossi (ih-mah-FOH-see) means grandfather in Chikashshanompa'. Grandfathers are deeply respected as elders and knowledge keepers in Chickasaw culture."},
  {c:"Ipok",p:"IH-pohk",e:"Grandchild",cat:"Family",ctx:"Grandchild — the next generation entrusted with carrying the language and culture forward.",q:"How do you say 'grandchild' in Chickasaw?",a:"Ipok (IH-pohk) means grandchild in Chikashshanompa'. Grandchildren carry the responsibility of continuing the language and culture into the future."},
  {c:"Nafki",p:"NAHF-kee",e:"Brother",cat:"Family",ctx:"Brother in Chickasaw.",q:"How do you say 'brother' in Chickasaw?",a:"Nafki (NAHF-kee) means brother in Chikashshanompa'."},
  {c:"Intiik",p:"in-TEEK",e:"Sister",cat:"Family",ctx:"Sister in Chickasaw — sisters were important social bonds in the matrilineal clan system.",q:"How do you say 'sister' in Chickasaw?",a:"Intiik (in-TEEK) means sister in Chikashshanompa'. Sisters held important social bonds in the traditional matrilineal clan system."},
  {c:"Oshi",p:"OH-shee",e:"Son",cat:"Family",ctx:"Son in Chickasaw.",q:"How do you say 'son' in Chickasaw?",a:"Oshi (OH-shee) means son in Chikashshanompa'."},
  {c:"Oshiitiik",p:"oh-SHEE-teek",e:"Daughter",cat:"Family",ctx:"Daughter in Chickasaw — daughters carried the clan lineage forward in the matrilineal system.",q:"How do you say 'daughter' in Chickasaw?",a:"Oshiitiik (oh-SHEE-teek) means daughter in Chikashshanompa'. In the matrilineal Chickasaw system, daughters carried the clan lineage forward to the next generation."},
  // BODY
  {c:"Ishkobo",p:"ish-KOH-boh",e:"Head",cat:"Body",ctx:"Head in Chickasaw.",q:"How do you say 'head' in Chickasaw?",a:"Ishkobo (ish-KOH-boh) means head in Chikashshanompa'."},
  {c:"Ishkin",p:"ISH-kin",e:"Eye",cat:"Body",ctx:"Eye in Chickasaw.",q:"How do you say 'eye' in Chickasaw?",a:"Ishkin (ISH-kin) means eye in Chikashshanompa'."},
  {c:"Ibichchala",p:"ih-bih-CHAH-lah",e:"Nose",cat:"Body",ctx:"Nose in Chickasaw.",q:"How do you say 'nose' in Chickasaw?",a:"Ibichchala (ih-bih-CHAH-lah) means nose in Chikashshanompa'."},
  {c:"Itiya",p:"ih-TEE-yah",e:"Mouth",cat:"Body",ctx:"Mouth in Chickasaw.",q:"How do you say 'mouth' in Chickasaw?",a:"Itiya (ih-TEE-yah) means mouth in Chikashshanompa'."},
  {c:"Haksibish",p:"hahk-SIH-bish",e:"Ears",cat:"Body",ctx:"Ears in Chickasaw.",q:"How do you say 'ears' in Chickasaw?",a:"Haksibish (hahk-SIH-bish) means ears in Chikashshanompa'."},
  {c:"Ipashi",p:"ih-PAH-shee",e:"Hair",cat:"Body",ctx:"Hair in Chickasaw.",q:"How do you say 'hair' in Chickasaw?",a:"Ipashi (ih-PAH-shee) means hair in Chikashshanompa'."},
  {c:"Ilbak",p:"IHL-bahk",e:"Hand / Arm",cat:"Body",ctx:"Hand and arm share a root word in Chickasaw.",q:"How do you say 'hand' in Chickasaw?",a:"Ilbak (IHL-bahk) means hand or arm in Chikashshanompa'. The same root word covers both hand and arm."},
  {c:"Iyyi",p:"IH-yee",e:"Foot / Leg",cat:"Body",ctx:"Foot and leg in Chickasaw.",q:"How do you say 'foot' in Chickasaw?",a:"Iyyi (IH-yee) means foot or leg in Chikashshanompa'."},
  {c:"Chukush",p:"CHOO-koosh",e:"Heart",cat:"Body",ctx:"Heart in Chickasaw — used both literally and metaphorically for the emotional core of a person.",q:"How do you say 'heart' in Chickasaw?",a:"Chukush (CHOO-koosh) means heart in Chikashshanompa'. The word is used both literally for the physical heart and metaphorically for a person's emotional core and spirit."},
  {c:"Foni",p:"FOH-nee",e:"Bone",cat:"Body",ctx:"Bone in Chickasaw.",q:"How do you say 'bone' in Chickasaw?",a:"Foni (FOH-nee) means bone in Chikashshanompa'."},
  {c:"Issish",p:"IH-sish",e:"Blood",cat:"Body",ctx:"Blood in Chickasaw — clan membership was determined by blood lineage through the mother.",q:"How do you say 'blood' in Chickasaw?",a:"Issish (IH-sish) means blood in Chikashshanompa'. Blood lineage through the mother determined clan membership in the traditional Chickasaw matrilineal system."},
  // NATURE & VALUES
  {c:"Oka",p:"OH-kah",e:"Water",cat:"Nature",ctx:"Water — deeply significant in Chickasaw culture and found in many traditional place names.",q:"How do you say 'water' in Chickasaw?",a:"Oka (OH-kah) means water in Chikashshanompa'. Water holds deep cultural significance for the Chickasaw people and appears throughout traditional place names in their ancestral territory."},
  {c:"Hashi",p:"HAH-shee",e:"Sun",cat:"Nature",ctx:"The sun — used also in the context of time. Hashi appears in days of the week and seasonal language.",q:"How do you say 'sun' in Chickasaw?",a:"Hashi (HAH-shee) means sun in Chikashshanompa'. The sun is foundational to Chickasaw timekeeping and appears in words for days, seasons, and weather."},
  {c:"Oklhili Hashi",p:"ohk-LHIH-lee HAH-shee",e:"Moon",cat:"Nature",ctx:"Moon — literally 'night sun' in Chickasaw.",q:"How do you say 'moon' in Chickasaw?",a:"Oklhili Hashi (ohk-LHIH-lee HAH-shee) means moon in Chikashshanompa' — literally meaning 'night sun', showing how Chickasaw describes the moon in relation to the sun."},
  {c:"Iti",p:"IH-tee",e:"Tree / Wood",cat:"Nature",ctx:"Tree or wood — forests were central to Chickasaw life in their southeastern homeland.",q:"How do you say 'tree' in Chickasaw?",a:"Iti (IH-tee) means tree or wood in Chikashshanompa'. Forests were central to Chickasaw life in their original southeastern homeland, providing materials, food, medicine, and spiritual connection."},
  {c:"Yakni",p:"YAHK-nee",e:"Earth / Land / Ground",cat:"Nature",ctx:"Earth or land — the land held profound spiritual and political significance as the foundation of Chickasaw sovereignty.",q:"How do you say 'land' or 'earth' in Chickasaw?",a:"Yakni (YAHK-nee) means earth, land, or ground in Chikashshanompa'. Land held profound spiritual and political significance for the Chickasaw — their sovereignty is inseparable from their relationship to the land."},
  {c:"Omba",p:"OHM-bah",e:"It is raining",cat:"Weather",ctx:"A weather phrase — used to say it is raining.",q:"How do you say 'it is raining' in Chickasaw?",a:"Omba (OHM-bah) means 'it is raining' in Chikashshanompa'."},
  {c:"Okti",p:"OHK-tee",e:"Snow",cat:"Weather",ctx:"Snow in Chickasaw.",q:"How do you say 'snow' in Chickasaw?",a:"Okti (OHK-tee) means snow in Chikashshanompa'."},
  {c:"Mahli",p:"MAH-lee",e:"It is windy",cat:"Weather",ctx:"A weather phrase for wind.",q:"How do you say 'it is windy' in Chickasaw?",a:"Mahli (MAH-lee) means 'it is windy' in Chikashshanompa'."},
  {c:"Toompalli",p:"toom-PAH-lee",e:"Summer",cat:"Seasons",ctx:"Summer — the warm growing season.",q:"How do you say 'summer' in Chickasaw?",a:"Toompalli (toom-PAH-lee) means summer in Chikashshanompa'."},
  {c:"Hashtola",p:"hash-TOH-lah",e:"Winter / Autumn",cat:"Seasons",ctx:"Winter in Chickasaw — the cold season.",q:"How do you say 'winter' in Chickasaw?",a:"Hashtola (hash-TOH-lah) means winter in Chikashshanompa'. The cold season when the land rests."},
  // DAYS
  {c:"Nittak Hollo",p:"NIH-ttahk HOH-loh",e:"Sunday",cat:"Days",ctx:"Sunday — literally 'holy day' in Chickasaw.",q:"How do you say 'Sunday' in Chickasaw?",a:"Nittak Hollo (NIH-ttahk HOH-loh) means Sunday in Chikashshanompa' — literally 'holy day', reflecting the influence of Christianity on Chickasaw language."},
  {c:"Nittak Ammona",p:"NIH-ttahk ah-MOH-nah",e:"Monday",cat:"Days",ctx:"Monday — the first day of the week.",q:"How do you say 'Monday' in Chickasaw?",a:"Nittak Ammona (NIH-ttahk ah-MOH-nah) means Monday in Chikashshanompa' — literally 'first day'."},
  {c:"Nittak Atokla",p:"NIH-ttahk ah-TOHK-lah",e:"Tuesday",cat:"Days",ctx:"Tuesday — the second day.",q:"How do you say 'Tuesday' in Chickasaw?",a:"Nittak Atokla (NIH-ttahk ah-TOHK-lah) means Tuesday in Chikashshanompa'."},
  {c:"Naalhchifa Nittak",p:"nahl-CHIH-fah NIH-ttahk",e:"Friday",cat:"Days",ctx:"Friday — preparation day before the holy day.",q:"How do you say 'Friday' in Chickasaw?",a:"Naalhchifa Nittak (nahl-CHIH-fah NIH-ttahk) means Friday in Chikashshanompa'."},
  // VALUES & CULTURE
  {c:"Chikasha",p:"CHIK-ah-shah",e:"Chickasaw people",cat:"Culture",ctx:"The name of the Nation. Often interpreted as 'the people who walk upright' — embodying dignity and sovereignty.",q:"What does Chikasha mean?",a:"Chikasha (CHIK-ah-shah) refers to the Chickasaw people themselves. The name is often interpreted as 'the people who walk upright' — a name that embodies dignity, honor, and sovereignty. It is both the name of the people and their Nation."},
  {c:"Chikashshanompa'",p:"chik-ash-shah-NOM-pah",e:"Chickasaw language",cat:"Culture",ctx:"The name of the language. Nompa means language or speech. Currently spoken by approximately 50 elders.",q:"What is the Chickasaw language called?",a:"The Chickasaw language is called Chikashshanompa' (chik-ash-shah-NOM-pah). Nompa means language or speech. It is a Muskogean language closely related to Choctaw, currently spoken by around 50 elders. Language preservation is one of the most important missions of the Chickasaw Nation."},
  {c:"Iti Fabvssa",p:"ih-tee fah-BUSS-ah",e:"Backbone / Ancestral strength",cat:"Culture",ctx:"Literally 'the backbone' — ancestral foundation and cultural strength across generations.",q:"What does Iti Fabvssa mean?",a:"Iti Fabvssa (ih-tee fah-BUSS-ah) literally means 'the backbone' in Chikashshanompa'. It represents the ancestral strength and cultural foundation that sustains the Chickasaw people across generations. It is also the name of the Nation's cultural program that preserves and shares Chickasaw history."},
  {c:"Kallo",p:"KAH-loh",e:"Strong / Brave",cat:"Values",ctx:"Describes both physical strength and bravery of character — a high compliment.",q:"How do you say 'strong' or 'brave' in Chickasaw?",a:"Kallo (KAH-loh) means strong or brave in Chikashshanompa'. It describes both physical strength and courage of character and is considered a high compliment in Chickasaw culture."},
  {c:"Holisso",p:"hoh-LIS-soh",e:"Book / Writing / Paper",cat:"Culture",ctx:"Writing and books — the Chickasaw had one of the highest literacy rates in 19th century Indian Territory.",q:"What is the Chickasaw word for book or writing?",a:"Holisso (hoh-LIS-soh) means book, writing, or paper in Chikashshanompa'. The Chickasaw Nation had one of the highest literacy rates of any people in 19th century Indian Territory — they valued education deeply and established schools before Oklahoma statehood."},
  {c:"Nanna alhlhi",p:"NAH-nah AHL-hee",e:"Truth",cat:"Values",ctx:"Truth — a core value in Chickasaw culture and governance.",q:"How do you say 'truth' in Chickasaw?",a:"Nanna alhlhi (NAH-nah AHL-hee) means truth in Chikashshanompa'. Truth is a foundational value in Chickasaw culture and traditional governance."},
  {c:"Shilombish Ishto",p:"shih-LOHM-bish ISH-toh",e:"Great Spirit",cat:"Spiritual",ctx:"The Great Spirit — the supreme spiritual force in traditional Chickasaw belief.",q:"How do you say 'Great Spirit' in Chickasaw?",a:"Shilombish Ishto (shih-LOHM-bish ISH-toh) means Great Spirit in Chikashshanompa' — literally 'great soul' or 'great spirit'. It refers to the supreme spiritual force in traditional Chickasaw belief."},
  {c:"Alikchi",p:"ah-LIK-chee",e:"Medicine Person / Healer",cat:"Spiritual",ctx:"The traditional Chickasaw healer and spiritual leader who used plants and ceremony for healing.",q:"What is the Chickasaw word for healer or medicine person?",a:"Alikchi (ah-LIK-chee) means medicine person or healer in Chikashshanompa'. The alikchi was a traditional spiritual and medical leader who used plant medicine and ceremony to heal the community."},
  {c:"Hayichi hilha",p:"hay-IH-chee HIL-hah",e:"Stomp Dance",cat:"Spiritual",ctx:"The sacred stomp dance ceremony — central to Chickasaw spiritual and community life.",q:"What is the Chickasaw word for stomp dance?",a:"Hayichi hilha (hay-IH-chee HIL-hah) means stomp dance in Chikashshanompa'. The stomp dance is a sacred ceremony central to Chickasaw spiritual and community life, performed at stomp grounds that are still active today."},
  {c:"Hattak",p:"HAH-ttahk",e:"Man / Person",cat:"People",ctx:"Man or person — root word for many people-related compound words.",q:"How do you say 'man' or 'person' in Chickasaw?",a:"Hattak (HAH-ttahk) means man or person in Chikashshanompa'. It serves as the root for many compound words relating to different human roles and identities in Chickasaw society."},
  {c:"Ohoyo",p:"oh-HOY-oh",e:"Woman",cat:"People",ctx:"Woman — held great respect in the matrilineal Chickasaw society where clan membership passed through women.",q:"How do you say 'woman' in Chickasaw?",a:"Ohoyo (oh-HOY-oh) means woman in Chikashshanompa'. Women held positions of great respect and authority in traditional Chickasaw society, which was matrilineal — meaning clan membership and inheritance passed through the mother's line."},
  {c:"Chipota",p:"chih-POH-tah",e:"Child",cat:"People",ctx:"Child — considered sacred, with language and culture education a community responsibility.",q:"How do you say 'child' in Chickasaw?",a:"Chipota (chih-POH-tah) means child in Chikashshanompa'. Children are considered sacred in Chickasaw culture and the responsibility of raising them in language and tradition belongs to the entire community — not just parents."},
  {c:"Sipokni",p:"sih-POHK-nee",e:"Elder / Ancient",cat:"People",ctx:"Elder or ancient one — elders are the knowledge keepers of Chikashshanompa' and cultural traditions.",q:"How do you say 'elder' in Chickasaw?",a:"Sipokni (sih-POHK-nee) means elder or ancient in Chikashshanompa'. Elders are the primary knowledge keepers of the language and cultural traditions — their role in the community is deeply honored."},
  // FOOD
  {c:"Pashofa",p:"pah-SHOH-fah",e:"Sacred cracked corn hominy soup",cat:"Food",ctx:"A sacred traditional dish central to Chickasaw ceremonies and gatherings.",q:"What is pashofa?",a:"Pashofa (pah-SHOH-fah) is the sacred Chickasaw cracked corn hominy soup — one of the most important traditional foods of the Chickasaw people. It is central to ceremonies and community gatherings and represents connection to the land, ancestors, and community. The preparation and sharing of pashofa is itself a cultural act."},
  {c:"Banaha",p:"bah-NAH-hah",e:"Corn shuck bread",cat:"Food",ctx:"Traditional corn bread wrapped and cooked in corn shucks — a staple and symbol of agricultural heritage.",q:"What is banaha in Chickasaw culture?",a:"Banaha (bah-NAH-hah) is traditional Chickasaw corn shuck bread — cornmeal wrapped in corn shucks and boiled. It is a staple of Chickasaw cuisine and a symbol of the Nation's deep agricultural heritage and connection to corn as a sacred crop."},
  {c:"Tanchi",p:"TAHN-chee",e:"Corn",cat:"Food",ctx:"Corn — the most sacred crop, basis of pashofa and banaha, central to ceremonial life.",q:"What is the Chickasaw word for corn?",a:"Tanchi (TAHN-chee) is the Chickasaw word for corn. Corn was the most sacred and important crop in Chickasaw agricultural tradition — the basis of pashofa and banaha, central to ceremonies, and a symbol of the Nation's connection to the land."},
  {c:"Nani",p:"NAH-nee",e:"Fish",cat:"Food",ctx:"Fish — an important food source in the Chickasaw southeastern homeland.",q:"How do you say 'fish' in Chickasaw?",a:"Nani (NAH-nee) means fish in Chikashshanompa'. Fish were an important food source for the Chickasaw in their original southeastern homeland near rivers and wetlands."},
];

function toJSONL(entries) {
  const lines = [];
  entries.forEach(e => {
    lines.push(JSON.stringify({ prompt: e.q, completion: e.a }));
    lines.push(JSON.stringify({ prompt: `What does ${e.c} mean in Chickasaw?`, completion: `${e.c} (${e.p}) means ${e.e} in Chikashshanompa'. ${e.ctx}` }));
    lines.push(JSON.stringify({ prompt: `Translate "${e.e}" to Chickasaw`, completion: `The Chickasaw word for ${e.e} is ${e.c}, pronounced ${e.p}. ${e.ctx}` }));
  });
  return lines.join('\n');
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Crimson+Text:ital,wght@0,400;1,400&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.3s ease forwards}
  textarea:focus,input:focus,select:focus{outline:none;border-color:#C8A020!important}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#080E14}::-webkit-scrollbar-thumb{background:#1C3040;border-radius:2px}
  *{box-sizing:border-box}
  .btn{transition:all 0.2s ease}.btn:hover{opacity:0.85;transform:translateY(-1px)}
  .card{transition:border-color 0.2s}.card:hover{border-color:#2A4560!important}
`;

const CATS = [...new Set(ALL_ENTRIES.map(e => e.cat))];

export default function CFMDataTool() {
  const [tab, setTab] = useState("browse");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(ALL_ENTRIES);
  const [newEntry, setNewEntry] = useState({ c:"", p:"", e:"", cat:"Greetings", ctx:"", q:"", a:"" });
  const [copied, setCopied] = useState(false);
  const [exportCount, setExportCount] = useState(0);

  const filtered = entries.filter(e =>
    (filter === "All" || e.cat === filter) &&
    (search === "" || e.e.toLowerCase().includes(search.toLowerCase()) || e.c.toLowerCase().includes(search.toLowerCase()))
  );

  const addEntry = () => {
    if (!newEntry.c || !newEntry.e) return;
    const e = { ...newEntry };
    if (!e.q) e.q = `How do you say "${e.e}" in Chickasaw?`;
    if (!e.a) e.a = `${e.c} (${e.p}) means ${e.e} in Chikashshanompa'. ${e.ctx}`;
    setEntries([...entries, e]);
    setNewEntry({ c:"", p:"", e:"", cat:"Greetings", ctx:"", q:"", a:"" });
  };

  const exportJSONL = () => {
    const data = toJSONL(entries);
    const blob = new Blob([data], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "chikashshanompa-training.jsonl";
    a.click();
    setExportCount(entries.length * 3);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"'Crimson Text',Georgia,serif", color:C.bone }}>
      <style>{styles}</style>

      {/* Header */}
      <div style={{ background:`${C.surface}F0`, borderBottom:`1px solid ${C.border}`, padding:"14px 20px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.green},${C.gold},${C.green},transparent)` }}/>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div>
              <div style={{ color:C.goldLight, fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:16, letterSpacing:2 }}>CHIKASHSHANOMPA' TRAINING DATA</div>
              <div style={{ color:C.muted, fontSize:9, letterSpacing:2, fontFamily:"Rajdhani,sans-serif" }}>CFM FINE-TUNE DATASET · SOVEREIGN SHIELD TECHNOLOGIES LLC</div>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ background:C.forest, border:`1px solid ${C.green}50`, borderRadius:8, padding:"6px 12px", textAlign:"center" }}>
                <div style={{ color:C.greenLight, fontFamily:"Rajdhani,sans-serif", fontSize:18, fontWeight:700 }}>{entries.length}</div>
                <div style={{ color:C.muted, fontSize:8, letterSpacing:1, fontFamily:"Rajdhani,sans-serif" }}>ENTRIES</div>
              </div>
              <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", textAlign:"center" }}>
                <div style={{ color:C.bone, fontFamily:"Rajdhani,sans-serif", fontSize:18, fontWeight:700 }}>{entries.length * 3}</div>
                <div style={{ color:C.muted, fontSize:8, letterSpacing:1, fontFamily:"Rajdhani,sans-serif" }}>TRAINING PAIRS</div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {["browse","add","export"].map(t => (
              <button key={t} className="btn" onClick={()=>setTab(t)} style={{ background:tab===t?C.gold:C.card, color:tab===t?C.bg:C.boneDim, border:`1px solid ${tab===t?C.gold:C.border}`, padding:"6px 16px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"Rajdhani,sans-serif", letterSpacing:1, textTransform:"uppercase" }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 20px 60px" }}>

        {/* BROWSE TAB */}
        {tab === "browse" && (
          <div className="fade-up">
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search words..." style={{ flex:1, minWidth:180, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.bone, padding:"8px 12px", fontSize:13, fontFamily:"inherit" }}/>
              <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.bone, padding:"8px 12px", fontSize:12, fontFamily:"Rajdhani,sans-serif", cursor:"pointer" }}>
                <option>All</option>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ color:C.muted, fontSize:10, letterSpacing:1, fontFamily:"Rajdhani,sans-serif", marginBottom:12 }}>{filtered.length} ENTRIES · {filtered.length * 3} TRAINING PAIRS</div>
            <div style={{ display:"grid", gap:10 }}>
              {filtered.map((e,i) => (
                <div key={i} className="card" style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8, flexWrap:"wrap", gap:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ color:C.goldLight, fontFamily:"Rajdhani,sans-serif", fontSize:17, fontWeight:700 }}>{e.c}</span>
                      <span style={{ color:C.muted, fontSize:11, fontStyle:"italic" }}>/{e.p}/</span>
                    </div>
                    <span style={{ background:`${C.green}20`, border:`1px solid ${C.green}40`, color:C.greenLight, padding:"2px 8px", borderRadius:20, fontSize:9, fontWeight:700, letterSpacing:1, fontFamily:"Rajdhani,sans-serif" }}>{e.cat}</span>
                  </div>
                  <div style={{ color:C.bone, fontSize:14, fontWeight:600, marginBottom:4 }}>{e.e}</div>
                  <div style={{ color:C.boneDim, fontSize:12, lineHeight:1.6, fontStyle:"italic" }}>{e.ctx}</div>
                  <div style={{ marginTop:10, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ color:C.muted, fontSize:9, letterSpacing:1, fontFamily:"Rajdhani,sans-serif", marginBottom:4 }}>TRAINING PAIR PREVIEW</div>
                    <div style={{ color:C.boneDim, fontSize:11 }}><strong style={{ color:C.gold }}>Q:</strong> {e.q}</div>
                    <div style={{ color:C.boneDim, fontSize:11, marginTop:3 }}><strong style={{ color:C.greenLight }}>A:</strong> {e.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD TAB */}
        {tab === "add" && (
          <div className="fade-up">
            <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:14, padding:22 }}>
              <div style={{ color:C.goldLight, fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:13, letterSpacing:1.5, marginBottom:18 }}>ADD NEW ENTRY</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                {[
                  { key:"c", label:"Chickasaw Word / Phrase", ph:"e.g. Yakoke" },
                  { key:"p", label:"Pronunciation", ph:"e.g. YAH-koh-keh" },
                  { key:"e", label:"English Meaning", ph:"e.g. Thank you" },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.key==="e"?"1 / -1":"auto" }}>
                    <div style={{ color:C.boneDim, fontSize:10, letterSpacing:1, fontFamily:"Rajdhani,sans-serif", marginBottom:5 }}>{f.label}</div>
                    <input value={newEntry[f.key]} onChange={ev=>setNewEntry({...newEntry,[f.key]:ev.target.value})} placeholder={f.ph} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.bone, padding:"9px 12px", fontSize:13, fontFamily:"inherit" }}/>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ color:C.boneDim, fontSize:10, letterSpacing:1, fontFamily:"Rajdhani,sans-serif", marginBottom:5 }}>CATEGORY</div>
                <select value={newEntry.cat} onChange={e=>setNewEntry({...newEntry,cat:e.target.value})} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.bone, padding:"9px 12px", fontSize:13, fontFamily:"inherit", cursor:"pointer" }}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ color:C.boneDim, fontSize:10, letterSpacing:1, fontFamily:"Rajdhani,sans-serif", marginBottom:5 }}>CULTURAL CONTEXT</div>
                <textarea value={newEntry.ctx} onChange={e=>setNewEntry({...newEntry,ctx:e.target.value})} placeholder="Cultural significance, usage notes, historical context..." rows={3} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.bone, padding:"9px 12px", fontSize:13, resize:"vertical", fontFamily:"inherit" }}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
                <div>
                  <div style={{ color:C.boneDim, fontSize:10, letterSpacing:1, fontFamily:"Rajdhani,sans-serif", marginBottom:5 }}>TRAINING QUESTION (optional — auto-generated if blank)</div>
                  <textarea value={newEntry.q} onChange={e=>setNewEntry({...newEntry,q:e.target.value})} placeholder="How do you say X in Chickasaw?" rows={2} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.bone, padding:"9px 12px", fontSize:12, resize:"vertical", fontFamily:"inherit" }}/>
                </div>
                <div>
                  <div style={{ color:C.boneDim, fontSize:10, letterSpacing:1, fontFamily:"Rajdhani,sans-serif", marginBottom:5 }}>TRAINING ANSWER (optional — auto-generated if blank)</div>
                  <textarea value={newEntry.a} onChange={e=>setNewEntry({...newEntry,a:e.target.value})} placeholder="Auto-generated from word + context..." rows={2} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.bone, padding:"9px 12px", fontSize:12, resize:"vertical", fontFamily:"inherit" }}/>
                </div>
              </div>
              <button className="btn" onClick={addEntry} disabled={!newEntry.c||!newEntry.e} style={{ background:newEntry.c&&newEntry.e?C.gold:C.border, color:newEntry.c&&newEntry.e?C.bg:C.muted, border:"none", borderRadius:9, padding:"11px 24px", fontWeight:800, fontSize:13, cursor:newEntry.c&&newEntry.e?"pointer":"not-allowed", fontFamily:"Rajdhani,sans-serif", letterSpacing:1 }}>
                Add to Dataset ◉
              </button>
            </div>
          </div>
        )}

        {/* EXPORT TAB */}
        {tab === "export" && (
          <div className="fade-up">
            <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:14, padding:24, marginBottom:16 }}>
              <div style={{ color:C.goldLight, fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:13, letterSpacing:1.5, marginBottom:16 }}>EXPORT TRAINING DATASET</div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
                {[
                  { v:entries.length, l:"Word Entries" },
                  { v:entries.length*3, l:"Training Pairs" },
                  { v:CATS.length, l:"Categories" },
                  { v:"JSONL", l:"Format" },
                ].map((m,i) => (
                  <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderTop:`2px solid ${C.gold}`, borderRadius:10, padding:"14px 18px", flex:1, minWidth:100 }}>
                    <div style={{ color:C.goldLight, fontFamily:"Rajdhani,sans-serif", fontSize:22, fontWeight:700 }}>{m.v}</div>
                    <div style={{ color:C.boneDim, fontSize:11, fontFamily:"Rajdhani,sans-serif", letterSpacing:0.5 }}>{m.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:18 }}>
                <div style={{ color:C.muted, fontSize:10, letterSpacing:1, fontFamily:"Rajdhani,sans-serif", marginBottom:10 }}>SAMPLE OUTPUT</div>
                <div style={{ color:C.greenLight, fontSize:11, fontFamily:"monospace", lineHeight:1.8 }}>
                  {`{"prompt":"How do you say thank you in Chickasaw?","completion":"Yakoke (YAH-koh-keh) means thank you..."}`}<br/>
                  {`{"prompt":"What does Yakoke mean in Chickasaw?","completion":"Yakoke (YAH-koh-keh) means thank you..."}`}<br/>
                  {`{"prompt":"Translate \\"thank you\\" to Chickasaw","completion":"The Chickasaw word for thank you is Yakoke..."}`}
                </div>
              </div>
              <button className="btn" onClick={exportJSONL} style={{ background:C.green, color:C.cream, border:"none", borderRadius:9, padding:"12px 28px", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"Rajdhani,sans-serif", letterSpacing:1, boxShadow:`0 0 16px ${C.green}50` }}>
                {copied ? `✓ Downloaded ${exportCount} training pairs!` : "⬇ Download JSONL for Hugging Face"}
              </button>
            </div>

            <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
              <div style={{ color:C.goldLight, fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:12, letterSpacing:1.5, marginBottom:14 }}>NEXT STEPS AFTER DOWNLOAD</div>
              {[
                { n:"1", t:"Upload to Hugging Face", d:"Go to huggingface.co → Datasets → Create → Upload your .jsonl file" },
                { n:"2", t:"Request Llama 3.1 8B Access", d:"Go to meta-llama/Llama-3.1-8B on Hugging Face → Request Access (free, approved same day)" },
                { n:"3", t:"Launch AutoTrain", d:"huggingface.co/autotrain → New Project → Fine-tune → select your dataset and Llama 3.1 8B" },
                { n:"4", t:"Run Fine-tune (~$20)", d:"AutoTrain handles everything. Takes 1-2 hours. Your CFM endpoint is ready when complete." },
                { n:"5", t:"Point CFM App at Your Model", d:"Replace the Anthropic API URL in your CFM app with your Hugging Face model endpoint. Fully sovereign." },
              ].map((s,i) => (
                <div key={i} style={{ display:"flex", gap:14, marginBottom:14, alignItems:"flex-start" }}>
                  <div style={{ background:C.forest, border:`1px solid ${C.green}50`, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ color:C.goldLight, fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:14 }}>{s.n}</span>
                  </div>
                  <div>
                    <div style={{ color:C.bone, fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:13, marginBottom:3 }}>{s.t}</div>
                    <div style={{ color:C.boneDim, fontSize:12, lineHeight:1.5 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
