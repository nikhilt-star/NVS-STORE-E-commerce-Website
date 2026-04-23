import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '../utils/apiError'
import { validators } from '../utils/validators'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {
      email: validators.email(form.email) ? '' : 'Enter a valid email',
      password: validators.minLength(form.password, 6) ? '' : 'Minimum 6 characters',
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')
      const payload = await authService.login(form)
      login(payload)
      navigate(location.state?.from?.pathname || '/profile', { replace: true })
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-16 md:py-20">
        <div className="mx-auto max-w-2xl rounded-[36px] border border-nvs-line bg-white p-8 shadow-soft md:p-12">
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-4 section-title">Log in to continue shopping and manage your NVS account.</h1>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              error={errors.email}
              placeholder="parent@nvskids.com"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              error={errors.password}
              placeholder="********"
            />
            {submitError ? (
              <p className="rounded-[20px] bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {submitError}
              </p>
            ) : null}
            <Button type="submit" className="mt-2">
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>
          </form>

          <p className="mt-6 text-sm font-medium text-nvs-brown/70">
            New here?{' '}
            <Link to="/register" className="font-bold text-nvs-purple">
              Create an account
            </Link>
          </p>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default Login
