"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const ProfileDisplay = () => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState({
    personalInfo: false,
    bio: false
  });

  // Static user data - replace with actual user data later
  const [personalInfo, setPersonalInfo] = useState({
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    dateOfBirth: "1995-03-15",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M5V 3A1"
  });

  const [bio, setBio] = useState("I'm a passionate software engineering student from China, currently pursuing my Master's degree at the University of Toronto. I moved to Canada two years ago and am excited to build my career in the tech industry while contributing to innovative projects that make a difference.");

  // Static matched mentors data
  const matchedMentors = [
    {
      id: 1,
      name: "Dr. Maria Rodriguez",
      profession: "Senior Software Engineer",
      company: "Shopify",
      skills: ["React", "Node.js", "System Design", "Leadership"],
      email: "maria.rodriguez@email.com",
      experience: "8 years",
      rating: 4.9
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      profession: "Product Manager",
      company: "RBC",
      skills: ["Product Strategy", "Agile", "Data Analysis", "Communication"],
      email: "ahmed.hassan@email.com",
      experience: "6 years",
      rating: 4.8
    },
    {
      id: 3,
      name: "Jennifer Kim",
      profession: "UX Designer",
      company: "Slack",
      skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
      email: "jennifer.kim@email.com",
      experience: "5 years",
      rating: 4.7
    }
  ];

  // Static questionnaire data - replace with actual onboarding data
  const questionnaireAnswers = {
    personalBackground: {
      countryOfOrigin: "China",
      englishProficiency: "B2 (Upper-Intermediate)",
      unclearAspects: ["Workplace culture and etiquette", "Networking and relationship building"]
    },
    personalityAndWorkStyle: {
      extravertedEnthusiastic: 4,
      dependableSelfDisciplined: 5,
      openToNewExperiences: 4
    },
    careerGoalsAndValues: {
      nextJobTarget: "Software Developer at a tech startup",
      professionalValuesRanking: ["Continuous learning", "Innovation", "Team collaboration"],
      remainsRelaxed: 3
    },
    challengesAndDevelopment: {
      barriersYouFace: ["Language barriers", "Lack of Canadian experience"],
      biggestCareerChallenge: ["Building professional networks", "Finding relevant job opportunities"],
      competenciesToDevelop: ["Communication and presentation", "Leadership and management", "Technical skills"]
    },
    communicationPreferences: {
      preferredChannels: {
        inPersonMeetings: 4,
        videoCalls: 5,
        phoneCalls: 3,
        textChatMessaging: 4,
        emailExchanges: 3
      },
      feedbackStyle: "Coaching (guided questions to help you discover solutions)",
      availableTimeSlots: ["Tuesday Evening (6pm-9pm)", "Thursday Evening (6pm-9pm)", "Saturday Morning (9am-12pm)"]
    }
  };

  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleEdit = (section) => {
    setIsEditing(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push("/");
    //   location.reload(); 
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      {/* Header Section */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between space-x-6">
            {/* Profile Picture */}
            <div className='flex flex-row items-center space-x-5'>
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                </div>
                
                {/* Welcome Message */}
                <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome, {personalInfo.name}!
                </h1>
                <p className="text-gray-600 mt-2">Your Prospéra profile is ready. Let's continue your journey!</p>
                </div>
            </div>

            <div className='flex flex-row gap-2'>
                <div>
                    <button
                        onClick={()=>{router.push("/")}}
                        className="text-white bg-gray-500  items-center overflow-hidden px-4 py-1.5 border rounded-lg font-semibold cursor-pointer"
                    >
                        Go back
                    </button>
                </div>
                <div>
                    <button
                        onClick={handleLogout}
                        className="text-white bg-red-500  items-center overflow-hidden px-4 py-1.5 border rounded-lg font-semibold cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Personal Info & Bio */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                <button
                  onClick={() => toggleEdit('personalInfo')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200"
                >
                  {isEditing.personalInfo ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(personalInfo).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-600 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {isEditing.personalInfo ? (
                      <input
                        type={key === 'dateOfBirth' ? 'date' : key === 'email' ? 'email' : 'text'}
                        value={value}
                        onChange={(e) => handlePersonalInfoChange(key, e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-200 focus:ring-4 transition-all duration-200"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                        {key === 'dateOfBirth' ? new Date(value).toLocaleDateString() : value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bio</h2>
                <button
                  onClick={() => toggleEdit('bio')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200"
                >
                  {isEditing.bio ? 'Save' : 'Edit'}
                </button>
              </div>
              
              {isEditing.bio ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="6"
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-200 focus:ring-4 transition-all duration-200 resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-800 leading-relaxed">
                  {bio}
                </div>
              )}
            </div>

            {/* Matched Mentors Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Matched Mentors</h2>
              
              <div className="space-y-6">
                {matchedMentors.map((mentor) => (
                  <div key={mentor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{mentor.name}</h3>
                        <p className="text-emerald-600 font-medium">{mentor.profession}</p>
                        <p className="text-gray-600">{mentor.company} • {mentor.experience} experience</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-gray-600 font-medium">{mentor.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <a href={`mailto:${mentor.email}`} className="text-emerald-600 hover:text-emerald-700 font-medium">
                        {mentor.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Questionnaire */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsQuestionnaireOpen(!isQuestionnaireOpen)}
              >
                <h2 className="text-2xl font-bold text-gray-800">Questionnaire</h2>
                <svg 
                  className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${isQuestionnaireOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {isQuestionnaireOpen && (
                <div className="mt-6 space-y-6">
                  {/* Personal Background */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-700 mb-3">Personal Background</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Country:</span> {questionnaireAnswers.personalBackground.countryOfOrigin}</p>
                      <p><span className="font-medium">English Level:</span> {questionnaireAnswers.personalBackground.englishProficiency}</p>
                      <p><span className="font-medium">Unclear Areas:</span></p>
                      <ul className="list-disc list-inside ml-4 text-gray-600">
                        {questionnaireAnswers.personalBackground.unclearAspects.map((aspect, index) => (
                          <li key={index}>{aspect}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Personality & Work Style */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-700 mb-3">Personality & Work Style</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Extraverted:</span> {questionnaireAnswers.personalityAndWorkStyle.extravertedEnthusiastic}/5</p>
                      <p><span className="font-medium">Dependable:</span> {questionnaireAnswers.personalityAndWorkStyle.dependableSelfDisciplined}/5</p>
                      <p><span className="font-medium">Open to new experiences:</span> {questionnaireAnswers.personalityAndWorkStyle.openToNewExperiences}/5</p>
                    </div>
                  </div>

                  {/* Career Goals */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-700 mb-3">Career Goals & Values</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Next Target:</span> {questionnaireAnswers.careerGoalsAndValues.nextJobTarget}</p>
                      <p><span className="font-medium">Top Values:</span></p>
                      <ol className="list-decimal list-inside ml-4 text-gray-600">
                        {questionnaireAnswers.careerGoalsAndValues.professionalValuesRanking.map((value, index) => (
                          <li key={index}>{value}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Challenges */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-700 mb-3">Challenges & Development</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Barriers:</span></p>
                      <ul className="list-disc list-inside ml-4 text-gray-600">
                        {questionnaireAnswers.challengesAndDevelopment.barriersYouFace.map((barrier, index) => (
                          <li key={index}>{barrier}</li>
                        ))}
                      </ul>
                      <p><span className="font-medium">Skills to Develop:</span></p>
                      <ul className="list-disc list-inside ml-4 text-gray-600">
                        {questionnaireAnswers.challengesAndDevelopment.competenciesToDevelop.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Communication */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-700 mb-3">Communication Preferences</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Feedback Style:</span> {questionnaireAnswers.communicationPreferences.feedbackStyle}</p>
                      <p><span className="font-medium">Available Times:</span></p>
                      <ul className="list-disc list-inside ml-4 text-gray-600">
                        {questionnaireAnswers.communicationPreferences.availableTimeSlots.map((slot, index) => (
                          <li key={index}>{slot}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
