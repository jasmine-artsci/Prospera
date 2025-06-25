"use client";

import { useState } from "react";

const OnboardingStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Sample themes and questions for each step
  const stepData = [
    {
      step: 1,
      theme: "Personal Background",
      questions: [
        "What is your current academic level?",
        "What field of study are you pursuing?"
      ]
    },
    {
      step: 2,
      theme: "Experience & Goals",
      questions: [
        "How long have you been in Canada?",
        "What are your primary career objectives?"
      ]
    },
    {
      step: 3,
      theme: "Mentorship Preferences",
      questions: [
        "What type of mentorship are you seeking?",
        "How often would you like to connect with your mentor?"
      ]
    },
    {
      step: 4,
      theme: "Communication Style",
      questions: [
        "What is your preferred communication method?",
        "What challenges are you currently facing?"
      ]
    },
    {
      step: 5,
      theme: "Additional Information",
      questions: [
        "Tell us about your interests and hobbies",
        "Is there anything else you'd like your mentor to know?"
      ]
    }
  ];

  const [formData, setFormData] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNext = () => {
    if (currentQuestionIndex < 1) {
      setCurrentQuestionIndex(1);
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(0);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCurrentQuestionIndex(1);
    }
  };

  const handleSave = () => {
    console.log("Saving form data:", formData);
    alert("Onboarding completed successfully!");
  };

  const currentStepData = stepData.find(step => step.step === currentStep);
  const currentQuestion = currentStepData?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar - Step Navigation */}
      <div className="w-72 bg-gray-200 p-6 shadow-lg">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Onboarding Process</h2>
        </div>

        {/* Step Navigation */}
        <div className="space-y-3">
          {stepData.map((step) => (
            <div
              key={step.step}
              className={`p-3 rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${
                currentStep === step.step
                  ? "bg-black text-white shadow-lg transform scale-105"
                  : currentStep > step.step
                  ? "bg-gray-300 text-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => {
                if (step.step <= currentStep) {
                  setCurrentStep(step.step);
                  setCurrentQuestionIndex(0);
                }
              }}
            >
              <div className="flex items-center">
                <span className="font-semibold">Step {step.step}</span>
                {currentStep > step.step && (
                  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8">
          <div className="text-sm text-gray-600 mb-2">
            Progress: {Math.round(((currentStep - 1) * 2 + currentQuestionIndex + 1) / 10 * 100)}%
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${((currentStep - 1) * 2 + currentQuestionIndex + 1) / 10 * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 bg-white p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          {/* Header with user icon */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {currentStepData?.theme}
              </h1>
              <div className="w-16 h-1 bg-black mb-6"></div>
            </div>
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Current Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Question {currentQuestionIndex + 1} about {currentStepData?.theme}
            </h2>
            
            <div className="bg-gray-100 rounded-lg p-8 mb-8">
              <p className="text-gray-700 text-lg">
                {currentQuestion}
              </p>
              
              {/* Answer Input Area */}
              <div className="mt-6">
                <textarea
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-all duration-200 text-gray-700 h-32 resize-none"
                  placeholder="Type your answer here..."
                  value={formData[`step${currentStep}_q${currentQuestionIndex + 1}`] || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [`step${currentStep}_q${currentQuestionIndex + 1}`]: e.target.value
                  }))}
                />
              </div>
            </div>

            {/* Second Question Indicator */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Question 2 about {currentStepData?.theme}
              </h2>
              
              <div className="bg-gray-100 rounded-lg p-8">
                <p className="text-gray-700 text-lg">
                  {currentStepData?.questions[1]}
                </p>
                
                {/* Answer Input Area */}
                <div className="mt-6">
                  <textarea
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-all duration-200 text-gray-700 h-32 resize-none"
                    placeholder="Type your answer here..."
                    value={formData[`step${currentStep}_q2`] || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [`step${currentStep}_q2`]: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-200"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-black hover:bg-gray-50"
              }`}
            >
              Prev
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-12 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300"
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

export default OnboardingStepPage;
