import { Upload, Brain, Download, Play } from "lucide-react"

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <Play className="w-4 h-4 mr-2" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Get Results in 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 3 Simple Steps</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our streamlined process makes it incredibly easy to get professional resume feedback in minutes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Upload Your Resume</h3>
            <p className="text-slate-600 leading-relaxed">Simply drag and drop your PDF resume or browse to select it. We support all standard resume formats.</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Analysis</h3>
            <p className="text-slate-600 leading-relaxed">Our advanced AI analyzes your resume against industry standards, ATS requirements, and best practices.</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Download className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Insights</h3>
            <p className="text-slate-600 leading-relaxed">Receive detailed feedback, scores, and actionable recommendations to improve your resume instantly.</p>
          </div>
        </div>
      </div>
    </section>
  )
}