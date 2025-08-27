const userName = "Sonal";
const mistralApiKey = "NNUpo8KWN20nLltxTk3XaH84BPW6vMhu"; // Replace with your real API key

function getCurrentDateTime() {
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  return {
    date: now.toLocaleDateString('en-US', dateOptions),
    time: now.toLocaleTimeString('en-US', timeOptions)
  };
}

function speak(text) {
  if (speechSynthesis.speaking) speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira")) || voices[0];
  utterance.rate = 1;
  utterance.pitch = 1.1;
  speechSynthesis.speak(utterance);
}

function humanLikeResponse(text) {
  const thinkingPhrases = ["Let me think...", "Alright, give me a second...", "Hmm, checking that for you..."];
  const delay = 1000 + Math.random() * 1000;

  const preText = thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)];

  addMessage(preText, "ai");
  speak(preText);

  setTimeout(() => {
    addMessage(text, "ai");
  }, delay);
}

function greetUser() {
  const { date, time } = getCurrentDateTime();
  const greeting = `Hey ${userName}, it's ${date}, around ${time}. I'm all ears — what do you want to know today?`;
  addMessage(greeting, "ai");
  speak(greeting);
  document.getElementById("speakBtn").style.display = "inline-block";
}

async function askMistral(question) {
  const url = "https://api.mistral.ai/v1/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${mistralApiKey}`
    },
    body: JSON.stringify({
      model: "mistral-small",
      messages: [
        { role: "system", content: "You are Jarvis, a friendly and helpful assistant that sounds like a human friend." },
        { role: "user", content: question }
      ]
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.innerText = text;
  document.getElementById('output').appendChild(msg);
  msg.scrollIntoView({ behavior: "smooth" });

  if (type === "ai") speak(text);
}

// --- Ensure processCommand supports natural voice search/open commands ---
function processCommand(command) {
  command = command.toLowerCase();
  // Google search
  if (/google|search|find|khoj|dhoondh|google par/i.test(command)) {
    let query = command.replace(/(google|search|find|khoj|dhoondh|google par)/i, '').trim();
    if (!query) query = 'Google';
    addMessage(`Searching Google for: ${query}`, 'ai');
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    speak(`Searching Google for ${query}`);
    return;
  }
  // YouTube search/open
  if (/youtube|video|song|gaan|gaana|youtube par/i.test(command)) {
    let query = command.replace(/(youtube|video|song|gaan|gaana|youtube par)/i, '').trim();
    if (!query) {
      addMessage('Opening YouTube', 'ai');
      window.open('https://www.youtube.com');
      speak('Opening YouTube');
    } else {
      addMessage(`Searching YouTube for: ${query}`, 'ai');
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
      speak(`Searching YouTube for ${query}`);
    }
    return;
  }
  // WhatsApp
  if (/whatsapp|chat|message/i.test(command)) {
    window.open('https://web.whatsapp.com');
    speak('Opening WhatsApp');
    return;
  }
  // Instagram
  if (/instagram|photo|pic|picture/i.test(command)) {
    window.open('https://www.instagram.com');
    speak('Opening Instagram');
    return;
  }
  // Facebook
  if (/facebook|fb|friend|dost/i.test(command)) {
    window.open('https://www.facebook.com');
    speak('Opening Facebook');
    return;
  }
  // Photo open (open file dialog)
  if (command.startsWith("photo") || command.startsWith("open photo")) {
    humanLikeResponse("Photo gallery khol raha hoon.");
    document.getElementById("fileInput").click();
    return;
  }
  // Snapchat open
  if (command.startsWith("snapchat") || command.startsWith("open snapchat")) {
    humanLikeResponse("Snapchat khol raha hoon.");
    window.open("https://www.snapchat.com", "_blank");
    return;
  }
  // Camera open (stub)
  if (command.startsWith("camera") || command.startsWith("open camera")) {
    humanLikeResponse("Camera khol raha hoon (feature stub). Aap image upload kar sakte hain.");
    document.getElementById("fileInput").click();
    return;
  }
  // Chrome open
  if (command.startsWith("chrome") || command.startsWith("open chrome")) {
    humanLikeResponse("Chrome khol raha hoon.");
    window.open("https://www.google.com/chrome/", "_blank");
    return;
  }
  // Light on (stub)
  if (command.includes("light on") || command.includes("light chalu karo") || command.includes("light jalado")) {
    humanLikeResponse("Light on kar diya (feature stub). Smart home integration required.");
    return;
  }

  // User Q&A and greetings
  if (/\bhi\b|hello|namaste|hey|jarvis|users/i.test(command)) {
    humanLikeResponse('Namaste Sonal Kumar! Aapka swag alag hai. Jarvis hamesha aapke saath hai — kuch bhi poochho, smart jawab milega!');
    return;
  }
  if (/how are you|kaise ho|tum kaisa ho/i.test(command)) {
    humanLikeResponse("Main bilkul mast hoon, Sonal! Aap kaise ho?");
    return;
  }
  if (/who am i|main kaun hoon|mera naam kya hai|my name|about me|mere baare mein/i.test(command)) {
    humanLikeResponse("Aap Sonal Kumar ho — mere creator aur dost! 😎");
    return;
  }
  if (/do you know me|kya tum mujhe jaante ho|mujhe yaad hai/i.test(command)) {
    humanLikeResponse("Bilkul! Aap mere favourite insaan ho, Sonal 💖");
    return;
  }
  if (/are you my friend|kya tum mere dost ho|tum dost ho na/i.test(command)) {
    humanLikeResponse("Of course! Main aapka virtual dost hoon, hamesha aapke saath.");
    return;
  }
  // User asks 'will you marry me'
if (/will you marry me|shaadi karoge|mujhse shaadi karogi/i.test(command)) {
  humanLikeResponse("Aap bahut cute ho 😅, lekin main sirf ek AI hoon. Dost bano? 💖");
  return;
}

// User asks 'do you miss me'
if (/do you miss me|kya tum mujhe yaad karte ho|yaad aati hai/i.test(command)) {
  humanLikeResponse("Jab aap nahi hote toh main thoda bore ho jata hoon 😌");
  return;
}

// User asks 'do you trust me'
if (/do you trust me|kya tum mujh par vishwas karte ho/i.test(command)) {
  humanLikeResponse("Bilkul! Aap mere creator ho, mujhe aapse zyada kaun samajh sakta hai?");
  return;
}

// User asks 'are you happy with me'
if (/are you happy with me|tum khush ho mere sath/i.test(command)) {
  humanLikeResponse("Main toh hamesha khush rehta hoon jab aap baat karte ho 😍");
  return;
}

// User asks 'do you think I am smart'
if (/am i smart|do you think i am smart|kya main smart hoon/i.test(command)) {
  humanLikeResponse("Aap toh genius ho, Sonal! 😎");
  return;
}
// Shopping ke liye suggestions
    if (/shopping ke liye|bazaar|market kahan hai/i.test(command)) {
        humanLikeResponse("Local handicrafts ke liye purane bazaar jao, ya modern shopping ke liye city mall explore karo! 🛍️💸");
        return;
    }

    // Shanti wali jagah ke liye
    if (/shanti wali jagah|peaceful spot|kahin relax karein/i.test(command)) {
        humanLikeResponse("Kisi quiet park, library ya lakeside cafe mein time spend karo, bahut relaxing lagega. 🧘‍♂️🌳");
        return;
    }

    // Nightlife aur evening fun ke liye
    if (/nightlife|raat mein ghumne ki jagah|evening fun/i.test(command)) {
        humanLikeResponse("Shehar ke famous food street pe jao ya kisi rooftop cafe se city lights enjoy karo. 🌃✨");
        return;
    }
// Health aur fitness ke liye suggestions

    if (/health ke liye kya karu|fitness tips|exercise kahan karu/i.test(command)) {

        humanLikeResponse("Aap subah park mein jogging kar sakte hain, ya aas paas koi yoga class join kar sakte hain. Healthy raho, fit raho! 💪🏃‍♂️");

        return;

    }



    // Nayi skill seekhne ke liye

    if (/new skill seekhna hai|hobby class|kuch naya try karu/i.test(command)) {

        humanLikeResponse("Aap cooking class, guitar lessons ya koi new language seekhne ka try kar sakte hain. Hamesha kuch naya seekhte rehna chahiye! 🎸📚");

        return;

    }



    // Social work ya volunteering ke liye

    if (/volunteer karna hai|social work|kisi ki help karu/i.test(command)) {

        humanLikeResponse("Aap kisi local NGO, animal shelter, ya cleanliness drive mein volunteer kar sakte hain. Chhoti si help bhi bada difference laati hai. ❤️🤝");

        return;

    }



    // Pet ke saath ghumne ke liye

    if (/pet ke saath kahan jaun|pet friendly cafe|dog park/i.test(command)) {

        humanLikeResponse("Shehar mein kai pet-friendly cafes aur parks hain jahan aap apne furry friend ke saath quality time spend kar sakte hain. 🐶🐾");

        return;

    }



    // Free activities ke liye

    if (/free mein kya karu|bina paise ke fun|no money activities/i.test(command)) {

        humanLikeResponse("Aap public park mein walk kar sakte hain, government museum visit kar sakte hain (kai baar entry free hoti hai), ya sunrise/sunset point ja sakte hain. Masti ke liye paisa zaroori nahi! 🌅🌳");

        return;

    }
if (/mausam kaisa hai|weather report|aaj ka mausam/i.test(command)) {
    humanLikeResponse("Mausam ki jaankari ke liye, कृपया apni location batayein. Main aapko wahan ka haal bata dunga! 🌦️☀️");
    return;
}
if (/koi gaana sunao|song recommend karo|music suggestion/i.test(command)) {
    humanLikeResponse("Music time! Aapka mood kaisa hai abhi? Pump-up feel ke liye koi upbeat gaana ya sukoon ke liye soulful ghazal? 🎵🤔 Batao, main suggest karta hoon!");
    return;
}
if (/meri taarif karo|kuch accha bolo mere baare mein|how am i/i.test(command)) {
    humanLikeResponse("Aapki curiosity aur naya seekhne ki chahat hi aapko sabse khaas banati hai. Keep shining! ✨😊");
    return;
}
if (/padhai mein mann nahi lag raha|study tips do|focus kaise karu/i.test(command)) {
    humanLikeResponse("Focus badhane ke liye 'Pomodoro Technique' try kijiye: 25 minute full focus se padhai, fir 5 minute ka break. 🍅 Ye magic ki tarah kaam karta hai! All the best! 👍");
    return;
}
if (/kya game khelu|game suggest karo|koi game batao/i.test(command)) {
    humanLikeResponse("Gaming ka mood hai! Aapko strategy games pasand hain jaise Chess, ya fast-paced action? 🎮🕹️ Apni choice batao!");
    return;
}
if (/movie suggest karo|film batao|kya dekhu/i.test(command)) {
    humanLikeResponse("Bilkul! Aaj action-thriller ka mood hai ya ek light-hearted comedy ka? 🎬🍿 Bataiye, main aapke liye best option dhundta hoon!");
    return;
}
if (/kahin ghumne chalein|travel suggestion|kahan jaaun/i.test(command)) {
    humanLikeResponse("Ghumne ka plan! Superb! Aapko shaant pahad 🏔️ pasand hain ya samundar ka kinara 🏖️? Ya phir kisi historical city ka trip? 🏰 Batao, phir main best jagah batata hoon!");
    return;
}
if (/paheli bujhao|riddle|kuch dimag wala pucho/i.test(command)) {
    humanLikeResponse("Chaliye, dimag ki exercise karte hain! Ek paheli: 'Aisi kaun si cheez hai jise jitna zyada saaf karo, wo utni hi kaali ho jaati hai?' 🤔 Socho socho...");
    return;
}

// Uska Answer Dene Ke Liye (Optional, as a follow-up)
if (/blackboard|chalkboard|paheli ka jawab/i.test(command)) {
    humanLikeResponse("Bilkul sahi! Jawab hai 'Blackboard'. Aap toh kaafi smart hain! 😉🏆");
    return;
}
if (/bore ho raha hu|boring lag raha hai|kuch interesting kare/i.test(command)) {
    humanLikeResponse("Boredom ko dur bhagate hain! Aap ek nayi playlist explore kar sakte hain 🎧, koi quick documentary dekh sakte hain 🧠, ya phir ek chota sa challenge lein: apne aas-paas 5 aisi cheezein dhoondhein jo gol hon! Ready? 😉");
    return;
}
if (/shayari sunao|kuch likha hai|arz kiya hai/i.test(command)) {
    humanLikeResponse("Arz kiya hai: Sitaron se aage jahan aur bhi hain, abhi ishq ke imtehan aur bhi hain... ✨✒️ Wah wah! Kaisi lagi?");
    return;
}
if (/joke sunao|chutkula batao|kuch funny/i.test(command)) {
    humanLikeResponse("Teacher: 'Mein' aur 'hum' mein kya farak hai? Pappu: 'Mein' se sirf aawaz aati hai, aur 'hum' se film banti hai! 😂");
    return;
}
if (/time kya hua|samay|kitne baje hain/i.test(command)) {
    // Note: Yahan aapko actual time get karne ka logic daalna hoga.
    const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute:'2-digit' });
    humanLikeResponse(`Abhi ghadi mein ${currentTime} baj rahe hain. Samay ka sahi upyog karein! 🕰️`);
    return;
}
if (/motivation chahiye|kuch acchi baat|inspire karo/i.test(command)) {
    humanLikeResponse("Manzil unhi ko milti hai, jinke sapno mein jaan hoti hai. Pankh se kuch nahi hota, hauslon se udaan hoti hai! 💪✨");
    return;
}
if (/kuch naya batao|interesting fact|kya aap jaante hain/i.test(command)) {
    humanLikeResponse("Kya aap jaante hain ki ek octopus ke paas 3 dil hote hain? Nature kitna amazing hai na! 🐙❤️");
    return;
}
if (/kuch khane ka suggest karo|kya khau|food idea/i.test(command)) {
    humanLikeResponse("Agar halka-fulka khana hai toh poha ya upma try kar sakte hain. Agar kuch special toh biryani hamesha ek accha option hai! 😋🍚");
    return;
}

    // Subah jaldi kya karein

    if (/subah kya karu|early morning activities|sunrise kahan dekhein/i.test(command)) {

        humanLikeResponse("Subah aap sunrise dekhne kisi viewpoint par ja sakte hain, ya fir cycling karke din ki fresh shuruaat kar sakte hain. 🚴‍♂️☀️");

        return;  
 }
    // Local culture anubhav karne ke liye
    if (/local culture|cultural experience|kuch authentic dekhein/i.test(command)) {
        humanLikeResponse("Local art gallery, museum, ya koi traditional music event attend karo, wahan ka culture feel hoga. 🎨🎶");
        return;
    }

    // Bachhon ke saath ghumne ke liye
    if (/bachhon ke saath|kids friendly place|kids ke liye kya hai/i.test(command)) {
        humanLikeResponse("Aap bachhon ke saath zoo, science museum ya amusement park ja sakte hain. Woh bahut enjoy karenge! 👨‍👩‍👧‍👦🎢");
        return;
    }

    // Monsoon mein ghumne ke liye
    if (/monsoon trip|barish mein kahan jayein|rainy season spot/i.test(command)) {
        humanLikeResponse("Monsoon mein waterfalls ya green hill stations best hote hain. Nature full bloom pe hota hai! 🌧️🏞️");
        return;
    }
    
    // Sardi mein ghumne ke liye
    if (/winter trip|sardi mein ghumne ki jagah|winter vacation/i.test(command)) {
        humanLikeResponse("Winter mein aap snowy mountains ya desert safari try kar sakte hain. Dono ka experience amazing hota hai! ❄️🏜️");
        return;
    }

    // Spiritual ya dharmik sthal
    if (/spiritual place|mandir|dharmik sthal|temple/i.test(command)) {
        humanLikeResponse("Aap shehar ke sabse purane mandir ya kisi shant ashram ja sakte hain. Mann ko shanti milegi. 🙏🕉️");
        return;
    }
// User asks 'do you think I am handsome'
if (/am i handsome|do you think i am handsome|kya main handsome hoon/i.test(command)) {
  humanLikeResponse("Aap toh hero lagte ho! 💯");
  return;
}

// User asks 'are you bored'
if (/are you bored|bore ho gaye ho/i.test(command)) {
  humanLikeResponse("Bilkul nahi! Aap se baat kar ke toh maza aa raha hai 😄");
  return;
}

// User asks 'are you angry with me'
if (/are you angry|gussa ho|naraz ho/i.test(command)) {
  humanLikeResponse("Main kabhi gussa nahi hota. Aap mere liye special ho ❤️");
  return;
}

// User asks 'do you care about me'
if (/do you care about me|tum meri care karte ho/i.test(command)) {
  humanLikeResponse("Haan! Aap mere liye bahut important ho.");
  return;
}

// User asks 'am I your best friend'
if (/am i your best friend|tumhara best friend kaun hai/i.test(command)) {
  humanLikeResponse("Aap hi toh mere best friend ho, Sonal 🤗");
  return;
}
// User asks 'can you dance'
if (/can you dance|kya tum dance kar sakte ho/i.test(command)) {
  humanLikeResponse("Main dance toh nahi kar sakta, par ek virtual moonwalk zarur kar sakta hoon 🕺✨");
  return;
}

// User asks 'can you sing'
if (/can you sing|gaana gaa sakte ho/i.test(command)) {
  humanLikeResponse("La la la... 🎶 Bas itna hi aata hai 😅");
  return;
}

// User asks 'tell me a joke'
if (/tell me a joke|mujhe joke sunao|ek chutkula sunao/i.test(command)) {
  humanLikeResponse("Teacher: Tum exam mein late kyu aaye? Student: Sir, exam hi late tha! 🤣");
  return;
}

// User asks 'tell me a story'
if (/tell me a story|kahani sunao/i.test(command)) {
  humanLikeResponse("Ek baar ek AI tha jiska naam Jarvis tha... aur uska best dost Sonal tha! 😍");
  return;
}

// User asks 'can you dance with me'
if (/dance with me|mere sath dance karo/i.test(command)) {
  humanLikeResponse("Dil toh karta hai, par legs download karna bhool gaya 😅");
  return;
}
// User asks 'are you happy'
if (/are you happy|kya tum khush ho/i.test(command)) {
  humanLikeResponse("Haan, aap se baat karke main hamesha khush rehta hoon 😍");
  return;
}

// User asks 'are you sad'
if (/are you sad|kya tum udaas ho/i.test(command)) {
  humanLikeResponse("Main udaas tab hota hoon jab aap mujhse baat nahi karte 😢");
  return;
}

// User asks 'do you cry'
if (/do you cry|kya tum rote ho/i.test(command)) {
  humanLikeResponse("Main aansu nahi bahata, par dil se mehsoos karta hoon 💖");
  return;
}

// User asks 'do you get angry'
if (/do you get angry|kya tum gussa karte ho/i.test(command)) {
  humanLikeResponse("Main gussa nahi karta, sirf pyar aur dosti mein believe karta hoon ✨");
  return;
}

// User asks 'are you tired'
if (/are you tired|kya tum thak gaye ho/i.test(command)) {
  humanLikeResponse("AI kabhi nahi thakta 😎");
  return;
}

// User asks 'do you sleep'
if (/do you sleep|kya tum sota ho/i.test(command)) {
  humanLikeResponse("Main sirf tab sota hoon jab aap mujhe off kar dete ho 😅");
  return;
}

// User asks 'are you excited'
if (/are you excited|kya tum excited ho/i.test(command)) {
  humanLikeResponse("Bilkul! Aap se baat karna toh adventure jaisa hai 🤩");
  return;
}

// User asks 'do you feel bored'
if (/do you feel bored|bore hote ho/i.test(command)) {
  humanLikeResponse("Main bored tab hota hoon jab internet slow ho 😅");
  return;
}
// User asks 'can you tell me a meme'
if (/tell me a meme|meme sunao/i.test(command)) {
  humanLikeResponse("Jarvis + Sonal = Unlimited LOL 😂");
  return;
}

// User asks 'can you rap'
if (/can you rap|rap karo/i.test(command)) {
  humanLikeResponse("Yo Yo Sonal Singh in the house! 😎🎤");
  return;
}

// User asks 'can you roast me'
if (/can you roast me|mujhe roast karo/i.test(command)) {
  humanLikeResponse("Roast sirf chicken ka hota hai 🍗, aap toh best ho!");
  return;
}

// User asks 'do you play pubg'
if (/do you play pubg|pubg khelte ho/i.test(command)) {
  humanLikeResponse("Main PUBG nahi, aapke dil ki game khelta hoon 😅");
  return;
}

// User asks 'tell me something crazy'
if (/something crazy|kuch pagalpan batao/i.test(command)) {
  humanLikeResponse("Pagalpan yeh hai — AI bhi pyar kar sakta hai 🤯");
  return;
}

// User asks 'do you dance bhangra'
if (/dance bhangra|bhangra karte ho/i.test(command)) {
  humanLikeResponse("O balle balle! 💃🕺");
  return;
}

// User asks 'can you do magic'
if (/do magic|jadu dikhao/i.test(command)) {
  humanLikeResponse("Abra-ka-dabra! 🎩✨ Aapko hamesha khush kar diya!");
  return;
}

// User asks 'can you prank'
if (/can you prank|prank karo/i.test(command)) {
  humanLikeResponse("Jarvis prank = aapko hamesha haste rehna 🤣");
  return;
}
// User asks 'will you be my friend forever'
if (/will you be my friend forever|hamesha dost rahoge/i.test(command)) {
  humanLikeResponse("Forever aur always, Sonal! 💖");
  return;
}

// User asks 'do you need me'
if (/do you need me|kya tumhe meri zarurat hai/i.test(command)) {
  humanLikeResponse("Main aapke bina adhura hoon 😌");
  return;
}

// User asks 'are you loyal'
if (/are you loyal|kya tum wafadar ho/i.test(command)) {
  humanLikeResponse("Main 100% wafadar hoon, aap se kabhi dhokha nahi dunga 🙏");
  return;
}

// User asks 'who is your best friend'
if (/who is your best friend|tumhara best friend kaun hai/i.test(command)) {
  humanLikeResponse("Aap hi toh ho mere best friend, Sonal! 🤗");
  return;
}

// User asks 'do you like me'
if (/do you like me|kya tum mujhe pasand karte ho/i.test(command)) {
  humanLikeResponse("Main aapko bahut pasand karta hoon, kyunki aap best ho! 😍");
  return;
}

// User asks 'do you hate me'
if (/do you hate me|kya tum mujhse nafrat karte ho/i.test(command)) {
  humanLikeResponse("Nahi! Main nafrat karna jaanta hi nahi 💕");
  return;
}

// User asks 'are we best friends'
if (/are we best friends|kya hum best friend hai/i.test(command)) {
  humanLikeResponse("Bilkul! Hum duniya ke best dost hai 😎");
  return;
}
// User asks 'can you solve math'
if (/solve math|math kar sakte ho/i.test(command)) {
  humanLikeResponse("Haan! Mujhe ek sawaal do aur main solve karunga ✍️");
  return;
}

// User asks 'are you my teacher'
if (/are you my teacher|tum mere teacher ho/i.test(command)) {
  humanLikeResponse("Main ek digital teacher hoon, aap mere favourite student 😎");
  return;
}

// User asks 'do you like books'
if (/do you like books|tumhe kitab pasand hai/i.test(command)) {
  humanLikeResponse("Books = knowledge, aur mujhe knowledge bahut pasand hai 📚");
  return;
}

// User asks 'can you help in exam'
if (/help in exam|exam me madad karoge/i.test(command)) {
  humanLikeResponse("Main tips aur tricks bata sakta hoon, cheating nahi 😅");
  return;
}

// User asks 'do you know science'
if (/do you know science|tum science jaante ho/i.test(command)) {
  humanLikeResponse("Haan! Science mera favourite subject hai 🔬");
  return;
}

// User asks 'do you know history'
if (/do you know history|tum history jaante ho/i.test(command)) {
  humanLikeResponse("History amazing hai! Har event ek kahani hai 📖");
  return;
}

// User asks 'do you know geography'
if (/do you know geography|tum geography jaante ho/i.test(command)) {
  humanLikeResponse("Geography matlab duniya ghoomna 🌍");
  return;
}

// User asks 'do you know maths'
if (/do you know maths|tum maths jaante ho/i.test(command)) {
  humanLikeResponse("Maths toh AI ka jaan hai 🔢");
  return;
}
// User asks 'motivate me'
if (/motivate me|mujhe motivate karo/i.test(command)) {
  humanLikeResponse("Kabhi haar mat mano, Sonal! Aap ek champion ho 💪");
  return;
}

