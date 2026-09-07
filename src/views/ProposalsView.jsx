import React from 'react';
import { isDateInFilter } from '../utils/dateUtils';

export default function ProposalsView({ proposals = [], searchQuery = '', selectedDateFilter = 'This Month', onSelectAccount }) {
  const q = searchQuery.toLowerCase().trim();
  const filteredProposals = proposals.filter(p => {
    const matchesSearch = !q ||
      p.proposalId.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.opportunity.toLowerCase().includes(q) ||
      p.notes.toLowerCase().includes(q) ||
      p.owner.toLowerCase().includes(q);

    const matchesDate = isDateInFilter(p.validityDate || p.createdDate, selectedDateFilter);

    return matchesSearch && matchesDate;
  });

  const handleAccountClick = (companyName) => {
    if (onSelectAccount) {
      onSelectAccount(companyName);
    }
  };

  return (
    <div className="proposals-view">
      <div className="section-card">
        <div className="section-header">
          <h3 className="section-title">Commercial Proposals Table</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="action-table">
            <thead>
              <tr>
                <th>Proposal ID</th>
                <th>Company Account</th>
                <th>Opportunity Name</th>
                <th>Proposal Value</th>
                <th>Est. Account Worth</th>
                <th>Validity Date</th>
                <th>Status Pipeline</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#557396' }}>
                    No proposals found matching the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProposals.map((prop) => (
                  <tr key={prop.id}>
                    <td>
                      <button
                        type="button"
                        className="table-link-btn"
                      onClick={() => handleAccountClick(prop.company)}
                      title={`View ${prop.company} account details`}
                      style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', fontWeight: 700, color: '#063669', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {prop.proposalId}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="table-link-btn"
                      onClick={() => handleAccountClick(prop.company)}
                      title={`View ${prop.company} account details`}
                      style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', fontWeight: 600, color: '#084482', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {prop.company}
                    </button>
                  </td>
                  <td>{prop.opportunity}</td>
                  <td style={{ fontWeight: 700 }}>{prop.proposalValue}</td>
                  <td style={{ color: '#557396' }}>{prop.estimatedAccountWorth}</td>
                  <td>{prop.validityDate}</td>
                  <td>
                    <span className={`status-chip ${prop.status.toLowerCase()}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td>{prop.owner}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
