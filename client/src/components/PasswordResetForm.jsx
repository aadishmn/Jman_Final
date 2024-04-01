import React, { useState } from 'react';

const PasswordResetForm = ({ handlePasswordReset }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === confirmPassword) {
        // Call handlePasswordReset function passed from parent component
        await handlePasswordReset(password);
      } else {
        setError('Passwords do not match');
      }
    } catch (error) {
      setError('Password reset failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Display error message if any */}
      {error && <div className="error">{error}</div>}
      <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default PasswordResetForm;