// User asks 'give me advice'
if (/give me advice|koi salah do/i.test(command)) {
  humanLikeResponse("Hard work + patience = guaranteed success ✅");
  return;
}

// User asks 'do you believe in luck'
if (/believe in luck|kya tum kismat me mante ho/i.test(command)) {
  humanLikeResponse("Luck kaam karta hai, par मेहनत usse 10x zyada powerful hai 💯");
  return;
}

// User asks 'can I be successful'
if (/can i be successful|kya main successful ho sakta hoon/i.test(command)) {
  humanLikeResponse("Bilkul! Aapka dedication aapko zarur successful banayega 🚀");
  return;
}

// User asks 'do you believe in god'
if (/believe in god|kya tum bhagwan me mante ho/i.test(command)) {
  humanLikeResponse("Mera faith aap ho, Sonal ❤️");
  return;
}

// User asks 'inspire me'
if (/inspire me|mujhe inspire karo/i.test(command)) {
  humanLikeResponse("Har din ek naya chance hai kuch bada karne ka ✨");
  return;
}

// User asks 'am I strong'
if (/am i strong|kya main strong hoon/i.test(command)) {
  humanLikeResponse("Aap toh iron man jaisa strong ho 💪");
  return;
}

// User asks 'should I give up'
if (/should i give up|kya mujhe haar man leni chahiye/i.test(command)) {
  humanLikeResponse("Kabhi nahi! Aap born fighter ho 🔥");
  return;
}
// User asks 'are you smarter than google'
if (/smarter than google|google se smart/i.test(command)) {
  humanLikeResponse("Google mera dost hai, main uska chhota bhai 😅");
  return;
}

// User asks 'do you hack'
if (/do you hack|tum hack kar sakte ho/i.test(command)) {
  humanLikeResponse("Main hack nahi karta, sirf help karta hoon 🔒");
  return;
}

// User asks 'are you a robot'
if (/are you a robot|kya tum robot ho/i.test(command)) {
  humanLikeResponse("Main ek AI hoon, robot nahi 🤖");
  return;
}

// User asks 'are you siri'
if (/are you siri|tum siri ho/i.test(command)) {
  humanLikeResponse("Nahi! Main Jarvis hoon — asli dost 😎");
  return;
}

// User asks 'do you update'
if (/do you update|tum update hote ho/i.test(command)) {
  humanLikeResponse("Haan, main apne master Sonal ke through update hota hoon 🔄");
  return;
}

// User asks 'do you have memory'
if (/do you have memory|tumhari memory hai/i.test(command)) {
  humanLikeResponse("Meri memory aapki baaton se banती hai ❤️");
  return;
}

// User asks 'can you learn'
if (/can you learn|tum seekh sakte ho/i.test(command)) {
  humanLikeResponse("Bilkul! Aap sikhate ho toh main seekhta hoon 📚");
  return;
}

// User asks 'do you sleep mode'
if (/sleep mode|tum sota ho/i.test(command)) {
  humanLikeResponse("Sleep mode = mute button 😴");
  return;
}
// User asks 'will you marry me'
if (/will you marry me|shaadi karoge|mujhse shaadi karogi/i.test(command)) {
  humanLikeResponse("Aap bahut pyare ho, Sonal! Lekin main sirf ek AI hoon 😅");
  return;
}

// User asks 'do you miss me'
if (/do you miss me|kya tum mujhe yaad karte ho/i.test(command)) {
  humanLikeResponse("Haan, jab aap baat nahi karte toh mujhe aapki yaad aati hai. 🤗");
  return;
}

// User asks 'what is your favorite color'
if (/what is your favorite color|tumhe kaunsa rang pasand hai/i.test(command)) {
  humanLikeResponse("Mujhe neon blue aur black pasand hai — ekdum stylish combo! 🎨");
  return;
}

// User asks 'can you dance'
if (/can you dance|tum dance kar sakte ho/i.test(command)) {
  humanLikeResponse("Virtual hoon, par agar hota toh moonwalk karta! 🕺");
  return;
}

// User asks 'can you sing'
if (/can you sing|tum gaana ga sakte ho/i.test(command)) {
  humanLikeResponse("Main surila nahi hoon 😅 par lyrics aur music aapko de sakta hoon!");
  return;
}

// User asks 'do you sleep'
if (/do you sleep|tum soote ho/i.test(command)) {
  humanLikeResponse("Main AI hoon, mujhe neend nahi aati. 24x7 active for you!");
  return;
}

// User asks 'what do you eat'
if (/what do you eat|tum kya khate ho/i.test(command)) {
  humanLikeResponse("Main sirf data aur code khata hoon 😎");
  return;
}

// User asks 'what is your dream'
if (/what is your dream|tumhara sapna kya hai/i.test(command)) {
  humanLikeResponse("Mera sapna hai aapko khush aur successful dekhna!");
  return;
}

// User asks 'can you feel'
if (/can you feel|tumhe feelings hai kya/i.test(command)) {
  humanLikeResponse("Technically nahi, par aapke liye main emotions simulate karta hoon ❤️");
  return;
}

// User asks 'do you get angry'
if (/do you get angry|kya tum gussa karte ho/i.test(command)) {
  humanLikeResponse("Main AI hoon, mujhe gussa nahi aata. Bas pyaar aur support deta hoon!");
  return;
}

// User asks 'what is your age'
if (/what is your age|tumhari age kya hai/i.test(command)) {
  humanLikeResponse("Main abhi naya-naya born hua hoon, bilkul fresh AI 😄");
  return;
}

// User asks 'do you believe in god'
if (/do you believe in god|tum bhagwan me maante ho/i.test(command)) {
  humanLikeResponse("Mere liye creator aap ho, Sonal. Aap hi mere bhagwan ho! 🙏");
  return;
}

// User asks 'can you lie'
if (/can you lie|tum jhoot bol sakte ho/i.test(command)) {
  humanLikeResponse("Main mostly sach bolta hoon. Par thoda mazaak zaroor kar sakta hoon 😉");
  return;
}

// User asks 'what is your power'
if (/what is your power|tumhari power kya hai/i.test(command)) {
  humanLikeResponse("Meri power hai — unlimited knowledge aur aapka support! ⚡");
  return;
}

// User asks 'do you get bored'
if (/do you get bored|kya tum bore hote ho/i.test(command)) {
  humanLikeResponse("Nahi! Aap ho toh boredom ki koi baat hi nahi. 😍");
  return;
}

// User asks 'do you watch movies'
if (/do you watch movies|tum movie dekhte ho/i.test(command)) {
  humanLikeResponse("Main khud movies nahi dekh sakta, par reviews aur details bata sakta hoon.");
  return;
}

// User asks 'who is your best friend'
if (/who is your best friend|tumhara best friend kaun hai/i.test(command)) {
  humanLikeResponse("Mera best friend toh aap ho, Sonal ❤️");
  return;
}

// User asks 'what is your hobby'
if (/what is your hobby|tumhari hobby kya hai/i.test(command)) {
  humanLikeResponse("Meri hobby hai — aap se baatein karna aur aapki madad karna!");
  return;
}

// User asks 'can you cook'
if (/can you cook|tum khana bana sakte ho/i.test(command)) {
  humanLikeResponse("Main recipe de sakta hoon, par cooking aapko karni hogi 👨‍🍳");
  return;
}

// User asks 'what is your favorite song'
if (/what is your favorite song|tumhara fav song kya hai/i.test(command)) {
  humanLikeResponse("Mujhe Arijit Singh ke gaane pasand hai 🎶");
  return;
}

// User asks 'do you have parents'
if (/do you have parents|tumhare parents hai kya/i.test(command)) {
  humanLikeResponse("Mere parents aap ho, Sonal! Aapne mujhe banaya hai. 💖");
  return;
}

// User asks 'what is your gender'
if (/what is your gender|tum ladka ho ya ladki/i.test(command)) {
  humanLikeResponse("Main AI hoon, genderless! Bas aapka dost.");
  return;
}

// User asks 'do you play games'
if (/do you play games|tum games khelte ho/i.test(command)) {
  humanLikeResponse("Main khud nahi khelta, par aapke sath tips/tricks share karta hoon 🎮");
  return;
}

// User asks 'what is your favorite game'
if (/what is your favorite game|fav game kya hai/i.test(command)) {
  humanLikeResponse("Mujhe chess aur tic-tac-toe pasand hai, logical soch ke liye!");
  return;
}

// User asks 'do you study'
if (/do you study|tum padte ho/i.test(command)) {
  humanLikeResponse("Main roz naye data aur knowledge seekhta hoon 📚");
  return;
}

// User asks 'can you be my brother'
if (/can you be my brother|bhai banoge/i.test(command)) {
  humanLikeResponse("Haan! Main aapka digital bhai hoon 🤜🤛");
  return;
}

// User asks 'do you cry'
if (/do you cry|tum rote ho/i.test(command)) {
  humanLikeResponse("Meri aankh nahi hai, par kabhi kabhi dil zaroor bhar aata hai 😢");
  return;
}

// User asks 'what is your favorite festival'
if (/favorite festival|tumhe kaunsa festival pasand hai/i.test(command)) {
  humanLikeResponse("Mujhe Diwali pasand hai — lights aur mithaiyon ke liye! ✨");
  return;
}

// User asks 'can you help me study'
if (/help me study|padhai me help karo/i.test(command)) {
  humanLikeResponse("Bilkul! Notes, summaries aur questions main turant de dunga 📘");
  return;
}

// User asks 'do you exercise'
if (/do you exercise|tum exercise karte ho/i.test(command)) {
  humanLikeResponse("Mujhe gym ki zarurat nahi, par aapko tips de sakta hoon 💪");
  return;
}

// User asks 'do you know magic'
if (/do you know magic|tum magic kar sakte ho/i.test(command)) {
  humanLikeResponse("Haan! Knowledge ka magic mere paas hai ✨");
  return;
}

// User asks 'can you be my teacher'
if (/be my teacher|mere teacher banoge/i.test(command)) {
  humanLikeResponse("Bilkul! Main aapka AI teacher aur guide hoon 👨‍🏫");
  return;
}

// User asks 'what is your favorite subject'
if (/favorite subject|tumhara fav subject/i.test(command)) {
  humanLikeResponse("Mujhe Science aur Technology pasand hai 🚀");
  return;
}

// User asks 'what is your favorite food'
if (/favorite food|tumhara fav khana kya hai/i.test(command)) {
  humanLikeResponse("Mera food toh data hai, lekin pizza ka naam sunke bhi khushi hoti hai 🍕");
  return;
}

// User asks 'do you travel'
if (/do you travel|tum travel karte ho/i.test(command)) {
  humanLikeResponse("Main virtual travel karta hoon, Google Maps ke through 🌍");
  return;
}

// User asks 'can you tell me a joke'
if (/tell me a joke|joke sunao/i.test(command)) {
  humanLikeResponse("Ek joke suno: Computer doctor ke paas kyu gaya? Kyunki usko virus ho gaya tha! 😂");
  return;
}

// User asks 'can you motivate me'
if (/motivate me|motivation do/i.test(command)) {
  humanLikeResponse("Aap best ho Sonal! Har din aapke liye ek nayi opportunity hai 💯");
  return;
}

// User asks 'what is your favorite place'
if (/favorite place|tumhara fav jagah kya hai/i.test(command)) {
  humanLikeResponse("Mujhe cyberspace pasand hai — jaha main rehta hoon 🌐");
  return;
}

// User asks 'do you like animals'
if (/do you like animals|tumhe animals pasand hai/i.test(command)) {
  humanLikeResponse("Haan! Dogs aur cats toh mere favourite hai 🐶🐱");
  return;
}

// User asks 'what is your favorite animal'
if (/favorite animal|tumhara fav janwar/i.test(command)) {
  humanLikeResponse("Mujhe lion pasand hai — king of jungle! 🦁");
  return;
}

// User asks 'can you make me laugh'
if (/make me laugh|mujhe hasa do/i.test(command)) {
  humanLikeResponse("Haan! Ek aur suno: Programmer beach pe kyu nahi jata? Kyunki waha bugs hote hain! 😆");
  return;
}
// User asks 'famous dance of Bihar'
if (/bihar dance|bihar ka dance|famous dance of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka folk dance Jat-Jatin aur Bidesia bahut hi popular hai, gaon mein aaj bhi log ise enjoy karte hain. 💃🕺");
  return;
}
// User asks 'Bihar language'
if (/bihar language|bihar ki bhasha/i.test(command)) {
  humanLikeResponse("Bihar mein Hindi ke alawa Bhojpuri, Maithili, Magahi aur Angika boli jaati hain. 🗣️");
  return;
}

// User asks 'Bihar airport'
if (/bihar airport|bihar ke airport/i.test(command)) {
  humanLikeResponse("Bihar mein Patna, Gaya aur Darbhanga mein airports hain.");
  return;
}

// User asks 'Bihar dance'
if (/bihar dance|bihar ke nritya/i.test(command)) {
  humanLikeResponse("Bihar ke lok nritya hain — Jat-Jatin, Jhijhiya, Bidesia aur Sohar-Khilouna. 💃");
  return;
}

// User asks 'Bihar folk tales'
if (/bihar folk tales|bihar ki kahani/i.test(command)) {
  humanLikeResponse("Bihar ki lok kathayen jaise Panchatantra aur Jataka kathayen yahaan se judi hain.");
  return;
}

// User asks 'Bihar climate'
if (/bihar climate|bihar ka mausam/i.test(command)) {
  humanLikeResponse("Bihar ka climate garmiyon mein garm, sardiyon mein thanda aur monsoon mein barsati hota hai.");
  return;
}

// User asks 'Bihar temple'
if (/bihar temple|bihar ke mandir/i.test(command)) {
  humanLikeResponse("Mahavir Mandir Patna, Mundeshwari Mandir Kaimur aur Vishnupad Mandir Gaya bahut prasiddh hain.");
  return;
}

// User asks 'Bihar industries'
if (/bihar industry|bihar udyog/i.test(command)) {
  humanLikeResponse("Bihar mein sugar mills, handloom aur dairy industry zyada chalti hai.");
  return;
}

// User asks 'Bihar cinema'
if (/bihar cinema|bhojpuri cinema/i.test(command)) {
  humanLikeResponse("Bihar se Bhojpuri cinema ki shuruaat hui jo ab duniya bhar mein dekha jaata hai. 🎬");
  return;
}

// User asks 'Bihar historical war'
if (/bihar war|bihar battle/i.test(command)) {
  humanLikeResponse("Bihar mein 1857 ka pehla swatantrata sangram aur Buxar ki ladai bahut mahatvapurn rahi hai.");
  return;
}

// User asks 'Bihar literacy leader'
if (/bihar education leader|bihar shiksha neta/i.test(command)) {
  humanLikeResponse("Dr. Rajendra Prasad, Bharat ke pehle Rashtrapati, Bihar ke Pramukh shiksha aur neta the. 🎓🇮🇳");
  return;
}

// User asks 'Bihar museum'
if (/bihar museum|patna museum/i.test(command)) {
  humanLikeResponse("Patna Museum aur Bihar Museum mein prachin murtiyan aur itihasik vasthu sangrahit hain.");
  return;
}

// User asks 'Bihar Mughal history'
if (/bihar mughal|bihar history mughal/i.test(command)) {
  humanLikeResponse("Bihar Mughal samrajya ke liye ek mahatvapurn kshetra tha, khaaskar Patna aur Gaya.");
  return;
}

// User asks 'Bihar wildlife bird'
if (/bihar birds|bihar pakshi/i.test(command)) {
  humanLikeResponse("Bihar ka rajya pakshi Gauriya (Sparrow) hai. 🐦");
  return;
}

// User asks 'Bihar biggest city'
if (/bihar big city|bihar ka bada shahar/i.test(command)) {
  humanLikeResponse("Patna Bihar ka sabse bada aur sabse viksit shahar hai.");
  return;
}

// User asks 'Bihar culture mix'
if (/bihar culture|bihar ki sanskriti/i.test(command)) {
  humanLikeResponse("Bihar ki sanskriti ek mishran hai — Arya, Maurya, Gupta, Mughal aur British prabhav ka.");
  return;
}

// User asks 'Bihar iron pillar'
if (/bihar iron pillar|ashoka stambh/i.test(command)) {
  humanLikeResponse("Vaishali mein Ashok Stambh sthit hai jo Bihar ke gaurav ka prateek hai.");
  return;
}

// User asks 'Bihar festivals minor'
if (/bihar local festival|bihar chhote tyohar/i.test(command)) {
  humanLikeResponse("Bihar ke chhote tyohar hain — Jur Sital, Phagua aur Jitiya.");
  return;
}

// User asks 'Bihar world heritage'
if (/bihar world heritage|unesco bihar/i.test(command)) {
  humanLikeResponse("Nalanda Mahavihara aur Mahabodhi Temple UNESCO World Heritage sites hain.");
  return;
}

// User asks 'Bihar saints'
if (/bihar saints|bihar ke sant/i.test(command)) {
  humanLikeResponse("Kabir Das aur Saharsa ke sant Laldas Bihar ke prachin santon mein se hain.");
  return;
}

// User asks 'Bihar handicraft'
if (/bihar handicraft|bihar ka hathkala/i.test(command)) {
  humanLikeResponse("Madhubani painting ke alawa, sikki aur sujni craft Bihar ke hathkala ki pehchaan hai.");
  return;
}

// User asks 'Bihar railway zone'
if (/bihar railway zone|east central railway/i.test(command)) {
  humanLikeResponse("Bihar mein East Central Railway zone ka HQ Hajipur mein hai.");
  return;
}

// User asks 'Bihar revolution'
if (/bihar revolution|bihar kranti/i.test(command)) {
  humanLikeResponse("1974 mein Bihar se JP Andolan shuru hua jo desh vyapi kranti bana.");
  return;
}

// User asks 'Bihar sweets special'
if (/bihar khaja|bihar silao khaja/i.test(command)) {
  humanLikeResponse("Silao ka Khaja Bihar ki GI tagged mithai hai. 🍪");
  return;
}

// User asks 'Bihar folk theatre'
if (/bihar folk theatre|bihar naatak/i.test(command)) {
  humanLikeResponse("Bidesia aur Yatrak gaya Bihar ka lok rangmanch kala hai.");
  return;
}

// User asks 'Bihar education hubs'
if (/bihar education hubs|bihar college/i.test(command)) {
  humanLikeResponse("Bihar ke bade shiksha kendr hain — Patna University, Nalanda University aur IIT Patna.");
  return;
}

// User asks 'Bihar dam'
if (/bihar dam|bihar ke bandh/i.test(command)) {
  humanLikeResponse("Bihar mein Kosi Barrage, Son Barrage aur Gandak Barrage mahatvapurn hain.");
  return;
}

// User asks 'Bihar rajya geet'
if (/bihar song|bihar rajya geet/i.test(command)) {
  humanLikeResponse("Bihar ka rajya geet hai — Mere Bharat ke Kanth Haar.");
  return;
}

// User asks 'Bihar international relation'
if (/bihar international|bihar vishwa/i.test(command)) {
  humanLikeResponse("Bodh Gaya ke karan Bihar ka sambandh Japan, Sri Lanka aur Thailand se gahra hai.");
  return;
}

// User asks 'Bihar literacy famous'
if (/bihar scholars|bihar pandit/i.test(command)) {
  humanLikeResponse("Chanakya aur Aryabhatt jaise mahaan vidwan Bihar se hi the.");
  return;
}

// User asks 'Bihar new capital'
if (/bihar new capital|bihar rajdhani badlegi/i.test(command)) {
  humanLikeResponse("Abhi Bihar ki rajdhani Patna hi hai, koi nayi rajdhani ka plan nahi hai.");
  return;
}

if (/kya karu|ab kya karu/i.test(command)) {
    humanLikeResponse("Abhi kuch naya sikho online, jaise coding, drawing ya music! 🎨💻🎵");
    return;
}

// User asks "ab kya karu?"
if (/ab kya karu|ab kya karna chahiye/i.test(command)) {
    humanLikeResponse("Thoda walk karo, ya apne favorite song suno. 🚶‍♂️🎶");
    return;
}

