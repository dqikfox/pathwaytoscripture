import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-[#FDFBF7] min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-12">
        <div className="md:flex md:items-center md:justify-between mb-12 border-b border-[#E5E2DC] pb-8">
          <div className="flex-1 min-w-0">
            <span className="text-[#C5A059] uppercase tracking-[0.2em] text-xs font-bold mb-3 block">Dashboard</span>
            <h2 className="text-3xl font-serif font-bold text-[#2F3337] sm:text-4xl tracking-tight">
              Admin Overview
            </h2>
            <p className="mt-2 text-lg text-[#2F3337]/70">
              Welcome back, {session.user?.name || session.user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-20">
          {/* Contact Messages Section */}
          <section>
            <h3 className="text-xl font-serif font-bold text-[#2F3337] mb-6">Contact Messages</h3>
            <div className="bg-white border border-[#E5E2DC] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E5E2DC]">
                  <thead className="bg-[#FDFBF7]">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2F3337]/70 uppercase tracking-widest">Date</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2F3337]/70 uppercase tracking-widest">Name</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2F3337]/70 uppercase tracking-widest">Email</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2F3337]/70 uppercase tracking-widest">Subject</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2F3337]/70 uppercase tracking-widest">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DC] bg-white">
                    {messages.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-[#2F3337]/50 italic">No messages found.</td></tr>
                    ) : messages.map((message) => (
                      <tr key={message.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-[#2F3337]/70">{new Date(message.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-[#2F3337]">{message.name}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-[#2F3337]/70">{message.email}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-[#2F3337]/70">{message.subject}</td>
                        <td className="px-6 py-5 text-sm text-[#2F3337]/70 max-w-xs truncate">{message.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* User Accounts Section */}
          <section>
            <h3 className="text-xl font-serif font-bold text-[#2F3337] mb-6">User Accounts</h3>
            <div className="bg-white border border-[#E5E2DC] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E5E2DC]">
                  <thead className="bg-[#FDFBF7]">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2F3337]/70 uppercase tracking-widest">Email</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2F3337]/70 uppercase tracking-widest">Name</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2F3337]/70 uppercase tracking-widest">Role</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2F3337]/70 uppercase tracking-widest">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DC] bg-white">
                    {users.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-[#2F3337]/50 italic">No users found.</td></tr>
                    ) : users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-[#2F3337]">{user.email}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-[#2F3337]/70">{user.name || '-'}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 inline-flex text-[10px] uppercase tracking-widest font-bold border ${user.role === 'admin' ? 'border-[#C5A059] text-[#C5A059] bg-[#C5A059]/5' : 'border-[#2F3337]/20 text-[#2F3337]/70 bg-[#FDFBF7]'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-[#2F3337]/70">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
