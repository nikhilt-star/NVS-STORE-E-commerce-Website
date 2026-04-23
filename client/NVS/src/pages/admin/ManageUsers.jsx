import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import PageTransition from '../../components/common/PageTransition'
import SectionReveal from '../../components/common/SectionReveal'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { adminService } from '../../services/adminService'
import { getApiErrorMessage } from '../../utils/apiError'

function ManageUsers() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [pendingUserId, setPendingUserId] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      try {
        setErrorMessage('')
        const data = await adminService.getUsers()

        if (isMounted) {
          setUsers(data.users)
        }
      } catch (error) {
        if (!isMounted) {
          return
        }

        if (error.response?.status === 401) {
          await logout()
          navigate('/login', { replace: true })
          return
        }

        setErrorMessage(getApiErrorMessage(error))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [logout, navigate])

  const handleToggleUser = async (user) => {
    try {
      setPendingUserId(user.id)
      setErrorMessage('')
      const response = await adminService.updateUserStatus(user.id, !user.isActive)

      setUsers((current) =>
        current.map((entry) => (entry.id === user.id ? response.user : entry)),
      )
    } catch (error) {
      if (error.response?.status === 401) {
        await logout()
        navigate('/login', { replace: true })
        return
      }

      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setPendingUserId('')
    }
  }

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <Sidebar />
          <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
            <p className="eyebrow">Users</p>
            <h1 className="mt-4 section-title">Manage Users</h1>
            {errorMessage ? (
              <div className="mt-8 rounded-[24px] bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                {errorMessage}
              </div>
            ) : null}

            {isLoading ? (
              <Loader label="Loading users..." />
            ) : !users.length ? (
              <div className="mt-8 rounded-[24px] bg-nvs-cream px-5 py-5 text-sm font-medium text-nvs-brown/70">
                No users found in the database yet.
              </div>
            ) : (
              <div className="mt-8 grid gap-4">
                {users.map((user) => (
                  <div key={user.id} className="rounded-[26px] border border-nvs-line p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-display text-4xl leading-none text-nvs-brown">
                        {user.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-pill bg-nvs-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-nvs-purple">
                          {user.role}
                        </span>
                        <span
                          className={`rounded-pill px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
                            user.isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-nvs-brown/70">{user.email}</p>
                    <p className="mt-2 text-sm font-semibold text-nvs-brown/70">
                      {user.phone || 'No phone number'}
                    </p>
                    <div className="mt-5">
                      <Button
                        variant={user.isActive ? 'secondary' : 'primary'}
                        onClick={() => handleToggleUser(user)}
                        disabled={pendingUserId === user.id}
                      >
                        {pendingUserId === user.id
                          ? 'Saving...'
                          : user.isActive
                            ? 'Deactivate User'
                            : 'Activate User'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default ManageUsers