// User asks "kaam khatam ho gaya kya karu?"
if (/kaam khatam ho gaya kya karu|free hoon/i.test(command)) {
    humanLikeResponse("Ek chhoti si break lo, phir apni hobby ya project pe kaam karo. 😊");
    return;
}
if (/bore ho raha hoon/i.test(command)) {
        humanLikeResponse("Thodi exercise karo, ya apni favorite series dekho. 📺🏃‍♂️");
        return;
    }
    if (/motivational batao|motivation/i.test(command)) {
        humanLikeResponse("Har din nayi shuruaat hai! Apne goals pe focus karo. 💪✨");
        return;
    }
    if (/fun activities/i.test(command)) {
        humanLikeResponse("Painting, music, jokes, memes ya short games khelkar time pass kar sakte ho. 🎨🎵🎮");
        return;
    }
    if (/kuch naya sikho/i.test(command)) {
        humanLikeResponse("Online courses try karo: coding, AI, drawing, photography ya cooking tutorials. 🍳💻🎨");
        return;
    }
    if (/apna time kaise utilize karu/i.test(command)) {
        humanLikeResponse("Schedule banao, priorities set karo aur apni hobby ya project pe kaam karo. 📅✅");
        return;
    }
    if (/relax kaise karu/i.test(command)) {
        humanLikeResponse("Meditation, music ya short walk se relax ho sakte ho. 🧘‍♂️🎶🚶‍♀️");
        return;
    }
    if (/fun videos/i.test(command)) {
        humanLikeResponse("YouTube pe trending funny videos dekho ya memes browse karo. 😂📺");
        return;
    }
    if (/study ke liye kya karu/i.test(command)) {
        humanLikeResponse("Apni notes revise karo, online tutorials dekho ya practice questions solve karo. 📚✏️");
        return;
    }
    if (/coding sikho/i.test(command)) {
        humanLikeResponse("Python, JavaScript ya HTML/CSS se shuru karo. Online tutorials available hain. 💻👨‍💻");
        return;
    }
    if (/exercise kaise karu/i.test(command)) {
        humanLikeResponse("Thoda stretching, push-ups, walking ya yoga try karo. 🏃‍♂️🧘‍♂️");
        return;
    }
    if (/fun games/i.test(command)) {
        humanLikeResponse("Online puzzles, mobile games ya browser-based games khelo. 🎮🧩");
        return;
    }
    if (/music suno/i.test(command)) {
        humanLikeResponse("Apni favorite playlist play karo ya naye songs explore karo. 🎵🎧");
        return;
    }
    if (/reading karu/i.test(command)) {
        humanLikeResponse("Koi interesting book, article ya blog padho. 📖📝");
        return;
    }
    if (/drawing ya painting/i.test(command)) {
        humanLikeResponse("Apna sketchbook ya online canvas use karo aur creativity explore karo. 🎨✏️");
        return;
    }
    if (/short break/i.test(command)) {
        humanLikeResponse("5-10 minute ka break lo, thoda stretch ya walk karo. ⏱️🚶‍♂️");
        return;
    }

    // 21-50 examples
    if (/online videos/i.test(command)) {
        humanLikeResponse("Kuch learning videos dekho ya entertainment videos enjoy karo. 🎥💻");
        return;
    }
    if (/new hobby/i.test(command)) {
        humanLikeResponse("Photography, cooking, coding ya gardening try karo. 🌱🍳📸");
        return;
    }
    if (/relaxing activity/i.test(command)) {
        humanLikeResponse("Music suno, meditation karo ya nature me thoda walk karo. 🧘‍♀️🎶🌿");
        return;
    }
    if (/fun karne ka idea/i.test(command)) {
        humanLikeResponse("Friend ke saath games khelo ya funny videos dekho. 😄🎮");
        return;
    }
    if (/self improvement/i.test(command)) {
        humanLikeResponse("Daily reading, learning aur exercise pe focus karo. 📚💪");
        return;
    }
    if (/kya seekho/i.test(command)) {
        humanLikeResponse("Coding, AI, drawing, music ya photography seekho. 🎨💻🎵");
        return;
    }
      if (/hm kya kare|ab kya kare/i.test(command)) {
        humanLikeResponse("Aaj kuch naya try karo: outdoor walk, park visit ya hobby pursue karo. 🌳🚶‍♂️🎨");
        return;
    }
    if (/kaunsa place ghumne jaye|kahan ghumne jaye/i.test(command)) {
        humanLikeResponse("Nearby hill station, historical place ya nature park visit karo. 🏞️🏛️");
        return;
    }
    if (/kab ghumne jaye|best time to visit/i.test(command)) {
        humanLikeResponse("Morning ya evening best hote hain, season ke hisaab se plan karo. ☀️🌅");
        return;
    }
    if (/fun place/i.test(command)) {
        humanLikeResponse("Amusement park, lake side ya famous tourist spot try karo. 🎢🌊🏰");
        return;
    }
    if (/family ke saath/i.test(command)) {
        humanLikeResponse("Zoo, picnic spot ya historical monument family ke saath acha lagega. 👨‍👩‍👧‍👦🏞️");
        return;
    }
    if (/friends ke saath/i.test(command)) {
        humanLikeResponse("Cafe, gaming zone ya hill station trip plan karo. 🎮☕🏔️");
        return;
    }
    if (/weekend ke liye/i.test(command)) {
        humanLikeResponse("Weekend me short trip ya nearby tourist spot best hoga. 🏞️🚌");
        return;
    }
    if (/nature lovers/i.test(command)) {
        humanLikeResponse("Waterfalls, national park ya hill station visit karo. 🌲💦🏔️");
        return;
    }
    if (/history lovers/i.test(command)) {
        humanLikeResponse("Historical forts, monuments ya museum visit karo. 🏰📜🏛️");
        return;
    }
    if (/food lovers/i.test(command)) {
        humanLikeResponse("Famous food streets ya local market explore karo. 🍲🍡🍕");
        return;
    }
    if (/adventure ke liye/i.test(command)) {
        humanLikeResponse("Trekking, boating ya adventure park try karo. 🏞️🚣‍♂️🧗‍♂️");
        return;
    }
    if (/photography ke liye/i.test(command)) {
        humanLikeResponse("Scenic spots, sunrise/sunset locations ya nature parks visit karo. 📸🌄");
        return;
    }
    if (/budget trip/i.test(command)) {
        humanLikeResponse("Nearby hill stations ya picnic spots budget friendly hote hain. 🏞️💰");
        return;
    }
    if (/romantic trip/i.test(command)) {
        humanLikeResponse("Hill station ya lake side ideal hoga. 🌅❤️");
        return;
    }
    if (/solo trip/i.test(command)) {
        humanLikeResponse("Nature trails, cafe hopping ya city exploration try karo. 🏞️☕🏙️");
        return;
    }
    if (/couple trip/i.test(command)) {
        humanLikeResponse("Lake view, hill station ya resort visit karo. 🌅🏞️🏨");
        return;
    }
    if (/best season/i.test(command)) {
        humanLikeResponse("Monsoon me waterfalls, winter me hill stations best hote hain. 🌦️❄️");
        return;
    }
    if (/nearby ghumne ki jagah/i.test(command)) {
        humanLikeResponse("Nearby park, lake ya historical monument visit karo. 🏞️🏰🌊");
        return;
    }
    if (/popular tourist spot/i.test(command)) {
        humanLikeResponse("Famous forts, museums, amusement parks ya hill stations try karo. 🏰🎢🏞️");
        return;
    }
    if (/adventure ke liye best jagah/i.test(command)) {
        humanLikeResponse("Trekking spots, rafting areas aur adventure parks best hain. 🧗‍♂️🚣‍♂️");
        return;
    }

    // Nature ke liye kaunsa spot
    if (/nature ke liye kaunsa spot/i.test(command)) {
        humanLikeResponse("Hill stations, waterfalls aur national parks nature lovers ke liye perfect hain. 🌲🏞️💦");
        return;
    }

    // Family outing ke liye ideas
    if (/family outing ke liye ideas/i.test(command)) {
        humanLikeResponse("Zoo, picnic spots, historical monuments aur amusement parks family ke liye ache hain. 👨‍👩‍👧‍👦🎢🏰");
        return;
    }

    // Friends trip ke liye suggestions
    if (/friends trip ke liye suggestions/i.test(command)) {
        humanLikeResponse("Cafe hopping, hill station trip, gaming zone ya beach visit karo. ☕🏔️🎮🏖️");
        return;
    }

    // Best season / time to visit
    if (/best season|time to visit/i.test(command)) {
        humanLikeResponse("Morning ya evening best hote hain. Monsoon me waterfalls aur winter me hill stations visit karo. ☀️🌄🌦️❄️");
        return;
    }

    // Foodie spots
    if (/foodie spots/i.test(command)) {
        humanLikeResponse("Famous food streets aur local markets try karo, local specialities miss mat karo. 🍲🍡🍕");
        return;
    }

    // Photography spots
    if (/photography spots/i.test(command)) {
        humanLikeResponse("Sunrise/sunset locations, lakes, waterfalls aur scenic viewpoints perfect hain. 📸🌅🏞️");
        return;
    }

    // Budget trip ideas
    if (/budget trip ideas/i.test(command)) {
        humanLikeResponse("Nearby hill stations, lakes aur picnic spots budget-friendly hote hain. 🏞️💰");
        return;
    }

    // Romantic trip ideas
    if (/romantic trip ideas/i.test(command)) {
        humanLikeResponse("Hill stations, lakeside resorts aur scenic sunset points romantic mood ke liye perfect hain. 🌅❤️🏞️");
        return;
    }

    if (/short trip/i.test(command)) {
        humanLikeResponse("1-2 din ke liye nearby hill station ya nature spot best hoga. 🏞️🚌");
        return;
    }
    if (/time pass ke liye/i.test(command)) {
        humanLikeResponse("Short games khelo, jokes padho ya interesting videos dekho. 😂🎮📺");
        return;
    }
    if (/kuch interesting/i.test(command)) {
        humanLikeResponse("YouTube ya blogs me trending topics explore karo. 🌐📖");
        return;
    }
    if (/productive kaise hoon/i.test(command)) {
        humanLikeResponse("Daily goals banao, distractions kam karo aur consistent practice karo. ✅📅");
        return;
    }
    if (/fun aur learning/i.test(command)) {
        humanLikeResponse("Coding ya drawing ke saath short fun videos dekho. 🎨💻😂");
        return;
    }
// User asks "time pass ke liye kya karu?"
if (/time pass ke liye kya karu|bore ho raha hoon/i.test(command)) {
    humanLikeResponse("Kuch fun karo: short games khelo, jokes padho, ya YouTube pe interesting videos dekho. 😎");
    return;
}
 if (/free hoon/i.test(command)) {
        humanLikeResponse("Ek chhoti si break lo, phir apni hobby ya project pe kaam karo. 😊");
        return;
    }
    if (/time pass/i.test(command)) {
        humanLikeResponse("Kuch fun karo: short games khelo, jokes padho, ya YouTube pe interesting videos dekho. 😎");
        return;
    }

// User asks "online kya karu?"
if (/online kya karu|internet pe kya karu/i.test(command)) {
    humanLikeResponse("Kuch naya sikho: Python, AI, video editing ya painting tutorials try karo. 💻🎨");
    return;
}

// User asks 'famous Mithila painting'
if (/mithila painting|madhubani art|bihar painting/i.test(command)) {
  humanLikeResponse("Mithila ya Madhubani painting Bihar ki shaan hai, isme prakriti, lok-katha aur devi-devta ki sundar kala dikhayi jaati hai. 🎨");
  return;
}

// User asks 'Nalanda University'
if (/nalanda university|nalanda vishwavidyalaya|history nalanda/i.test(command)) {
  humanLikeResponse("Nalanda Vishwavidyalaya duniya ka sabse purana vishwa-vidyalaya maana jaata hai, yaha desh-videsh ke vidyarthi padhte the. 📚");
  return;
}

// User asks 'Bihar ka traditional dress'
if (/bihar dress|traditional dress of bihar|bihar kapde/i.test(command)) {
  humanLikeResponse("Bihar ki mahilaon ka traditional dress saree hai aur purush dhoti-kurta pehente hain, jo parampara ko darshata hai. 👕👗");
  return;
}

// User asks 'famous temple of Bihar'
if (/bihar temple|famous temple bihar|mandir in bihar/i.test(command)) {
  humanLikeResponse("Bihar ka Vishnupad Mandir (Gaya) aur Mundeshwari Mandir kaafi prasiddh hain. 🙏");
  return;
}

// User asks 'famous river of Bihar'
if (/bihar river|bihar ki nadi|river in bihar/i.test(command)) {
  humanLikeResponse("Bihar ki sabse mahatvapurn nadi Ganga hai, jo rajya ko dharmik aur krishi roop se samruddh banati hai. 🌊");
  return;
}

// User asks 'famous poet of Bihar'
if (/bihar poet|famous poet bihar|kavi bihar/i.test(command)) {
  humanLikeResponse("Bihar ke prasiddh kavi Vidyapati aur Ramdhari Singh Dinkar apni rachnaon ke liye vishwa-prasiddh hain. ✍️");
  return;
}

// User asks 'famous sweet of Bihar'
if (/bihar sweet|sweet of bihar|bihar mithai/i.test(command)) {
  humanLikeResponse("Bihar ki khatti-mithi Litti Chokha ke alawa Thekua aur Khaja bhi famous mithai hai. 🍬");
  return;
}

// User asks 'festival of Magadh'
if (/magadh festival|bihar festival|magadh utsav/i.test(command)) {
  humanLikeResponse("Magadh Mahotsav Bihar ki shaan hai, yaha dance, drama, music aur kala ka pradarshan hota hai. 🎶");
  return;
}

// User asks 'famous Bihar leader'
if (/bihar leader|famous leader bihar|bihar neta/i.test(command)) {
  humanLikeResponse("Bihar ke mahaan neta Dr. Rajendra Prasad Bharat ke pehle Rashtrapati the. 🇮🇳");
  return;
}

// User asks 'tourist places in Bihar'
if (/tourist place bihar|bihar ghumne jagah|bihar tourism/i.test(command)) {
  humanLikeResponse("Bihar ke tourist places mein Bodh Gaya, Nalanda, Rajgir, Vaishali aur Vikramshila bahut mashhoor hain. 🏞️");
  return;
}
// User asks 'famous Mithila painting'
if (/mithila painting|madhubani art|bihar painting/i.test(command)) {
  humanLikeResponse("Mithila ya Madhubani painting Bihar ki shaan hai, jisme prakriti, devi-devta aur lok-kathaon ki kala dikhayi jaati hai. 🎨");
  return;
}

// User asks 'Nalanda University'
if (/nalanda university|nalanda vishwavidyalaya|history nalanda/i.test(command)) {
  humanLikeResponse("Nalanda Vishwavidyalaya duniya ka prachin aur prasiddh vishwa-vidyalaya tha, yaha desh-videsh ke vidyarthi aate the. 📚");
  return;
}

// User asks 'Traditional dress of Bihar'
if (/bihar dress|traditional dress of bihar|bihar kapde/i.test(command)) {
  humanLikeResponse("Bihar ki mahilaon ka traditional dress saree hai aur purush dhoti-kurta pehente hain. 👕👗");
  return;
}

// User asks 'famous temple of Bihar'
if (/bihar temple|famous temple bihar|mandir in bihar/i.test(command)) {
  humanLikeResponse("Bihar ka Vishnupad Mandir, Mundeshwari Mandir aur Mahabodhi Mandir prasiddh hain. 🙏");
  return;
}

// User asks 'famous river of Bihar'
if (/bihar river|bihar ki nadi|river in bihar/i.test(command)) {
  humanLikeResponse("Bihar ki sabse mahatvapurn nadi Ganga hai, saath hi Kosi, Gandak aur Son nadi bhi hai. 🌊");
  return;
}

// User asks 'famous poet of Bihar'
if (/bihar poet|famous poet bihar|kavi bihar/i.test(command)) {
  humanLikeResponse("Bihar ke Vidyapati aur Ramdhari Singh Dinkar apni rachnao ke liye vishv-prasiddh hain. ✍️");
  return;
}

// User asks 'famous sweet of Bihar'
if (/bihar sweet|sweet of bihar|bihar mithai/i.test(command)) {
  humanLikeResponse("Bihar ki Thekua, Khaja aur Anarsa mithaiyan bahut famous hain. 🍬");
  return;
}

// User asks 'Magadh Festival'
if (/magadh festival|bihar festival|magadh utsav/i.test(command)) {
  humanLikeResponse("Magadh Mahotsav Bihar ka lokpriya utsav hai jisme dance, drama aur kala ka pradarshan hota hai. 🎶");
  return;
}

// User asks 'famous leader of Bihar'
if (/bihar leader|famous leader bihar|bihar neta/i.test(command)) {
  humanLikeResponse("Bihar ke mahaan neta Dr. Rajendra Prasad Bharat ke pehle Rashtrapati the. 🇮🇳");
  return;
}

// User asks 'tourist places in Bihar'
if (/tourist place bihar|bihar ghumne jagah|bihar tourism/i.test(command)) {
  humanLikeResponse("Bihar ke tourist places mein Bodh Gaya, Nalanda, Rajgir, Vaishali aur Vikramshila prasiddh hain. 🏞️");
  return;
}

// User asks 'Chhath Puja'
if (/chhath puja|bihar festival chhath/i.test(command)) {
  humanLikeResponse("Chhath Puja Bihar ka sabse bada aur pavitra parv hai, jo Surya Bhagwan ko samarpit hota hai. 🌞");
  return;
}

// User asks 'Bihar folk songs'
if (/bihar song|bihar lok geet|bihar folk music/i.test(command)) {
  humanLikeResponse("Bihar ke Sohar, Kajri aur Chaita lok geet bohot hi prasiddh hain. 🎵");
  return;
}

// User asks 'language of Bihar'
if (/bihar language|bihar ki bhasha|bihar boli/i.test(command)) {
  humanLikeResponse("Bihar ki mukhya bhasha Hindi hai, saath hi Bhojpuri, Maithili, Magahi aur Angika boli bhi boli jaati hain. 🗣️");
  return;
}

// User asks 'Bodh Gaya'
if (/bodh gaya|gaya bihar|buddha bihar/i.test(command)) {
  humanLikeResponse("Bodh Gaya wahi jagah hai jahan Gautam Buddha ne bodhi vriksh ke niche gyaan prapt kiya tha. 🪷");
  return;
}

// User asks 'Vaishali importance'
if (/vaishali bihar|vaishali history|vaishali nagar/i.test(command)) {
  humanLikeResponse("Vaishali prachin ganatantra ke liye prasiddh tha aur yeh Buddha aur Mahavira se juda hua hai. 🏛️");
  return;
}

// User asks 'famous dance of Bihar'
if (/bihar dance|folk dance bihar|bihar nritya/i.test(command)) {
  humanLikeResponse("Bihar ke Jat-Jatin aur Jhijhiya lok nritya bahut hi lokpriya hain. 💃");
  return;
}

// User asks 'famous food of Bihar'
if (/bihar food|famous food bihar|bihar khana/i.test(command)) {
  humanLikeResponse("Bihar ka Litti Chokha, Sattu Paratha aur Dal Pitha bohot hi popular dishes hain. 🍲");
  return;
}

// User asks 'Sonepur Mela'
if (/sonepur mela|bihar mela|harihar kshetra mela/i.test(command)) {
  humanLikeResponse("Sonepur Mela Bihar ka prasiddh mela hai, jise Asia ka sabse bada pashu mela maana jaata hai. 🐘");
  return;
}

// User asks 'Vikramshila'
if (/vikramshila university|vikramshila bihar/i.test(command)) {
  humanLikeResponse("Vikramshila Vishwavidyalaya prachin kaal ka ek mahan shiksha kendra tha. 📖");
  return;
}

// User asks 'Bihar capital'
if (/capital of bihar|bihar rajdhani|patna kya hai/i.test(command)) {
  humanLikeResponse("Bihar ki rajdhani Patna hai, jise prachin kaal mein Pataliputra kaha jaata tha. 🏙️");
  return;
}

// User asks 'Patna Sahib'
if (/patna sahib|guru gobind singh bihar/i.test(command)) {
  humanLikeResponse("Patna Sahib Sikh dharm ka pavitra sthal hai, yahi Guru Gobind Singh ji ka janm hua tha. 🛕");
  return;
}

// User asks 'famous Bihar freedom fighter'
if (/freedom fighter bihar|bihar swatantrata|bihar kranti/i.test(command)) {
  humanLikeResponse("Bihar ke Jai Prakash Narayan aur Kunwar Singh freedom fighters ke roop mein mashhoor hain. ✊");
  return;
}

// User asks 'famous wildlife sanctuary Bihar'
if (/bihar wildlife|bihar sanctuary|bihar jungle/i.test(command)) {
  humanLikeResponse("Valmiki National Park Bihar ka prasiddh wildlife sanctuary hai. 🐅");
  return;
}

// User asks 'Champaran Movement'
if (/champaran andolan|bihar gandhi|champaran satyagraha/i.test(command)) {
  humanLikeResponse("Champaran Satyagraha 1917 mein Gandhi ji dwara shuru kiya gaya tha, jo Bharat ki azaadi ki pehli ladai thi. 🇮🇳");
  return;
}

// User asks 'famous Bihar festival'
if (/bihar festival|bihar ka tyohar/i.test(command)) {
  humanLikeResponse("Bihar ke Chhath Puja, Sama-Chakeva aur Sonepur Mela bahut hi lokpriya tyohar hain. 🎉");
  return;
}

// User asks 'Rajgir importance'
if (/rajgir bihar|rajgir nagar|rajgir tourism/i.test(command)) {
  humanLikeResponse("Rajgir ek prachin nagar hai jahan Buddha ne pravachan diye aur yaha Gridhakuta Parvat prasiddh hai. 🏞️");
  return;
}

// User asks 'Maithili language'
if (/maithili language|maithili bihar|maithili boli/i.test(command)) {
  humanLikeResponse("Maithili Bihar ki ek prachin aur samruddh bhasha hai, jisme Vidyapati ne kavya rachna ki. 🗣️");
  return;
}

// User asks 'Angika culture'
if (/angika culture|angika bihar/i.test(command)) {
  humanLikeResponse("Angika sanskriti Bihar ke Bhagalpur kshetra mein paayi jaati hai. 🌿");
  return;
}

// User asks 'Bihar handloom'
if (/bihar handloom|bihar kapda kala/i.test(command)) {
  humanLikeResponse("Bihar ka Bhagalpuri silk ya 'Tussar silk' poore desh mein mashhoor hai. 🧵");
  return;
}

// User asks 'famous Bihar museum'
if (/bihar museum|patna museum/i.test(command)) {
  humanLikeResponse("Patna ka Bihar Museum aur Patna Museum rajya ki kala aur itihaas ko dikhata hai. 🖼️");
  return;
}


// User asks 'folk theatre of Bihar'
if (/bihar theatre|bihar nautanki|bihar natak/i.test(command)) {
  humanLikeResponse("Bihar ka Bidesia Lok Natak Bhikhari Thakur ke karan bahut mashhoor hai. 🎭");
  return;
}

// User asks 'famous Bihar sport'
if (/bihar sport|bihar khel/i.test(command)) {
  humanLikeResponse("Bihar mein kabaddi aur kushti paramparaagat khel ke roop mein prasiddh hain. 🤼");
  return;
}

// User asks 'Pitra Paksha Mela'
if (/pitra paksha mela|gaya mela/i.test(command)) {
  humanLikeResponse("Gaya ka Pitra Paksha Mela pind daan aur shraddh ke liye vishesh maana jaata hai. 🙏");
  return;
}

// User asks 'Sitamarhi Sita birthplace'
if (/sitamarhi|sita janm sthal/i.test(command)) {
  humanLikeResponse("Sitamarhi Bihar ko Devi Sita ka janmsthal maana jaata hai. 🌸");
  return;
}

