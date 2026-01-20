import React, { useState, useEffect } from 'react';

export default function PaymentModal({ isOpen, onClose, course, onPaymentSuccess }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'validating', 'processing', 'verifying', 'finalizing', 'success', 'failed'
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.replace(/\s/g, '').length <= 16) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    // Format expiry date (MM/YY)
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    // Format CVV (max 4 digits)
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 4);
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!formData.cardholderName || formData.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.billingAddress || formData.billingAddress.trim().length < 5) {
      newErrors.billingAddress = 'Please enter billing address';
    }

    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = 'Please enter city';
    }

    if (!formData.zipCode || formData.zipCode.trim().length < 4) {
      newErrors.zipCode = 'Please enter a valid zip code';
    }

    if (!formData.country || formData.country.trim().length < 2) {
      newErrors.country = 'Please enter country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processFakePayment = async (cardNumber) => {
    // Simulate different payment scenarios based on card number
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    // Step 1: Validating card information
    setProcessingStatus('Validating card information...');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    // Check card format
    if (cleanCardNumber.length !== 16) {
      throw new Error('Invalid card number. Please check and try again.');
    }
    
    // Check for declined cards
    if (cleanCardNumber === '4000000000000002') {
      setProcessingStatus('Card declined by issuer...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error('Your card was declined. Please try a different payment method.');
    }
    
    if (cleanCardNumber === '4000000000009995') {
      setProcessingStatus('Checking account balance...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error('Insufficient funds. Please use a different card.');
    }
    
    // Step 2: Processing payment
    setProcessingStatus('Processing payment with bank...');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Step 3: Verifying transaction
    setProcessingStatus('Verifying transaction...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Step 4: Finalizing
    setProcessingStatus('Finalizing your purchase...');
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Generate fake transaction details
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const authCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    
    return {
      success: true,
      transactionId,
      authCode,
      amount: course.price,
      timestamp: new Date().toISOString(),
      paymentMethod: 'card',
      last4: cleanCardNumber.slice(-4),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStep('validating');
    setProcessingStatus('Starting payment process...');

    // Simulate fake payment processing with multiple steps
    try {
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      
      // Step 1: Validating
      setPaymentStep('validating');
      setProcessingStatus('Validating card information...');
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Step 2: Processing
      setPaymentStep('processing');
      setProcessingStatus('Processing payment with bank...');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Step 3: Verifying
      setPaymentStep('verifying');
      setProcessingStatus('Verifying transaction...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Actually process payment (this will set processing status internally)
      const paymentResult = await processFakePayment(cleanCardNumber);
      
      // Step 4: Finalizing
      setPaymentStep('finalizing');
      setProcessingStatus('Finalizing your purchase...');
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setPaymentDetails(paymentResult);
      setPaymentStep('success');
      
      // Wait a bit to show success message
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Payment successful - call callback
      if (onPaymentSuccess) {
        onPaymentSuccess({
          courseId: course._id || course.id,
          amount: course.price,
          paymentMethod: 'card',
          transactionId: paymentResult.transactionId,
          ...paymentResult,
        });
      }

      // Reset form and close modal
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        email: '',
        billingAddress: '',
        city: '',
        zipCode: '',
        country: '',
      });
      setErrors({});
      setPaymentStep('form');
      setPaymentDetails(null);
      setProcessingStatus('');
      setIsProcessing(false);
      onClose();
    } catch (error) {
      setPaymentStep('failed');
      setErrors({ payment: error.message });
      setProcessingStatus('');
      console.error('Payment error:', error);
      
      // Reset to form after showing error
      setTimeout(() => {
        setPaymentStep('form');
        setIsProcessing(false);
        setProcessingStatus('');
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Course Summary */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.category} • {course.difficulty}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">${course.price}</p>
            </div>
          </div>
        </div>

        {/* Payment Processing Screens */}
        {(paymentStep === 'validating' || paymentStep === 'processing' || paymentStep === 'verifying' || paymentStep === 'finalizing') && (
          <div className="px-6 py-12 text-center">
            <div className="mb-6">
              <svg className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {paymentStep === 'validating' && 'Validating Card Information'}
                {paymentStep === 'processing' && 'Processing Payment'}
                {paymentStep === 'verifying' && 'Verifying Transaction'}
                {paymentStep === 'finalizing' && 'Finalizing Purchase'}
              </h3>
              <p className="text-gray-600 mb-4">{processingStatus || 'Please wait while we process your payment'}</p>
              
              {/* Progress indicators */}
              <div className="flex justify-center gap-2 mt-6">
                <div className={`w-3 h-3 rounded-full ${paymentStep === 'validating' ? 'bg-blue-600' : paymentStep !== 'form' && paymentStep !== 'failed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${paymentStep === 'processing' ? 'bg-blue-600' : paymentStep === 'verifying' || paymentStep === 'finalizing' || paymentStep === 'success' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${paymentStep === 'verifying' ? 'bg-blue-600' : paymentStep === 'finalizing' || paymentStep === 'success' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${paymentStep === 'finalizing' ? 'bg-blue-600' : paymentStep === 'success' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Success Screen */}
        {paymentStep === 'success' && paymentDetails && (
          <div className="px-6 py-12 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">Your payment has been processed successfully</p>
              
              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-semibold text-gray-800">{paymentDetails.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Authorization Code:</span>
                    <span className="font-semibold text-gray-800">{paymentDetails.authCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-800">${paymentDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card:</span>
                    <span className="font-semibold text-gray-800">**** **** **** {paymentDetails.last4}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-green-600">✓ Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Failed Screen */}
        {paymentStep === 'failed' && (
          <div className="px-6 py-12 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-4">{errors.payment || 'Your payment could not be processed'}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPaymentStep('form');
                setIsProcessing(false);
                setErrors({});
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Payment Form */}
        {paymentStep === 'form' && (
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {/* Card Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Card Details</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
              )}
            </div>
          </div>

          {/* Billing Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Address
              </label>
              <input
                type="text"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleChange}
                placeholder="123 Main Street"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.billingAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.billingAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.billingAddress}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-800">
                Your payment information is secure and encrypted. We use industry-standard security measures to protect your data.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay $${course.price}`
              )}
            </button>
          </div>
          {errors.payment && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.payment}</p>
            </div>
          )}
        </form>
        )}
      </div>
    </div>
  );
}
