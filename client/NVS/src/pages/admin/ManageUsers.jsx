import PageTransition from '../../components/common/PageTransition'
import SectionReveal from '../../components/common/SectionReveal'
import Sidebar from '../../components/layout/Sidebar'
import { mockUsers } from '../../data/mockData'

function ManageUsers() {
  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <Sidebar />
          <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
            <p className="eyebrow">Users</p>
            <h1 className="mt-4 section-title">Manage Users</h1>
            <div className="mt-8 grid gap-4">
              {Object.values(mockUsers).map((user) => (
                <div key={user.id} className="rounded-[26px] border border-nvs-line p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-4xl leading-none text-nvs-brown">{user.name}</p>
                    <span className="rounded-pill bg-nvs-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-nvs-purple">
                      {user.role}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-nvs-brown/70">{user.email}</p>
                  <p className="mt-2 text-sm font-semibold text-nvs-brown/70">{user.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default ManageUsers
