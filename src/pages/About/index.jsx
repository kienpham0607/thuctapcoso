import { CheckCircle, Users, Target, Award, BookOpen, BarChart3, Calculator, Presentation } from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

export default function AboutPage() {
  const features = [
    {
      icon: Calculator,
      title: "Automatic GPA Calculation",
      description:
        "Our intelligent system automatically calculates your GPA based on your grades, saving time and eliminating calculation errors.",
    },
    {
      icon: Presentation,
      title: "Lecture Management",
      description:
        "Organize and access all your lecture materials in one place with our comprehensive lecture management system.",
    },
    {
      icon: BarChart3,
      title: "Learning Progress Tracking",
      description:
        "Monitor your academic journey with detailed analytics and visualizations of your learning progress.",
    },
    {
      icon: BookOpen,
      title: "Course Organization",
      description:
        "Efficiently organize courses, assignments, and materials with our intuitive interface designed for students.",
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description:
        "Share notes, collaborate on assignments, and learn together with classmates through integrated tools.",
    },
    {
      icon: Award,
      title: "Achievement Tracking",
      description:
        "Set academic goals and track your achievements with personalized dashboards and progress indicators.",
    },
  ]

  const stats = [
    { number: "100%", label: "Calculation Accuracy" },
    { number: "24/7", label: "Access" },
    { number: "4.9/5", label: "User Rating" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-100">Academic Success Platform</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-teal-600">Us</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A comprehensive platform that automatically calculates your GPA and manages lecture materials, helping you
            track your learning progress with precision and ease.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 text-teal-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Accurate GPA Calculation</span>
            </div>
            <div className="flex items-center space-x-2 text-teal-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Lecture Management</span>
            </div>
            <div className="flex items-center space-x-2 text-teal-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Progress Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our three main features designed to support your academic journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col items-center">
                <Calculator className="w-12 h-12 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">College GPA</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Easily calculate and track your college GPA with detailed breakdowns for each subject and semester.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col items-center">
                <Presentation className="w-12 h-12 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice Test</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Take practice tests to assess your knowledge and prepare for exams with instant feedback.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col items-center">
                <Users className="w-12 h-12 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Profile</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Manage your academic profile, achievements, and personal information in one convenient place.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform simplifies academic management in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Enter Your Grades</h3>
              <p className="text-gray-600">
                Simply input your course grades and credit hours into our user-friendly interface.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Lecture Materials</h3>
              <p className="text-gray-600">
                Organize your lecture notes, slides, and resources in our comprehensive management system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Your Progress</h3>
              <p className="text-gray-600">
                Monitor your academic performance with detailed analytics and visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <Target className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl text-teal-100 leading-relaxed">
            To empower students with tools that simplify academic management and provide accurate insights into their
            learning progress. We believe that with the right tools, every student can achieve their full academic
            potential and take control of their educational journey.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">The benefits of using our GPA and lecture management platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Students</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Accurate GPA calculation saves time and prevents errors</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Centralized lecture materials for easy access and review</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Visual progress tracking to identify strengths and weaknesses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Goal setting and achievement monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Educators</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Streamlined lecture material distribution</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Insights into student performance and engagement</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Reduced administrative workload with automated calculations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Tools to identify students who may need additional support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}