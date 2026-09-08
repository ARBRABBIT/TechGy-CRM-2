import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { isDateInFilter } from '../utils/dateUtils';

export default function ContactsView({
  contacts = [],
  onSelectAccount,
  searchQuery = '',
  selectedDateFilter = 'This Month',
  selectedOwnerFilter = 'All Owners'
}) {
  const [activePreset, setActivePreset] = useState('All Contacts');

  const q = searchQuery.toLowerCase().trim();

  const filteredContacts = contacts.filter(c => {
    if (activePreset === 'Recently Contacted' && c.lastContacted === 'None') return false;
    if (activePreset === 'No Activity' && c.relationshipStatus !== 'No Activity') return false;
    if (selectedOwnerFilter && selectedOwnerFilter !== 'All Owners' && c.owner !== selectedOwnerFilter) return false;
    if (q) {
      const matchName = c.name.toLowerCase().includes(q);
      const matchCompany = c.company.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchPhone = c.phone.toLowerCase().includes(q);
      const matchOwner = c.owner.toLowerCase().includes(q);
      if (!matchName && !matchCompany && !matchEmail && !matchPhone && !matchOwner) return false;
    }
    // Only apply date filter if custom date range was explicitly set
    if (typeof selectedDateFilter === 'object' && selectedDateFilter?.type === 'custom') {
      const matchesDate = isDateInFilter(c.createdDate || c.lastContacted, selectedDateFilter);
      if (!matchesDate) return false;
    }
    return true;
  });

  const filterKey = `${activePreset}_${searchQuery}_${selectedDateFilter}`;

  return (
    <div className="contacts-view">
      <div className="section-card">
        {/* Preset Views */}
        <div className="tab-header">
          {['All Contacts', 'By Account', 'By Owner', 'Recently Contacted', 'No Activity'].map(preset => (
            <div
              key={preset}
              className={`tab-item ${activePreset === preset ? 'active' : ''}`}
              onClick={() => setActivePreset(preset)}
            >
              {preset}
            </div>
          ))}
        </div>

        <div className="table-responsive-wrapper" style={{ overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none' }}>
          <table className="action-table">
            <thead>
              <tr>
                <th>Contact Name</th>
                <th>Company Account</th>
                <th>Designation</th>
                <th>Phone Number</th>
                <th>Email ID</th>
                <th>Location</th>
                <th>Owner</th>
                <th>Relationship Status</th>
              </tr>
            </thead>
            <motion.tbody
              key={filterKey}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            >
              {filteredContacts.length === 0 ? (
                <motion.tr
                  key="no-contacts"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                >
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#557396' }}>
                    No contacts found matching the current filter criteria.
                  </td>
                </motion.tr>
              ) : (
                filteredContacts.map((con, idx) => (
                  <motion.tr
                    key={con.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.28,
                      ease: [0.25, 1, 0.5, 1],
                      delay: Math.min(idx * 0.022, 0.1)
                    }}
                  >
                    <td style={{ fontWeight: 700, color: '#063669' }}>{con.name}</td>
                    <td>
                      <span
                        style={{ fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => onSelectAccount(con)}
                      >
                        {con.company}
                      </span>
                    </td>
                    <td>{con.designation}</td>
                    <td>{con.phone}</td>
                    <td>{con.email}</td>
                    <td>{con.location}</td>
                    <td>{con.owner}</td>
                    <td>
                      <span className={`status-chip ${con.relationshipStatus === 'No Activity' ? 'overdue' : 'new'}`}>
                        {con.relationshipStatus}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
