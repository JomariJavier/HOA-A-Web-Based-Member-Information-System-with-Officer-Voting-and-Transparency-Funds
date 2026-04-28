import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ExpenseLedger({ isAdmin }) {
    const { fetchWithAuth } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRecord, setNewRecord] = useState({
        amount: '',
        type: 'EXPENSE',
        category: 'Maintenance',
        description: ''
    });

    const fetchRecords = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:8081/api/finance/records');
            if (response.ok) {
                const data = await response.json();
                setRecords(data);
            }
        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchWithAuth('http://localhost:8081/api/finance/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newRecord,
                    amount: parseFloat(newRecord.amount)
                })
            });
            if (response.ok) {
                setShowAddModal(false);
                setNewRecord({ amount: '', type: 'EXPENSE', category: 'Maintenance', description: '' });
                fetchRecords();
            }
        } catch (error) {
            console.error("Error adding record:", error);
        }
    };

    const handleExport = () => {
        window.open('http://localhost:8081/api/finance/export', '_blank');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record? An audit trail will be kept.")) return;
        try {
            const response = await fetchWithAuth(`http://localhost:8081/api/finance/records/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) fetchRecords();
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    if (loading) return <div>Loading ledger...</div>;

    return (
        <div className="expense-ledger">
            <div className="ledger-actions" style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px'}}>
                <button className="m3-tonal-btn" onClick={handleExport}>
                    <span>⬇</span> Export to Excel/CSV
                </button>
                {isAdmin && (
                    <button className="m3-filled-btn" onClick={() => setShowAddModal(true)}>
                        <span>+</span> Record Transaction
                    </button>
                )}
            </div>

            <div className="m3-table-container">
                <table className="m3-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(record => (
                            <tr key={record.id}>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`m3-badge ${record.type === 'INCOME' ? 'badge-success' : 'badge-error'}`}>
                                        {record.type}
                                    </span>
                                </td>
                                <td>{record.category}</td>
                                <td>{record.description}</td>
                                <td style={{fontWeight: 'bold', color: record.type === 'INCOME' ? '#2E7D32' : '#C62828'}}>
                                    {record.type === 'INCOME' ? '+' : '-'} ₱{record.amount.toLocaleString()}
                                </td>
                                {isAdmin && (
                                    <td>
                                        <button className="m3-icon-btn error-text" onClick={() => handleDelete(record.id)}>✕</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="m3-modal-overlay">
                    <div className="m3-card m3-elevated-card m3-modal-content">
                        <h2 className="m3-title-large">Record Transaction</h2>
                        <form className="m3-form-grid" onSubmit={handleAddSubmit}>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Type</label>
                                <select 
                                    className="m3-input"
                                    value={newRecord.type}
                                    onChange={e => setNewRecord({...newRecord, type: e.target.value})}
                                >
                                    <option value="EXPENSE">Expense</option>
                                    <option value="INCOME">Income / Contribution</option>
                                </select>
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Amount</label>
                                <input 
                                    type="number" 
                                    className="m3-input" 
                                    required
                                    value={newRecord.amount}
                                    onChange={e => setNewRecord({...newRecord, amount: e.target.value})}
                                />
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Category</label>
                                <input 
                                    type="text" 
                                    className="m3-input" 
                                    value={newRecord.category}
                                    onChange={e => setNewRecord({...newRecord, category: e.target.value})}
                                />
                            </div>
                            <div className="m3-text-field m3-full-width">
                                <label className="m3-label-medium">Description</label>
                                <textarea 
                                    className="m3-input" 
                                    required
                                    value={newRecord.description}
                                    onChange={e => setNewRecord({...newRecord, description: e.target.value})}
                                />
                            </div>
                            <div className="m3-card-actions m3-full-width">
                                <button type="button" className="m3-text-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="m3-filled-btn">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