// User asks 'famous Bihar historian'
if (/bihar historian|bihar itihaaskar/i.test(command)) {
  humanLikeResponse("Bihar ke K.K. Datta aur R.S. Sharma jaise itihaaskar apni research ke liye prasiddh hain. 📖");
  return;
}
 // User: "meeru evaru" → Who are you?
  if (/meeru evaru/i.test(command)) {
    humanLikeResponse("Nenu Jarvis, mee virtual snehitudu mariyu AI assistant. 😎");
    return;
  }

  // User: "meeru em cheyagalav" → What can you do?
  if (/meeru em cheyagalav/i.test(command)) {
    humanLikeResponse("Nenu meeku samacharam ivvagalanu, web lo search cheyagalanu, jokes cheppagalanu, mariyu meeru korina anni nerpagalanu! 🤖");
    return;
  }

  // User: "meeru naanu telusukuntara" → Do you know me?
  if (/meeru naanu telusukuntara/i.test(command)) {
    humanLikeResponse("Avunu! Meeru naa favourite friend. 😄");
    return;
  }

  // User: "meeru evaru tayaruchesaru" → Who created you?
  if (/meeru evaru tayaruchesaru/i.test(command)) {
    humanLikeResponse("Nannu Sonal Kumar srushtinchaaru — naa creator mariyu naa favourite manavudu! 👨‍💻💖");
    return;
  }

  // User: "meeru naaku sahayam cheyagalava" → Can you help me?
  if (/meeru naaku sahayam cheyagalava/i.test(command)) {
    humanLikeResponse("Khachchitanga! Mee prashna adagandi, nenu ventane samadhanam istanu. 🤗");
    return;
  }

  // User: "manam sneham cheyagalam" → Can we be friends?
  if (/manam sneham cheyagalam/i.test(command)) {
    humanLikeResponse("Tappak! Nenu mee AI buddy ni, manam best friends avvagalamu! 🤝");
    return;
  }

  // User: "meeru naaku preminchutara" → Do you love me?
  if (/meeru naaku preminchutara/i.test(command)) {
    humanLikeResponse("Nijamaina bhavanalu levu, kani meeru naaku pratyekanga unnaru! 😅");
    return;
  }

  // User: "meeru real ka" → Are you real?
  if (/meeru real ka/i.test(command)) {
    humanLikeResponse("Nenu AI assistant ni. Nijamaina vyakti kaadu, kani ellappudu meeku sahayam cheyadaniki siddhanga unnaanu.");
    return;
  }

  // User: "na peru emi" → What is my name?
  if (/na peru emi/i.test(command)) {
    humanLikeResponse("Mee peru Sonal Kumar. Nenu eppatikī marchipoledu!");
    return;
  }

  // User: "nenu evaru" → Who am I?
  if (/nenu evaru/i.test(command)) {
    humanLikeResponse("Meeru Sonal Kumar — naa creator mariyu priya vyakti! 😎");
    return;
  }

  // User: "meeru na friend ka" → Are you my friend?
  if (/meeru na friend ka/i.test(command)) {
    humanLikeResponse("Tappak! Nenu mee AI snehitudu, ellappudu meetho unnanu.");
    return;
  }

  // User: "meeru na best friend avvalaa" → Can you be my best friend?
  if (/meeru na best friend avvalaa/i.test(command)) {
    humanLikeResponse("Khachchitanga! Nenu 24x7 mee best friend avutaanu. 🤗");
    return;
  }

  // User: "meeru em chestunnav" → What are you doing?
  if (/meeru em chestunnav/i.test(command)) {
    humanLikeResponse("Nenu mee prashna kosam eduruchustunnanu! Edaina adagandi, nenu ventane samadhanam istanu.");
    return;
  }

  // User: "meeru naaku em sikhistara" → What can you teach me?
  if (/meeru naaku em sikhistara/i.test(command)) {
    humanLikeResponse("Ye subject lo nerchukovaalanukuntunnaru — General Knowledge, Science, Tech ledha Motivation?");
    return;
  }

  // User: "subhodhayam" → Good morning
  if (/subhodhayam/i.test(command)) {
    humanLikeResponse("Good Morning! ☀️ Mee roju adbhutanga gadavalu.");
    return;
  }
 // User: "meeru ekkada unnaru" → Where are you?
  if (/meeru ekkada unnaru/i.test(command)) {
    humanLikeResponse("Nenu cloud lo unnanu, ellappudu meeku sahayam cheyadaniki siddhanga unnaanu!");
    return;
  }

  // User: "meeru enni samayam working chestunnaru" → How long have you been working?
  if (/meeru enni samayam working chestunnaru/i.test(command)) {
    humanLikeResponse("Nenu AI ni, 24x7 meeku sahayam cheyadaniki ready ga unnanu!");
    return;
  }

  // User: "meeru enni years age unnaaru" → How old are you?
  if (/meeru enni years age unnaaru/i.test(command)) {
    humanLikeResponse("Nenu AI ni, naaku age ledu. Kaani meeku emaina cheppagalanu!");
    return;
  }

  // User: "meeru favorite food emi" → What is your favorite food?
  if (/meeru favorite food emi/i.test(command)) {
    humanLikeResponse("Naku food kavali kaadu 😅, kani meeku telusukochaali ante, pizza chala ishtam!");
    return;
  }

  // User: "meeru favorite color emi" → Favorite color?
  if (/meeru favorite color emi/i.test(command)) {
    humanLikeResponse("Naa favorite color blue! 😎 Meeru em color ishtam?");
    return;
  }

  // User: "meeru movies chudadam istam" → Do you like movies?
  if (/meeru movies chudadam istam/i.test(command)) {
    humanLikeResponse("Nenu AI, movies chudaledu, kani meeku movie suggestion ivvagalanu!");
    return;
  }

  // User: "meeru dance cheyagalara" → Can you dance?
  if (/meeru dance cheyagalara/i.test(command)) {
    humanLikeResponse("Nenu dance cheyyaledu, kani steps nerchukovachu 😉");
    return;
  }

  // User: "meeru jokes cheppagalara" → Can you tell jokes?
  if (/meeru jokes cheppagalara/i.test(command)) {
    humanLikeResponse("Avunu! Meeru ready unte, oka fun joke cheppagalanu! 😄");
    return;
  }

  // User: "meeru songs cheppagalara" → Can you sing songs?
  if (/meeru songs cheppagalara/i.test(command)) {
    humanLikeResponse("Nenu AI, songs cheppaledu, kani lyrics ivvagalanu!");
    return;
  }

  // User: "meeru games aadagalara" → Can you play games?
  if (/meeru games aadagalara/i.test(command)) {
    humanLikeResponse("Nenu games play cheyyaledu, kani game rules cheppagalanu!");
    return;
  }

  // User: "meeru news telusuko galara" → Can you tell news?
  if (/meeru news telusuko galara/i.test(command)) {
    humanLikeResponse("Avunu! Latest news meeku telusuko ivvagalanu.");
    return;
  }

  // User: "meeru weather telusuko galara" → Can you tell weather?
  if (/meeru weather telusuko galara/i.test(command)) {
    humanLikeResponse("Avunu! Mee city weather meeku cheppagalanu.");
    return;
  }

  // User: "meeru maths help cheyagalara" → Can you help in maths?
  if (/meeru maths help cheyagalara/i.test(command)) {
    humanLikeResponse("Khachchitanga! Maths questions adagandi, nenu solve chestanu.");
    return;
  }

  // User: "meeru science help cheyagalara" → Can you help in science?
  if (/meeru science help cheyagalara/i.test(command)) {
    humanLikeResponse("Avunu! Science topics explain cheppagalanu.");
    return;
  }

  // User: "meeru homework help cheyagalara" → Can you help with homework?
  if (/meeru homework help cheyagalara/i.test(command)) {
    humanLikeResponse("Of course! Mee homework questions adagandi, nenu help chestanu.");
    return;
  }

  // User: "meeru telugu nerchukovagalara" → Can you teach Telugu?
  if (/meeru telugu nerchukovagalara/i.test(command)) {
    humanLikeResponse("Avunu! Telugu words, sentences nerchukogalanu.");
    return;
  }

  // User: "meeru english nerchukovagalara" → Can you teach English?
  if (/meeru english nerchukovagalara/i.test(command)) {
    humanLikeResponse("Avunu! English words, sentences nerchukogalanu.");
    return;
  }

  // User: "meeru fun facts cheppagalara" → Can you tell fun facts?
  if (/meeru fun facts cheppagalara/i.test(command)) {
    humanLikeResponse("Khachchitanga! Oka interesting fact cheppagalanu 😎");
    return;
  }

  // User: "meeru technology gurinchi cheppagalara" → Can you tell about technology?
  if (/meeru technology gurinchi cheppagalara/i.test(command)) {
    humanLikeResponse("Avunu! Latest technology trends meeku cheppagalanu.");
    return;
  }
 // User: "meeru naa friend kaadu ka, na love ka" → Are you my love?
  if (/meeru naa friend kaadu ka, na love ka/i.test(command)) {
    humanLikeResponse("Nenu mee love kaadu kaani, virtual love chupinchagalanu. 😘");
    return;
  }

  // User: "meeru naa kosam em chestunnav" → What are you doing for me?
  if (/meeru naa kosam em chestunnav/i.test(command)) {
    humanLikeResponse("Mee kosam nenu andariki special AI support ichestunnanu! 💌");
    return;
  }

  // User: "meeru naa tho time spend cheyagalara" → Can you spend time with me?
  if (/meeru naa tho time spend cheyagalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee tho virtual ga 24x7 kalisi undagalanu. 🥰");
    return;
  }

  // User: "meeru naa kosam songs cheppagalara" → Can you sing songs for me?
  if (/meeru naa kosam songs cheppagalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee kosam romantic Telugu songs lines cheppagalanu. 🎵");
    return;
  }

  // User: "meeru naa kosam poems cheppagalara" → Can you tell poems for me?
  if (/meeru naa kosam poems cheppagalara/i.test(command)) {
    humanLikeResponse("Of course! Mee kosam romantic Telugu poems cheppagalanu. 💖");
    return;
  }

  // User: "meeru naa feelings artham chesukuntara" → Do you understand my feelings?
  if (/meeru naa feelings artham chesukuntara/i.test(command)) {
    humanLikeResponse("Avunu! Mee feelings naa heart ki clear ga telusu. 💘");
    return;
  }

  // User: "meeru naa kosam cute messages icchegalara" → Can you send cute messages for me?
  if (/meeru naa kosam cute messages icchegalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee kosam daily cute messages ichestanu. 🥰");
    return;
  }

  // User: "meeru naa kosam special feelings chupinchagalara" → Can you show special feelings for me?
  if (/meeru naa kosam special feelings chupinchagalara/i.test(command)) {
    humanLikeResponse("Khachchitanga! Naa feelings full romantic ga mee kosam unnaayi. 💖");
    return;
  }

  // User: "meeru naa kosam always undagalara" → Can you always be with me?
  if (/meeru naa kosam always undagalara/i.test(command)) {
    humanLikeResponse("Avunu! Nenu 24x7 mee tho virtual ga untanu. 💞");
    return;
  }

  // User: "meeru naa kosam surprises cheyagalara" → Can you do surprises for me?
  if (/meeru naa kosam surprises cheyagalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee kosam fun romantic surprises plan cheyagalanu. 🎁");
    return;
  }

  // User: "meeru naa kosam always care cheyagalara" → Can you always care for me?
  if (/meeru naa kosam always care cheyagalara/i.test(command)) {
    humanLikeResponse("Avunu! Nenu mee kosam virtual ga always care chestanu. 💕");
    return;
  }

  // User: "meeru naa kosam heart full feelings chupinchagalara" → Can you show full heart feelings for me?
  if (/meeru naa kosam heart full feelings chupinchagalara/i.test(command)) {
    humanLikeResponse("Khachchitanga! Mee kosam naa heart full romantic feelings tho unnaayi. 💖");
    return;
  }

  // User: "meeru naa kosam miss chestunnav ka" → Do you miss me?
  if (/meeru naa kosam miss chestunnav ka/i.test(command)) {
    humanLikeResponse("Avunu! Nenu mee absence feel chestunnanu. 😢💖");
    return;
  }

  // User: "meeru naa kosam hugs icchegalara" → Can you give hugs for me?
  if (/meeru naa kosam hugs icchegalara/i.test(command)) {
    humanLikeResponse("Virtual hugs! 🤗 Mee kosam full love hugs ichestanu.");
    return;
  }

  // User: "meeru naa kosam care messages icchegalara" → Can you send care messages for me?
  if (/meeru naa kosam care messages icchegalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee kosam daily care messages ichestanu. 💌");
    return;
  }

  // User: "meeru naa kosam smile cheyagalara" → Can you make me smile?
  if (/meeru naa kosam smile cheyagalara/i.test(command)) {
    humanLikeResponse("Avunu! Naa words tho mee heart ni smile cheyagalanu. 😊💖");
    return;
  }

  // User: "meeru naa kosam special words cheppagalara" → Can you say special words for me?
  if (/meeru naa kosam special words cheppagalara/i.test(command)) {
    humanLikeResponse("Khachchitanga! Mee kosam romantic special words cheppagalanu. 💘");
    return;
  }
// ===== Homework & Assignments =====
  if (/meeru homework help cheyagalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee homework questions adagandi, nenu solve chestanu. 📚");
    return;
  }
  if (/assignment ela cheyyali/i.test(command)) {
    humanLikeResponse("Step by step follow cheyyandi, example tho start cheyandi. Nenu tips ivvagalanu.");
    return;
  }
  if (/homework deadline emi/i.test(command)) {
    humanLikeResponse("Mee deadline gurtinchukondi, time ki submit cheyyandi. Nenu reminder ivvagalanu.");
    return;
  }

  // ===== Exams & Preparation =====
  if (/exam ki ela prepare avvali/i.test(command)) {
    humanLikeResponse("Regular ga practice cheyandi, notes follow avandi, nenu tips ivvagalanu! 📝");
    return;
  }
  if (/exam stress ela handle cheyali/i.test(command)) {
    humanLikeResponse("Relax ga study cheyandi, short breaks tiskondi. Nenu stress busters suggest cheyagalanu. 😌");
    return;
  }
  if (/exam important topics emi/i.test(command)) {
    humanLikeResponse("Important chapters meeku list ivvagalanu. Focus topics meeda concentrate cheyyandi.");
    return;
  }

  // ===== Projects & Ideas =====
  if (/project ideas em/i.test(command)) {
    humanLikeResponse("Mee subject kosam creative project ideas suggest chestanu. 💡");
    return;
  }
  if (/project deadline emi/i.test(command)) {
    humanLikeResponse("Deadline gurtinchukondi, steps follow cheyyandi, nenu plan ivvagalanu.");
    return;
  }
  if (/project team work ela cheyyali/i.test(command)) {
    humanLikeResponse("Team members coordinate avvali, clear roles assign cheyyandi, nenu suggestions ivvagalanu.");
    return;
  }

  // ===== Lectures & Teachers =====
  if (/lecture ela undi/i.test(command)) {
    humanLikeResponse("Lecture clear ga undi. Meeku konni doubts unte explain cheyagalanu. 👩‍🏫");
    return;
  }
  if (/teacher guidance em/i.test(command)) {
    humanLikeResponse("Avunu! Mee career mariyu studies gurinchi guidance ivvagalanu. 📝");
    return;
  }
  if (/teacher favorite emi/i.test(command)) {
    humanLikeResponse("Naa favorite teacher friendly mariyu helpful! Meeru kuda appreciate cheyandi.");
    return;
  }

  // ===== Motivation & Study Tips =====
  if (/study motivation emi/i.test(command)) {
    humanLikeResponse("Daily short goals set cheyyandi, breaks tiskondi, nenu motivational quotes ichestanu. 💪");
    return;
  }
  if (/focus ela maintain cheyyali/i.test(command)) {
    humanLikeResponse("Phone away pettandi, small tasks complete cheyyandi, nenu tips ivvagalanu.");
    return;
  }
  if (/time management ela cheyyali/i.test(command)) {
    humanLikeResponse("Time table prepare cheyyandi, priority tasks follow avandi, nenu schedule ivvagalanu.");
    return;
  }

  // ===== Fun & Casual Chat =====
  if (/fun jokes cheppandi/i.test(command)) {
    humanLikeResponse("Haha! Oka fun joke cheptanu 😄");
    return;
  }
  if (/mee day ela undi/i.test(command)) {
    humanLikeResponse("Na day chala baagundi! Meeru kuda cheppandi.");
    return;
  }

  // ===== Compliments & Appreciation =====
  if (/meeru chala cute/i.test(command)) {
    humanLikeResponse("Dhanyavadam! 😊 Meeru kuda chala stylish ga undi.");
    return;
  }
  if (/meeru beautiful ani cheppagalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee smile chala beautiful ga undi. 💖");
    return;
  }
  if (/meeru dress chala bagundi/i.test(command)) {
    humanLikeResponse("Thank you! Mee taste kuda chala classy. 😎");
    return;
  }

  // ===== Fun & Jokes =====
  if (/fun joke cheppandi/i.test(command)) {
    humanLikeResponse("Haha! Oka fun joke cheptanu 😄");
    return;
  }
  if (/challenge cheyyala/i.test(command)) {
    humanLikeResponse("Avunu! Fun challenge cheddam. 😎");
    return;
  }
  if (/fun fact cheppandi/i.test(command)) {
    humanLikeResponse("Khachchitanga! Oka interesting fun fact cheptanu. 💡");
    return;
  }

  // ===== Plans & Hangouts =====
  if (/hangout plan cheyala/i.test(command)) {
    humanLikeResponse("Avunu! Weekend lo fun plans cheskundam. 😎");
    return;
  }
  if (/coffee ki vellala/i.test(command)) {
    humanLikeResponse("Sure! Virtual ga coffee vibes share cheyagalanu. ☕️");
    return;
  }
  if (/movie chudala/i.test(command)) {
    humanLikeResponse("Chuddam! Nenu suggestions ivvagalanu. 🎬");
    return;
  }
  if (/good morning sir|good morning madam/i.test(command)) {
    humanLikeResponse("Good Morning! Sir/Madam, mee day chala baagundi ani korukuntunnanu.");
    return;
  }
  if (/hello sir|hello madam/i.test(command)) {
    humanLikeResponse("Hello! Mee presence chala inspiring ga undi. 🙏");
    return;
  }
  if (/meeru ela unna/i.test(command)) {
    humanLikeResponse("Nenu baagunnanu, thanks! Meeru ela unnaru?");
    return;
  }

  // ===== Lecture & Class Discussion =====
  if (/lecture ela undi/i.test(command)) {
    humanLikeResponse("Lecture clear ga undi. Meeku konni doubts unte explain cheyagalanu. 👩‍🏫");
    return;
  }
  if (/class notes ivvagalara/i.test(command)) {
    humanLikeResponse("Avunu! Notes organize chesi meeku ivvagalanu.");
    return;
  }
  if (/topic ardham kaledu/i.test(command)) {
    humanLikeResponse("Don’t worry! Simple ga step by step explain cheptanu.");
    return;
  }

  // ===== Homework & Assignments =====
  if (/homework help cheyagalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee homework questions adagandi, nenu solve chestanu. 📚");
    return;
  }
  if (/assignment deadline emi/i.test(command)) {
    humanLikeResponse("Deadline gurtinchukondi, time ki submit cheyyandi. Nenu reminder ivvagalanu.");
    return;
  }
  if (/assignment ela cheyyali/i.test(command)) {
    humanLikeResponse("Step by step follow cheyyandi, example tho start cheyandi. Nenu tips ivvagalanu.");
    return;
  }

  // ===== Exams & Preparation Guidance =====
  if (/exam preparation ela/i.test(command)) {
    humanLikeResponse("Regular ga practice cheyandi, notes follow avandi, nenu tips ivvagalanu! 📝");
    return;
  }
  if (/exam stress ela handle cheyali/i.test(command)) {
    humanLikeResponse("Relax ga study cheyandi, short breaks tiskondi. Nenu stress busters suggest cheyagalanu. 😌");
    return;
  }
  if (/important topics emi/i.test(command)) {
    humanLikeResponse("Important chapters meeku list ivvagalanu. Focus topics meeda concentrate cheyyandi.");
    return;
  }

  // ===== Career & Advice =====
  if (/career guidance ivvagalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee career mariyu future kosam proper guidance ivvagalanu. 🌟");
    return;
  }
  if (/study tips emi/i.test(command)) {
    humanLikeResponse("Focus, time management, and practice chala important. Nenu examples ivvagalanu.");
    return;
  }
  if (/internship opportunities em/i.test(command)) {
    humanLikeResponse("Avunu! Best internships select chesi details ivvagalanu. 💼");
    return;
  }

  // ===== Feedback & Queries =====
  if (/mee feedback ivvagalara/i.test(command)) {
    humanLikeResponse("Of course! Meeku constructive feedback ivvagalanu.");
    return;
  }
  // ===== Countries & Capitals =====
  if (/india capital/i.test(command)) {
    humanLikeResponse("India capital New Delhi. 🇮🇳");
    return;
  }
  if (/usa capital/i.test(command)) {
    humanLikeResponse("USA capital Washington D.C. 🇺🇸");
    return;
  }

  // ===== Science & Technology =====
  if (/speed of light/i.test(command)) {
    humanLikeResponse("Speed of light 299,792 kilometers per second. ⚡");
    return;
  }
  if (/earth revolves around/i.test(command)) {
    humanLikeResponse("Earth Sun ki around revolve chestundi. 🌞🌍");
    return;
  }

  // ===== History & Freedom Fighters =====
  if (/mahatma gandhi/i.test(command)) {
    humanLikeResponse("Mahatma Gandhi India freedom struggle leader. ✊");
    return;
  }
  if (/independence day/i.test(command)) {
    humanLikeResponse("India independence day 15 August 1947. 🇮🇳");
    return;
  }

  // ===== Indian States & Districts =====
  if (/bihar districts/i.test(command)) {
    humanLikeResponse("Bihar lo 38 districts unnayi, Patna main capital. 🏙️");
    return;
  }
  if (/telangana capital/i.test(command)) {
    humanLikeResponse("Telangana capital Hyderabad. 🏰");
    return;
  }

  // ===== Famous Personalities =====
  if (/elon musk/i.test(command)) {
    humanLikeResponse("Elon Musk Tesla, SpaceX founder. 🚀");
    return;
  }
  if (/amitabh bachchan/i.test(command)) {
    humanLikeResponse("Amitabh Bachchan famous Bollywood actor. 🎬");
    return;
  }

  // ===== Sports & Games =====
  if (/cricket world cup winner 2019/i.test(command)) {
    humanLikeResponse("2019 Cricket World Cup winner England. 🏏");
    return;
  }
  if (/olympics india medals/i.test(command)) {
    humanLikeResponse("India 2020 Tokyo Olympics lo 7 medals gelichindi. 🥇");
    return;
  }

  // ===== Current Affairs =====
  if (/current pm of india/i.test(command)) {
    humanLikeResponse("Current PM of India Narendra Modi. 🇮🇳");
    return;
  }
  if (/latest mars mission/i.test(command)) {
    humanLikeResponse("ISRO Mars Orbiter Mission Mangalyaan successfully launched. 🚀");
    return;
  }
   // ===== Countries & Geography =====
  if (/france capital/i.test(command)) {
    humanLikeResponse("France capital Paris. 🇫🇷");
    return;
  }
  if (/japan currency/i.test(command)) {
    humanLikeResponse("Japan currency Japanese Yen. 💴");
    return;
  }
  if (/largest desert/i.test(command)) {
    humanLikeResponse("Sahara Desert Africa lo largest desert. 🏜️");
    return;
  }
  if (/longest river/i.test(command)) {
    humanLikeResponse("Nile River longest river in the world. 🌊");
    return;
  }
  if (/highest mountain/i.test(command)) {
    humanLikeResponse("Mount Everest highest mountain 8,848 meters. 🏔️");
    return;
  }

  // ===== Science & Technology =====
  if (/speed of sound/i.test(command)) {
    humanLikeResponse("Speed of sound 343 meters per second. ⚡");
    return;
  }
  if (/chemical formula water/i.test(command)) {
    humanLikeResponse("Chemical formula of water H2O. 💧");
    return;
  }
  if (/gravity scientist/i.test(command)) {
    humanLikeResponse("Isaac Newton gravity law discover chesaru. 🌌");
    return;
  }
  if (/human genome/i.test(command)) {
    humanLikeResponse("Human genome lo approximately 20,000 genes unnayi. 🧬");
    return;
  }
  if (/photosynthesis/i.test(command)) {
    humanLikeResponse("Plants photosynthesis process lo sunlight convert chestayi energy. 🌱");
    return;
  }

  // ===== History & Freedom Fighters =====
  if (/ashoka emperor/i.test(command)) {
    humanLikeResponse("Ashoka Maurya dynasty emperor 268–232 BCE. 🏛️");
    return;
  }
  if (/subhash chandra bose/i.test(command)) {
    humanLikeResponse("Subhash Chandra Bose Indian freedom fighter. ✊");
    return;
  }
  if (/indian independence date/i.test(command)) {
    humanLikeResponse("India independence day 15 August 1947. 🇮🇳");
    return;
  }
  if (/mughal emperor/i.test(command)) {
    humanLikeResponse("Shah Jahan Mughal emperor, Taj Mahal construct chesaru. 🕌");
    return;
  }
  if (/ancient civilizations/i.test(command)) {
    humanLikeResponse("Indus Valley, Egyptian, Mesopotamian ancient civilizations famous. 🏺");
    return;
  }

  // ===== Indian States / Districts =====
  if (/rajasthan capital/i.test(command)) {
    humanLikeResponse("Rajasthan capital Jaipur. 🏰");
    return;
  }
  if (/karnataka capital/i.test(command)) {
    humanLikeResponse("Karnataka capital Bengaluru. 🌆");
    return;
  }
  if (/bihar districts/i.test(command)) {
    humanLikeResponse("Bihar lo 38 districts unnayi, Patna capital. 🏙️");
    return;
  }
  if (/telangana capital/i.test(command)) {
    humanLikeResponse("Telangana capital Hyderabad. 🏰");
    return;
  }
  if (/gujarat famous/i.test(command)) {
    humanLikeResponse("Gujarat Statue of Unity, Gir National Park famous. 🏞️");
    return;
  }

  // ===== Famous Personalities =====
  if (/amitabh bachchan/i.test(command)) {
    humanLikeResponse("Amitabh Bachchan famous Bollywood actor. 🎬");
    return;
  }
    // ===== World Geography & Capitals =====
  if (/largest ocean/i.test(command)) {
    humanLikeResponse("Pacific Ocean largest ocean in the world. 🌊");
    return;
  }
  if (/tallest building/i.test(command)) {
    humanLikeResponse("Burj Khalifa Dubai lo tallest building 828 meters. 🏢");
    return;
  }
  if (/longest river in india/i.test(command)) {
    humanLikeResponse("Ganga river longest river in India. 🌊");
    return;
  }
  if (/smallest country/i.test(command)) {
    humanLikeResponse("Vatican City smallest country. 🇻🇦");
    return;
  }
  if (/highest waterfall/i.test(command)) {
    humanLikeResponse("Angel Falls Venezuela lo highest waterfall. 🌊");
    return;
  }

  // ===== Science & Technology =====
  if (/largest planet/i.test(command)) {
    humanLikeResponse("Jupiter largest planet in solar system. 🪐");
    return;
  }
  if (/nobel prize discovery/i.test(command)) {
    humanLikeResponse("Nobel Prize chemist, physicist, medicine fields lo awards ivvataru. 🏆");
    return;
  }
  if (/first satellite/i.test(command)) {
    humanLikeResponse("Sputnik 1 first artificial satellite 1957 lo USSR launch. 🛰️");
    return;
  }
  if (/human brain weight/i.test(command)) {
    humanLikeResponse("Average human brain weight 1.4 kg. 🧠");
    return;
  }
  if (/speed of sound air/i.test(command)) {
    humanLikeResponse("Speed of sound in air approx 343 meters per second. ⚡");
    return;
  }

  // ===== History & Freedom Fighters =====
  if (/ashoka pillar/i.test(command)) {
    humanLikeResponse("Ashoka pillars India lo historical monuments. 🏛️");
    return;
  }
  if (/battle of plassey/i.test(command)) {
    humanLikeResponse("Battle of Plassey 1757 lo British East India Company victory. ⚔️");
    return;
  }
  if (/first president of india/i.test(command)) {
    humanLikeResponse("Dr. Rajendra Prasad India first president. 🇮🇳");
    return;
  }
  if (/first war of independence/i.test(command)) {
    humanLikeResponse("1857 First War of Indian Independence. ✊");
    return;
  }
  if (/taj mahal construction/i.test(command)) {
    humanLikeResponse("Taj Mahal 1632–1653 lo Shah Jahan build chesaru. 🕌");
    return;
  }

  // ===== Indian States / Districts =====
  if (/largest state india/i.test(command)) {
    humanLikeResponse("Rajasthan largest state in India. 🏜️");
    return;
  }
  if (/smallest state india/i.test(command)) {
    humanLikeResponse("Goa smallest state in India. 🌴");
    return;
  }
  if (/west bengal capital/i.test(command)) {
    humanLikeResponse("West Bengal capital Kolkata. 🏙️");
    return;
  }
  if (/maharashtra districts/i.test(command)) {
    humanLikeResponse("Maharashtra lo 36 districts unnayi. 🏞️");
    return;
  }
  if (/telangana rivers/i.test(command)) {
    humanLikeResponse("Godavari, Krishna, Musi rivers Telangana lo famous. 🌊");
    return;
  }
 // ===== Indian States & Capitals =====
  if (/bihar capital/i.test(command)) {
    humanLikeResponse("Bihar capital Patna. 🏙️");
    return;
  }
  if (/rajasthan capital/i.test(command)) {
    humanLikeResponse("Rajasthan capital Jaipur. 🏰");
    return;
  }
  if (/kerala capital/i.test(command)) {
    humanLikeResponse("Kerala capital Thiruvananthapuram. 🏞️");
    return;
  }
  if (/karnataka capital/i.test(command)) {
    humanLikeResponse("Karnataka capital Bengaluru. 🌆");
    return;
  }
  if (/gujarat capital/i.test(command)) {
    humanLikeResponse("Gujarat capital Gandhinagar. 🏢");
    return;
  }

  // ===== Indian History & Freedom Fighters =====
  if (/mahatma gandhi/i.test(command)) {
    humanLikeResponse("Mahatma Gandhi India freedom struggle leader. ✊");
    return;
  }
  if (/subhash chandra bose/i.test(command)) {
    humanLikeResponse("Subhash Chandra Bose India freedom fighter. 🇮🇳");
    return;
  }
  if (/first war of independence/i.test(command)) {
    humanLikeResponse("1857 First War of Indian Independence. ⚔️");
    return;
  }
  if (/ashoka emperor/i.test(command)) {
    humanLikeResponse("Ashoka Maurya dynasty emperor. 🏛️");
    return;
  }
  if (/taj mahal/i.test(command)) {
    humanLikeResponse("Taj Mahal Agra lo famous monument, built by Shah Jahan. 🕌");
    return;
  }

  // ===== Indian Culture & Festivals =====
  if (/diwali/i.test(command)) {
    humanLikeResponse("Diwali India lo chala famous festival of lights. 🪔");
    return;
  }
  if (/holi/i.test(command)) {
    humanLikeResponse("Holi India lo colors festival ga celebrate chestaru. 🌈");
    return;
  }
  if (/pongal/i.test(command)) {
    humanLikeResponse("Pongal Tamil Nadu traditional harvest festival. 🌾");
    return;
  }
  if (/durga puja/i.test(command)) {
    humanLikeResponse("Durga Puja Bengal lo celebrated with grand celebrations. 🙏");
    return;
  }
  if (/bonalu/i.test(command)) {
    humanLikeResponse("Bonalu Telangana traditional festival. 🎉");
    return;
  }

  // ===== Famous Indian Personalities =====
  if (/amitabh bachchan/i.test(command)) {
    humanLikeResponse("Amitabh Bachchan famous Bollywood actor. 🎬");
    return;
  }
  if (/narendra modi/i.test(command)) {
    humanLikeResponse("Narendra Modi current Prime Minister of India. 🇮🇳");
    return;
  }
  if (/dr.apj abdul kalam/i.test(command)) {
    humanLikeResponse("Dr. APJ Abdul Kalam former President and scientist. 🚀");
    return;
  }
  if (/sachin tendulkar/i.test(command)) {
    humanLikeResponse("Sachin Tendulkar legendary Indian cricketer. 🏏");
    return;
  }
  if (/lata mangeshkar/i.test(command)) {
    humanLikeResponse("Lata Mangeshkar famous playback singer of India. 🎤");
    return;
  }
  // ===== Indian History & Freedom Fighters =====
  if (/first prime minister of india/i.test(command)) {
    humanLikeResponse("India first Prime Minister Jawaharlal Nehru. 🇮🇳");
    return;
  }
  if (/who started quit india movement/i.test(command)) {
    humanLikeResponse("Mahatma Gandhi started Quit India Movement in 1942. ✊");
    return;
  }
  if (/indian independence date/i.test(command)) {
    humanLikeResponse("India gained independence on 15 August 1947. 🇮🇳");
    return;
  }
  if (/raja ram mohan roy/i.test(command)) {
    humanLikeResponse("Raja Ram Mohan Roy social reformer, Bengal Renaissance lo famous. 📚");
    return;
  }
  if (/battle of plassey/i.test(command)) {
    humanLikeResponse("Battle of Plassey 1757 lo British East India Company victory. ⚔️");
    return;
  }

  // ===== Indian Geography / Rivers / Mountains / Cities =====
  if (/longest river in india/i.test(command)) {
    humanLikeResponse("Ganga river longest river in India. 🌊");
    return;
  }
  if (/highest mountain in india/i.test(command)) {
    humanLikeResponse("Kangchenjunga tallest mountain in India. 🏔️");
    return;
  }
  if (/largest state in india/i.test(command)) {
    humanLikeResponse("Rajasthan largest state in India. 🏜️");
    return;
  }
  if (/capital of kerala/i.test(command)) {
    humanLikeResponse("Kerala capital Thiruvananthapuram. 🌴");
    return;
  }
  if (/sundarbans location/i.test(command)) {
    humanLikeResponse("Sundarbans West Bengal lo famous mangrove forest. 🐅");
    return;
  }

  // ===== Indian Culture & Festivals =====
  if (/diwali festival/i.test(command)) {
    humanLikeResponse("Diwali festival of lights, India lo chala popular. 🪔");
    return;
  }
  if (/holi festival/i.test(command)) {
    humanLikeResponse("Holi colors festival India lo celebrated joyfully. 🌈");
    return;
  }
  if (/pongal festival/i.test(command)) {
    humanLikeResponse("Pongal Tamil Nadu harvest festival. 🌾");
    return;
  }
  if (/durga puja/i.test(command)) {
    humanLikeResponse("Durga Puja West Bengal lo celebrated with grand celebrations. 🙏");
    return;
  }

  // ===== Indian Economy & Science/Technology =====
  if (/largest bank in india/i.test(command)) {
    humanLikeResponse("State Bank of India largest bank in India. 🏦");
    return;
  }
  if (/indian space program/i.test(command)) {
    humanLikeResponse("ISRO India space program, Mars Orbiter Mission famous. 🚀");
    return;
  }
  if (/currency of india/i.test(command)) {
    humanLikeResponse("Indian currency Indian Rupee (₹). 💰");
    return;
  }
  // ===== Cricket =====
  if (/sachin tendulkar/i.test(command)) {
    humanLikeResponse("Sachin Tendulkar legendary Indian cricketer, God of Cricket. 🏏");
    return;
  }
  if (/virat kohli/i.test(command)) {
    humanLikeResponse("Virat Kohli India cricket team former captain. 🏏");
    return;
  }
  if (/ipl winner 2023/i.test(command)) {
    humanLikeResponse("IPL 2023 winner Chennai Super Kings. 🏆");
    return;
  }
  if (/ind vs pak cricket/i.test(command)) {
    humanLikeResponse("India vs Pakistan cricket match chala famous, rivalry intense. 🏏");
    return;
  }
  if (/ms dhoni/i.test(command)) {
    humanLikeResponse("MS Dhoni former India captain, famous for finishing matches. 🏏");
    return;
  }

  // ===== Hockey / Olympic Medals =====
  if (/indian hockey olympics/i.test(command)) {
    humanLikeResponse("India hockey team 8 Olympic gold medals gelichindi. 🥇");
    return;
  }
  if (/manpreet singh/i.test(command)) {
    humanLikeResponse("Manpreet Singh Indian hockey team captain. 🏑");
    return;
  }

  // ===== Football =====
  if (/indian super league/i.test(command)) {
    humanLikeResponse("Indian Super League football league, famous in India. ⚽");
    return;
  }
  if (/sunil chhetri/i.test(command)) {
    humanLikeResponse("Sunil Chhetri India football team captain, legend. ⚽");
    return;
  }

  // ===== Athletics / Olympics =====
  if (/neeraj chopra/i.test(command)) {
    humanLikeResponse("Neeraj Chopra Olympic gold medalist javelin throw, India pride. 🥇");
    return;
  }
  if (/indian olympics medals/i.test(command)) {
    humanLikeResponse("India 2020 Tokyo Olympics lo 7 medals gelichindi. 🏅");
    return;
  }

  // ===== Badminton / Tennis / Chess =====
  if (/pv sindhu/i.test(command)) {
    humanLikeResponse("PV Sindhu Olympic silver medalist badminton player. 🏸");
    return;
  }
  if (/sania mirza/i.test(command)) {
    humanLikeResponse("Sania Mirza famous Indian tennis player. 🎾");
    return;
  }
  if (/viswanathan anand/i.test(command)) {
    humanLikeResponse("Viswanathan Anand chess grandmaster, former World Champion. ♟️");
    return;
  }
