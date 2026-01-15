class OTPHelper {
  // Generate 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Validate OTP format
  static isValidOTP(otp) {
    return /^\d{6}$/.test(otp);
  }

  // Generate OTP expiration time (10 minutes from now)
  static getExpirationTime() {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }

  // Check if OTP is expired
  static isExpired(expirationTime) {
    return new Date() > new Date(expirationTime);
  }
}

module.exports = OTPHelper;