import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '', password: '' }
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const payload = {
        email: (values.email || '').trim(),
        password: values.password || ''
      };
      if (!payload.email || !payload.password) {
        toast.error('Please enter email and password');
        return;
      }
      const { data } = await api.post('/auth/login', payload);
      login(data.token, data.user);
      toast.success('Logged in successfully');
      const role = data.user.role;
      if (role === 'donor') navigate('/donor');
      else if (role === 'requester') navigate('/requester');
      else if (role === 'ngo') navigate('/ngo');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (e) {
      const resp = e?.response?.data;
      if (resp?.errors && Array.isArray(resp.errors)) {
        resp.errors.forEach(er => toast.error(er.msg || 'Validation failed'));
      } else if (resp?.message) {
        toast.error(resp.message);
      } else {
        toast.error('Login failed');
      }
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })} />
          {errors.email && <small className="text-danger">{errors.email.message}</small>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" placeholder="••••••••"
            {...register('password', { required: 'Password is required' })} />
          {errors.password && <small className="text-danger">{errors.password.message}</small>}
        </div>
        <button className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-3">
        <span>New here? </span>
        <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}
