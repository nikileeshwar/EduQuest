const currentAffairs = [
  {
    question: "Which Indian movie won the Oscar for Best Original Song with 'Naatu Naatu'?",
    options: ["RRR", "Pushpa", "KGF", "Salaar"],
    answer: "RRR"
  },
  {
    question: "Which country hosted the ICC Champions Trophy 2025?",
    options: ["India", "Pakistan", "Australia", "England"],
    answer: "Pakistan"
  },
  {
    question: "Who is the current President of India in 2026?",
    options: ["Narendra Modi", "Droupadi Murmu", "Jagdeep Dhankhar", "Amit Shah"],
    answer: "Droupadi Murmu"
  },
  {
    question: "What is India's lunar mission that successfully landed near the Moon's south pole?",
    options: ["Chandrayaan-1", "Chandrayaan-2", "Chandrayaan-3", "Aditya-L1"],
    answer: "Chandrayaan-3"
  },
  {
    question: "Which mission studies the Sun from space?",
    options: ["Gaganyaan", "Aditya-L1", "Mangalyaan", "Astrosat"],
    answer: "Aditya-L1"
  },
  {
    question: "Which city hosted the World Yogasana Championship 2026?",
    options: ["Chennai", "Ahmedabad", "Delhi", "Hyderabad"],
    answer: "Ahmedabad"
  },
  {
    question: "Which country launched the Shenzhou-23 spacecraft mission?",
    options: ["Japan", "India", "China", "Russia"],
    answer: "China"
  },
  {
    question: "World Ocean Day is observed on:",
    options: ["June 5", "June 8", "June 10", "June 12"],
    answer: "June 8"
  },
  {
    question: "Which country co-hosted the FIFA World Cup 2026 along with the USA and Mexico?",
    options: ["Brazil", "Canada", "Argentina", "Spain"],
    answer: "Canada"
  },
  {
    question: "Which Indian state launched the country's first Yoga Policy?",
    options: ["Kerala", "Tamil Nadu", "Uttarakhand", "Gujarat"],
    answer: "Uttarakhand"
  },
  {
    question: "Who is the Prime Minister of India in 2026?",
    options: ["Rahul Gandhi", "Narendra Modi", "Amit Shah", "Yogi Adityanath"],
    answer: "Narendra Modi"
  },
  {
    question: "Which organization conducts the NEET examination?",
    options: ["CBSE", "UGC", "NTA", "AICTE"],
    answer: "NTA"
  },
  {
    question: "What is the name of India's planned human spaceflight mission?",
    options: ["Mangalyaan", "Gaganyaan", "Aditya", "Vyom"],
    answer: "Gaganyaan"
  },
  {
    question: "Which summit focuses on Brazil, Russia, India, China, and South Africa?",
    options: ["G7", "ASEAN", "BRICS", "NATO"],
    answer: "BRICS"
  },
  {
    question: "Which country hosted the AI Action Summit in 2025?",
    options: ["India", "USA", "France", "Germany"],
    answer: "France"
  },
  {
    question: "Which ministry launched the SOAR programme for AI readiness?",
    options: ["Ministry of Education", "MSDE", "ISRO", "DST"],
    answer: "MSDE"
  },
  {
    question: "Which Indian city is known as India's Silicon Valley?",
    options: ["Hyderabad", "Pune", "Bengaluru", "Chennai"],
    answer: "Bengaluru"
  },
  {
    question: "What is the currency of Japan?",
    options: ["Won", "Yuan", "Yen", "Dollar"],
    answer: "Yen"
  },
  {
    question: "Which country is known for the spacecraft mission Shenzhou?",
    options: ["Russia", "China", "USA", "Japan"],
    answer: "China"
  },
  {
    question: "Which day is celebrated as World Environment Day?",
    options: ["June 5", "June 6", "June 7", "June 8"],
    answer: "June 5"
  },
  {
    question: "Which renewable energy source uses sunlight?",
    options: ["Wind", "Solar", "Hydro", "Biomass"],
    answer: "Solar"
  },
  {
    question: "Which organization is responsible for India's space missions?",
    options: ["DRDO", "ISRO", "BARC", "HAL"],
    answer: "ISRO"
  },
  {
    question: "Which Indian state is famous for the Chaliyar River?",
    options: ["Karnataka", "Kerala", "Tamil Nadu", "Telangana"],
    answer: "Kerala"
  },
  {
    question: "Which country has the largest population in the world?",
    options: ["USA", "India", "China", "Russia"],
    answer: "India"
  },
  {
    question: "Who is the current Chief Justice of India in 2026?",
    options: ["B. R. Gavai", "D. Y. Chandrachud", "Sanjiv Khanna", "N. V. Ramana"],
    answer: "B. R. Gavai"
  },
  {
    question: "Which international organization is headquartered in New York?",
    options: ["WHO", "UN", "IMF", "UNESCO"],
    answer: "UN"
  },
  {
    question: "Which country hosted the G20 Summit in 2023?",
    options: ["India", "Brazil", "USA", "Japan"],
    answer: "India"
  },
  {
    question: "Which city is India's financial capital?",
    options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
    answer: "Mumbai"
  },
  {
    question: "What does AI stand for?",
    options: ["Automatic Intelligence", "Artificial Intelligence", "Advanced Internet", "Applied Innovation"],
    answer: "Artificial Intelligence"
  },
  {
    question: "Which Indian mission studies solar activity?",
    options: ["Chandrayaan", "Aditya-L1", "Mangalyaan", "Gaganyaan"],
    answer: "Aditya-L1"
  },
  {
    question: "Which country is famous for Mount Fuji?",
    options: ["China", "Japan", "Nepal", "South Korea"],
    answer: "Japan"
  },
  {
    question: "Which sport is played at Wimbledon?",
    options: ["Cricket", "Football", "Tennis", "Hockey"],
    answer: "Tennis"
  },
  {
    question: "Which company developed ChatGPT?",
    options: ["Google", "Meta", "OpenAI", "Microsoft"],
    answer: "OpenAI"
  },
  {
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    answer: "Canberra"
  },
  {
    question: "Which country is associated with the city of Kyiv?",
    options: ["Russia", "Ukraine", "Poland", "Belarus"],
    answer: "Ukraine"
  },
  {
    question: "Which gas is most responsible for global warming?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
    answer: "Carbon Dioxide"
  },
  {
    question: "Which Indian city hosted the G20 Leaders' Summit 2023?",
    options: ["Mumbai", "Delhi", "Bengaluru", "Hyderabad"],
    answer: "Delhi"
  },
  {
    question: "Which social media platform is owned by Meta?",
    options: ["YouTube", "Instagram", "Snapchat", "Telegram"],
    answer: "Instagram"
  },
  {
    question: "Which country is known for the Eiffel Tower?",
    options: ["Italy", "Germany", "France", "Spain"],
    answer: "France"
  },
  {
    question: "What is the headquarters of ISRO?",
    options: ["Delhi", "Mumbai", "Bengaluru", "Chennai"],
    answer: "Bengaluru"
  },
  {
    question: "Which Indian state is called the Land of Five Rivers?",
    options: ["Haryana", "Punjab", "Gujarat", "Rajasthan"],
    answer: "Punjab"
  },
  {
    question: "Which country launched the first artificial satellite, Sputnik?",
    options: ["USA", "Russia", "China", "France"],
    answer: "Russia"
  },
  {
    question: "Which international event focuses on climate change discussions?",
    options: ["BRICS", "COP", "G20", "ASEAN"],
    answer: "COP"
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Japan", "Thailand", "Vietnam"],
    answer: "Japan"
  },
  {
    question: "Which Indian city is known as the Pink City?",
    options: ["Jaipur", "Jodhpur", "Udaipur", "Bikaner"],
    answer: "Jaipur"
  },
  {
    question: "Which continent is the Sahara Desert located in?",
    options: ["Asia", "Africa", "Australia", "Europe"],
    answer: "Africa"
  },
  {
    question: "Which organization releases the World Happiness Report?",
    options: ["UN", "WHO", "UNICEF", "WTO"],
    answer: "UN"
  },
  {
    question: "Which country is famous for the Great Wall?",
    options: ["Japan", "China", "Korea", "Mongolia"],
    answer: "China"
  },
  {
    question: "Which Indian state has Ahmedabad as its largest city?",
    options: ["Maharashtra", "Rajasthan", "Gujarat", "Punjab"],
    answer: "Gujarat"
  },
  {
    question: "Which ocean is the largest on Earth?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    answer: "Pacific"
  }
];
export default currentAffairs;