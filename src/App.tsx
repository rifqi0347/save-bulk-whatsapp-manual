import React, { useState } from 'react';
import { Download, UserPlus, Pencil, Trash2, ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Github } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const contactsPerPage = 10;
  const totalPages = Math.ceil(contacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const displayedContacts = contacts.slice(startIndex, startIndex + contactsPerPage);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const isDuplicate = (nameToCheck: string, phoneToCheck: string, excludeId?: string) => {
    return contacts.some(contact => 
      (contact.name.toLowerCase() === nameToCheck.toLowerCase() || 
       contact.phone === phoneToCheck) && 
      contact.id !== excludeId
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (editingId) {
      if (isDuplicate(name, phone, editingId)) {
        showErrorMessage('A contact with this name or phone number already exists!');
        return;
      }
      setContacts(contacts.map(contact => 
        contact.id === editingId ? { ...contact, name, phone } : contact
      ));
      setEditingId(null);
      showSuccessMessage('Contact updated successfully!');
    } else {
      if (isDuplicate(name, phone)) {
        showErrorMessage('A contact with this name or phone number already exists!');
        return;
      }
      setContacts([...contacts, { id: crypto.randomUUID(), name, phone }]);
      showSuccessMessage('Contact added successfully!');
    }

    setName('');
    setPhone('');
  };

  const startEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setPhone('');
  };

  const deleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(contact => contact.id !== id));
      showSuccessMessage('Contact deleted successfully!');
      if (displayedContacts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const exportToCSV = () => {
    const header = 'Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,Phone 1 - Type,Phone 1 - Value\n';
    const csvContent = header + contacts.map(contact => 
      `${contact.name},${contact.name},,,,,,,,,,,,,,,,,,,,,,,,,,,* myContacts,,${contact.phone}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contacts.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#1a237e] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">Bulk save contacts for WhatsApp</h1>
        
        <div className="text-center mb-8">
          <p className="text-white text-lg mb-2">Created by Rifqi</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.facebook.com/rifqi.0347"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://x.com/rifqiteh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <Twitter size={24} />
            </a>
            <a
              href="https://www.instagram.com/iqiwf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://github.com/rifqi0347"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <Github size={24} />
            </a>
          </div>
        </div>
        
        {showSuccess && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-4 text-center">
            {successMessage}
          </div>
        )}

        {showError && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2">
                Contact Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40"
                required
                placeholder="Enter contact name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-white mb-2">
                Contact Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40"
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-white text-[#1a237e] py-3 px-6 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              {editingId ? <Pencil size={20} /> : <UserPlus size={20} />}
              {editingId ? 'Update Contact' : 'Add Contact'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 bg-red-500/20 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={exportToCSV}
              className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/20"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </form>

        {contacts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Contacts ({contacts.length})
            </h2>
            <div className="space-y-2">
              {displayedContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className="bg-white/10 p-4 rounded-lg border border-white/20 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium">{contact.name}</p>
                    <p className="text-white/70">{contact.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(contact)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Pencil size={20} className="text-white" />
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;