import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { autofillUserCoords } from '../utils/geolocate';

export default function Register() {
  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      role: 'requester',
      location: {
        address: '',
        coordinates: { latitude: 0, longitude: 0 }
      }
    }
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const role = watch('role');

  const onSubmit = async (values) => {
    try {
      // ensure numbers
      values.location.coordinates.latitude = parseFloat(values.location.coordinates.latitude);
      values.location.coordinates.longitude = parseFloat(values.location.coordinates.longitude);
      const { data } = await api.post('/auth/register', values);
      toast.success('Registered successfully');
      login(data.token, data.user);
      if (values.role === 'donor') navigate('/donor');
      else if (values.role === 'ngo') navigate('/ngo');
      else navigate('/requester');
      reset();
    } catch (e) {
      // handled by interceptor
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h2 className="mb-4">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input className="form-control" {...register('name', { required: 'Name is required', minLength: 2 })} />
            {errors.name && <small className="text-danger">{errors.name.message}</small>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Role</label>
            <select className="form-select" {...register('role', { required: true })}>
              <option value="donor">Donor</option>
              <option value="requester">Requester</option>
              <option value="ngo">NGO</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" {...register('email', { required: 'Email is required' })} />
            {errors.email && <small className="text-danger">{errors.email.message}</small>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input className="form-control" placeholder="10-digit"
              {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid phone' } })} />
            {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" {...register('password', { required: 'Password is required', minLength: 6 })} />
            {errors.password && <small className="text-danger">{errors.password.message}</small>}
          </div>

          {role === 'donor' && (
            <div className="col-md-6">
              <label className="form-label">Business Type</label>
              <select className="form-select" {...register('businessType', { required: 'Business type is required' })}>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hotel</option>
                <option value="grocery_store">Grocery Store</option>
                <option value="other">Other</option>
              </select>
              {errors.businessType && <small className="text-danger">{errors.businessType.message}</small>}
            </div>
          )}

          {role === 'ngo' && (
            <>
              <div className="col-md-6">
                <label className="form-label">Organization Name</label>
                <input className="form-control" {...register('organizationName', { required: 'Organization name is required' })} />
                {errors.organizationName && <small className="text-danger">{errors.organizationName.message}</small>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Registration Number</label>
                <input className="form-control" {...register('registrationNumber', { required: 'Registration number is required' })} />
                {errors.registrationNumber && <small className="text-danger">{errors.registrationNumber.message}</small>}
              </div>
            </>
          )}

          <div className="col-12">
            <label className="form-label">Address</label>
            <input className="form-control" {...register('location.address', { required: 'Address is required' })} />
            {errors.location?.address && <small className="text-danger">{errors.location.address.message}</small>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Latitude</label>
            <input className="form-control" type="number" step="any" {...register('location.coordinates.latitude', { required: 'Latitude is required' })} />
            {errors.location?.coordinates?.latitude && <small className="text-danger">{errors.location.coordinates.latitude.message}</small>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Longitude</label>
            <input className="form-control" type="number" step="any" {...register('location.coordinates.longitude', { required: 'Longitude is required' })} />
            {errors.location?.coordinates?.longitude && <small className="text-danger">{errors.location.coordinates.longitude.message}</small>}
          </div>

          <div className="col-12">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={async()=>{
              try {
                const { latitude, longitude } = await autofillUserCoords((field, val)=>setValue(field, val));
                toast.info(`GPS set to ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              } catch (e) {
                toast.error('Unable to get GPS location');
              }
            }}>Use GPS</button>
          </div>

          <div className="col-12">
            <button className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
            <Link className="btn btn-link" to="/login">Back to Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
