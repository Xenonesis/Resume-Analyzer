import React, { useState } from 'react'

export interface QuestionnaireData {
  // Dream Job Information
  dreamJob: {
    title: string
    company: string
    industry: string
    location: string
    salaryRange: string
    workType: 'remote' | 'hybrid' | 'onsite' | 'flexible'
  }
  
  // Current Status
  currentStatus: {
    employmentStatus: 'employed' | 'unemployed' | 'student' | 'freelancer' | 'career-change'
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
    currentRole?: string
    currentCompany?: string
    yearsOfExperience: string
    noticePeriod?: string
  }
  
  // Additional Information
  additionalInfo: {
    keySkills: string[]
    certifications: string[]
    careerGoals: string
    challenges: string[]
    preferredJobBoards: string[]
    applicationDeadline?: string
    specificRequirements: string
  }
  
  // Job Application Context
  jobContext: {
    companyName: string
    jobTitle: string
    jobDescription: string
    applicationSource: string
    referral?: string
  }
}

interface ResumeQuestionnaireProps {
  fileName: string
  filePath: string
  onComplete: (data: QuestionnaireData) => void
  onBack?: () => void
}

export const ResumeQuestionnaire: React.FC<ResumeQuestionnaireProps> = ({
  fileName,
  onComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<QuestionnaireData>({
    dreamJob: {
      title: '',
      company: '',
      industry: '',
      location: '',
      salaryRange: '',
      workType: 'hybrid'
    },
    currentStatus: {
      employmentStatus: 'employed',
      experienceLevel: 'mid',
      currentRole: '',
      currentCompany: '',
      yearsOfExperience: '',
      noticePeriod: ''
    },
    additionalInfo: {
      keySkills: [],
      certifications: [],
      careerGoals: '',
      challenges: [],
      preferredJobBoards: [],
      applicationDeadline: '',
      specificRequirements: ''
    },
    jobContext: {
      companyName: '',
      jobTitle: '',
      jobDescription: '',
      applicationSource: '',
      referral: ''
    }
  })

  const [skillInput, setSkillInput] = useState('')
  const [certificationInput, setCertificationInput] = useState('')

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else if (onBack) {
      onBack()
    }
  }

  const updateFormData = (section: keyof QuestionnaireData, data: Partial<QuestionnaireData[typeof section]>) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.additionalInfo.keySkills.includes(skillInput.trim())) {
      updateFormData('additionalInfo', {
        keySkills: [...formData.additionalInfo.keySkills, skillInput.trim()]
      })
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    updateFormData('additionalInfo', {
      keySkills: formData.additionalInfo.keySkills.filter(s => s !== skill)
    })
  }

  const addCertification = () => {
    if (certificationInput.trim() && !formData.additionalInfo.certifications.includes(certificationInput.trim())) {
      updateFormData('additionalInfo', {
        certifications: [...formData.additionalInfo.certifications, certificationInput.trim()]
      })
      setCertificationInput('')
    }
  }

  const removeCertification = (cert: string) => {
    updateFormData('additionalInfo', {
      certifications: formData.additionalInfo.certifications.filter(c => c !== cert)
    })
  }

  const toggleChallenge = (challenge: string) => {
    const challenges = formData.additionalInfo.challenges
    if (challenges.includes(challenge)) {
      updateFormData('additionalInfo', {
        challenges: challenges.filter(c => c !== challenge)
      })
    } else {
      updateFormData('additionalInfo', {
        challenges: [...challenges, challenge]
      })
    }
  }


  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.dreamJob.title && formData.dreamJob.industry
      case 2:
        return formData.currentStatus.yearsOfExperience
      case 3:
        return formData.additionalInfo.careerGoals.length > 10
      case 4:
        return formData.jobContext.companyName && formData.jobContext.jobTitle
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your dream job</h2>
              <p className="text-gray-600">Help us understand what you're aiming for</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dream Job Title *
                </label>
                <input
                  type="text"
                  value={formData.dreamJob.title}
                  onChange={(e) => updateFormData('dreamJob', { title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Senior Software Engineer, Product Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Company (Optional)
                </label>
                <input
                  type="text"
                  value={formData.dreamJob.company}
                  onChange={(e) => updateFormData('dreamJob', { company: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Google, Microsoft, Startup"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  value={formData.dreamJob.industry}
                  onChange={(e) => updateFormData('dreamJob', { industry: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="marketing">Marketing</option>
                  <option value="consulting">Consulting</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="media">Media & Entertainment</option>
                  <option value="nonprofit">Non-Profit</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={formData.dreamJob.location}
                  onChange={(e) => updateFormData('dreamJob', { location: e.target.value })}
                  className="input-field"
                  placeholder="e.g. San Francisco, Remote, New York"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Salary Range
                </label>
                <select
                  value={formData.dreamJob.salaryRange}
                  onChange={(e) => updateFormData('dreamJob', { salaryRange: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Range</option>
                  <option value="under-50k">Under $50,000</option>
                  <option value="50k-75k">$50,000 - $75,000</option>
                  <option value="75k-100k">$75,000 - $100,000</option>
                  <option value="100k-150k">$100,000 - $150,000</option>
                  <option value="150k-200k">$150,000 - $200,000</option>
                  <option value="200k-300k">$200,000 - $300,000</option>
                  <option value="over-300k">Over $300,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Type Preference
                </label>
                <select
                  value={formData.dreamJob.workType}
                  onChange={(e) => updateFormData('dreamJob', { workType: e.target.value as any })}
                  className="input-field"
                >
                  <option value="remote">Fully Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your current status?</h2>
              <p className="text-gray-600">Help us understand your current situation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employment Status
                </label>
                <select
                  value={formData.currentStatus.employmentStatus}
                  onChange={(e) => updateFormData('currentStatus', { employmentStatus: e.target.value as any })}
                  className="input-field"
                >
                  <option value="employed">Currently Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                  <option value="freelancer">Freelancer/Contractor</option>
                  <option value="career-change">Career Change</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.currentStatus.experienceLevel}
                  onChange={(e) => updateFormData('currentStatus', { experienceLevel: e.target.value as any })}
                  className="input-field"
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-7 years)</option>
                  <option value="senior">Senior Level (8-15 years)</option>
                  <option value="executive">Executive Level (15+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="text"
                  value={formData.currentStatus.yearsOfExperience}
                  onChange={(e) => updateFormData('currentStatus', { yearsOfExperience: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 5 years, 2.5 years"
                />
              </div>

              {formData.currentStatus.employmentStatus === 'employed' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Role
                    </label>
                    <input
                      type="text"
                      value={formData.currentStatus.currentRole}
                      onChange={(e) => updateFormData('currentStatus', { currentRole: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Software Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Company
                    </label>
                    <input
                      type="text"
                      value={formData.currentStatus.currentCompany}
                      onChange={(e) => updateFormData('currentStatus', { currentCompany: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Tech Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notice Period
                    </label>
                    <select
                      value={formData.currentStatus.noticePeriod}
                      onChange={(e) => updateFormData('currentStatus', { noticePeriod: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Notice Period</option>
                      <option value="immediate">Immediate</option>
                      <option value="2-weeks">2 Weeks</option>
                      <option value="1-month">1 Month</option>
                      <option value="2-months">2 Months</option>
                      <option value="3-months">3 Months</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
              <p className="text-gray-600">Help us personalize your resume analysis</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Key Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="input-field flex-1"
                    placeholder="e.g. React, Python, Project Management"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.additionalInfo.keySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Certifications
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    className="input-field flex-1"
                    placeholder="e.g. AWS Certified, PMP, Google Analytics"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.additionalInfo.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeCertification(cert)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Career Goals *
                </label>
                <textarea
                  value={formData.additionalInfo.careerGoals}
                  onChange={(e) => updateFormData('additionalInfo', { careerGoals: e.target.value })}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Describe your short-term and long-term career goals..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Current Job Search Challenges (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Getting interviews',
                    'ATS compatibility',
                    'Lack of experience',
                    'Career transition',
                    'Salary negotiations',
                    'Remote work options',
                    'Industry knowledge',
                    'Networking'
                  ].map((challenge) => (
                    <label key={challenge} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.additionalInfo.challenges.includes(challenge)}
                        onChange={() => toggleChallenge(challenge)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{challenge}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Application Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={formData.additionalInfo.applicationDeadline}
                  onChange={(e) => updateFormData('additionalInfo', { applicationDeadline: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Application Details</h2>
              <p className="text-gray-600">Tell us about the specific job you're applying for</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.jobContext.companyName}
                    onChange={(e) => updateFormData('jobContext', { companyName: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Google, Microsoft, Apple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.jobContext.jobTitle}
                    onChange={(e) => updateFormData('jobContext', { jobTitle: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Where did you find this job?
                  </label>
                  <select
                    value={formData.jobContext.applicationSource}
                    onChange={(e) => updateFormData('jobContext', { applicationSource: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Source</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="indeed">Indeed</option>
                    <option value="glassdoor">Glassdoor</option>
                    <option value="company-website">Company Website</option>
                    <option value="referral">Referral</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="job-fair">Job Fair</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Referral Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.jobContext.referral}
                    onChange={(e) => updateFormData('jobContext', { referral: e.target.value })}
                    className="input-field"
                    placeholder="Name of person who referred you"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={formData.jobContext.jobDescription}
                  onChange={(e) => updateFormData('jobContext', { jobDescription: e.target.value })}
                  className="input-field min-h-[150px] resize-none"
                  placeholder="Paste the complete job description here for more accurate analysis..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Adding a job description significantly improves analysis accuracy
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specific Requirements or Notes
                </label>
                <textarea
                  value={formData.additionalInfo.specificRequirements}
                  onChange={(e) => updateFormData('additionalInfo', { specificRequirements: e.target.value })}
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Any specific requirements, preferences, or additional context..."
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis Questionnaire</h1>
            <p className="text-gray-600">File: {fileName}</p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-gray-700">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {currentStep === 1 ? 'Back to Upload' : 'Previous'}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? 'Start AI Analysis' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}