"use client";

import { useState } from "react";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Sample questions for each step
  const stepData = [
    {
      step: 1,
      theme: "Personal Information",
      questions: [
        {
          id: "q1",
          question: "What is your current academic level?",
          type: "select",
          options: ["High School", "Undergraduate", "Graduate", "PhD", "Post-Doc"]
        },
        {
          id: "q2", 
          question: "What field of study are you pursuing?",
          type: "text",
          placeholder: "e.g., Computer Science, Business, Engineering..."
        }
      ]
    },
    {
      step: 2,
      theme: "Background & Experience",
      questions: [
        {
          id: "q3",
          question: "How long have you been in Canada?",
          type: "select",
          options: ["Less than 6 months", "6 months - 1 year", "1-2 years", "2-3 years", "More than 3 years"]
        },
        {
          id: "q4",
          question: "What challenges are you currently facing?",
          type: "textarea",
          placeholder: "Describe any academic, social, or professional challenges..."
        }
      ]
    },
    {
      step: 3,
      theme: "Goals & Aspirations",
      questions: [
        {
          id: "q5",
          question: "What are your primary career goals?",
          type: "textarea",
          placeholder: "Describe your career aspirations and objectives..."
        },
        {
          id: "q6",
          question: "What type of mentorship are you seeking?",
          type: "select",
          options: ["Academic Support", "Career Guidance", "Cultural Integration", "Networking", "All of the above"]
        }
      ]
    },
    {
      step: 4,
      theme: "Preferences",
      questions: [
        {
          id: "q7",
          question: "Preferred communication style?",
          type: "select",
          options: ["In-person meetings", "Video calls", "Text/Email", "Phone calls", "No preference"]
        },
        {
          id: "q8",
          question: "How often would you like to connect with your mentor?",
          type: "select",
          options: ["Weekly", "Bi-weekly", "Monthly", "As needed", "Not sure"]
        }
      ]
    },
    {
      step: 5,
      theme: "Additional Information",
      questions: [
        {
          id: "q9",
          question: "Tell us about your interests and hobbies",
          type: "textarea",
          placeholder: "This helps us match you with mentors who share similar interests..."
        },
        {
          id: "q10",
          question: "Is there anything else you'd like your mentor to know?",
          type: "textarea",
          placeholder: "Any additional information that might help in the mentoring process..."
        }
      ]
    }
  ];

  const [formData, setFormData] = useState({});

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

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
    console.log("Saving form data:", formData);
    // Here you would typically save to your backend
    alert("Onboarding completed successfully!");
  };

  const currentStepData = stepData.find(step => step.step === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex">
      {/* Left Sidebar - Progress Bar */}
      <div className="w-80 bg-white shadow-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Prospéra</h2>
          <p className="text-gray-600">Let's set up your profile to find the perfect mentor</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {stepData.map((step, index) => (
            <div
              key={step.step}
              className={`relative flex items-center transition-all duration-500 ease-in-out ${
                currentStep === step.step
                  ? "transform scale-105"
                  : currentStep > step.step
                  ? "opacity-90"
                  : "opacity-60"
              }`}
            >
              {/* Step Number Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-500 ease-in-out ${
                  currentStep > step.step
                    ? "bg-green-600 shadow-lg"
                    : currentStep === step.step
                    ? "bg-emerald-600 shadow-xl ring-4 ring-emerald-200"
                    : "bg-gray-300"
                }`}
              >
                {currentStep > step.step ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.step
                )}
              </div>

              {/* Step Content */}
              <div className="ml-4 flex-1">
                <h3
                  className={`font-semibold transition-all duration-300 ${
                    currentStep === step.step
                      ? "text-emerald-700 text-lg"
                      : currentStep > step.step
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  Step {step.step}
                </h3>
                <p
                  className={`text-sm transition-all duration-300 ${
                    currentStep === step.step
                      ? "text-emerald-600 font-medium"
                      : currentStep > step.step
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  {step.theme}
                </p>
              </div>

              {/* Connecting Line */}
              {index < stepData.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-0.5 h-8 transition-all duration-500 ${
                    currentStep > step.step
                      ? "bg-green-600"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress Percentage */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {currentStepData?.theme}
            </h1>
            <p className="text-gray-600">
              Step {currentStep} of {totalSteps} - Please answer the following questions
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {currentStepData?.questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
              >
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Question {index + 1}: {question.question}
                </label>
                
                {question.type === "select" && (
                  <select
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-200 focus:ring-4 transition-all duration-200 text-gray-700"
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

                {question.type === "text" && (
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-200 focus:ring-4 transition-all duration-200 text-gray-700"
                    placeholder={question.placeholder}
                    value={formData[question.id] || ""}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                  />
                )}

                {question.type === "textarea" && (
                  <textarea
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-200 focus:ring-4 transition-all duration-200 text-gray-700 h-32 resize-none"
                    placeholder={question.placeholder}
                    value={formData[question.id] || ""}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 shadow-md hover:shadow-lg"
              }`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-12 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
