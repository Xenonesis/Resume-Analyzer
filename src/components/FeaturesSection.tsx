import { Brain, Target, Zap, BarChart3, MessageSquare, Shield, Rocket } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
            <Rocket className="w-4 h-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Everything You Need to 
            <span className="bg-gradient-to-r from-purple-600 to-blue-60 bg-clip-text text-transparent"> Stand Out</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our AI doesn't just scan your resume—it understands it, analyzes it, and gives you the insights you need to get hired.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">AI-Powered Analysis</h3>
            <p className="text-slate-600 leading-relaxed">Advanced machine learning algorithms analyze your resume against thousands of successful applications and industry standards.</p>
          </div>
          
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">ATS Optimization</h3>
            <p className="text-slate-600 leading-relaxed">Ensure your resume passes through Applicant Tracking Systems with our comprehensive ATS compatibility analysis.</p>
          </div>
          
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Instant Results</h3>
            <p className="text-slate-600 leading-relaxed">Get comprehensive feedback and actionable insights in under 30 seconds. No waiting, no delays.</p>
          </div>
          
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Detailed Scoring</h3>
            <p className="text-slate-600 leading-relaxed">Comprehensive scoring across multiple dimensions including content quality, structure, and presentation.</p>
          </div>
          
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-pink-200 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Actionable Insights</h3>
            <p className="text-slate-600 leading-relaxed">Get specific, actionable recommendations to improve your resume and increase your chances of getting hired.</p>
          </div>
          
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-200 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Privacy First</h3>
            <p className="text-slate-600 leading-relaxed">Your resume data is processed securely and never stored. Complete privacy and confidentiality guaranteed.</p>
          </div>
        </div>
      </div>
    </section>
  )
}