using System;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services.HashHelper
{
    public class HashHelperService : IHashHelperService
    {
      private readonly byte[] _secretKey;

        public HashHelperService(IConfiguration configuration)
        {
            _secretKey = Encoding.UTF8.GetBytes(
                configuration["Security:TokenHashSecret"]);
        }

        public string ComputeHash(string token)
        {
          if (string.IsNullOrEmpty(token))
            throw new Exception("Token cannot be null or empty");
          
          using var hmac = new HMACSHA256(_secretKey);
          return Convert.ToBase64String(
              hmac.ComputeHash(Encoding.UTF8.GetBytes(token)));
        }

        public bool VerifyHash(string input, string hash)
        {
            if (string.IsNullOrEmpty(input))
                throw new Exception("Input cannot be null or empty");
            if (string.IsNullOrEmpty(hash))
                throw new Exception("Hash cannot be null or empty");

            var computedHash = ComputeHash(input);
            return computedHash == hash;
        }
    }
}
