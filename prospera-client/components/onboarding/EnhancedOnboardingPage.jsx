"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EnhancedOnboardingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  useEffect(()=>{
    const getSession = async () => {
      const {data: {session}} = await supabase.auth.getSession();
      if(!session?.user) router.push("/sign-up");
      else {
        setUser(session.user);
        setLoading(false);
      }
    };

    getSession();
  }, [router])
  // Sample themes and questions for each step
  const stepData = [
    {
      step: 1,
      theme: "Personal Background",
      questions: [
        "What is your current academic level and field of study?",
        "How long have you been in Canada and what brought you here?"
      ]
    },
    {
      step: 2,
      theme: "Academic Journey",
      questions: [
        "What academic challenges are you currently facing?",
        "What resources or support do you need most right now?"
      ]
    },
    {
      step: 3,
      theme: "Career Aspirations",
      questions: [
        "What are your primary career goals after graduation?",
        "What industry or field interests you the most?"
      ]
    },
    {
      step: 4,
      theme: "Mentorship Preferences",
      questions: [
        "What type of mentorship support are you looking for?",
        "How often would you like to connect with a mentor?"
      ]
    },
    {
      step: 5,
      theme: "Personal Interests",
      questions: [
        "Tell us about your hobbies and interests outside academics",
        "Is there anything else you'd like to share about yourself?"
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
    console.log("Saving form data:", formData);
    alert("Onboarding completed successfully! Welcome to Prospéra!");
  };

  const handleInputChange = (questionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      [`step${currentStep}_q${questionIndex + 1}`]: value
    }));
  };

  const currentStepData = stepData.find(step => step.step === currentStep);

  if(loading) return <div className="text-7xl bg-white h-screen w-screen text-black text-center pt-60">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Left Sidebar - Step Navigation */}
      <div className="w-80 bg-gray-300 p-8 shadow-lg">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Prospéra</h2>
          <p className="text-gray-600 text-sm">Complete your profile to get matched with the perfect mentor</p>
        </div>
        <div>
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
          {/* Question 1 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Question 1 about Theme {currentStep}
            </h2>
            <div className="bg-gray-100 rounded-lg p-6 min-h-[120px] flex items-center">
              <p className="text-gray-700 text-lg">
                {currentStepData?.questions[0]}
              </p>
            </div>
            <div className="mt-4">
              <textarea
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-all duration-200 text-gray-700 h-24 resize-none"
                placeholder="Share your thoughts here..."
                value={formData[`step${currentStep}_q1`] || ""}
                onChange={(e) => handleInputChange(0, e.target.value)}
              />
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Question 2 about Theme {currentStep}
            </h2>
            <div className="bg-gray-100 rounded-lg p-6 min-h-[120px] flex items-center">
              <p className="text-gray-700 text-lg">
                {currentStepData?.questions[1]}
              </p>
            </div>
            <div className="mt-4">
              <textarea
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 transition-all duration-200 text-gray-700 h-24 resize-none"
                placeholder="Share your thoughts here..."
                value={formData[`step${currentStep}_q2`] || ""}
                onChange={(e) => handleInputChange(1, e.target.value)}
              />
            </div>
          </div>
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