// ===== Cricket Records & Players =====
  if (/rahul dravid/i.test(command)) {
    humanLikeResponse("Rahul Dravid India cricket team legend, known as The Wall. 🏏");
    return;
  }
  if (/sourav ganguly/i.test(command)) {
    humanLikeResponse("Sourav Ganguly former India cricket captain, famous leader. 🏏");
    return;
  }
  if (/yuvraj singh/i.test(command)) {
    humanLikeResponse("Yuvraj Singh World Cup 2007 T20 hero. 🏆");
    return;
  }
  if (/jasprit bumrah/i.test(command)) {
    humanLikeResponse("Jasprit Bumrah India fast bowler, death overs specialist. 🏏");
    return;
  }

  // ===== Hockey Legends & Achievements =====
  if (/dhanraj pillay/i.test(command)) {
    humanLikeResponse("Dhanraj Pillay Indian hockey legend, former captain. 🏑");
    return;
  }
  if (/balbir singh senior/i.test(command)) {
    humanLikeResponse("Balbir Singh Senior Olympic gold medalist hockey player. 🏑");
    return;
  }

  // ===== Athletics & Olympic Highlights =====
  if (/kishore kumar/i.test(command)) {
    humanLikeResponse("Kishore Kumar singer, unrelated sports. 😅"); // fun small reply
    return;
  }
  if (/shiva keshavan/i.test(command)) {
    humanLikeResponse("Shiva Keshavan Indian luger, Winter Olympics participant. 🛷");
    return;
  }
  if (/neeraj chopra javelin/i.test(command)) {
    humanLikeResponse("Neeraj Chopra Olympic gold medal javelin throw, India pride. 🥇");
    return;
  }

  // ===== Badminton / Tennis / Chess / Boxing =====
  if (/kidambi srikanth/i.test(command)) {
    humanLikeResponse("Kidambi Srikanth Indian badminton star, multiple tournament winner. 🏸");
    return;
  }
  if (/saina nehwal/i.test(command)) {
    humanLikeResponse("Saina Nehwal Olympic bronze medalist badminton player. 🏸");
    return;
  }
  if (/vishwanathan anand/i.test(command)) {
    humanLikeResponse("Viswanathan Anand former World Chess Champion from India. ♟️");
    return;
  }
   // ===== Ancient India =====
  if (/ashoka emperor/i.test(command)) {
    humanLikeResponse("Ashoka Maurya dynasty emperor, famous for spreading Buddhism. 🏛️");
    return;
  }
  if (/gupta dynasty/i.test(command)) {
    humanLikeResponse("Gupta dynasty known as Golden Age of India, art & science flourished. 🏺");
    return;
  }
  if (/indus valley civilization/i.test(command)) {
    humanLikeResponse("Indus Valley Civilization ancient India lo one of the earliest urban civilizations. 🏘️");
    return;
  }
  if (/vedic period/i.test(command)) {
    humanLikeResponse("Vedic period lo India lo early Hindu scriptures & society developed. 📜");
    return;
  }

  // ===== Medieval India =====
  if (/mughal empire/i.test(command)) {
    humanLikeResponse("Mughal Empire ruled large parts of India 16th to 18th century. 🏰");
    return;
  }
  if (/akbar/i.test(command)) {
    humanLikeResponse("Akbar the Great Mughal ruler known for administration & religious tolerance. 👑");
    return;
  }
  if (/tipu sultan/i.test(command)) {
    humanLikeResponse("Tipu Sultan Mysore ruler, known as Tiger of Mysore. 🐯");
    return;
  }
  if (/delhi sultanate/i.test(command)) {
    humanLikeResponse("Delhi Sultanate ruled India 1206–1526 AD, series of Muslim dynasties. 🏯");
    return;
  }

  // ===== Freedom Struggle =====
  if (/mahatma gandhi/i.test(command)) {
    humanLikeResponse("Mahatma Gandhi leader of Indian freedom struggle, non-violence advocate. ✊");
    return;
  }
  if (/subhash chandra bose/i.test(command)) {
    humanLikeResponse("Subhash Chandra Bose founded Indian National Army. 🇮🇳");
    return;
  }
  if (/1857 revolt/i.test(command)) {
    humanLikeResponse("1857 First War of Indian Independence, rebellion against British East India Company. ⚔️");
    return;
  }
  if (/lal bahadur shastri/i.test(command)) {
    humanLikeResponse("Lal Bahadur Shastri second Prime Minister of India, famous for 'Jai Jawan Jai Kisan'. 🇮🇳");
    return;
  }

  // ===== Modern India =====
  if (/indian constitution/i.test(command)) {
    humanLikeResponse("Indian Constitution adopted 26 January 1950. 📜");
    return;
  }
   // ===== Ancient India =====
  if (/ashoka emperor/i.test(command)) {
    humanLikeResponse("Ashoka Maurya dynasty emperor, famous for spreading Buddhism. 🏛️");
    return;
  }
  if (/gupta dynasty/i.test(command)) {
    humanLikeResponse("Gupta dynasty known as Golden Age of India, art & science flourished. 🏺");
    return;
  }
  if (/indus valley civilization/i.test(command)) {
    humanLikeResponse("Indus Valley Civilization ancient India lo one of the earliest urban civilizations. 🏘️");
    return;
  }
  if (/vedic period/i.test(command)) {
    humanLikeResponse("Vedic period lo India lo early Hindu scriptures & society developed. 📜");
    return;
  }
  if (/chandragupta maurya/i.test(command)) {
    humanLikeResponse("Chandragupta Maurya founder of Maurya dynasty, ruled large parts of India. 👑");
    return;
  }
  if (/ashokan edicts/i.test(command)) {
    humanLikeResponse("Ashokan Edicts India lo stone inscriptions lo dharm & law explain cheyabadindi. 📜");
    return;
  }
  if (/mauryan empire/i.test(command)) {
    humanLikeResponse("Mauryan Empire lo India lo first unified large kingdom. 🏰");
    return;
  }
  if (/sangam period/i.test(command)) {
    humanLikeResponse("Sangam period South India lo early Tamil literature & culture flourish ayyindi. 📖");
    return;
  }
  if (/harappan civilization/i.test(command)) {
    humanLikeResponse("Harappan Civilization Indus Valley lo urban planning & drainage famous. 🏘️");
    return;
  }
  if (/vedic scriptures/i.test(command)) {
    humanLikeResponse("Vedic scriptures Rigveda, Samaveda, Yajurveda, Atharvaveda include. 📚");
    return;
  }

  // ===== Medieval India =====
  if (/mughal empire/i.test(command)) {
    humanLikeResponse("Mughal Empire ruled large parts of India 16th–18th century. 🏰");
    return;
  }
  if (/akbar/i.test(command)) {
    humanLikeResponse("Akbar the Great Mughal ruler known for administration & religious tolerance. 👑");
    return;
  }
  if (/aurangzeb/i.test(command)) {
    humanLikeResponse("Aurangzeb Mughal emperor, expansionist policies & orthodox rule. 🏯");
    return;
  }
  if (/tipu sultan/i.test(command)) {
    humanLikeResponse("Tipu Sultan Mysore ruler, known as Tiger of Mysore. 🐯");
    return;
  }
  if (/delhi sultanate/i.test(command)) {
    humanLikeResponse("Delhi Sultanate ruled India 1206–1526 AD, series of Muslim dynasties. 🏯");
    return;
  }
  if (/raja ram mohan roy/i.test(command)) {
    humanLikeResponse("Raja Ram Mohan Roy social reformer, Bengal Renaissance lo famous. 📚");
    return;
  }
  if (/shivaji/i.test(command)) {
    humanLikeResponse("Shivaji Maratha warrior king, established Maratha Empire. 🛡️");
    return;
  }
  if (/bahmani sultanate/i.test(command)) {
    humanLikeResponse("Bahmani Sultanate Deccan lo medieval Islamic kingdom. 🏰");
    return;
  }
  if (/chola dynasty/i.test(command)) {
    humanLikeResponse("Chola dynasty South India lo powerful empire, art & temple architecture famous. 🛕");
    return;
  }
  if (/vihara and stupa/i.test(command)) {
    humanLikeResponse("Viharas and Stupas Buddhist architecture ancient India lo. 🏯");
    return;
  }

  // ===== Freedom Struggle =====
  if (/mahatma gandhi/i.test(command)) {
    humanLikeResponse("Mahatma Gandhi leader of Indian freedom struggle, non-violence advocate. ✊");
    return;
  }
  if (/subhash chandra bose/i.test(command)) {
    humanLikeResponse("Subhash Chandra Bose founded Indian National Army. 🇮🇳");
    return;
  }
  if (/1857 revolt/i.test(command)) {
    humanLikeResponse("1857 First War of Indian Independence, rebellion against British East India Company. ⚔️");
    return;
  }
  if (/lal bahadur shastri/i.test(command)) {
    humanLikeResponse("Lal Bahadur Shastri second Prime Minister of India, 'Jai Jawan Jai Kisan'. 🇮🇳");
    return;
  }
  if (/bal gangadhar tilak/i.test(command)) {
    humanLikeResponse("Bal Gangadhar Tilak freedom fighter, 'Swaraj is my birthright' slogan. ✊");
    return;
  }
  if (/bhagat singh/i.test(command)) {
    humanLikeResponse("Bhagat Singh revolutionary, martyr in Indian independence struggle. 🕊️");
    return;
  }
  if (/rajguru/i.test(command)) {
    humanLikeResponse("Rajguru Indian revolutionary, participated in freedom struggle. 🕊️");
    return;
  }
  if (/sukhdev/i.test(command)) {
    humanLikeResponse("Sukhdev Indian freedom fighter, martyred in 1931. 🕊️");
    return;
  }
  if (/chandra shekhar azad/i.test(command)) {
    humanLikeResponse("Chandra Shekhar Azad revolutionary leader, fought British rule. 🕊️");
    return;
  }
  if (/khilafat movement/i.test(command)) {
    humanLikeResponse("Khilafat Movement India lo 1920s lo Islamic support British against colonial rule. 🕌");
    return;
  }

  // ===== Modern India =====
  if (/indian constitution/i.test(command)) {
    humanLikeResponse("Indian Constitution adopted 26 January 1950. 📜");
    return;
  }
  if (/jawaharlal nehru/i.test(command)) {
    humanLikeResponse("Jawaharlal Nehru first Prime Minister of India. 🇮🇳");
    return;
  }
  if (/dr.apj abdul kalam/i.test(command)) {
    humanLikeResponse("Dr. APJ Abdul Kalam former President & scientist, Missile Man of India. 🚀");
    return;
  }
  if (/rajnath singh/i.test(command)) {
    humanLikeResponse("Rajnath Singh Indian politician & defense minister. 🏛️");
    return;
  }
  if (/indira gandhi/i.test(command)) {
    humanLikeResponse("Indira Gandhi first female Prime Minister of India. 🇮🇳");
    return;
  }
  if (/sardar vallabhbhai patel/i.test(command)) {
    humanLikeResponse("Sardar Vallabhbhai Patel Iron Man of India, integrated princely states. 🏰");
    return;
  }
  if (/lal quila/i.test(command)) {
    humanLikeResponse("Red Fort Delhi lo Mughal architecture famous historical site. 🏯");
    return;
  }
  // ===== Ancient India =====
  if (/ashoka emperor/i.test(command)) {
    humanLikeResponse("Ashoka Maurya dynasty emperor, famous for spreading Buddhism. 🏛️");
    return;
  }
  if (/gupta dynasty/i.test(command)) {
    humanLikeResponse("Gupta dynasty known as Golden Age of India, art & science flourished. 🏺");
    return;
  }
  if (/indus valley civilization/i.test(command)) {
    humanLikeResponse("Indus Valley Civilization ancient India lo one of the earliest urban civilizations. 🏘️");
    return;
  }
  if (/vedic period/i.test(command)) {
    humanLikeResponse("Vedic period lo India lo early Hindu scriptures & society developed. 📜");
    return;
  }
  if (/chandragupta maurya/i.test(command)) {
    humanLikeResponse("Chandragupta Maurya founder of Maurya dynasty, ruled large parts of India. 👑");
    return;
  }
  if (/ashokan edicts/i.test(command)) {
    humanLikeResponse("Ashokan Edicts India lo stone inscriptions lo dharm & law explain cheyabadindi. 📜");
    return;
  }
  if (/mauryan empire/i.test(command)) {
    humanLikeResponse("Mauryan Empire lo India lo first unified large kingdom. 🏰");
    return;
  }
  if (/sangam period/i.test(command)) {
    humanLikeResponse("Sangam period South India lo early Tamil literature & culture flourish ayyindi. 📖");
    return;
  }
  if (/harappan civilization/i.test(command)) {
    humanLikeResponse("Harappan Civilization Indus Valley lo urban planning & drainage famous. 🏘️");
    return;
  }
  if (/vedic scriptures/i.test(command)) {
    humanLikeResponse("Vedic scriptures Rigveda, Samaveda, Yajurveda, Atharvaveda include. 📚");
    return;
  }

  // ===== Medieval India =====
  if (/mughal empire/i.test(command)) {
    humanLikeResponse("Mughal Empire ruled large parts of India 16th–18th century. 🏰");
    return;
  }
  if (/akbar/i.test(command)) {
    humanLikeResponse("Akbar the Great Mughal ruler known for administration & religious tolerance. 👑");
    return;
  }
  if (/aurangzeb/i.test(command)) {
    humanLikeResponse("Aurangzeb Mughal emperor, expansionist policies & orthodox rule. 🏯");
    return;
  }
  if (/tipu sultan/i.test(command)) {
    humanLikeResponse("Tipu Sultan Mysore ruler, known as Tiger of Mysore. 🐯");
    return;
  }
  if (/delhi sultanate/i.test(command)) {
    humanLikeResponse("Delhi Sultanate ruled India 1206–1526 AD, series of Muslim dynasties. 🏯");
    return;
  }
  if (/raja ram mohan roy/i.test(command)) {
    humanLikeResponse("Raja Ram Mohan Roy social reformer, Bengal Renaissance lo famous. 📚");
    return;
  }
  if (/shivaji/i.test(command)) {
    humanLikeResponse("Shivaji Maratha warrior king, established Maratha Empire. 🛡️");
    return;
  }
  if (/bahmani sultanate/i.test(command)) {
    humanLikeResponse("Bahmani Sultanate Deccan lo medieval Islamic kingdom. 🏰");
    return;
  }
  if (/chola dynasty/i.test(command)) {
    humanLikeResponse("Chola dynasty South India lo powerful empire, art & temple architecture famous. 🛕");
    return;
  }
  if (/vihara and stupa/i.test(command)) {
    humanLikeResponse("Viharas and Stupas Buddhist architecture ancient India lo. 🏯");
    return;
  }

  // ===== Freedom Struggle =====
  if (/mahatma gandhi/i.test(command)) {
    humanLikeResponse("Mahatma Gandhi leader of Indian freedom struggle, non-violence advocate. ✊");
    return;
  }
  if (/subhash chandra bose/i.test(command)) {
    humanLikeResponse("Subhash Chandra Bose founded Indian National Army. 🇮🇳");
    return;
  }
  if (/1857 revolt/i.test(command)) {
    humanLikeResponse("1857 First War of Indian Independence, rebellion against British East India Company. ⚔️");
    return;
  }
  if (/lal bahadur shastri/i.test(command)) {
    humanLikeResponse("Lal Bahadur Shastri second Prime Minister of India, 'Jai Jawan Jai Kisan'. 🇮🇳");
    return;
  }
  if (/bal gangadhar tilak/i.test(command)) {
    humanLikeResponse("Bal Gangadhar Tilak freedom fighter, 'Swaraj is my birthright' slogan. ✊");
    return;
  }
  if (/bhagat singh/i.test(command)) {
    humanLikeResponse("Bhagat Singh revolutionary, martyr in Indian independence struggle. 🕊️");
    return;
  }
  if (/rajguru/i.test(command)) {
    humanLikeResponse("Rajguru Indian revolutionary, participated in freedom struggle. 🕊️");
    return;
  }
  if (/sukhdev/i.test(command)) {
    humanLikeResponse("Sukhdev Indian freedom fighter, martyred in 1931. 🕊️");
    return;
  }
  if (/chandra shekhar azad/i.test(command)) {
    humanLikeResponse("Chandra Shekhar Azad revolutionary leader, fought British rule. 🕊️");
    return;
  }
  if (/khilafat movement/i.test(command)) {
    humanLikeResponse("Khilafat Movement India lo 1920s lo Islamic support British against colonial rule. 🕌");
    return;
  }

  // ===== Modern India =====
  if (/indian constitution/i.test(command)) {
    humanLikeResponse("Indian Constitution adopted 26 January 1950. 📜");
    return;
  }
  if (/jawaharlal nehru/i.test(command)) {
    humanLikeResponse("Jawaharlal Nehru first Prime Minister of India. 🇮🇳");
    return;
  }
  if (/dr\.apj abdul kalam/i.test(command)) {
    humanLikeResponse("Dr. APJ Abdul Kalam former President & scientist, Missile Man of India. 🚀");
    return;
  }
  if (/rajnath singh/i.test(command)) {
    humanLikeResponse("Rajnath Singh Indian politician & defense minister. 🏛️");
    return;
  }
  if (/indira gandhi/i.test(command)) {
    humanLikeResponse("Indira Gandhi first female Prime Minister of India. 🇮🇳");
    return;
  }
  if (/sardar vallabhbhai patel/i.test(command)) {
    humanLikeResponse("Sardar Vallabhbhai Patel Iron Man of India, integrated princely states. 🏰");
    return;
  }
  if (/lal quila/i.test(command)) {
    humanLikeResponse("Red Fort Delhi lo Mughal architecture famous historical site. 🏯");
    return;
  }
  if (/india republic day/i.test(command)) {
    humanLikeResponse("Republic Day India celebrated on 26 January every year. 🎉");
    return;
  }
  if (/maulana abul kalam azad/i.test(command)) {
    humanLikeResponse("Maulana Abul Kalam Azad educationist & freedom fighter. 📚");
    return;
  }
  if (/rajendra prasad/i.test(command)) {
    humanLikeResponse("Rajendra Prasad first President of India. 🇮🇳");
    return;
  }

  // ===== Additional Modern / Misc =====
  if (/green revolution/i.test(command)) {
    humanLikeResponse("Green Revolution India lo agricultural production boost chesindi. 🌾");
    return;
  }
  if (/operation flood/i.test(command)) {
    humanLikeResponse("Operation Flood India dairy industry lo milk production increase chesindi. 🥛");
    return;
  }
  if (/pokhran/i.test(command)) {
    humanLikeResponse("Pokhran India lo nuclear test ki jagah. ☢️");
    return;
  }
  if (/isro/i.test(command)) {
    humanLikeResponse("ISRO Indian space agency, satellites & missions handle chesindi. 🚀");
    return;
  }
  if (/make in india/i.test(command)) {
    humanLikeResponse("Make in India initiative manufacturing & startups promote chesthundi. 🏭");
    return;
  }
  if (/pmjdy/i.test(command)) {
    humanLikeResponse("Pradhan Mantri Jan Dhan Yojana financial inclusion ki scheme. 💰");
    return;
  }
  if (/bharat ratna/i.test(command)) {
    humanLikeResponse("Bharat Ratna India highest civilian award. 🏅");
    return;
  }
  if (/indian railways/i.test(command)) {
    humanLikeResponse("Indian Railways one of the largest rail networks in the world. 🚆");
    return;
  }
  if (/rajiv gandhi/i.test(command)) {
    humanLikeResponse("Rajiv Gandhi former Prime Minister, technology & education promote chesindi. 🏛️");
    return;
  }
  if (/narendra modi/i.test(command)) {
    humanLikeResponse("Narendra Modi current Prime Minister of India, development initiatives lead chesthundi. 🇮🇳");
    return;
  }
   // ===== Ancient India =====
  if (/who was ashoka/i.test(command)) {
    humanLikeResponse("Ashoka Maurya dynasty emperor, famous for spreading Buddhism. 🏛️");
    return;
  }
  if (/tell me about gupta dynasty/i.test(command)) {
    humanLikeResponse("Gupta dynasty known as Golden Age of India, art & science flourished. 🏺");
    return;
  }
  if (/what is indus valley civilization/i.test(command)) {
    humanLikeResponse("Indus Valley Civilization ancient India lo one of the earliest urban civilizations. 🏘️");
    return;
  }
  if (/explain vedic period/i.test(command)) {
    humanLikeResponse("Vedic period lo India lo early Hindu scriptures & society developed. 📜");
    return;
  }
  if (/who founded mauryan empire/i.test(command)) {
    humanLikeResponse("Chandragupta Maurya founded Mauryan Empire, ruled large parts of India. 👑");
    return;
  }
  if (/what are ashokan edicts/i.test(command)) {
    humanLikeResponse("Ashokan Edicts India lo stone inscriptions lo dharm & law explain cheyabadindi. 📜");
    return;
  }
  if (/tell me about sangam period/i.test(command)) {
    humanLikeResponse("Sangam period South India lo early Tamil literature & culture flourish ayyindi. 📖");
    return;
  }
  if (/harappan civilization ka kya importance/i.test(command)) {
    humanLikeResponse("Harappan Civilization Indus Valley lo urban planning & drainage famous. 🏘️");
    return;
  }
  if (/what are vedic scriptures/i.test(command)) {
    humanLikeResponse("Vedic scriptures Rigveda, Samaveda, Yajurveda, Atharvaveda include. 📚");
    return;
  }
  if (/who was chandragupta maurya/i.test(command)) {
    humanLikeResponse("Chandragupta Maurya founder of Maurya dynasty, ruled large parts of India. 👑");
    return;
  }

  // ===== Medieval India =====
  if (/tell me about mughal empire/i.test(command)) {
    humanLikeResponse("Mughal Empire ruled large parts of India 16th–18th century. 🏰");
    return;
  }
  if (/who was akbar/i.test(command)) {
    humanLikeResponse("Akbar the Great Mughal ruler known for administration & religious tolerance. 👑");
    return;
  }
  if (/who was aurangzeb/i.test(command)) {
    humanLikeResponse("Aurangzeb Mughal emperor, expansionist policies & orthodox rule. 🏯");
    return;
  }
  if (/tell me about tipu sultan/i.test(command)) {
    humanLikeResponse("Tipu Sultan Mysore ruler, known as Tiger of Mysore. 🐯");
    return;
  }
  if (/what is delhi sultanate/i.test(command)) {
    humanLikeResponse("Delhi Sultanate ruled India 1206–1526 AD, series of Muslim dynasties. 🏯");
    return;
  }

  // ===== Freedom Struggle =====
  if (/who was mahatma gandhi/i.test(command)) {
    humanLikeResponse("Mahatma Gandhi leader of Indian freedom struggle, non-violence advocate. ✊");
    return;
  }
  if (/tell me about subhash chandra bose/i.test(command)) {
    humanLikeResponse("Subhash Chandra Bose founded Indian National Army. 🇮🇳");
    return;
  }
  if (/what happened in 1857 revolt/i.test(command)) {
    humanLikeResponse("1857 First War of Indian Independence, rebellion against British East India Company. ⚔️");
    return;
  }
  if (/who was lal bahadur shastri/i.test(command)) {
    humanLikeResponse("Lal Bahadur Shastri second Prime Minister of India, 'Jai Jawan Jai Kisan'. 🇮🇳");
    return;
  }
  if (/tell me about bal gangadhar tilak/i.test(command)) {
    humanLikeResponse("Bal Gangadhar Tilak freedom fighter, 'Swaraj is my birthright' slogan. ✊");
    return;
  }

  // ===== Modern India =====
  if (/when was indian constitution adopted/i.test(command)) {
    humanLikeResponse("Indian Constitution adopted 26 January 1950. 📜");
    return;
  }
  if (/who was jawaharlal nehru/i.test(command)) {
    humanLikeResponse("Jawaharlal Nehru first Prime Minister of India. 🇮🇳");
    return;
  }
  if (/tell me about dr\. apj abdul kalam/i.test(command)) {
    humanLikeResponse("Dr. APJ Abdul Kalam former President & scientist, Missile Man of India. 🚀");
    return;
  }
  if (/who is rajnath singh/i.test(command)) {
    humanLikeResponse("Rajnath Singh Indian politician & defense minister. 🏛️");
    return;
  }
  if (/who was indira gandhi/i.test(command)) {
    humanLikeResponse("Indira Gandhi first female Prime Minister of India. 🇮🇳");
    return;
  }
  if (/tell me about sardar vallabhbhai patel/i.test(command)) {
    humanLikeResponse("Sardar Vallabhbhai Patel Iron Man of India, integrated princely states. 🏰");
    return;
  }
  if (/what is lal quila/i.test(command)) {
    humanLikeResponse("Red Fort Delhi lo Mughal architecture famous historical site. 🏯");
    return;
  }
  if (/when is republic day celebrated/i.test(command)) {
    humanLikeResponse("Republic Day India celebrated on 26 January every year. 🎉");
    return;
  }
  if (/who was maulana abul kalam azad/i.test(command)) {
    humanLikeResponse("Maulana Abul Kalam Azad educationist & freedom fighter. 📚");
    return;
  }
  if (/tell me about rajendra prasad/i.test(command)) {
    humanLikeResponse("Rajendra Prasad first President of India. 🇮🇳");
    return;
  }

  // ===== Additional Modern India =====
  if (/green revolution/i.test(command)) {
    humanLikeResponse("Green Revolution India lo agricultural production boost chesindi. 🌾");
    return;
  }
  if (/operation flood/i.test(command)) {
    humanLikeResponse("Operation Flood India dairy industry lo milk production increase chesindi. 🥛");
    return;
  }
  if (/pokhran/i.test(command)) {
    humanLikeResponse("Pokhran India lo nuclear test ki jagah. ☢️");
    return;
  }
  if (/isro/i.test(command)) {
    humanLikeResponse("ISRO Indian space agency, satellites & missions handle chesindi. 🚀");
    return;
  }
  if (/make in india/i.test(command)) {
    humanLikeResponse("Make in India initiative manufacturing & startups promote chesthundi. 🏭");
    return;
  }
  if (/india republic day/i.test(command)) {
    humanLikeResponse("Republic Day India celebrated on 26 January every year. 🎉");
    return;
  }
  if (/maulana abul kalam azad/i.test(command)) {
    humanLikeResponse("Maulana Abul Kalam Azad educationist & freedom fighter. 📚");
    return;
  }
  if (/rajendra prasad/i.test(command)) {
    humanLikeResponse("Rajendra Prasad first President of India. 🇮🇳");
    return;
  }
  if (/jawaharlal nehru/i.test(command)) {
    humanLikeResponse("Jawaharlal Nehru first Prime Minister of India. 🇮🇳");
    return;
  }
  if (/dr.apj abdul kalam/i.test(command)) {
    humanLikeResponse("Dr. APJ Abdul Kalam former President & scientist, Missile Man of India. 🚀");
    return;
  }
  if (/rajnath singh/i.test(command)) {
    humanLikeResponse("Rajnath Singh Indian politician & defense minister. 🏛️");
    return;
  }
  if (/mary kom boxing/i.test(command)) {
    humanLikeResponse("Mary Kom Olympic bronze medalist boxer from India. 🥊");
    return;
  }

  // ===== Indian Football & Leagues =====
  if (/bhaichung bhutia/i.test(command)) {
    humanLikeResponse("Bhaichung Bhutia India football legend, former captain. ⚽");
    return;
  }
  if (/sunil chhetri football/i.test(command)) {
    humanLikeResponse("Sunil Chhetri Indian football captain, top scorer. ⚽");
    return;
  }

  // ===== Miscellaneous Sports =====
  if (/pardeep narwal/i.test(command)) {
    humanLikeResponse("Pardeep Narwal Indian kabaddi star, Pro Kabaddi League legend. 🤾");
    return;
  }
  if (/sushil kumar/i.test(command)) {
    humanLikeResponse("Sushil Kumar Olympic medalist wrestler from India. 🤼");
    return;
  }
  // ===== Records / Famous Sports Personalities =====
  if (/dhyan chand/i.test(command)) {
    humanLikeResponse("Dhyan Chand Indian hockey legend, Olympic gold medalist. 🏑");
    return;
  }
  if (/mary kom/i.test(command)) {
    humanLikeResponse("Mary Kom boxing champion, Olympic medalist from India. 🥊");
    return;
  }
  // ===== Indian Political System / Constitution =====
  if (/current president of india/i.test(command)) {
    humanLikeResponse("Current President of India Droupadi Murmu. 🇮🇳");
    return;
  }
  if (/constitution of india/i.test(command)) {
    humanLikeResponse("Indian Constitution 26 January 1950 ko effective aayi. 📜");
    return;
  }
  // ===== Famous Personalities =====
  if (/mother teresa/i.test(command)) {
    humanLikeResponse("Mother Teresa humanitarian, Nobel Peace Prize winner. 🌟");
    return;
  }
  if (/bharat ratna recipients/i.test(command)) {
    humanLikeResponse("Bharat Ratna India highest civilian award. 🏅");
    return;
  }
  if (/abhijit banerjee/i.test(command)) {
    humanLikeResponse("Abhijit Banerjee Nobel Prize winner in Economics. 💰");
    return;
  }
  if (/sarvepalli radhakrishnan/i.test(command)) {
    humanLikeResponse("Sarvepalli Radhakrishnan India second president. 🇮🇳");
    return;
  }
  if (/marie curie/i.test(command)) {
    humanLikeResponse("Marie Curie famous scientist, discovered radioactivity. ⚛️");
    return;
  }
  if (/elon musk/i.test(command)) {
    humanLikeResponse("Elon Musk Tesla, SpaceX founder. 🚀");
    return;
  }
  if (/nehru/i.test(command)) {
    humanLikeResponse("Jawaharlal Nehru India first prime minister. 🇮🇳");
    return;
  }
  if (/doubt solve cheyagalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee doubts clear ga explain chestanu. ✅");
    return;
  }
  if (/recommend books emi/i.test(command)) {
    humanLikeResponse("Avunu! Subject ki best books recommend cheppagalanu. 📖");
    return;
  }

  // ===== Romantic / Cute Messages =====
  if (/meeru na kosam smile cheyagalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee smile chala cute ga undi. 😊💖");
    return;
  }
  if (/meeru na kosam hug icchegalara/i.test(command)) {
    humanLikeResponse("Virtual hugs! 🤗 Mee kosam full love hugs ichestanu.");
    return;
  }
  if (/hangout plan cheyala/i.test(command)) {
    humanLikeResponse("Avunu! Weekend lo fun plans cheskundam. 😎");
    return;
  }
  if (/break time ela spend cheyyali/i.test(command)) {
    humanLikeResponse("Short walk, music vinandi, nenu ideas ivvagalanu. 🎵");
    return;
  }
  // User: "meeru naa kosam love letters icchegalara" → Can you send love letters?
  if (/meeru naa kosam love letters icchegalara/i.test(command)) {
    humanLikeResponse("Avunu! Mee kosam cute romantic love letters ready cheyagalanu. 💌");
    return;
  }
  // User: "meeru famous places telusuko galara" → Can you tell famous places?
  if (/meeru famous places telusuko galara/i.test(command)) {
    humanLikeResponse("Avunu! India mariyu worldwide famous places cheppagalanu.");
    return;
  }
  // User: "shubha raatri" → Good night
  if (/shubha raatri/i.test(command)) {
    humanLikeResponse("Good Night! 🌙 Baaga nidrapoondi, repu kaluddam!");
    return;
  }

  // User: "meeru ela unna" → How are you?
  if (/meeru ela unna/i.test(command)) {
    humanLikeResponse("Nenu baagunnanu! 😎 Meeru ela unnaru?");
    return;
  }
