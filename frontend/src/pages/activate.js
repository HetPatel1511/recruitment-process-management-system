import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { activateAccount } from '../features/auth/authApi';
import { logout } from '../features/auth/authSlice';

export const Activate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activateAccountStatus, setActivateAccountStatus] = useState('idle');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    token: ''
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    dispatch(logout());
  }, []);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setFormData(prev => ({ ...prev, token }));
    } else {
      navigate('/auth/login');
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      try {
        setActivateAccountStatus('loading');
        await dispatch(activateAccount({
          token: formData.token,
          password: formData.password
        })).unwrap();
        setActivateAccountStatus('succeeded');
        // navigate('/auth/login');
      } catch (err) {
        setActivateAccountStatus('failed');
        setErrors({
          ...formErrors,
          apiError: err?.data?.message || 'Activation failed. The link may be invalid or expired.'
        });
      }
    } else {
      setErrors(formErrors);
    }
  };

  if (activateAccountStatus==='succeeded') {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Account Activated!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your account has been activated successfully. You can now log in.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create a new password for your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="token" value={formData.token} />
            
            <FormInput
              id="password"
              name="password"
              type="password"
              label="New Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={activateAccountStatus==='loading'}
              autoComplete="new-password"
              placeholder="Enter your new password"
              required
            />

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={activateAccountStatus==='loading'}
              autoComplete="new-password"
              placeholder="Confirm your new password"
              required
            />

            {errors.apiError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.apiError}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={activateAccountStatus==='loading'}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  activateAccountStatus==='loading' ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {activateAccountStatus==='loading' ? 'Activating...' : 'Activate Account'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
