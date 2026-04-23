import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { getApiErrorMessage } from '../utils/apiError'
import { validators } from '../utils/validators'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {
      name: validators.required(form.name) ? '' : 'Name is required',
      email: validators.email(form.email) ? '' : 'Enter a valid email',
      phone: form.phone && !validators.minLength(form.phone, 10) ? 'Enter a valid phone number' : '',
      password: validators.minLength(form.password, 8) ? '' : 'Minimum 8 characters',
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')
      const payload = await authService.register(form)
      login(payload)
      navigate('/profile', { replace: true })
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
          <p className="eyebrow">Join NVS</p>
          <h1 className="mt-4 section-title">Create your account and keep checkout details ready for every order.</h1>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              error={errors.name}
              placeholder="NVS Parent"
            />
            <Input
              label="Email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              error={errors.email}
              placeholder="parent@nvskids.com"
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              error={errors.phone}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Password"
              type="password"
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-sm font-medium text-nvs-brown/70">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-nvs-purple">
              Log in
            </Link>
          </p>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default Register
