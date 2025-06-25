"use client";

import { useState } from "react";

const EnhancedOnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Sample themes and questions for each step
  const stepData = [
    {
      step: 1,
      theme: "Personal Background",
      questions: [
        {
          id: "q1",
          question: "Country/region of origin.",
          type: "searchable-dropdown",
          options: ["Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Brazil", "Canada", "Chile", "China", "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany", "Ghana", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Japan", "Jordan", "Kenya", "South Korea", "Lebanon", "Malaysia", "Mexico", "Morocco", "Netherlands", "Nigeria", "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Russia", "Saudi Arabia", "South Africa", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Kingdom", "United States", "Venezuela", "Vietnam"]
        },
        {
          id: "q2", 
          question: "Rate your business‑English proficiency (CEFR).",
          type: "select",
          options: ["A1 (Beginner)", "A2 (Elementary)", "B1 (Intermediate)", "B2 (Upper-Intermediate)", "C1 (Advanced)", "C2 (Proficient)"]
        },
        {
          id: "q3",
          question: "Which part of the Canadian professional landscape still feels unclear?",
          type: "multi-select",
          options: ["Workplace culture and etiquette", "Networking and relationship building", "Career progression pathways", "Industry-specific regulations", "Professional certifications and licensing", "Salary negotiation", "Job search strategies", "Interview processes", "Professional communication styles", "Work-life balance expectations", "Leadership and management styles", "Diversity and inclusion practices"]
        }
      ]
    },
    {
      step: 2,
      theme: "Personality and Work Style",
      questions: [
        {
          id: "q4",
          question: "I see myself as someone who is extraverted, enthusiastic.",
          type: "likert",
          scale: 5,
          labels: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        },
        {
          id: "q5",
          question: "I see myself as someone who is dependable, self‑disciplined.",
          type: "likert",
          scale: 5,
          labels: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        },
        {
          id: "q6",
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
          id: "q7",
          question: "Briefly describe your next job target or promotion goal.",
          type: "short-text",
          maxLength: 200,
          placeholder: "Describe your immediate career objective (max 200 characters)..."
        },
        {
          id: "q8",
          question: "Pick your top three professional values (rank by importance).",
          type: "dropdown-ranking",
          options: ["Work-life balance", "Career advancement", "Financial security", "Creative freedom", "Social impact", "Team collaboration", "Leadership opportunities", "Continuous learning", "Job stability", "Innovation", "Recognition", "Autonomy"]
        },
        {
          id: "q9",
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
          id: "q10",
          question: "Identify up to three barriers you face.",
          type: "dropdown-input",
          maxSelections: 3,
          options: ["Language barriers", "Cultural differences", "Lack of Canadian experience", "Professional network gaps", "Credential recognition", "Technical skills gap", "Soft skills development", "Time management", "Confidence building", "Other (please specify)"]
        },
        {
          id: "q11",
          question: "What is your biggest career challenge today?",
          type: "multi-select",
          options: ["Finding relevant job opportunities", "Building professional networks", "Developing leadership skills", "Improving communication", "Advancing in current role", "Changing career paths", "Balancing work and personal life", "Managing workplace stress", "Learning new technologies", "Understanding organizational politics"]
        },
        {
          id: "q12",
          question: "Select the top 3 competencies you want to develop.",
          type: "multi-select",
          maxSelections: 3,
          options: ["Leadership and management", "Communication and presentation", "Strategic thinking", "Problem-solving", "Team collaboration", "Project management", "Technical skills", "Emotional intelligence", "Negotiation", "Decision-making", "Innovation and creativity", "Data analysis", "Customer relationship management", "Financial literacy"]
        }
      ]
    },
    {
      step: 5,
      theme: "Communication Preferences",
      questions: [
        {
          id: "q13",
          question: "Preferred communication channel for mentoring sessions.",
          type: "likert-options",
          options: [
            { label: "In-person meetings", scale: 5 },
            { label: "Video calls", scale: 5 },
            { label: "Phone calls", scale: 5 },
            { label: "Text/Chat messaging", scale: 5 },
            { label: "Email exchanges", scale: 5 }
          ]
        },
        {
          id: "q14",
          question: "Which feedback style helps you most?",
          type: "radio",
          options: ["Direct (straightforward, specific feedback)", "Coaching (guided questions to help you discover solutions)", "Socratic (thought-provoking questions to develop critical thinking)", "Appreciative (focusing on strengths and positive reinforcement)"]
        },
        {
          id: "q15",
          question: "Select up to three weekly time windows you can meet.",
          type: "time-selector",
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

  const [formData, setFormData] = useState({});

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // Create structured JSON output with all answers
    const onboardingData = {
      completedAt: new Date().toISOString(),
      totalSteps: totalSteps,
      responses: {
        personalBackground: {
          countryOfOrigin: formData.q1 || null,
          englishProficiency: formData.q2 || null,
          unclearAspects: formData.q3 || []
        },
        personalityAndWorkStyle: {
          extravertedEnthusiastic: formData.q4 || null,
          dependableSelfDisciplined: formData.q5 || null,
          openToNewExperiences: formData.q6 || null
        },
        careerGoalsAndValues: {
          nextJobTarget: formData.q7 || null,
          professionalValuesRanking: formData.q8 || [],
          remainsRelaxed: formData.q9 || null
        },
        challengesAndDevelopment: {
          barriersYouFace: formData.q10 || [],
          biggestCareerChallenge: formData.q11 || [],
          competenciesToDevelop: formData.q12 || []
        },
        communicationPreferences: {
          preferredChannels: {
            inPersonMeetings: formData.q13_0 || null,
            videoCalls: formData.q13_1 || null,
            phoneCalls: formData.q13_2 || null,
            textChatMessaging: formData.q13_3 || null,
            emailExchanges: formData.q13_4 || null
          },
          feedbackStyle: formData.q14 || null,
          availableTimeSlots: formData.q15 || []
        }
      },
      rawFormData: formData,
      completionStats: {
        answeredQuestions: Object.keys(formData).length,
        totalQuestions: 15,
        completionPercentage: Math.round((Object.keys(formData).length / 15) * 100)
      }
    };

    // Output structured JSON to console
    console.log("=== ONBOARDING DATA ===");
    console.log(JSON.stringify(onboardingData, null, 2));
    
    // Also log individual sections for easier reading
    console.log("\n=== PERSONAL BACKGROUND ===");
    console.log(onboardingData.responses.personalBackground);
    
    console.log("\n=== PERSONALITY & WORK STYLE ===");
    console.log(onboardingData.responses.personalityAndWorkStyle);
    
    console.log("\n=== CAREER GOALS & VALUES ===");
    console.log(onboardingData.responses.careerGoalsAndValues);
    
    console.log("\n=== CHALLENGES & DEVELOPMENT ===");
    console.log(onboardingData.responses.challengesAndDevelopment);
    
    console.log("\n=== COMMUNICATION PREFERENCES ===");
    console.log(onboardingData.responses.communicationPreferences);
    
    console.log("\n=== COMPLETION STATS ===");
    console.log(onboardingData.completionStats);

    // Show success message
    alert(`Onboarding completed successfully! Welcome to Prospéra!\n\nAnswered ${onboardingData.completionStats.answeredQuestions}/15 questions (${onboardingData.completionStats.completionPercentage}% complete)\n\nCheck the console for detailed JSON output.`);
  };

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const currentStepData = stepData.find(step => step.step === currentStep);

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Left Sidebar - Step Navigation */}
      <div className="w-80 bg-gray-300 p-8 shadow-lg">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Prospéra</h2>
          <p className="text-gray-600 text-sm">Complete your profile to get matched with the perfect mentor</p>
        </div>

        {/* Step Navigation Buttons */}
        <div className="space-y-4">
          {stepData.map((step) => (
            <div
              key={step.step}
              className={`p-4 rounded-lg transition-all duration-500 ease-in-out transform ${
                currentStep === step.step
                  ? "bg-black text-white shadow-xl scale-105 border-l-4 border-emerald-500"
                  : currentStep > step.step
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  : "bg-gray-100 text-gray-500"
              }`}
              onClick={() => {
                if (step.step <= currentStep) {
                  setCurrentStep(step.step);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-lg">Step {step.step}</span>
                  <p className={`text-sm mt-1 ${
                    currentStep === step.step ? "text-gray-200" : "text-gray-500"
                  }`}>
                    {step.theme}
                  </p>
                </div>
                {currentStep > step.step && (
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="mt-12">
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span className="font-medium">Overall Progress</span>
            <span className="font-semibold">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-400 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {currentStep} of {totalSteps} steps completed
          </p>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Theme {currentStep}
              </h1>
              <div className="w-20 h-1 bg-black mt-2"></div>
            </div>
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Questions Content */}
        <div className="p-8 space-y-8">
          {currentStepData?.questions.map((question, index) => (
            <div key={question.id}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Question {index + 1} about {currentStepData.theme}
              </h2>
              <div className="bg-gray-100 rounded-lg p-6 min-h-[120px] flex items-center mb-4">
                <p className="text-gray-700 text-lg">
                  {question.question}
                </p>
              </div>
              
              {/* Input rendering based on question type */}
              <div className="space-y-4">
                {/* Standard Dropdown */}
                {question.type === "select" && (
                  <select
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-all duration-200 text-gray-700"
                    value={formData[question.id] || ""}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                  >
                    <option value="">Select an option...</option>
                    {question.options.map((option, optIndex) => (
                      <option key={optIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {/* Searchable Dropdown */}
                {question.type === "searchable-dropdown" && (
                  <div className="relative">
                    <input
                      type="text"
                      list={`${question.id}-options`}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-all duration-200 text-gray-700"
                      placeholder="Type to search or select from dropdown..."
                      value={formData[question.id] || ""}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                    />
                    <datalist id={`${question.id}-options`}>
                      {question.options.map((option, optIndex) => (
                        <option key={optIndex} value={option} />
                      ))}
                    </datalist>
                  </div>
                )}

                {/* Multi-select */}
                {question.type === "multi-select" && (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          checked={(formData[question.id] || []).includes(option)}
                          onChange={(e) => {
                            const currentValues = formData[question.id] || [];
                            let newValues;
                            if (e.target.checked) {
                              newValues = [...currentValues, option];
                            } else {
                              newValues = currentValues.filter(v => v !== option);
                            }
                            if (question.maxSelections && newValues.length > question.maxSelections) {
                              newValues = newValues.slice(-question.maxSelections);
                            }
                            handleInputChange(question.id, newValues);
                          }}
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                    {question.maxSelections && (
                      <p className="text-sm text-gray-500 mt-2">
                        Select up to {question.maxSelections} options. Selected: {(formData[question.id] || []).length}
                      </p>
                    )}
                  </div>
                )}

                {/* Likert Scale */}
                {question.type === "likert" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      {question.labels.map((label, labelIndex) => (
                        <label key={labelIndex} className="flex flex-col items-center space-y-2 cursor-pointer">
                          <input
                            type="radio"
                            name={question.id}
                            value={labelIndex + 1}
                            className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                            checked={formData[question.id] == labelIndex + 1}
                            onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
                          />
                          <span className="text-sm text-gray-600 text-center">{label}</span>
                          <span className="text-xs text-gray-400">{labelIndex + 1}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Short Text Input */}
                {question.type === "short-text" && (
                  <div>
                    <input
                      type="text"
                      maxLength={question.maxLength}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-all duration-200 text-gray-700"
                      placeholder={question.placeholder}
                      value={formData[question.id] || ""}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {(formData[question.id] || "").length}/{question.maxLength} characters
                    </p>
                  </div>
                )}

                {/* Dropdown Ranking */}
                {question.type === "dropdown-ranking" && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((rank) => (
                      <div key={rank} className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold">
                          {rank}
                        </span>
                        <select
                          className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-all duration-200 text-gray-700"
                          value={(formData[question.id] || [])[rank - 1] || ""}
                          onChange={(e) => {
                            const currentRanking = formData[question.id] || [];
                            const newRanking = [...currentRanking];
                            newRanking[rank - 1] = e.target.value;
                            handleInputChange(question.id, newRanking);
                          }}
                        >
                          <option value="">Select your #{rank} choice...</option>
                          {question.options.map((option, optIndex) => (
                            <option key={optIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropdown with Input */}
                {question.type === "dropdown-input" && (
                  <div className="space-y-3">
                    <select
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-all duration-200 text-gray-700"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const currentValues = formData[question.id] || [];
                          if (!currentValues.includes(e.target.value)) {
                            const newValues = [...currentValues, e.target.value];
                            if (question.maxSelections && newValues.length > question.maxSelections) {
                              newValues.splice(0, newValues.length - question.maxSelections);
                            }
                            handleInputChange(question.id, newValues);
                          }
                        }
                      }}
                    >
                      <option value="">Add a barrier...</option>
                      {question.options.map((option, optIndex) => (
                        <option key={optIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="space-y-2">
                      {(formData[question.id] || []).map((selected, selectedIndex) => (
                        <div key={selectedIndex} className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg">
                          <span className="text-gray-700">{selected}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentValues = formData[question.id] || [];
                              const newValues = currentValues.filter((_, index) => index !== selectedIndex);
                              handleInputChange(question.id, newValues);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    {question.maxSelections && (
                      <p className="text-sm text-gray-500">
                        Selected: {(formData[question.id] || []).length}/{question.maxSelections}
                      </p>
                    )}
                  </div>
                )}

                {/* Likert Options */}
                {question.type === "likert-options" && (
                  <div className="space-y-4">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="space-y-2">
                        <label className="block text-gray-700 font-medium">{option.label}</label>
                        <div className="flex justify-between items-center">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} className="flex flex-col items-center space-y-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`${question.id}_${optIndex}`}
                                value={value}
                                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                checked={formData[`${question.id}_${optIndex}`] == value}
                                onChange={(e) => handleInputChange(`${question.id}_${optIndex}`, parseInt(e.target.value))}
                              />
                              <span className="text-xs text-gray-400">{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Radio Buttons */}
                {question.type === "radio" && (
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                          checked={formData[question.id] === option}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Time Selector */}
                {question.type === "time-selector" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((timeSlot, optIndex) => (
                      <label key={optIndex} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer border border-gray-200">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          checked={(formData[question.id] || []).includes(timeSlot)}
                          onChange={(e) => {
                            const currentValues = formData[question.id] || [];
                            let newValues;
                            if (e.target.checked) {
                              newValues = [...currentValues, timeSlot];
                            } else {
                              newValues = currentValues.filter(v => v !== timeSlot);
                            }
                            if (question.maxSelections && newValues.length > question.maxSelections) {
                              newValues = newValues.slice(-question.maxSelections);
                            }
                            handleInputChange(question.id, newValues);
                          }}
                        />
                        <span className="text-gray-700 text-sm">{timeSlot}</span>
                      </label>
                    ))}
                    {question.maxSelections && (
                      <p className="text-sm text-gray-500 col-span-full mt-2">
                        Select up to {question.maxSelections} time slots. Selected: {(formData[question.id] || []).length}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-gray-200 p-8">
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-200"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              Prev
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-12 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingPage;
