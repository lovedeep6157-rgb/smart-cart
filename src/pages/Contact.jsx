import React, { useState, useCallback } from 'react'
import styles from './Contact.module.css'

// ── Initial form state ────────────────────────────────────────
const INITIAL = {
  name:     '',
  email:    '',
  phone:    '',
  subject:  '',
  category: '',
  message:  '',
  agree:    false,
}

// ── Validation rules ──────────────────────────────────────────
function validate(fields) {
  const errors = {}

  if (!fields.name.trim())
    errors.name = 'Full name is required.'
  else if (fields.name.trim().length < 2)
    errors.name = 'Name must be at least 2 characters.'

  if (!fields.email.trim())
    errors.email = 'Email address is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Enter a valid email address.'

  if (fields.phone && !/^[+]?[\d\s\-().]{7,15}$/.test(fields.phone))
    errors.phone = 'Enter a valid phone number.'

  if (!fields.subject.trim())
    errors.subject = 'Subject is required.'
  else if (fields.subject.trim().length < 4)
    errors.subject = 'Subject must be at least 4 characters.'

  if (!fields.category)
    errors.category = 'Please select a category.'

  if (!fields.message.trim())
    errors.message = 'Message is required.'
  else if (fields.message.trim().length < 20)
    errors.message = 'Message must be at least 20 characters.'

  if (!fields.agree)
    errors.agree = 'You must agree to the terms to submit.'

  return errors
}

// ── Field component ───────────────────────────────────────────
function Field({ label, error, required, children }) {
  return (
    <div className={`${styles.field} ${error ? styles.fieldError : ''}`}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && (
        <span className={styles.errorMsg} role="alert">{error}</span>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function Contact() {
  const [form,    setForm]    = useState(INITIAL)
  const [errors,  setErrors]  = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  // Live-validate only touched fields
  const getVisible = useCallback((f) => {
    const all = validate(f)
    const visible = {}
    Object.keys(touched).forEach((k) => { if (all[k]) visible[k] = all[k] })
    return visible
  }, [touched])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm((prev) => {
      const next = { ...prev, [name]: val }
      setErrors(getVisible(next))
      return next
    })
  }, [getVisible])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => {
      const all = validate(form)
      return { ...prev, ...(all[name] ? { [name]: all[name] } : { [name]: undefined }) }
    })
  }, [form])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    // Mark all fields as touched
    const allTouched = Object.keys(INITIAL).reduce((a, k) => ({ ...a, [k]: true }), {})
    setTouched(allTouched)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    // Simulate async submission
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }, [form])

  const handleReset = useCallback(() => {
    setForm(INITIAL)
    setErrors({})
    setTouched({})
    setSubmitted(false)
  }, [])

  // ── Success screen ────────────────────────────────────────
  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>Message Sent!</h2>
          <p className={styles.successSub}>
            Thanks, <strong>{form.name}</strong>! We've received your message and will
            reply to <strong>{form.email}</strong> within 24 hours.
          </p>
          <button className={styles.resetBtn} onClick={handleReset}>
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  const charLeft = 500 - form.message.length

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerBadge}>💬 Get in Touch</div>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.sub}>
          Have a question, feedback, or just want to say hello? Fill in the form
          below and our team will get back to you shortly.
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Left: info cards ── */}
        <aside className={styles.infoCol}>
          {[
            { icon: '📧', label: 'Email',   value: 'support@smartcart.in' },
            { icon: '📞', label: 'Phone',   value: '+91 98765 43210' },
            { icon: '🕐', label: 'Hours',   value: 'Mon – Sat, 9 am – 6 pm IST' },
            { icon: '📍', label: 'Address', value: '42 Commerce Lane, Bengaluru 560001' },
          ].map(({ icon, label, value }) => (
            <div key={label} className={styles.infoCard}>
              <span className={styles.infoIcon}>{icon}</span>
              <div>
                <p className={styles.infoLabel}>{label}</p>
                <p className={styles.infoValue}>{value}</p>
              </div>
            </div>
          ))}

          <div className={styles.responseCard}>
            <p className={styles.responseTitle}>⚡ Average Response</p>
            <p className={styles.responseVal}>Under 2 hours</p>
            <p className={styles.responseSub}>during business hours</p>
          </div>
        </aside>

        {/* ── Right: form ── */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Send a Message</h2>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            aria-label="Contact form"
          >
            {/* Row: name + email */}
            <div className={styles.row}>
              <Field label="Full Name" required error={errors.name}>
                <input
                  type="text"
                  name="name"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="name"
                  maxLength={60}
                />
              </Field>

              <Field label="Email Address" required error={errors.email}>
                <input
                  type="email"
                  name="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
              </Field>
            </div>

            {/* Row: phone + category */}
            <div className={styles.row}>
              <Field label="Phone Number" error={errors.phone}>
                <input
                  type="tel"
                  name="phone"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="tel"
                  maxLength={16}
                />
              </Field>

              <Field label="Category" required error={errors.category}>
                <select
                  name="category"
                  className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                  value={form.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select a category</option>
                  <option value="order">Order Issue</option>
                  <option value="product">Product Query</option>
                  <option value="return">Return / Refund</option>
                  <option value="payment">Payment Problem</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </div>

            {/* Subject */}
            <Field label="Subject" required error={errors.subject}>
              <input
                type="text"
                name="subject"
                className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
                placeholder="Briefly describe your enquiry…"
                value={form.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={100}
              />
            </Field>

            {/* Message */}
            <Field label="Message" required error={errors.message}>
              <textarea
                name="message"
                className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                placeholder="Tell us more — the more detail you provide, the faster we can help."
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                maxLength={500}
              />
              <span className={`${styles.charCount} ${charLeft < 50 ? styles.charWarn : ''}`}>
                {charLeft} characters remaining
              </span>
            </Field>

            {/* Terms checkbox */}
            <div className={`${styles.checkRow} ${errors.agree ? styles.fieldError : ''}`}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  name="agree"
                  className={styles.checkbox}
                  checked={form.agree}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span>
                  I agree to the{' '}
                  <a href="#terms" className={styles.link} onClick={(e) => e.preventDefault()}>
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className={styles.link} onClick={(e) => e.preventDefault()}>
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agree && (
                <span className={styles.errorMsg} role="alert">{errors.agree}</span>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  '📨 Send Message'
                )}
              </button>

              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleReset}
                disabled={loading}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
