const sports = [
  {
    question: "How many players are there in a cricket team on the field?",
    options: ["9", "10", "11", "12"],
    answer: "11"
  },
  {
    question: "Which country won the ICC Cricket World Cup 2023?",
    options: ["India", "England", "Australia", "New Zealand"],
    answer: "Australia"
  },
  {
    question: "How many rings are there in the Olympic symbol?",
    options: ["4", "5", "6", "7"],
    answer: "5"
  },
  {
    question: "Which sport is associated with Wimbledon?",
    options: ["Cricket", "Football", "Tennis", "Golf"],
    answer: "Tennis"
  },
  {
    question: "Who is known as the 'God of Cricket'?",
    options: ["Virat Kohli", "MS Dhoni", "Sachin Tendulkar", "Rohit Sharma"],
    answer: "Sachin Tendulkar"
  },
  {
    question: "How many players are there in a football team on the field?",
    options: ["9", "10", "11", "12"],
    answer: "11"
  },
  {
    question: "Which country won the FIFA World Cup 2022?",
    options: ["France", "Brazil", "Argentina", "Germany"],
    answer: "Argentina"
  },
  {
    question: "In which sport is the term 'checkmate' used?",
    options: ["Tennis", "Chess", "Cricket", "Hockey"],
    answer: "Chess"
  },
  {
    question: "Which Indian athlete won a gold medal in javelin at the Tokyo Olympics?",
    options: ["Bajrang Punia", "Neeraj Chopra", "PV Sindhu", "Mirabai Chanu"],
    answer: "Neeraj Chopra"
  },
  {
    question: "How many points is a touchdown worth in American football?",
    options: ["3", "6", "7", "8"],
    answer: "6"
  },
  {
    question: "Which country hosts the Tour de France cycling race?",
    options: ["Italy", "Spain", "France", "Germany"],
    answer: "France"
  },
  {
    question: "Who has won the most Grand Slam singles titles in men's tennis?",
    options: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Andy Murray"],
    answer: "Novak Djokovic"
  },
  {
    question: "Which sport uses a shuttlecock?",
    options: ["Tennis", "Squash", "Badminton", "Table Tennis"],
    answer: "Badminton"
  },
  {
    question: "What is the national sport of Canada?",
    options: ["Football", "Ice Hockey", "Baseball", "Basketball"],
    answer: "Ice Hockey"
  },
  {
    question: "Which Indian cricketer is known as 'Captain Cool'?",
    options: ["Virat Kohli", "Rohit Sharma", "MS Dhoni", "Kapil Dev"],
    answer: "MS Dhoni"
  },
  {
    question: "How many holes are played in a standard round of golf?",
    options: ["9", "12", "18", "24"],
    answer: "18"
  },
  {
    question: "Which country invented table tennis?",
    options: ["China", "Japan", "England", "Germany"],
    answer: "England"
  },
  {
    question: "What is the highest governing body of world football?",
    options: ["UEFA", "AFC", "FIFA", "IOC"],
    answer: "FIFA"
  },
  {
    question: "Which Indian badminton player won an Olympic silver medal in 2016?",
    options: ["Saina Nehwal", "PV Sindhu", "Jwala Gutta", "Ashwini Ponnappa"],
    answer: "PV Sindhu"
  },
  {
    question: "In cricket, how many runs are awarded for hitting the ball over the boundary without bouncing?",
    options: ["4", "5", "6", "7"],
    answer: "6"
  },
  {
    question: "Which country has won the most FIFA World Cups?",
    options: ["Germany", "Italy", "Brazil", "Argentina"],
    answer: "Brazil"
  },
  {
    question: "Who is known as the 'Flying Sikh'?",
    options: ["Milkha Singh", "Neeraj Chopra", "PT Usha", "Abhinav Bindra"],
    answer: "Milkha Singh"
  },
  {
    question: "Which sport features the terms birdie and eagle?",
    options: ["Tennis", "Golf", "Baseball", "Cricket"],
    answer: "Golf"
  },
  {
    question: "How many players are there in a basketball team on the court?",
    options: ["5", "6", "7", "8"],
    answer: "5"
  },
  {
    question: "Which Indian city is home to the IPL team Chennai Super Kings?",
    options: ["Mumbai", "Chennai", "Bengaluru", "Hyderabad"],
    answer: "Chennai"
  },
  {
    question: "Who won the Ballon d'Or 2023?",
    options: ["Cristiano Ronaldo", "Kylian Mbappe", "Erling Haaland", "Lionel Messi"],
    answer: "Lionel Messi"
  },
  {
    question: "Which sport is played at the Ryder Cup?",
    options: ["Tennis", "Golf", "Cricket", "Rugby"],
    answer: "Golf"
  },
  {
    question: "Which country hosted the 2024 Summer Olympics?",
    options: ["Japan", "France", "USA", "Australia"],
    answer: "France"
  },
  {
    question: "What is the nickname of the Indian men's hockey team?",
    options: ["Blue Tigers", "Men in Blue", "Indian Lions", "Stick Masters"],
    answer: "Men in Blue"
  },
  {
    question: "In tennis, what is the score called when both players have 40 points?",
    options: ["Advantage", "Love", "Deuce", "Tie"],
    answer: "Deuce"
  },
  {
    question: "Who was the first Indian to win an individual Olympic gold medal?",
    options: ["Neeraj Chopra", "Abhinav Bindra", "Leander Paes", "Rajyavardhan Singh Rathore"],
    answer: "Abhinav Bindra"
  },
  {
    question: "Which sport is associated with the Stanley Cup?",
    options: ["Basketball", "Baseball", "Ice Hockey", "Football"],
    answer: "Ice Hockey"
  },
  {
    question: "How many players are there in a kabaddi team on the court?",
    options: ["5", "6", "7", "8"],
    answer: "7"
  },
  {
    question: "Which Indian cricketer is known as the 'Hitman'?",
    options: ["Virat Kohli", "Rohit Sharma", "Shikhar Dhawan", "KL Rahul"],
    answer: "Rohit Sharma"
  },
  {
    question: "Which country won the ICC Men's T20 World Cup 2024?",
    options: ["India", "Australia", "England", "South Africa"],
    answer: "India"
  },
  {
    question: "What is the maximum break possible in snooker?",
    options: ["147", "155", "167", "180"],
    answer: "147"
  },
  {
    question: "Which sport uses the term 'home run'?",
    options: ["Baseball", "Cricket", "Rugby", "Hockey"],
    answer: "Baseball"
  },
  {
    question: "Who is known as the 'King of Clay' in tennis?",
    options: ["Roger Federer", "Novak Djokovic", "Rafael Nadal", "Andy Murray"],
    answer: "Rafael Nadal"
  },
  {
    question: "Which Indian woman boxer won an Olympic bronze medal in 2012?",
    options: ["Nikhat Zareen", "Mary Kom", "Lovlina Borgohain", "Sarita Devi"],
    answer: "Mary Kom"
  },
  {
    question: "How long is a marathon race?",
    options: ["40.195 km", "41.195 km", "42.195 km", "43.195 km"],
    answer: "42.195 km"
  },
  {
    question: "Which country is famous for the martial art Taekwondo?",
    options: ["China", "Japan", "South Korea", "Thailand"],
    answer: "South Korea"
  },
  {
    question: "Which IPL team has won the most titles?",
    options: ["Chennai Super Kings", "Mumbai Indians", "Kolkata Knight Riders", "Sunrisers Hyderabad"],
    answer: "Mumbai Indians"
  },
  {
    question: "In which sport would you perform a slam dunk?",
    options: ["Volleyball", "Basketball", "Handball", "Baseball"],
    answer: "Basketball"
  },
  {
    question: "Who holds the record for the most international goals in men's football?",
    options: ["Lionel Messi", "Cristiano Ronaldo", "Pele", "Ali Daei"],
    answer: "Cristiano Ronaldo"
  },
  {
    question: "Which country won the Hockey World Cup 2023?",
    options: ["India", "Germany", "Belgium", "Australia"],
    answer: "Germany"
  },
  {
    question: "What is the shape of a baseball field commonly called?",
    options: ["Square", "Diamond", "Circle", "Rectangle"],
    answer: "Diamond"
  },
  {
    question: "Which Indian chess player became the youngest World Chess Champion in 2024?",
    options: ["Viswanathan Anand", "R Praggnanandhaa", "D Gukesh", "Arjun Erigaisi"],
    answer: "D Gukesh"
  },
  {
    question: "How many sets must a player usually win to win a men's Grand Slam tennis match?",
    options: ["2", "3", "4", "5"],
    answer: "3"
  },
  {
    question: "Which sport is associated with the term 'hat-trick' most famously?",
    options: ["Football", "Cricket", "Hockey", "All of the above"],
    answer: "All of the above"
  },
  {
    question: "Who is widely regarded as the greatest Olympic swimmer of all time?",
    options: ["Ian Thorpe", "Mark Spitz", "Michael Phelps", "Caeleb Dressel"],
    answer: "Michael Phelps"
  }
];
export default sports;