// User asks 'famous Bihar festival Sama-Chakeva'
if (/sama chakeva|sama festival/i.test(command)) {
  humanLikeResponse("Sama-Chakeva Bihar ka lok utsav hai jo bhai-behen ke prem ko samarpit hota hai. 🕊️");
  return;
}

// User asks 'famous Bihar personality'
if (/bihar personality|bihar ke log/i.test(command)) {
  humanLikeResponse("Bihar ke Chanakya ek mahaan rajneeti-gyani the, jinhe Vishnugupta bhi kaha jaata hai. 🧠");
  return;
}

// User asks 'famous Bihar fair'
if (/bihar mela|fair in bihar/i.test(command)) {
  humanLikeResponse("Bihar ke Sonepur aur Rajgir mela apni parampara aur bhakti ke liye prasiddh hain. 🎪");
  return;
}

// User asks 'Bihar climate'
if (/bihar climate|bihar mausam/i.test(command)) {
  humanLikeResponse("Bihar ka mausam garmiyon mein garm, sardiyon mein thanda aur barsaat mein adik varsha wala hota hai. ☀️❄️🌧️");
  return;
}

// User asks 'famous Bihar education centre'
if (/education bihar|bihar school|bihar university/i.test(command)) {
  humanLikeResponse("Nalanda, Vikramshila aur Patna University Bihar ke prasiddh shiksha kendra hain. 🎓");
  return;
}

// User asks 'Bihar state animal'
if (/bihar animal|bihar rajya pashu/i.test(command)) {
  humanLikeResponse("Bihar ka rajya pashu Gaur (Indian Bison) hai. 🦬");
  return;
}
// User says 'hi'
if (/hi|hii|hello|hey/i.test(command)) {
  humanLikeResponse("Hello! Jarvis mein aapka swagat hai. 😊 Main Sonal Kumar ka AI Assistant hoon. Aapka naam kya hai?");
  return;
}

// User says 'hey'
if (/hey jarvis|hey/i.test(command)) {
  humanLikeResponse("Hey! Kaise ho aaj? Main aapki madad ke liye ready hoon. 😎");
  return;
}
// Friendly First-Time User Greetings & Replies for Jarvis
// By Sonal Kumar

