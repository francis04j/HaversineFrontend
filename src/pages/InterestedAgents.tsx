import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Mail, Phone, MapPin, Briefcase, MessageSquare, Pencil, Trash2, X } from 'lucide-react';
import styles from '../styles/components/Input.module.css';

interface AgentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  comments: string;
  timestamp: string;
}

export function InterestedAgents() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    location: '',
    comments: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAllAgents, setShowAllAgents] = useState(false);

  useEffect(() => {
    const storedAgents = localStorage.getItem('interestedAgents');
    if (storedAgents) {
      setAgents(JSON.parse(storedAgents));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update existing agent
      const updatedAgents = agents.map(agent => 
        agent.id === editingId 
          ? { ...agent, ...formData, timestamp: new Date().toISOString() }
          : agent
      );
      setAgents(updatedAgents);
      localStorage.setItem('interestedAgents', JSON.stringify(updatedAgents));
      setMessage({ type: 'success', text: 'Agent details updated successfully!' });
      setEditingId(null);
    } else {
      // Add new agent
      const newAgent: AgentData = {
        id: crypto.randomUUID(),
        ...formData,
        timestamp: new Date().toISOString()
      };
      const updatedAgents = [...agents, newAgent];
      setAgents(updatedAgents);
      localStorage.setItem('interestedAgents', JSON.stringify(updatedAgents));
      setMessage({ type: 'success', text: 'Your details have been saved successfully!' });
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      location: '',
      comments: ''
    });

    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (agent: AgentData) => {
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
      location: agent.location,
      comments: agent.comments
    });
    setEditingId(agent.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      const updatedAgents = agents.filter(agent => agent.id !== id);
      setAgents(updatedAgents);
      localStorage.setItem('interestedAgents', JSON.stringify(updatedAgents));
      setMessage({ type: 'success', text: 'Agent deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      location: '',
      comments: ''
    });
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const displayedAgents = showAllAgents ? agents : agents.slice(-3);

  return (
    <>
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Search className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-2xl font-bold text-primary">CloseBy</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <UserPlus className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                {editingId ? 'Edit Agent Details' : 'Join Our Agent Network'}
              </h1>
              <p className="text-sm text-secondary-light">
                {editingId ? 'Update the agent information below' : 'Register your interest to become a RentHub agent'}
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-search p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <UserPlus className={styles.icon} />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={styles.input}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <Mail className={styles.icon} />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={styles.input}
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <Phone className={styles.icon} />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={styles.input}
                    placeholder="+44 123 456 7890"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <Briefcase className={styles.icon} />
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className={styles.input}
                  >
                    <option value="">Select your role</option>
                    <option value="estate_agent">Estate Agent</option>
                    <option value="letting_agent">Letting Agent</option>
                    <option value="property_manager">Property Manager</option>
                    <option value="branch_manager">Branch Manager</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <MapPin className={styles.icon} />
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className={styles.input}
                    placeholder="Enter your location"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <MessageSquare className={styles.icon} />
                    Comments
                  </label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => handleChange('comments', e.target.value)}
                    className={`${styles.input} resize-none`}
                    rows={3}
                    placeholder="Any additional information..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 rounded-lg text-base font-medium text-secondary-light bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className={styles.searchButton}>
                  {editingId ? 'Update Details' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>

          {agents.length > 0 && (
            <div className="bg-white rounded-xl shadow-search p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-secondary">
                  {showAllAgents ? 'All Applications' : 'Recent Applications'}
                </h2>
                <button
                  onClick={() => setShowAllAgents(!showAllAgents)}
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  {showAllAgents ? 'Show Recent' : 'View All'}
                </button>
              </div>
              <div className="space-y-4">
                {displayedAgents.reverse().map((agent) => (
                  <div key={agent.id} className="p-4 rounded-lg bg-neutral-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-secondary">{agent.name}</h3>
                        <p className="text-sm text-secondary-light">{agent.role.replace('_', ' ')}</p>
                        <p className="text-sm text-secondary-light mt-1">{agent.email}</p>
                        <p className="text-sm text-secondary-light">{agent.phone}</p>
                        <p className="text-sm text-secondary-light mt-2">{agent.location}</p>
                        {agent.comments && (
                          <p className="text-sm text-secondary-light mt-2">{agent.comments}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(agent)}
                          className="p-2 text-secondary-light hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(agent.id)}
                          className="p-2 text-secondary-light hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-secondary-light">
                      {new Date(agent.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}