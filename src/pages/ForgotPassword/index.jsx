import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, CheckCircle, Lock, Eye, EyeOff, KeySquare } from "lucide-react"
import { Link } from "react-router-dom"
import authApi from "../../apis/authApi"
import logo from "../../assets/logo.png"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      await authApi.forgotPassword(email)
      setStep(2)
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error)
      setError(error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError("")

    if (!otp) {
      setError("Mã OTP không được để trống")
      return
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp")
      return
    }
    
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    setIsLoading(true)

    try {
      await authApi.resetPassword(email, otp, password)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error)
      setError(error.response?.data?.message || error.message || 'Mã OTP không đúng hoặc đã hết hạn.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col items-center">
          <Link to="/" className="mb-6">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>

          {isSubmitted ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold">Mật khẩu đã được đặt lại</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.
              </p>
            </>
          ) : step === 1 ? (
            <>
              <h2 className="text-2xl font-bold">Quên mật khẩu</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật khẩu.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Đặt lại mật khẩu</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Mã OTP đã được gửi đến <strong>{email}</strong>. Vui lòng nhập mã OTP và mật khẩu mới.
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {!isSubmitted ? (
          step === 1 ? (
            <form onSubmit={handleRequestOTP} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Địa chỉ email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Địa chỉ email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="bg-gray-50 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Mã OTP
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeySquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mã OTP từ email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="basis-1/3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="basis-2/3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
              </div>
            </form>
          )
        ) : (
          <div className="mt-6">
            <Link
              to="/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng nhập
            </Link>
          </div>
        )}

        {!isSubmitted && (
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Quay lại trang đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}