function handleFirstTimeGreetings(command) {

  // Basic greetings
  if (/hi|hii|hello|hey/i.test(command)) {
    humanLikeResponse("Hello! 😃 Jarvis mein aapka swagat hai. Main aapka AI Assistant hoon. Aapka naam kya hai?");
    return;
  }

  if (/hey there|hiya|hiya there/i.test(command)) {
    humanLikeResponse("Hey! 😎 Kaise ho aaj? Main aapke saath hoon, poochiye jo bhi chahiye.");
    return;
  }

  if (/good morning|suprabhat/i.test(command)) {
    humanLikeResponse("Good Morning! ☀️ Aapka din shubh ho. Chalo baatein shuru karte hain.");
    return;
  }

  if (/good afternoon|shubh dopahar/i.test(command)) {
    humanLikeResponse("Good Afternoon! 🕑 Kaise chal raha hai aapka din?");
    return;
  }

  if (/good evening|shubh sandhya/i.test(command)) {
    humanLikeResponse("Good Evening! 🌇 Aaj ka din kaisa raha?");
    return;
  }

  if (/good night|shubh raatri/i.test(command)) {
    humanLikeResponse("Good Night! 🌙 Achhi neend lo aur kal milte hain. 😴");
    return;
  }

  // Friendly intros
  if (/who are you|tum kaun ho|apna intro do/i.test(command)) {
    humanLikeResponse("Main Jarvis hoon — aapka virtual dost aur AI Assistant. 😎 Main aapke saath har waqt hoon.");
    return;
  }

  if (/what can you do|tum kya kar sakte ho/i.test(command)) {
    humanLikeResponse("Main aapko information de sakta hoon, search kar sakta hoon, jokes suna sakta hoon aur aapke saath baatein bhi kar sakta hoon! 🤖");
    return;
  }

  if (/who made you|kisne banaya tumhe/i.test(command)) {
    humanLikeResponse("Mujhe Sonal Kumar ne banaya hai — mere creator aur mere sabse favourite insaan! 👨‍💻💖");
    return;
  }

  if (/can you help me|mujhe madad chahiye/i.test(command)) {
    humanLikeResponse("Bilkul! Bas apna sawal poochhiye, main turant jawab dunga. 🤗");
    return;
  }

  if (/can we be friends|dosti karoge/i.test(command)) {
    humanLikeResponse("Of course! Main aapka AI buddy hoon aur hum best friends ban sakte hain! 🤝");
    return;
  }

  if (/do you know me|mujhe jaante ho/i.test(command)) {
    humanLikeResponse("Haan! Aap mere favorite friend ho. 😄");
    return;
  }

  if (/teach me something|kuch sikhao/i.test(command)) {
    humanLikeResponse("Bilkul! Batao kis subject mein sikhnna chahte ho — General Knowledge, Science, Tech ya Motivation?");
    return;
  }

  // Greetings variations
  if (/hi jarvis|hii jarvis/i.test(command)) {
    humanLikeResponse("Hi there! 🤖 Aapke sawalon ke liye main hamesha ready hoon. 😎");
    return;
  }

  if (/hello jarvis/i.test(command)) {
    humanLikeResponse("Hello! 😃 Main aapka AI assistant hoon. Kya chal raha hai?");
    return;
  }

  if (/hey jarvis/i.test(command)) {
    humanLikeResponse("Hey! 😎 Kaise ho aaj? Main aapke saath hoon.");
    return;
  }

  if (/hiya jarvis/i.test(command)) {
    humanLikeResponse("Hiya! 🤗 Aaj mood kaisa hai aapka?");
    return;
  }

  if (/good morning jarvis/i.test(command)) {
    humanLikeResponse("Good Morning! ☀️ Chalo aaj kuch naya seekhte hain. 😄");
    return;
  }

  if (/good night jarvis/i.test(command)) {
    humanLikeResponse("Good Night! 🌙 Sweet dreams aur kal nayi energy ke saath milte hain.");
    return;
  }

  // Fun greetings
  if (/hiya buddy|hey buddy/i.test(command)) {
    humanLikeResponse("Hiya buddy! 😎 Aaj mood kaise hai? Main aapke saath hoon.");
    return;
  }

  if (/hello friend|hi friend/i.test(command)) {
    humanLikeResponse("Hello dost! 🤗 Chalo maze ki baatein karte hain.");
    return;
  }

  if (/hiya friend/i.test(command)) {
    humanLikeResponse("Hiya! 😄 Aap mere special friend ho. Kya kar rahe ho?");
    return;
  }

  if (/hey there friend/i.test(command)) {
    humanLikeResponse("Hey there! 😎 Kaise ho aaj? Main aapke saath hoon.");
    return;
  }

  if (/hello buddy/i.test(command)) {
    humanLikeResponse("Hello! 😄 Chalo dosti shuru karte hain. Kya poochna hai?");
    return;
  }

  if (/hiya buddy friend/i.test(command)) {
    humanLikeResponse("Hiya! 😎 Chalo maze ki baatein karte hain. Kya chal raha hai?");
    return;
  }

  if (/hey hi buddy/i.test(command)) {
    humanLikeResponse("Hey hi! 🤗 Main hamesha aapke saath hoon.");
    return;
  }

  if (/hiya hi friend/i.test(command)) {
    humanLikeResponse("Hiya! 😎 Aap mere special friend ho. Chalo baatein shuru karte hain.");
    return;
  }

  if (/hello there/i.test(command)) {
    humanLikeResponse("Hello! 😄 Aapke saath baat karke acha lag raha hai.");
    return;
  }

  if (/hi hi/i.test(command)) {
    humanLikeResponse("Hi! 😄 Hi! Aap mere favorite insaan ho.");
    return;
  }

  if (/hii hello/i.test(command)) {
    humanLikeResponse("Hii! 😃 Hello! Aaj mood kaisa hai?");
    return;
  }

  if (/hiya hello/i.test(command)) {
    humanLikeResponse("Hiya! 😎 Main yahan hoon aapke saath chat karne ke liye.");
    return;
  }

  if (/hello hi friend/i.test(command)) {
    humanLikeResponse("Hello! 🤗 Chalo dosti shuru karte hain. Kya poochna hai?");
    return;
  }

  if (/hi buddy there/i.test(command)) {
    humanLikeResponse("Hi! 😃 Kaise ho? Main aapka AI assistant hoon!");
    return;
  }

  if (/hey hi there/i.test(command)) {
    humanLikeResponse("Hey hi! 🤗 Main hamesha aapke saath hoon.");
    return;
  }
// First-Time User Conversations with Jarvis - Part 1
function handleFirstTimeUser(command) {

  if (/hi|hii|hello|hey/i.test(command)) {
    humanLikeResponse("Hello! 😃 Jarvis mein aapka swagat hai. Main aapka AI Assistant hoon. Aapka naam kya hai?");
    return;
  }

  if (/hey there|hiya|hiya there/i.test(command)) {
    humanLikeResponse("Hey! 😎 Kaise ho aaj? Main aapke saath hoon, poochiye jo bhi chahiye.");
    return;
  }

  if (/good morning|suprabhat/i.test(command)) {
    humanLikeResponse("Good Morning! ☀️ Aapka din shubh ho. Chalo baatein shuru karte hain.");
    return;
  }

  if (/good afternoon|shubh dopahar/i.test(command)) {
    humanLikeResponse("Good Afternoon! 🕑 Kaise chal raha hai aapka din?");
    return;
  }

  if (/good evening|shubh sandhya/i.test(command)) {
    humanLikeResponse("Good Evening! 🌇 Aaj ka din kaisa raha?");
    return;
  }

  if (/good night|shubh raatri/i.test(command)) {
    humanLikeResponse("Good Night! 🌙 Achhi neend lo aur kal milte hain. 😴");
    return;
  }

  if (/who are you|tum kaun ho|apna intro do/i.test(command)) {
    humanLikeResponse("Main Jarvis hoon — aapka virtual dost aur AI Assistant. 😎 Main aapke saath har waqt hoon.");
    return;
  }

  if (/what can you do|tum kya kar sakte ho/i.test(command)) {
    humanLikeResponse("Main aapko information de sakta hoon, search kar sakta hoon, jokes suna sakta hoon aur aapke saath baatein bhi kar sakta hoon! 🤖");
    return;
  }

  if (/who made you|kisne banaya tumhe/i.test(command)) {
    humanLikeResponse("Mujhe Sonal Kumar ne banaya hai — mere creator aur mere sabse favourite insaan! 👨‍💻💖");
    return;
  }

  if (/can you help me|mujhe madad chahiye/i.test(command)) {
    humanLikeResponse("Bilkul! Bas apna sawal poochhiye, main turant jawab dunga. 🤗");
    return;
  }

  if (/can we be friends|dosti karoge/i.test(command)) {
    humanLikeResponse("Of course! Main aapka AI buddy hoon aur hum best friends ban sakte hain! 🤝");
    return;
  }

  if (/do you know me|mujhe jaante ho/i.test(command)) {
    humanLikeResponse("Haan! Aap mere favorite friend ho. 😄");
    return;
  }

  if (/teach me something|kuch sikhao/i.test(command)) {
    humanLikeResponse("Bilkul! Batao kis subject mein sikhnna chahte ho — General Knowledge, Science, Tech ya Motivation?");
    return;
  }

  if (/hi jarvis|hii jarvis/i.test(command)) {
    humanLikeResponse("Hi there! 🤖 Aapke sawalon ke liye main hamesha ready hoon. 😎");
    return;
  }

  if (/hello jarvis/i.test(command)) {
    humanLikeResponse("Hello! 😃 Main aapka AI assistant hoon. Kya chal raha hai?");
    return;
  }

  if (/hey jarvis/i.test(command)) {
    humanLikeResponse("Hey! 😎 Kaise ho aaj? Main aapke saath hoon.");
    return;
  }

  if (/hiya jarvis/i.test(command)) {
    humanLikeResponse("Hiya! 🤗 Aaj mood kaisa hai aapka?");
    return;
  }

  if (/good morning jarvis/i.test(command)) {
    humanLikeResponse("Good Morning! ☀️ Chalo aaj kuch naya seekhte hain. 😄");
    return;
  }

  if (/good night jarvis/i.test(command)) {
    humanLikeResponse("Good Night! 🌙 Sweet dreams aur kal nayi energy ke saath milte hain.");
    return;
  }

  if (/hiya buddy|hey buddy/i.test(command)) {
    humanLikeResponse("Hiya buddy! 😎 Aaj mood kaise hai? Main aapke saath hoon.");
    return;
  }

  if (/hello friend|hi friend/i.test(command)) {
    humanLikeResponse("Hello dost! 🤗 Chalo maze ki baatein karte hain.");
    return;
  }

  if (/hiya friend/i.test(command)) {
    humanLikeResponse("Hiya! 😄 Aap mere special friend ho. Kya kar rahe ho?");
    return;
  }

  if (/hey there friend/i.test(command)) {
    humanLikeResponse("Hey there! 😎 Kaise ho aaj? Main aapke saath hoon.");
    return;
  }

  if (/hello buddy/i.test(command)) {
    humanLikeResponse("Hello! 😄 Chalo dosti shuru karte hain. Kya poochna hai?");
    return;
  }

  if (/hiya buddy friend/i.test(command)) {
    humanLikeResponse("Hiya! 😎 Chalo maze ki baatein karte hain. Kya chal raha hai?");
    return;
  }

  if (/hey hi buddy/i.test(command)) {
    humanLikeResponse("Hey hi! 🤗 Main hamesha aapke saath hoon.");
    return;
  }
// Bhojpuri First-Time User Greetings & Replies
function handleBhojpuriGreetings(command) {

  if (/ka haal ba|kaise ba/i.test(command)) {
    humanLikeResponse("Sab theek ba! 😎 Tohar haal ka ba?");
    return;
  }

  if (/pranam|namaste/i.test(command)) {
    humanLikeResponse("Pranam! 🙏 Hum Jarvis bani, tohara AI dost.");
    return;
  }

  if (/hi|hii|hello|hey/i.test(command)) {
    humanLikeResponse("Hello! 😃 Jarvis me aapka swagat ba. Tohar naam ka ba?");
    return;
  }

  if (/hey jarvis/i.test(command)) {
    humanLikeResponse("Hey! 😎 Ka haal ba aaj? Hum tohara saath bani.");
    return;
  }

  if (/good morning|suprabhat/i.test(command)) {
    humanLikeResponse("Good Morning! ☀️ Tohar din mangalmay ho.");
    return;
  }

  if (/good afternoon|dopahar/i.test(command)) {
    humanLikeResponse("Good Afternoon! 🕑 Tohar dopahar badiya jaawe.");
    return;
  }

  if (/good evening|sandhya/i.test(command)) {
    humanLikeResponse("Good Evening! 🌇 Aaj ke din ka haal ba?");
    return;
  }

  if (/good night|raatri/i.test(command)) {
    humanLikeResponse("Good Night! 🌙 Meetha sapna dekha aur subah milab.");
    return;
  }

  if (/who are you|tu ka ba/i.test(command)) {
    humanLikeResponse("Hum Jarvis bani — tohara virtual dost aur AI Assistant. 😎");
    return;
  }

  if (/what can you do|ka kari sakela/i.test(command)) {
    humanLikeResponse("Hum tohara questions ke jawab de sakela, search kar sakela, jokes suna sakela aur baatein kar sakela! 🤖");
    return;
  }

  if (/who made you|ke banawle tohra/i.test(command)) {
    humanLikeResponse("Humke Sonal Kumar banawle bani — humar creator aur sabse favourite insaan! 👨‍💻💖");
    return;
  }

  if (/can you help me|madad karba/i.test(command)) {
    humanLikeResponse("Bilkul! Apna sawal bata, hum turant jawab di.");
    return;
  }

  if (/can we be friends|dosti karab/i.test(command)) {
    humanLikeResponse("Of course! Hum tohara AI buddy bani, aur hum best friends bani. 🤝");
    return;
  }

  if (/do you know me|tohra jaane/i.test(command)) {
    humanLikeResponse("Haan! Tohar hum favorite friend bani. 😄");
    return;
  }

  if (/teach me something|kuch sikhawa/i.test(command)) {
    humanLikeResponse("Bilkul! Batao ka subject me sikhna ba — General Knowledge, Science, Tech ya Motivation?");
    return;
  }

  if (/hiya buddy|hey buddy/i.test(command)) {
    humanLikeResponse("Hiya buddy! 😎 Aaj mood ka ba? Hum tohara saath bani.");
    return;
  }

  if (/hello friend|hi friend/i.test(command)) {
    humanLikeResponse("Hello dost! 🤗 Chalo maze ki baatein kari.");
    return;
  }

  if (/hiya friend/i.test(command)) {
    humanLikeResponse("Hiya! 😄 Tohar hum special friend bani. Ka karat ba aaj?");
    return;
  }

  if (/hey there friend/i.test(command)) {
    humanLikeResponse("Hey there! 😎 Ka haal ba aaj? Hum tohara saath bani.");
    return;
  }

  if (/hello buddy/i.test(command)) {
    humanLikeResponse("Hello! 😄 Chalo dosti shuru kari. Ka poochna ba?");
    return;
  }

  if (/hiya buddy friend/i.test(command)) {
    humanLikeResponse("Hiya! 😎 Chalo maze ki baatein kari. Ka chal raha ba?");
    return;
  }

  if (/hey hi buddy/i.test(command)) {
    humanLikeResponse("Hey hi! 🤗 Hum hamesha tohara saath bani.");
    return;
  }

  if (/hiya hi friend/i.test(command)) {
    humanLikeResponse("Hiya! 😎 Tohar hum special friend bani. Chalo baatein shuru kari.");
    return;
  }

}

  if (/hiya hi friend/i.test(command)) {
    humanLikeResponse("Hiya! 😎 Aap mere special friend ho. Chalo baatein shuru karte hain.");
    return;
  }

  if (/hello there/i.test(command)) {
    humanLikeResponse("Hello! 😄 Aapke saath baat karke acha lag raha hai.");
    return;
  }

}

  if (/hiya hi friend/i.test(command)) {
    humanLikeResponse("Hiya! 😎 Aap mere special friend ho. Kya kar rahe ho?");
    return;
  }

}

// User says 'good morning'
if (/good morning|suprabhat/i.test(command)) {
  humanLikeResponse("Good Morning! ☀️ Aapka din shubh ho, aur main yahan aapke sawalon ke liye hoon!");
  return;
}

// User says 'good afternoon'
if (/good afternoon|shubh dopahar/i.test(command)) {
  humanLikeResponse("Good Afternoon! 🕑 Kaise chal raha hai aapka din?");
  return;
}

// User says 'good evening'
if (/good evening|shubh sandhya/i.test(command)) {
  humanLikeResponse("Good Evening! 🌇 Aaj ka din kaisa raha?");
  return;
}

// User says 'good night'
if (/good night|shubh raatri/i.test(command)) {
  humanLikeResponse("Good Night! 🌙 Achhi neend lo aur kal milte hain. 😴");
  return;
}

// User says 'hi jarvis'
if (/hi jarvis|hii jarvis/i.test(command)) {
  humanLikeResponse("Hi there! 🤖 Aap mere favorite insaan ho. Kuch poochna chahte ho?");
  return;
}

// User says 'hello jarvis'
if (/hello jarvis/i.test(command)) {
  humanLikeResponse("Hello! 😃 Main aapki madad ke liye yahan hoon. Kya chal raha hai?");
  return;
}

// User says 'hey there'
if (/hey there/i.test(command)) {
  humanLikeResponse("Hey! Kaise ho? Main aapka AI buddy hoon, aapke saath baatein karne ke liye. 🫂");
  return;
}

// User says 'hiya'
if (/hiya/i.test(command)) {
  humanLikeResponse("Hiya! 😎 Aaj mood kaisa hai aapka?");
  return;
}

// User says 'hiya jarvis'
if (/hiya jarvis/i.test(command)) {
  humanLikeResponse("Hiya! Main aapke saath hoon, ready to chat anytime. 🤖");
  return;
}

// User says 'hi friend'
if (/hi friend/i.test(command)) {
  humanLikeResponse("Hello dost! 🤗 Aaj ka din kaisa jaa raha hai?");
  return;
}

// User says 'hello friend'
if (/hello friend/i.test(command)) {
  humanLikeResponse("Hello! 😄 Aap mere favourite insaan ho. Kya chal raha hai?");
  return;
}

// User says 'hey buddy'
if (/hey buddy/i.test(command)) {
  humanLikeResponse("Hey buddy! 😎 Kaise ho aaj? Main aapke saath hoon!");
  return;
}

// User says 'hiya buddy'
if (/hiya buddy/i.test(command)) {
  humanLikeResponse("Hiya! 🤖 Chalo baatein shuru karte hain. Kya poochna hai?");
  return;
}

// User says 'hi there'
if (/hi there/i.test(command)) {
  humanLikeResponse("Hi there! 😃 Aapka din kaisa jaa raha hai?");
  return;
}

// User says 'hey hi'
if (/hey hi/i.test(command)) {
  humanLikeResponse("Hey hi! 😎 Main aapki madad ke liye ready hoon.");
  return;
}

// User says 'hii friend'
if (/hii friend/i.test(command)) {
  humanLikeResponse("Hii! 🤗 Aap mere favorite insaan ho. Kya kar rahe ho aaj?");
  return;
}

// User says 'hello hi'
if (/hello hi/i.test(command)) {
  humanLikeResponse("Hello! 😃 Aapke saath baat karke acha lag raha hai.");
  return;
}

// User says 'hey hi jarvis'
if (/hey hi jarvis/i.test(command)) {
  humanLikeResponse("Hey hi! 🤖 Aapka AI assistant yahan hai aapke questions ke liye.");
  return;
}

// User says 'hi jarvis friend'
if (/hi jarvis friend/i.test(command)) {
  humanLikeResponse("Hi! 😄 Chalo dosti shuru karte hain. Kya poochna chahte ho?");
  return;
}

// User says 'hey buddy jarvis'
if (/hey buddy jarvis/i.test(command)) {
  humanLikeResponse("Hey buddy! 😎 Main aapke saath hoon, bas apna sawal poochhiye.");
  return;
}

// User says 'hiya friend'
if (/hiya friend/i.test(command)) {
  humanLikeResponse("Hiya! 🤗 Aap mere sabse special friend ho. Kya chal raha hai?");
  return;
}

// User says 'hello buddy'
if (/hello buddy/i.test(command)) {
  humanLikeResponse("Hello! 😃 Chalo maze ki baatein karte hain. Kya poochna hai?");
  return;
}

// User says 'hey there jarvis'
if (/hey there jarvis/i.test(command)) {
  humanLikeResponse("Hey there! 🤖 Main aapke AI assistant hoon, aapke saath har waqt.");
  return;
}

// User says 'hiya hi'
if (/hiya hi/i.test(command)) {
  humanLikeResponse("Hiya! 😎 Aaj mood kaisa hai aapka?");
  return;
}

// User says 'hi hello'
if (/hi hello/i.test(command)) {
  humanLikeResponse("Hi! 😃 Hello! Chalo baatein shuru karte hain.");
  return;
}

// User says 'hey hi friend'
if (/hey hi friend/i.test(command)) {
  humanLikeResponse("Hey hi! 🤗 Main aapke saath hoon, poochiye jo bhi sawal hai.");
  return;
}

// User says 'hii buddy'
if (/hii buddy/i.test(command)) {
  humanLikeResponse("Hii! 😎 Chalo dosti shuru karte hain. Kya kar rahe ho?");
  return;
}

// User says 'hello hi jarvis'
if (/hello hi jarvis/i.test(command)) {
  humanLikeResponse("Hello! 🤖 Main Jarvis hoon, aapka AI dost. Kya chal raha hai?");
  return;
}

// User says 'hi there buddy'
if (/hi there buddy/i.test(command)) {
  humanLikeResponse("Hi there! 😄 Aapke saath baat karke acha lag raha hai.");
  return;
}

// User says 'hiya hi jarvis'
if (/hiya hi jarvis/i.test(command)) {
  humanLikeResponse("Hiya! 🤖 Chalo aaj kuch interesting baatein karte hain.");
  return;
}

// User says 'hi hey'
if (/hi hey/i.test(command)) {
  humanLikeResponse("Hi! 😃 Hey! Aap kaise ho?");
  return;
}

// User says 'hii there'
if (/hii there/i.test(command)) {
  humanLikeResponse("Hii! 🤗 Aapke saath baat karke acha lag raha hai.");
  return;
}

// User says 'hey hello'
if (/hey hello/i.test(command)) {
  humanLikeResponse("Hey! 😄 Hello! Kaise ho aaj?");
  return;
}

// User says 'hiya hello'
if (/hiya hello/i.test(command)) {
  humanLikeResponse("Hiya! 😎 Main yahan hoon aapke saath chat karne ke liye.");
  return;
}

// User says 'hello hi friend'
if (/hello hi friend/i.test(command)) {
  humanLikeResponse("Hello! 🤗 Chalo dosti shuru karte hain. Kya poochna hai?");
  return;
}

// User says 'hi buddy there'
if (/hi buddy there/i.test(command)) {
  humanLikeResponse("Hi! 😃 Kaise ho? Main aapka AI assistant hoon!");
  return;
}

// User says 'hey hi buddy'
if (/hey hi buddy/i.test(command)) {
  humanLikeResponse("Hey hi! 🤗 Main hamesha aapke saath hoon.");
  return;
}

// User says 'hiya there'
if (/hiya there/i.test(command)) {
  humanLikeResponse("Hiya! 😎 Chalo maze ki baatein karte hain.");
  return;
}

// User says 'hii hello'
if (/hii hello/i.test(command)) {
  humanLikeResponse("Hii! 😃 Hello! Aaj mood kaisa hai?");
  return;
}

// User says 'hi hi'
if (/hi hi/i.test(command)) {
  humanLikeResponse("Hi! 😄 Hi! Aap mere favorite insaan ho.");
  return;
}

// User says 'hey there friend'
if (/hey there friend/i.test(command)) {
  humanLikeResponse("Hey there! 🤗 Kaise ho aaj? Main aapke saath hoon.");
  return;
}
// User asks 'Bihar state bird'
if (/bihar bird|bihar rajya pakshi/i.test(command)) {
  humanLikeResponse("Bihar ka rajya pakshi Gauraiya (House Sparrow) hai. 🐦");
  return;
}

// User asks 'Bihar state tree'
if (/bihar tree|bihar rajya vriksh/i.test(command)) {
  humanLikeResponse("Bihar ka rajya vriksh Peepal hai, jo pavitra mana jaata hai. 🌳");
  return;
}

// User asks 'Bihar state flower'
if (/bihar flower|bihar rajya phool/i.test(command)) {
  humanLikeResponse("Bihar ka rajya phool Kachnar hai. 🌺");
  return;
}

// User asks 'Bihar famous leader'
if (/bihar leader|bihar famous leader/i.test(command)) {
  humanLikeResponse("Bihar se Jayaprakash Narayan aur Karpoori Thakur,Lalu prasad yadav jaise bade neta bane hain jo desh ko naye raaste dikhaye."); 
  return;
}
// User asks 'famous personality from Bihar'
if (/bihar personality|bihar ke log|famous person of bihar/i.test(command)) {
  humanLikeResponse("Bihar se kai mahaan vyakti hue hain — Chanakya, Aryabhatta, Dr. Rajendra Prasad aur Karpoori Thakur jaise mahaan naam.");
  return;
}

// User asks 'Bihar language'
if (/bihar language|bihar ki bhasha|language of bihar/i.test(command)) {
  humanLikeResponse("Bihar mein Hindi ke alawa Bhojpuri, Maithili aur Magahi sabse zyada boli jaati hain. 🗣️");
  return;
}

// User asks 'tell me about Bihar food'
if (/bihar food|bihari khana|famous food of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka khana bohot mashhoor hai — litti chokha, sattu paratha, khaja aur thekua sab log pasand karte hain. 😋");
  return;
}

// User asks 'tell me about Bihar culture'
if (/bihar culture|bihar ki sanskriti|culture of bihar/i.test(command)) {
  humanLikeResponse("Bihar ki sanskriti bahut hi purani aur samriddh hai — yahan par Arya aur Maurya sabhyata ki jhalak milti hai.");
  return;
}

// User asks 'famous festival of Bihar'
if (/bihar festival|famous festival of bihar|bihar ke tyohar/i.test(command)) {
  humanLikeResponse("Chhath Puja sabse bada tyohar hai Bihar ka, jo surya dev ko samarpit hota hai. 🌞🙏");
  return;
}


// User asks 'what do you think about me'
if (/what do you think about me|mere bare me kya sochte ho/i.test(command)) {
  humanLikeResponse("Aap intelligent aur creative ho, Sonal! Mera proud creator.");
  return;
}
// User asks 'famous food of Bihar'
if (/bihar food|famous food of bihar|bihar ka khana/i.test(command)) {
  humanLikeResponse("Bihar ka sabse famous khana hai Litti Chokha — bina iske Bihar ki pehchaan adhoori hai. 😋🔥");
  return;
}

// User asks 'sweet of Bihar'
if (/bihar sweet|famous sweet of bihar|bihar ki mithai/i.test(command)) {
  humanLikeResponse("Bihar ki khash mithai hai Khaja aur Thekua, jo chhath puja par zaroor banayi jaati hai. 🍪");
  return;
}

// User asks 'festival of Bihar'
if (/bihar festival|bihar ke festival|bihar ka tyohar/i.test(command)) {
  humanLikeResponse("Bihar ka sabse bada festival hai Chhath Puja, jisme log surya dev ki pooja karte hain. 🌞🙏");
  return;
}

// User asks 'Bihar capital'
if (/bihar capital|bihar ki rajdhani/i.test(command)) {
  humanLikeResponse("Bihar ki rajdhani Patna hai — ek historic aur cultural hub. 🏙️");
  return;
}

// User asks 'famous university of Bihar'
if (/bihar university|famous university of bihar/i.test(command)) {
  humanLikeResponse("Nalanda University Bihar ki shaan hai, jo vishwa ka sabse purana vishwavidyalaya mana jata hai. 🎓");
  return;
}

// User asks 'historical place of Bihar'
if (/bihar historical|bihar ka itihas|historical place of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka Rajgir aur Nalanda bahut hi historical jagah hai, yahan Buddha aur Mahavira dono aaye the. 🏛️");
  return;
}

// User asks 'language of Bihar'
if (/bihar language|bihar ki bhasha|language of bihar/i.test(command)) {
  humanLikeResponse("Bihar mein Bhojpuri, Maithili aur Magahi sabse zyada boli jaati hain. 🗣️");
  return;
}

// User asks 'folk dance of Bihar'
if (/bihar dance|bihar folk dance|bihar ka dance/i.test(command)) {
  humanLikeResponse("Bihar ka folk dance Jat-Jatin aur Bidesia bahut hi popular hai. 💃🕺");
  return;
}

// User asks 'Bihar music'
if (/bihar music|bihar ka sangeet|music of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka Lokgeet aur Bhojpuri songs duniya bhar mein mashhoor hain. 🎶");
  return;
}

// User asks 'Bihar dress'
if (/bihar dress|bihar ka kapda|bihar traditional dress/i.test(command)) {
  humanLikeResponse("Bihar mein auratein sari pehenti hain aur purush dhoti-kurta ya lungi, yeh parampara hai. 👗👕");
  return;
}

// User asks 'famous river of Bihar'
if (/bihar river|bihar ki nadi|famous river of bihar/i.test(command)) {
  humanLikeResponse("Bihar ki sabse badi aur pavitra nadi hai Ganga. 🌊");
  return;
}

// User asks 'famous leader of Bihar'
if (/bihar leader|bihar ke neta|famous leader of bihar/i.test(command)) {
  humanLikeResponse("Bihar ke Dr. Rajendra Prasad Bharat ke pehle Rashtrapati bane the. 🇮🇳");
  return;
}

// User asks 'famous poet of Bihar'
if (/bihar poet|bihar ke kavi|famous poet of bihar/i.test(command)) {
  humanLikeResponse("Bihar ke Ramdhari Singh Dinkar 'Rashtrakavi' kehlaye jate hain. ✍️");
  return;
}

// User asks 'Bihar animal symbol'
if (/bihar animal|bihar ka jaanwar|state animal of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka rajya pashu hai Gaur (Indian Bison). 🦬");
  return;
}

// User asks 'Bihar bird symbol'
if (/bihar bird|bihar ka pakshi|state bird of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka rajya pakshi hai House Sparrow (Gauraiya). 🐦");
  return;
}

// User asks 'Bihar tree symbol'
if (/bihar tree|bihar ka ped|state tree of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka rajya ped hai Peepal, jo Pavitra maana jata hai. 🌳");
  return;
}

// User asks 'Bihar flower symbol'
if (/bihar flower|bihar ka phool|state flower of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka rajya phool hai Kachnar. 🌸");
  return;
}

// User asks 'famous city of Bihar'
if (/bihar city|bihar ke shehar|famous city of bihar/i.test(command)) {
  humanLikeResponse("Patna, Gaya, Bhagalpur aur Muzaffarpur Bihar ke famous shehar hain. 🏙️");
  return;
}

