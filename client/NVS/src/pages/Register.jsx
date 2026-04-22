import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { validators } from '../utils/validators'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {
      name: validators.required(form.name) ? '' : 'Name is required',
      email: validators.email(form.email) ? '' : 'Enter a valid email',
      password: validators.minLength(form.password, 6) ? '' : 'Minimum 6 characters',
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    const payload = await authService.register(form)
    login(payload)
    navigate('/profile', { replace: true })
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
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              error={errors.password}
              placeholder="******"
            />
            <Button type="submit" className="mt-2">
              Create Account
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
