import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/useAuth.js';
import api from '../services/api.js';

const initialValues = {
  name: '',
  email: '',
  password: '',
  role: 'student',
};

function validate(values) {
  const nextErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.name.trim()) {
    nextErrors.name = 'Name is required';
  }

  if (!values.email.trim()) {
    nextErrors.email = 'Email is required';
  } else if (!emailRegex.test(values.email)) {
    nextErrors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    nextErrors.password = 'Password is required';
  } else if (values.password.length < 6) {
    nextErrors.password = 'Password must be at least 6 characters';
  }

  if (!['student', 'admin'].includes(values.role)) {
    nextErrors.role = 'Select a valid role';
  }

  return nextErrors;
}

function Register() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { data } = await api.post('/auth/register', values);
      const token = data.token;
      const user = data.user;

      if (!token || !user?.role) {
        throw new Error('Invalid register response');
      }

      login({ token, user });
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard', {
        replace: true,
      });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          'Registration failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Register as a student or admin for CCMS access.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Input
            error={errors.name}
            id="register-name"
            label="Name"
            name="name"
            onChange={handleChange}
            placeholder="Your full name"
            value={values.name}
          />
          <Input
            error={errors.email}
            id="register-email"
            label="Email"
            name="email"
            onChange={handleChange}
            placeholder="name@campus.edu"
            type="email"
            value={values.email}
          />
          <Input
            error={errors.password}
            id="register-password"
            label="Password"
            name="password"
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            type="password"
            value={values.password}
          />

          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="register-role"
            >
              Role
            </label>
            <select
              className={`mt-2 w-full rounded-md border bg-white px-3 py-2 text-slate-950 shadow-sm outline-none transition focus:ring-2 ${
                errors.role
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
              id="register-role"
              name="role"
              onChange={handleChange}
              value={values.role}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role ? (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            ) : null}
          </div>

          {submitError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </p>
          ) : null}

          <button
            className="w-full rounded-md bg-blue-700 px-4 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            className="font-medium text-blue-700 hover:text-blue-900"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