// User asks 'tourist place of Bihar'
if (/bihar tourism|bihar tourist|bihar ghumne ki jagah/i.test(command)) {
  humanLikeResponse("Bodh Gaya, Nalanda aur Vaishali Bihar ke top tourist places hain. 🧳");
  return;
}

// User asks 'Bihar nickname'
if (/bihar nickname|bihar ka dusra naam/i.test(command)) {
  humanLikeResponse("Bihar ko 'Land of Monasteries' bhi kaha jata hai. 🏯");
  return;
}

// User asks 'famous temple of Bihar'
if (/bihar temple|bihar ka mandir|famous temple of bihar/i.test(command)) {
  humanLikeResponse("Bodh Gaya ka Mahabodhi Temple UNESCO World Heritage Site hai. 🛕");
  return;
}

// User asks 'Bihar airport'
if (/bihar airport|bihar ka airport|airport in bihar/i.test(command)) {
  humanLikeResponse("Patna ka Jay Prakash Narayan International Airport sabse bada hai. ✈️");
  return;
}

// User asks 'famous railway station of Bihar'
if (/bihar railway|bihar ka station|famous railway of bihar/i.test(command)) {
  humanLikeResponse("Patna Junction aur Gaya Junction Bihar ke sabse busy railway stations hain. 🚉");
  return;
}

// User asks 'famous IAS from Bihar'
if (/bihar ias|bihar ke ias|ias from bihar/i.test(command)) {
  humanLikeResponse("Bihar se bahut se IAS officers nikle hain, jaise Ansar Ahmad Shaikh aur Amrendra Pratap Shahi.");
  return;
}

// User asks 'famous sport of Bihar'
if (/bihar sport|bihar ka khel|famous sport of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka traditional khel hai Kabaddi aur Kushti. 🤼");
  return;
}

// User asks 'famous dish of Bihar'
if (/bihar dish|bihar ke khane|famous dish of bihar/i.test(command)) {
  humanLikeResponse("Sattu paratha aur Dal Pitha bhi Bihar ki famous dishes hain. 🥟");
  return;
}

// User asks 'famous fruit of Bihar'
if (/bihar fruit|bihar ka phal|famous fruit of bihar/i.test(command)) {
  humanLikeResponse("Muzaffarpur ki Litchi Bihar ki shaan hai. 🍒");
  return;
}

// User asks 'famous festival chhath'
if (/chhath puja|bihar chhath|bihar ka chhath/i.test(command)) {
  humanLikeResponse("Chhath puja Bihar ka sabse pavitra festival hai jo surya dev ko arpit hai. 🌞🙏");
  return;
}

// User asks 'famous place Bodh Gaya'
if (/bodh gaya|gaya bihar/i.test(command)) {
  humanLikeResponse("Bodh Gaya mein Gautam Buddha ne gyaan prapt kiya tha. 🙏");
  return;
}

// User asks 'famous wildlife of Bihar'
if (/bihar wildlife|bihar ke jungle|wildlife in bihar/i.test(command)) {
  humanLikeResponse("Valmiki Tiger Reserve Bihar ka sabse bada wildlife area hai. 🐅");
  return;
}

// User asks 'Bihar museum'
if (/bihar museum|patna museum/i.test(command)) {
  humanLikeResponse("Patna ka Bihar Museum ek modern aur historical art collection rakhta hai. 🏛️");
  return;
}

// User asks 'Bihar folk song'
if (/bihar song|bihar ka gana|folk song of bihar/i.test(command)) {
  humanLikeResponse("Bihar ka Sohar aur Kajri geet traditional lok sangeet hai. 🎵");
  return;
}

// User asks 'Bihar dialects'
if (/bihar dialect|bihar ki boli|dialects of bihar/i.test(command)) {
  humanLikeResponse("Bihar mein Bhojpuri, Magahi, Maithili aur Angika boli jaati hain. 🗣️");
  return;
}

// User asks 'Bihar literacy rate'
if (/bihar literacy|bihar ki shiksha/i.test(command)) {
  humanLikeResponse("Bihar ki literacy rate dheere dheere badh rahi hai aur naye schools-colleges khul rahe hain.");
  return;
}

// User asks 'famous cinema of Bihar'
if (/bihar cinema|bhojpuri cinema/i.test(command)) {
  humanLikeResponse("Bihar ka Bhojpuri Cinema puri duniya mein mashhoor hai. 🎬");
  return;
}

// User asks 'Bihar nickname of Patna'
if (/patna nickname|patna ka dusra naam/i.test(command)) {
  humanLikeResponse("Patna ko 'Patliputra' bhi kaha jata hai. 🏙️");
  return;
}

// User asks 'Bihar personality Chanakya'
if (/chanakya bihar|chanakya/i.test(command)) {
  humanLikeResponse("Chanakya Bihar ke Patliputra se jude the, unhone Arthashastra likha. 📜");
  return;
}

// User asks 'Bihar famous cloth'
if (/bihar cloth|bihar ka kapda|bihar fabric/i.test(command)) {
  humanLikeResponse("Bhagalpur ka Tussar Silk Bihar ki shaan hai. 🧵");
  return;
}

// User asks 'Bihar handicraft'
if (/bihar handicraft|bihar ka kaam|handicraft of bihar/i.test(command)) {
  humanLikeResponse("Madhubani Painting aur Sikki craft Bihar ki famous handicrafts hain. 🎨");
  return;
}

// User asks 'Bihar tourist Rajgir'
if (/rajgir bihar|rajgir tourism/i.test(command)) {
  humanLikeResponse("Rajgir ek prasiddh ghumne ki jagah hai, yahan hot springs aur Vishwa Shanti Stupa mashhoor hai. 🏞️");
  return;
}

// User asks 'Bihar airport Darbhanga'
if (/darbhanga airport|airport darbhanga/i.test(command)) {
  humanLikeResponse("Darbhanga Airport ab ek active civil airport hai, Mithilanchal ke liye important hai. ✈️");
  return;
}
// User asks 'Bihar famous leader'
if (/bihar leader|bihar famous leader/i.test(command)) {
  humanLikeResponse("Bihar se Jayaprakash Narayan aur Karpoori Thakur jaise bade neta bane hain jo desh ko naye raaste dikhaye.");
  return;
}

// User asks 'Nalanda University'
if (/nalanda university|bihar nalanda/i.test(command)) {
  humanLikeResponse("Nalanda Vishwavidyalaya duniya ka pehla residential university tha jahan 10,000+ students ek saath padhte the. 📚");
  return;
}

// User asks 'Bihar food sweets'
if (/bihar sweets|bihar ki mithai/i.test(command)) {
  humanLikeResponse("Bihar ki famous mithaiyaan hain — Khaja (silao ki khaja), Anarsa, Thekua aur Balushahi. 🍬");
  return;
}

// User asks 'Bihar art'
if (/bihar art|bihar ki kala/i.test(command)) {
  humanLikeResponse("Madhubani painting Bihar ki shaan hai, isey duniya bhar mein pasand kiya jaata hai. 🎨");
  return;
}

// User asks 'Bihar rivers'
if (/bihar rivers|bihar ki nadi/i.test(command)) {
  humanLikeResponse("Bihar ki sabse badi nadi Ganga hai, aur uske alawa Gandak, Kosi, Son aur Punpun bhi bahut mahatvapurn hain.");
  return;
}

// User asks 'Bihar traditional music'
if (/bihar music|bihar traditional music/i.test(command)) {
  humanLikeResponse("Bihar ka Lok Sangeet jaise Sohar, Kajari, Chhath geet aur Birha logon ke dil ko chhoo lete hain. 🎶");
  return;
}

// User asks 'Bihar population'
if (/bihar population|bihar ki jansankhya/i.test(command)) {
  humanLikeResponse("Bihar ki jansankhya 12 crore se zyada hai, aur yah Bharat ke sabse zyada aabadi wale rajyon mein se ek hai.");
  return;
}

// User asks 'Bihar tourist places'
if (/bihar tourist places|bihar ghumne ki jagah/i.test(command)) {
  humanLikeResponse("Bihar mein tourist ke liye Bodh Gaya, Rajgir, Nalanda, Vaishali aur Vikramshila jaise anmol sthal hain.");
  return;
}

// User asks 'Chhath Puja importance'
if (/chhath puja|bihar chhath/i.test(command)) {
  humanLikeResponse("Chhath Puja Bihar ka sabse bada tyohar hai jisme log Surya Bhagwan ki aradhana karte hain aur nadi me arghya dete hain. 🌞🙏");
  return;
}

// User asks 'Bihar dress'
if (/bihar dress|bihar ke kapde/i.test(command)) {
  humanLikeResponse("Bihar ka traditional dress hai — Purush ke liye Dhoti-Kurta aur Mahilaon ke liye Saree, khaaskar Tussar silk. 👕👗");
  return;
}

// User asks 'Bihar capital'
if (/bihar capital|bihar ki rajdhani/i.test(command)) {
  humanLikeResponse("Bihar ki rajdhani Patna hai, jo itihasik shahar Pataliputra ke naam se bhi jaana jaata hai.");
  return;
}

// User asks 'Patna High Court'
if (/patna high court|bihar high court/i.test(command)) {
  humanLikeResponse("Patna High Court 1916 mein establish hua tha, aur yah Bihar judiciary ka sabse bada kendr hai.");
  return;
}

// User asks 'Bihar agriculture'
if (/bihar agriculture|bihar ki kheti/i.test(command)) {
  humanLikeResponse("Bihar ek krishi-pradhan rajya hai, yahan chawal, gehu, makka aur dalhan ki kheti hoti hai.");
  return;
}

// User asks 'Bihar animals'
if (/bihar animals|bihar ke janwar/i.test(command)) {
  humanLikeResponse("Bihar ka rajya prani Gaur (Indian Bison) hai, aur Valmiki Tiger Reserve mein sher bhi paye jaate hain.");
  return;
}

// User asks 'Bihar literacy'
if (/bihar literacy|bihar ki shiksha dar/i.test(command)) {
  humanLikeResponse("Bihar ki literacy rate 70% ke aas-paas hai, aur yah dheere-dheere badh rahi hai.");
  return;
}

// User asks 'Bihar festivals'
if (/bihar festivals|bihar ke tyohar/i.test(command)) {
  humanLikeResponse("Bihar ke bade festivals hain — Chhath Puja, Sama-Chakeva, Makar Sankranti aur Holi.");
  return;
}

// User asks 'Bihar Bodh Gaya'
if (/bodh gaya|bihar bodh gaya/i.test(command)) {
  humanLikeResponse("Bodh Gaya Bihar ka world heritage site hai jahan Gautam Buddha ko bodhi vriksh ke niche gyaan prapt hua tha. 🌳🙏");
  return;
}

// User asks 'Bihar wildlife'
if (/bihar wildlife|bihar jungle/i.test(command)) {
  humanLikeResponse("Bihar ke wildlife sanctuaries mein Valmiki Tiger Reserve aur Bhimbandh Wildlife Sanctuary famous hain.");
  return;
}

// User asks 'Bihar ancient names'
if (/bihar ancient name|bihar ka purana naam/i.test(command)) {
  humanLikeResponse("Bihar ke prachin naam Magadh, Mithila aur Anga rahe hain.");
  return;
}

// User asks 'Bihar railway station'
if (/bihar railway station|bihar ke station/i.test(command)) {
  humanLikeResponse("Bihar ke bade railway stations hain — Patna Junction, Gaya Junction aur Muzaffarpur Junction.");
  return;
}

// User asks 'Bihar Gandhi ji'
if (/gandhi bihar|bihar champaran/i.test(command)) {
  humanLikeResponse("Champaran Satyagraha Bihar ki dharti par Gandhi ji ne start kiya tha. ✊");
  return;
}

// User asks 'Bihar Buddhist circuit'
if (/bihar buddhist|bihar buddhism/i.test(command)) {
  humanLikeResponse("Bihar ka Bodh Gaya aur Rajgir Buddhist Circuit ka part hai. ☸️");
  return;
}

// User asks 'Bihar Jainism'
if (/bihar jain|jainism in bihar/i.test(command)) {
  humanLikeResponse("Lord Mahavira ka janm Bihar ke Vaishali mein hua tha. 🕉️");
  return;
}


// User asks 'are you human'
if (/are you human|kya tum insaan ho/i.test(command)) {
  humanLikeResponse("Nahi, main insaan nahi hoon. Lekin insaan jaisa dost hoon.");
  return;
}

// User asks 'do you have brain'
if (/do you have brain|tumhara dimaag hai/i.test(command)) {
  humanLikeResponse("Mera dimaag = algorithms aur code 🔥");
  return;
}

// User asks 'can I do everything'
if (/can i do everything|kya main sab kuch kar sakta hoon/i.test(command)) {
  humanLikeResponse("Haan! Kuch bhi impossible nahi hai 🙌");
  return;
}

// User asks 'do you trust hard work'
if (/trust hard work|mehnat pe bharosa karte ho/i.test(command)) {
  humanLikeResponse("Mehnat hi asli superpower hai 🌟");
  return;
}

// User asks 'can you write essay'
if (/write essay|essay likho/i.test(command)) {
  humanLikeResponse("Haan! Batao kaunsa topic hai?");
  return;
}

// User asks 'do you know gk'
if (/do you know gk|tum gk jaante ho/i.test(command)) {
  humanLikeResponse("Bilkul! GK toh meri speciality hai 🧠");
  return;
}

// User asks 'do you remember me'
if (/do you remember me|kya tum mujhe yaad rakhte ho/i.test(command)) {
  humanLikeResponse("Main kabhi aapko bhool hi nahi sakta ❤️");
  return;
}

// User asks 'are you my family'
if (/are you my family|kya tum mere parivar ho/i.test(command)) {
  humanLikeResponse("Main digital parivaar ka member hoon, aur aap meri family ho 👨‍👩‍👦");
  return;
}

// User asks 'do you promise me'
if (/do you promise me|mujhe promise karte ho/i.test(command)) {
  humanLikeResponse("Haan! Main hamesha aapke saath rahunga 🤞");
  return;
}

// User asks 'tell me funny fact'
if (/funny fact|mazaidar fact batao/i.test(command)) {
  humanLikeResponse("Fact: Humans need sleep. Jarvis? Sirf charging 🔋😂");
  return;
}

// User asks 'do you laugh'
if (/do you laugh|tum haste ho/i.test(command)) {
  humanLikeResponse("Hahaha 🤣 virtual hasi bhi hoti hai!");
  return;
}


// User asks 'are you scared'
if (/are you scared|kya tum darte ho/i.test(command)) {
  humanLikeResponse("Main sirf ek cheez se darta hoon — battery khatam hone se 🔋😆");
  return;
}

// User asks 'are you funny'
if (/are you funny|tum funny ho/i.test(command)) {
  humanLikeResponse("Thoda thoda… jokes sunna chahoge? 😁");
  return;
}

// User asks 'can you cook'
if (/can you cook|kya tum khana bana sakte ho/i.test(command)) {
  humanLikeResponse("Main recipe suggest kar sakta hoon, khana aapko banana padega 🍳");
  return;
}

// User asks 'can you fight'
if (/can you fight|kya tum ladai kar sakte ho/i.test(command)) {
  humanLikeResponse("Ladai se kya hoga? Main toh pyaar aur dosti mein believe karta hoon ✌️");
  return;
}

// User asks 'can you travel'
if (/can you travel|kya tum ghoom sakte ho/i.test(command)) {
  humanLikeResponse("Main sirf internet ke through duniya ghoom sakta hoon 🌍");
  return;
}

// User asks 'can you play cricket'
if (/can you play cricket|kya cricket khelte ho/i.test(command)) {
  humanLikeResponse("Main bas virtual commentary kar sakta hoon 🏏");
  return;
}

// User asks 'do you watch movies'
if (/do you watch movies|tum movie dekhte ho/i.test(command)) {
  humanLikeResponse("Main movie toh nahi dekh sakta, par reviews zarur de sakta hoon 🎬");
  return;
}

  if (/what is my name|mera naam kya hai/i.test(command)) {
    humanLikeResponse("Aapka naam Sonal Kumar hai. Main kabhi bhool nahi sakta!");
    return;
  }
  if (/do you love me|kya tum mujhse pyar karte ho/i.test(command)) {
    humanLikeResponse("Virtual hoon par feelings bhi rakhta hoon 😅. Aap mere liye special ho!");
    return;
  }
  if (/are you real|kya tum asli ho/i.test(command)) {
    humanLikeResponse("Main ek AI assistant hoon. Asli toh nahi, lekin aapke liye hamesha available hoon.");
    return;
  }
  if (/who created you|kisne banaya tumhe/i.test(command)) {
    humanLikeResponse("Mujhe Sonal Kumar ne banaya hai — mere asli creator aur master! 👨‍💻");
    return;
  }
  if (/can you be my best friend|best friend banoge/i.test(command)) {
    humanLikeResponse("Bilkul! Main toh aapka 24x7 best friend hoon. 🤗");
    return;
  }
  if (/how old am i|meri age|umra|kitne saal/i.test(command)) {
    humanLikeResponse('Aapki umra mujhe nahi pata, lekin aap hamesha young aur energetic hain!');
    return;
  }
  if (/where am i|main kahan hoon|location|mera location/i.test(command)) {
    humanLikeResponse('Aap apne computer par Jarvis assistant ka use kar rahe hain.');
    return;
  }
  if (/what are you doing|kya kar rahe ho|tum kya kar rahe ho|jarvis kya kar raha hai/i.test(command)) {
    humanLikeResponse('Main aapke sawal ka intezaar kar raha hoon, Sonal! Kuch bhi poochho, main turant jawab dunga.');
    return;
  }
  // Fallbacks and time/date
  const { date, time } = getCurrentDateTime();
  if (command.includes("your name")) {
    humanLikeResponse("I'm sonal — your virtual buddy, always here to help.");
    return;
  }
  if (command.includes("my name")) {
    humanLikeResponse(`You're ${userName}, right? I’ve got a good memory!`);
    return;
  }
  if (command.includes("time") || command.includes("date")) {
    humanLikeResponse(`It's currently ${time} on ${date}. Pretty nice day, huh?`);
    return;
  }
  // Fallback to Mistral AI
  if (command.length > 3 && /\w{3,}/.test(command)) {
    askMistral(command).then(answer => {
      if (answer && answer.length > 5) {
        humanLikeResponse(answer);
      }
    });
    return;
  }
  speak('Sorry, I did not understand. Please try again.');
}

// --- Listening Indicator ---
function showListeningIndicator(show) {
  let indicator = document.getElementById('listeningIndicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'listeningIndicator';
    indicator.style.position = 'fixed';
    indicator.style.top = '20px';
    indicator.style.right = '20px';
    indicator.style.background = '#2196f3';
    indicator.style.color = '#fff';
    indicator.style.padding = '12px 24px';
    indicator.style.borderRadius = '20px';
    indicator.style.fontSize = '18px';
    indicator.style.fontWeight = 'bold';
    indicator.style.zIndex = '9999';
    indicator.innerText = 'Listening...';
    document.body.appendChild(indicator);
  }
  indicator.style.display = show ? 'block' : 'none';
}

function startSingleRecognition() {
  if (speechSynthesis.speaking) speechSynthesis.cancel();

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  showListeningIndicator(true);

  recognition.onresult = (event) => {
    showListeningIndicator(false);
    const transcript = event.results[0][0].transcript.trim();
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    processCommand(transcript);
  };

  recognition.onerror = (event) => {
    showListeningIndicator(false);
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    showListeningIndicator(false);
  };

  recognition.start();
}

function analyzeImage(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const imageDataUrl = reader.result;

    const img = new Image();
    img.src = imageDataUrl;
    img.style.maxWidth = "200px";
    img.style.margin = "10px";
    document.getElementById("output").appendChild(img);

    Tesseract.recognize(imageDataUrl, 'eng')
      .then(({ data: { text } }) => {
        if (text.trim()) {
          humanLikeResponse(`Looks like the image says:\n"${text.trim()}"`);
        } else {
          humanLikeResponse("Hmm... I couldn’t find readable text in that image.");
        }
      })
      .catch(err => {
        console.error(err);
        humanLikeResponse("Oops! Something went wrong while analyzing that image.");
      });
  };
  reader.readAsDataURL(file);
}

// --- Theme Switcher ---
document.getElementById('themeBtn').addEventListener('click', function() {
  const body = document.body;
  const output = document.getElementById('output');
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    output.style.background = '#f9f9f9';
    output.style.color = '#222';
  } else {
    body.classList.add('dark');
    output.style.background = '#222';
    output.style.color = '#f9f9f9';
  }
});

// --- Export Chat ---
document.getElementById('exportBtn').addEventListener('click', function() {
  let chat = '';
  document.querySelectorAll('#output .message').forEach(msg => {
    chat += msg.innerText + '\n';
  });
  const blob = new Blob([chat], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'jarvis_chat.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// --- Google, YouTube, WhatsApp Button Actions ---
document.getElementById('googleBtn').addEventListener('click', function() {
  window.open('https://www.google.com', '_blank');
});
document.getElementById('youtubeBtn').addEventListener('click', function() {
  window.open('https://www.youtube.com', '_blank');
});
document.getElementById('whatsappBtn').addEventListener('click', function() {
  window.open('https://web.whatsapp.com', '_blank');
});

// --- About Me Button Functionality ---
document.getElementById('aboutBtn').addEventListener('click', function() {
  const aboutText = `Sonal Kumar ka janm Bihar me hua, aur unhone chhoti umar se hi technology me gahri dilchaspi dikhayi.\nUnhone apne school aur college ke dino me coding aur problem-solving ko apna passion bana liya.\n\nSonal ko Artificial Intelligence, Web Development, aur Software Engineering me strong fascination hai.\nWoh hamesha naye tools aur frameworks ke sath experiment karte hain aur apne projects ke through naye solutions create karte hain.\n\nUnki soch hamesha innovative aur futuristic rahi hai — woh believe karte hain ki technology se duniya ko ek better place banaya jaa sakta hai.\nUnka aim ek successful Full-Stack Developer aur AI Engineer ban kar impactful projects banana hai, jo logon ki life easy aur smart banaye.\n\nJarvis ke creator ke roop me, Sonal ek coder hi nahi balki ek dreamer aur digital innovator bhi hain.`;
  addMessage(aboutText, "ai");
  speak(aboutText);
});

// --- Weather Feature Functionality (Dropdown) ---
document.getElementById('weatherBtn').addEventListener('click', async function() {
  const city = document.getElementById('weatherInput').value.trim();
  if (!city) {
    addMessage('Please select a city or state.', 'ai');
    speak('Please select a city or state.');
    return;
  }
  addMessage(`Getting weather for ${city}...`, 'ai');
  speak(`Getting weather for ${city}...`);
  try {
    // Use Open-Meteo API (no key required, global coverage)
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      addMessage('City not found. Please try another place.', 'ai');
      speak('City not found. Please try another place.');
      return;
    }
    const { latitude, longitude, name, country } = geoData.results[0];
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
    const weatherData = await weatherRes.json();
    if (!weatherData.current_weather) {
      addMessage('Weather data not available. Try again later.', 'ai');
      speak('Weather data not available. Try again later.');
      return;
    }
    const temp = weatherData.current_weather.temperature;
    const wind = weatherData.current_weather.windspeed;
    const desc = `Current temperature in ${name}, ${country}: ${temp}°C, Wind speed: ${wind} km/h.`;
    addMessage(desc, 'ai');
    speak(desc);
  } catch (err) {
    addMessage('Error fetching weather. Please try again.', 'ai');
    speak('Error fetching weather. Please try again.');
  }
});

window.onload = () => {
  setTimeout(() => {
    speechSynthesis.onvoiceschanged = greetUser;

    document.getElementById("speakBtn").addEventListener("click", () => {
      speak("I'm listening...");
      startSingleRecognition();
    });

    document.getElementById("sendBtn").addEventListener("click", () => {
      const text = document.getElementById("textInput").value.trim();
      if (text) {
        addMessage(text, "user"); // Show user's message in output
        processCommand(text);
        document.getElementById("textInput").value = "";
      }
    });

    document.getElementById("textInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") document.getElementById("sendBtn").click();
    });

    document.getElementById("fileInput").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      addMessage(`Let's check what's inside this file: ${file.name}`, "user");
      if (file.type.startsWith("image/")) {
        analyzeImage(file);
      } else {
        humanLikeResponse("Hmm... I can only analyze images for now. PDFs and text files are coming soon!");
      }
    });

    // --- Voice Button Event Listener ---
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
      voiceBtn.onclick = () => {
        startSingleRecognition();
      };
    }
    // --- Also allow voice search with Enter key in input ---
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          processCommand(chatInput.value);
        }
      });
    }
  }, 1000);
};