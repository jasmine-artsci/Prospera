"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import stepDataMentee from './stepDataMentee';
import stepDataMentor from "./stepDataMentor";
import { useRouter } from "next/navigation";
import DatePicker from "./DatePicker";

const EnhancedOnboardingPage = ({ role, name, id }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (newDates) => {
    setSelectedDates(newDates);
    console.log("Received in parent:", newDates);
  };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const router = useRouter();
  // Sample themes and questions for each step

  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

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
          origin: formData.q1 || null,
          [role === "mentor" ? "english_level" : "english_cefr"]: formData.q2 || null,
          [role === "mentor" ? "canadian_landscape_help" : "unclear_canadian_landscape"]: formData.q3 || [],
          industry: formData.q4 || [],
          department: formData.q5 || [],
        },
        personalityAndWorkStyle: {
          extraversion: formData.q6 || null,
          conscientiousness: formData.q7 || null,
          openness: formData.q8 || null
        },
        careerGoalsAndValues: {
          [role === "mentor" ? "goal_support" : "goal_target"]: formData.q9 || null,
          values: formData.q10 || [],
          emotional_stability: formData.q11 || null
        },
        challengesAndDevelopment: {
          [role === "mentor" ? "support_areas" : "barriers_faced"]: formData.q12 || [],
          [role === "mentor" ? "challenges_help" : "current_challenges"]: formData.q13 || [],
          [role === "mentor" ? "coaching_skills" : "skills_to_develop"]: formData.q14 || []
        },
        communicationPreferences: {
          preferred_channel: {
            inPersonMeetings: formData.q15_0 || false,
            videoCalls: formData.q15_1 || false,
            phoneCalls: formData.q15_2 || false,
            textChatMessaging: formData.q15_3 || false,
            emailExchanges: formData.q15_4 || false
          },
          feedback_style: formData.q16 || null,
          availability: formData.q17 || []
        }
      },
      rawFormData: formData,
      completionStats: {
        answeredQuestions: Object.keys(formData).length,
        totalQuestions: 15,
        completionPercentage: Math.round((Object.keys(formData).length / 15) * 100)
      }
    };
    console.log("formData.q15_0::::::::::::::::::::::::::::::::::", formData.q15_0);
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

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      
      const payload = {
        ...onboardingData.responses.personalBackground,
        ...onboardingData.responses.personalityAndWorkStyle,
        ...onboardingData.responses.careerGoalsAndValues,
        ...onboardingData.responses.challengesAndDevelopment,
        ...onboardingData.responses.communicationPreferences,
      };
      console.log(payload);

      if(role === "mentee"){
        console.log("I AM IN MENTEES");
        console.log("USER ID::::", user.id);
        const {data, error} = await supabase
          .from('mentees')
          .upsert({ id: user.id, name: name, ...payload }, {onConflict: "id"});
        setError(error);
      }
      else if(role === "mentor"){
        console.log("I AM IN MENTORS");
        console.log("USER ID::::", user.id);
        const {data, error} = await supabase
          .from('mentors')
          .upsert({ id: user.id, name: name, ...payload }, {onConflict: "id"});
        setError(error);
      }
      if (error) console.error('❌ Upsert failed:', error);
    }

    fetchData();

    router.push("/");
    // Show success message
    // alert(`Onboarding completed successfully! Welcome to Prospéra!\n\nAnswered ${onboardingData.completionStats.answeredQuestions}/15 questions (${onboardingData.completionStats.completionPercentage}% complete)\n\nCheck the console for detailed JSON output.`);
  };

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };  

  const currentStepData = role === "mentee" ? stepDataMentee.find(step => step.step === currentStep) : stepDataMentor.find(step => step.step === currentStep);

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Left Sidebar - Step Navigation */}
      <div className="w-80 bg-gray-300 p-8 shadow-lg sticky top-0 h-screen overflow-y-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Hello <span className="text-emerald-600">{name}</span>!</h2>
          <p className="text-gray-600 text-md">Complete your profile to get matched with the perfect mentor</p>
        </div>

        {/* Step Navigation Buttons */}
        <div className="space-y-4">
          {stepDataMentee.map((step) => (
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
                {currentStepData.theme} - {role}
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
                Question {index + 1}
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
                    <div className="flex justify-start items-center">
                      {question.labels.map((label, labelIndex) => (
                        <label key={labelIndex} className="flex flex-col mx-15 items-center space-y-2 cursor-pointer">
                          <input
                            type="radio"
                            name={question.id}
                            value={labelIndex + 1}
                            className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                            checked={formData[question.id] == labelIndex + 1}
                            onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
                            required
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
                      required
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
                        <div className="flex justify-start items-center">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} className="flex flex-col mx-15 items-center space-y-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`${question.id}_${optIndex}`}
                                value={value}
                                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                checked={formData[`${question.id}_${optIndex}`] == value}
                                onChange={(e) => handleInputChange(`${question.id}_${optIndex}`, parseInt(e.target.value))}
                                required
                              />
                              <span className="text-xs text-gray-400">{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Multi Bool options */}
                {question.type === "multi-bool-options" && (
                  <div className="space-y-4">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex}>
                      <div className="font-medium text-gray-700">{option.label}</div>
                      <div className="flex gap-5 px-3 mt-2">
                        <div>
                          <label className="text-gray-700 space-x-2">
                            <input
                              type="radio"
                              name={`q15_${optIndex}`} // shared name per option
                              checked={formData[`q15_${optIndex}`] === true}
                              onChange={() => handleInputChange(`q15_${optIndex}`, true)}
                            />
                            <span>
                              Yes
                            </span>
                          </label>
                        </div>
                        <div>
                          <label className="text-gray-700 space-x-2">
                            <input
                              type="radio"
                              name={`q15_${optIndex}`}
                              checked={formData[`q15_${optIndex}`] === false}
                              onChange={() => handleInputChange(`q15_${optIndex}`, false)}
                            />
                            <span>
                              No
                            </span>
                          </label>
                        </div>
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
                          required
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Time Selector */}
                {question.type === "time-selector" && (
                  // <DatePicker onChange={handleDateChange} />
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
                            console.log("QUESTIONS>ID:::", question.id);
                            handleInputChange(question.id, newValues);
                          }}
                          required
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

                {question.type === "multi-select-dropdown" && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <select
                        value={formData.tempDay || ""}
                        onChange={(e) => handleInputChange("tempDay", e.target.value)}
                        className="border p-2 rounded text-gray-700"
                      >
                        <option value="">Select Day</option>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>

                      <select
                        value={formData.tempTime || ""}
                        onChange={(e) => handleInputChange("tempTime", e.target.value)}
                        className="border p-2 rounded text-gray-700"
                      >
                        <option value="">Select Time</option>
                        {[
                          "8-10AM", "9-11AM", "10AM-12PM",
                          "1-3PM", "2-4PM", "3-5PM",
                          "5-7PM", "6-8PM", "7-9PM"
                        ].map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>

                      <button
                        className="bg-emerald-500 text-white px-3 py-1 enabled:hover:bg-emerald-600 rounded disabled:opacity-50 transition"
                        disabled={
                          !formData.tempDay || !formData.tempTime ||
                          (formData[question.id] || []).length >= question.maxSelections
                        }
                        onClick={() => {
                          const value = `${formData.tempDay} ${formData.tempTime}`;
                          const currentValues = formData[question.id] || [];

                          if (!currentValues.includes(value)) {
                            const updated = [...currentValues, value].slice(0, question.maxSelections);
                            handleInputChange(question.id, updated);
                          }

                          // Optionally reset dropdowns:
                          handleInputChange("tempDay", "");
                          handleInputChange("tempTime", "");
                        }}
                      >
                        Add
                      </button>
                    </div>

                    {/* Display selected values */}
                    <ul className="space-y-3 mt-2">
                      {(formData[question.id] || []).map((slot, i) => (
                        <li key={slot} className="flex w-100 space-x-2 justify-between bg-gray-100 text-gray-700 px-3 py-1 rounded">
                          <div>
                            <span className="text-lg">{slot}</span>
                          </div>
                          <div>
                            <button
                              className="text-red-600 cursor-pointer"
                              onClick={() => {
                                const updated = (formData[question.id] || []).filter((v) => v !== slot);
                                handleInputChange(question.id, updated);
                              }}
                            >
                              remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm text-gray-500">
                      Select up to {question.maxSelections} time slots. Selected: {(formData[question.id] || []).length}
                    </p>
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
                className="px-12 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-green-700 transition duration-300 shadow-md hover:shadow-lg"
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