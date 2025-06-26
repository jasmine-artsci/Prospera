const stepDataMentor = [
    {
      step: 1,
      theme: "Personal Background",
      questions: [
        {
          id: "q1",
          question: "What's your country/region of origin?",
          type: "select",
          options: ["Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Brazil", "Canada", "Chile", "China", "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany", "Ghana", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Japan", "Jordan", "Kenya", "South Korea", "Lebanon", "Malaysia", "Mexico", "Morocco", "Netherlands", "Nigeria", "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Russia", "Saudi Arabia", "South Africa", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Kingdom", "United States", "Venezuela", "Vietnam"]
        },
        {
          id: "q2", 
          question: "How'd you rate your business‑English proficiency (CEFR)?",
          type: "select",
          options: ["A1 (Beginner)", "A2 (Elementary)", "B1 (Intermediate)", "B2 (Upper-Intermediate)", "C1 (Advanced)", "C2 (Proficient)"]
        },
        {
          id: "q3",
          question: "Which part of the Canadian professional landscape do you feel MOST confident guiding newcomers through?",
          type: "multi-select",
          options: ["Workplace culture and etiquette", "Licensing & credential recognition", "Job search, networking & interviews", "Salary, benefits & career progression"]
        },
        {
          id: "q4",
          question: "What industry are you in?",
          type: "select",
          options: [
                    "Technology",
                    "Finance",
                    "Healthcare",
                    "Education",
                    "Retail",
                    "Manufacturing",
                    "Hospitality",
                    "Government",
                    "Construction",
                    "Transportation",
                    "Other"
                  ]
        },
        {
          id: "q5",
          question: "What department did you work in most recently?",
          type: "select",
          options: [
                    "Engineering / Development",
                    "Marketing",
                    "Sales",
                    "Customer Support",
                    "Finance / Accounting",
                    "Human Resources",
                    "Operations",
                    "Product Management",
                    "Legal",
                    "IT / Technical Support",
                    "Other"
                  ]
        }
      ]
    },
    {
      step: 2,
      theme: "Personality and Work Style",
      questions: [
        {
          id: "q6",
          question: "I see myself as someone who is extraverted, enthusiastic.",
          type: "likert",
          scale: 5,
          labels: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        },
        {
          id: "q7",
          question: "I see myself as someone who is dependable, self‑disciplined.",
          type: "likert",
          scale: 5,
          labels: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        },
        {
          id: "q8",
          question: "I see myself as someone who is open to new experiences, complex.",
          type: "likert",
          scale: 5,
          labels: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        }
      ]
    },
    {
      step: 3,
      theme: "Career Goals and Values",
      questions: [
        {
          id: "q9",
          question: "Briefly describe the career domain or promotion milestone you feel best equipped to mentor others in.",
          type: "short-text",
          maxLength: 200,
          placeholder: "Describe your immediate career objective (max 200 characters)..."
        },
        {
          id: "q10",
          question: "Pick your top three professional values (rank by importance).",
          type: "dropdown-ranking",
          options: ["Job Search & Career Transition", "Leadership & Advancement", "Skills Growth & Network Building", "Work‑Life Balance & Well‑Being"]
        },
        {
          id: "q11",
          question: "I remain relaxed in most situations.",
          type: "likert",
          scale: 5,
          labels: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        }
      ]
    },
    {
      step: 4,
      theme: "Challenges and Development Areas",
      questions: [
        {
          id: "q12",
          question: "Identify up to three areas you can best support .",
          type: "dropdown-input",
          maxSelections: 3,
          options: [
            "Communication & Culture", "Canadian Experience & Networking", "Credentials & Skill Alignment", "Personal Effectiveness"
          ]
        },
        {
          id: "q13",
          question: "What is the challenge you can best help with ?",
          type: "multi-select",
          options: ["Job Search & Career Transition", "Leadership & Advancement", "Skills Growth & Network Building", "Work‑Life Balance & Well‑Being"]
        },
        {
          id: "q14",
          question: "Select the top 3 competencies you want coach in.",
          type: "multi-select",
          maxSelections: 3,
          options: [
            "Strategic Leadership & Management", "Technical & Analytical Expertise", "Communication & Relationship Building", "Innovation & Creative Problem‑Solving"
          ]        
        }
      ]
    },
    {
      step: 5,
      theme: "Communication Preferences",
      questions: [
        {
          id: "q15",
          question: "What's your preferred communication channel for mentoring sessions?",
          type: "multi-bool-options",
          options: [
            { label: "In-person meetings", key: "inPersonMeetings" },
            { label: "Video calls", key: "videoCalls" },
            { label: "Phone calls", key: "phoneCalls" },
            { label: "Text/Chat messaging", key: "textChatMessaging" },
            { label: "Email exchanges", key: "emailExchanges" }
          ]
        },
        {
          id: "q16",
          question: "Which feedback style do you use most ?",
          type: "radio",
          options: ["Direct (straightforward, specific feedback)", "Coaching (guided questions to help you discover solutions)", "Socratic (thought-provoking questions to develop critical thinking)", "Appreciative (focusing on strengths and positive reinforcement)"]
        },
        {
          id: "q17",
          question: "Select up to three weekly time windows you can meet.",
          type: "multi-select-dropdown",
          maxSelections: 3,
          options: [
            "Monday Morning (9am-12pm)",
            "Monday Afternoon (1pm-5pm)",
            "Monday Evening (6pm-9pm)",
            "Tuesday Morning (9am-12pm)",
            "Tuesday Afternoon (1pm-5pm)",
            "Tuesday Evening (6pm-9pm)",
            "Wednesday Morning (9am-12pm)",
            "Wednesday Afternoon (1pm-5pm)",
            "Wednesday Evening (6pm-9pm)",
            "Thursday Morning (9am-12pm)",
            "Thursday Afternoon (1pm-5pm)",
            "Thursday Evening (6pm-9pm)",
            "Friday Morning (9am-12pm)",
            "Friday Afternoon (1pm-5pm)",
            "Friday Evening (6pm-9pm)",
            "Saturday Morning (9am-12pm)",
            "Saturday Afternoon (1pm-5pm)",
            "Sunday Morning (9am-12pm)",
            "Sunday Afternoon (1pm-5pm)"
          ]
        }
      ]
    }
  ];

export default stepDataMentor;