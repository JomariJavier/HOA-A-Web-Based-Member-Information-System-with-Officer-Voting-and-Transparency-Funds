import React, { useState, useEffect } from 'react';
import './RegisterModal.css';

const STEPS = ['Personal Info', 'Address & Contact', 'Account Setup', 'Review'];

const INITIAL_FORM = {
    fullName: '',
    birthDate: '',
    gender: '',
    maritalStatus: '',
    email: '',
    contactNumber: '',
    hoaAddress: '',
    familyMembers: '',
    username: '',
    password: '',
    confirmPassword: '',
};

export default function RegisterModal({ onClose }) {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState('');

    // Trap focus + close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setServerError('');
    };

    // Per-step validation
    const validateStep = () => {
        const newErrors = {};
        if (step === 0) {
            if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
            else if (form.fullName.trim().length < 3) newErrors.fullName = 'Name must be at least 3 characters.';
            if (!form.birthDate) newErrors.birthDate = 'Birth date is required.';
            if (!form.gender) newErrors.gender = 'Please select a gender.';
            if (!form.maritalStatus) newErrors.maritalStatus = 'Please select a marital status.';
        }
        if (step === 1) {
            if (!form.hoaAddress.trim()) newErrors.hoaAddress = 'HOA address is required.';
            if (!form.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required.';
            else if (!/^[\d\s\-()+]{7,20}$/.test(form.contactNumber.trim()))
                newErrors.contactNumber = 'Enter a valid contact number.';
            if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                newErrors.email = 'Enter a valid email address.';
        }
        if (step === 2) {
            const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/;
            if (!form.username.trim()) newErrors.username = 'Username is required.';
            else if (!usernameRegex.test(form.username.trim()))
                newErrors.username = 'Username must be 3-30 chars: letters, numbers, . _ - only.';
            if (!form.password) newErrors.password = 'Password is required.';
            else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
            else if (!/[A-Z]/.test(form.password)) newErrors.password = 'Password must contain at least one uppercase letter.';
            else if (!/[0-9]/.test(form.password)) newErrors.password = 'Password must contain at least one number.';
            if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
            else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setServerError('');
        try {
            // Strip confirmPassword — never send it to the backend
            const { confirmPassword: _confirmPassword, ...rest } = form;
            const payload = {
                ...rest,
                fullName: form.fullName.trim(),
                username: form.username.trim(),
                hoaAddress: form.hoaAddress.trim(),
                contactNumber: form.contactNumber.trim(),
                email: form.email.trim(),
                familyMembers: form.familyMembers.trim(),
            };

            const res = await fetch('/api/public/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                setServerError(data.error || 'Submission failed. Please try again.');
                setLoading(false);
                return;
            }
            setSubmitted(true);
        } catch {
            setServerError('Network error — please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const progressPct = ((step) / STEPS.length) * 100;

    return (
        <div className="reg-overlay" role="dialog" aria-modal="true" aria-label="Member Registration" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="reg-modal">
                {/* Header */}
                <div className="reg-modal-header">
                    <div className="reg-modal-title-row">
                        <div className="reg-logo">🏘️</div>
                        <div>
                            <h2 className="reg-title">Member Registration</h2>
                            <p className="reg-subtitle">Apply to join your HOA community</p>
                        </div>
                    </div>
                    <button className="reg-close-btn" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* Progress bar */}
                {!submitted && (
                    <div className="reg-progress-bar">
                        <div className="reg-progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                )}

                {/* Step pills */}
                {!submitted && (
                    <div className="reg-steps">
                        {STEPS.map((s, i) => (
                            <div key={s} className={`reg-step-pill ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                                <span className="reg-step-num">{i < step ? '✓' : i + 1}</span>
                                <span className="reg-step-label">{s}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Body */}
                <div className="reg-body">
                    {submitted ? (
                        <SuccessScreen onClose={onClose} />
                    ) : (
                        <>
                            {step === 0 && <StepPersonal form={form} errors={errors} onChange={handleChange} />}
                            {step === 1 && <StepContact form={form} errors={errors} onChange={handleChange} />}
                            {step === 2 && <StepAccount form={form} errors={errors} onChange={handleChange} />}
                            {step === 3 && <StepReview form={form} />}

                            {serverError && (
                                <div className="reg-server-error">
                                    <span>⚠️</span> {serverError}
                                </div>
                            )}

                            <div className="reg-nav-btns">
                                {step > 0 && (
                                    <button className="reg-btn-back" onClick={prevStep} disabled={loading}>
                                        ← Back
                                    </button>
                                )}
                                <div style={{ flex: 1 }} />
                                {step < STEPS.length - 1 ? (
                                    <button className="reg-btn-next" onClick={nextStep}>
                                        Next →
                                    </button>
                                ) : (
                                    <button className="reg-btn-submit" onClick={handleSubmit} disabled={loading}>
                                        {loading ? (
                                            <span className="reg-spinner" />
                                        ) : '✓ Submit Application'}
                                    </button>
                                )}
                            </div>

                            <p className="reg-note">
                                Your application will be reviewed by an officer before activation.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Step 1: Personal Info ───────────────────────────────────── */
function StepPersonal({ form, errors, onChange }) {
    return (
        <div className="reg-step-content">
            <h3 className="reg-step-heading">Personal Information</h3>
            <p className="reg-step-desc">Tell us about yourself so we can verify your identity.</p>
            <div className="reg-fields">
                <Field label="Full Name *" error={errors.fullName}>
                    <input
                        id="reg-fullName"
                        name="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={onChange}
                        placeholder="e.g. Juan dela Cruz"
                        className={errors.fullName ? 'error' : ''}
                        autoFocus
                    />
                </Field>
                <Field label="Date of Birth *" error={errors.birthDate}>
                    <input
                        id="reg-birthDate"
                        name="birthDate"
                        type="date"
                        value={form.birthDate}
                        onChange={onChange}
                        className={errors.birthDate ? 'error' : ''}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </Field>
                <div className="reg-field-row">
                    <Field label="Gender *" error={errors.gender}>
                        <select
                            id="reg-gender"
                            name="gender"
                            value={form.gender}
                            onChange={onChange}
                            className={errors.gender ? 'error' : ''}
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </Field>
                    <Field label="Marital Status *" error={errors.maritalStatus}>
                        <select
                            id="reg-maritalStatus"
                            name="maritalStatus"
                            value={form.maritalStatus}
                            onChange={onChange}
                            className={errors.maritalStatus ? 'error' : ''}
                        >
                            <option value="">Select status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                        </select>
                    </Field>
                </div>
            </div>
        </div>
    );
}

/* ── Step 2: Address & Contact ───────────────────────────────── */
function StepContact({ form, errors, onChange }) {
    return (
        <div className="reg-step-content">
            <h3 className="reg-step-heading">Address & Contact</h3>
            <p className="reg-step-desc">How can officers reach you and confirm your HOA residence?</p>
            <div className="reg-fields">
                <Field label="HOA Address / Block & Lot *" error={errors.hoaAddress}>
                    <input
                        id="reg-hoaAddress"
                        name="hoaAddress"
                        type="text"
                        value={form.hoaAddress}
                        onChange={onChange}
                        placeholder="e.g. Block 3, Lot 12, Phase 2"
                        className={errors.hoaAddress ? 'error' : ''}
                        autoFocus
                    />
                </Field>
                <Field label="Contact Number *" error={errors.contactNumber}>
                    <input
                        id="reg-contactNumber"
                        name="contactNumber"
                        type="tel"
                        value={form.contactNumber}
                        onChange={onChange}
                        placeholder="e.g. 09123456789"
                        className={errors.contactNumber ? 'error' : ''}
                    />
                </Field>
                <Field label="Email Address (optional)" error={errors.email}>
                    <input
                        id="reg-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="you@example.com"
                        className={errors.email ? 'error' : ''}
                    />
                </Field>
                <Field label="Family Members (optional)" error={errors.familyMembers}>
                    <textarea
                        id="reg-familyMembers"
                        name="familyMembers"
                        value={form.familyMembers}
                        onChange={onChange}
                        placeholder="List names of household members, one per line…"
                        rows={3}
                    />
                </Field>
            </div>
        </div>
    );
}

/* ── Step 3: Account Setup ───────────────────────────────────── */
function StepAccount({ form, errors, onChange }) {
    const [showPwd, setShowPwd] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);

    // Password strength helper
    const strength = (() => {
        const p = form.password;
        if (!p) return { level: 0, label: '' };
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        return { level: score, label: levels[score] };
    })();

    return (
        <div className="reg-step-content">
            <h3 className="reg-step-heading">Account Setup</h3>
            <p className="reg-step-desc">Choose a username and set a password for your account.</p>
            <div className="reg-fields">
                <Field label="Preferred Username *" error={errors.username}>
                    <input
                        id="reg-username"
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={onChange}
                        placeholder="e.g. juan.delacruz"
                        className={errors.username ? 'error' : ''}
                        autoFocus
                        autoComplete="off"
                    />
                </Field>
                <Field label="Password *" error={errors.password}>
                    <div className="reg-pwd-wrapper">
                        <input
                            id="reg-password"
                            name="password"
                            type={showPwd ? 'text' : 'password'}
                            value={form.password}
                            onChange={onChange}
                            placeholder="Min 8 chars, 1 uppercase, 1 number"
                            className={errors.password ? 'error' : ''}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="reg-pwd-toggle"
                            onClick={() => setShowPwd(v => !v)}
                            aria-label={showPwd ? 'Hide password' : 'Show password'}
                        >
                            {showPwd ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {form.password && (
                        <div className="reg-pwd-strength">
                            <div className="reg-pwd-strength-bar">
                                {[1,2,3,4].map(i => (
                                    <div
                                        key={i}
                                        className={`reg-pwd-strength-seg ${strength.level >= i ? `level-${strength.level}` : ''}`}
                                    />
                                ))}
                            </div>
                            <span className={`reg-pwd-strength-label level-${strength.level}`}>{strength.label}</span>
                        </div>
                    )}
                </Field>
                <Field label="Confirm Password *" error={errors.confirmPassword}>
                    <div className="reg-pwd-wrapper">
                        <input
                            id="reg-confirmPassword"
                            name="confirmPassword"
                            type={showConfirm ? 'text' : 'password'}
                            value={form.confirmPassword}
                            onChange={onChange}
                            placeholder="Re-enter your password"
                            className={errors.confirmPassword ? 'error' : ''}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="reg-pwd-toggle"
                            onClick={() => setShowConfirm(v => !v)}
                            aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                            {showConfirm ? '🙈' : '👁️'}
                        </button>
                    </div>
                </Field>
            </div>
        </div>
    );
}

/* ── Step 4: Review ──────────────────────────────────────────── */
function StepReview({ form }) {
    const rows = [
        ['Full Name', form.fullName],
        ['Date of Birth', form.birthDate],
        ['Gender', form.gender],
        ['Marital Status', form.maritalStatus],
        ['HOA Address', form.hoaAddress],
        ['Contact Number', form.contactNumber],
        ['Email', form.email || '—'],
        ['Family Members', form.familyMembers || '—'],
        ['Username', form.username],
        ['Password', '••••••••'],
    ];

    return (
        <div className="reg-step-content">
            <h3 className="reg-step-heading">Review Your Application</h3>
            <p className="reg-step-desc">Please confirm the information below before submitting.</p>
            <div className="reg-review-table">
                {rows.map(([label, val]) => (
                    <div className="reg-review-row" key={label}>
                        <span className="reg-review-label">{label}</span>
                        <span className="reg-review-value">{val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Success Screen ──────────────────────────────────────────── */
function SuccessScreen({ onClose }) {
    return (
        <div className="reg-success">
            <div className="reg-success-icon">🎉</div>
            <h3 className="reg-success-title">Application Submitted!</h3>
            <p className="reg-success-msg">
                Your registration request has been sent to the HOA officers for review.
                You'll be contacted once your account is approved.
            </p>
            <button className="reg-btn-submit" onClick={onClose} style={{ marginTop: '8px' }}>
                Back to Login
            </button>
        </div>
    );
}

/* ── Reusable Field Wrapper ──────────────────────────────────── */
function Field({ label, error, children }) {
    return (
        <div className="reg-field">
            <label className="reg-field-label">{label}</label>
            {children}
            {error && <span className="reg-field-error">{error}</span>}
        </div>
    );
}
