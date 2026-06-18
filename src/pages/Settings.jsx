import { useAuth } from '../context/useAuth.js';
import { useState } from 'react';

function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'preferences', label: 'Preferences', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Please log in to access settings</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Settings</h1>
        <p className="mt-1 text-slate-600">Manage your account settings and preferences</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 overflow-x-auto">
          <nav className="flex gap-4 px-6" aria-label="Settings tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 mb-4">Profile Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      defaultValue={user.name}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      defaultValue={user.email}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <button type="submit" className="rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-950">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { title: 'Email Notifications', desc: 'Receive email updates for complaint status changes', enabled: true },
                  { title: 'Push Notifications', desc: 'Get real-time push notifications on your device', enabled: true },
                  { title: 'Weekly Digest', desc: 'Receive a weekly summary of your complaints', enabled: false },
                  { title: 'Admin Alerts', desc: 'Notifications for admin actions on your complaints', enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-950">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <form className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-950">Display Preferences</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700">Theme</label>
                <div className="mt-2 flex gap-4">
                  {['light', 'dark', 'system'].map((theme) => (
                    <label key={theme} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="theme" defaultValue="system" defaultChecked={theme === 'system'} className="text-blue-600 focus:ring-blue-500" />
                      <span className="capitalize text-slate-700">{theme}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Language</label>
                <select className="mt-1 block w-full max-w-xs rounded-lg border border-slate-300 px-4 py-2.5 text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <button type="submit" className="rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
                  Save Preferences
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;