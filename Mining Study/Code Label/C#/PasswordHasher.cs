using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Runtime.CompilerServices;

// Written mostly by ChatGPT
namespace BudgetWatcher.Models
{
    public class PasswordHasher
    {
        private const int HashSize = 32;
        private const int Iterations = 10000;

        public static string HashPassword(SecureString securePassword, string saltBase64)
        {
            byte[] salt = Convert.FromBase64String(saltBase64);

            int SaltSize = salt.Length;


            byte[] passwordBytes;

            IntPtr ptr = Marshal.SecureStringToBSTR(securePassword);
            try
            {
                passwordBytes = new byte[securePassword.Length * 2];
                Marshal.Copy(ptr, passwordBytes, 0, passwordBytes.Length);
            }
            finally
            {
                Marshal.ZeroFreeBSTR(ptr);
            }

            var pbkdf2 = new Rfc2898DeriveBytes(passwordBytes, salt, Iterations);
            byte[] hash = pbkdf2.GetBytes(HashSize);

            byte[] hashBytes = new byte[SaltSize + HashSize];
            Array.Copy(salt, 0, hashBytes, 0, SaltSize);
            Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);

            string hashedPassword = Convert.ToBase64String(hashBytes);

            return hashedPassword;
        }

        public static string GenerateSaltBase64()
        {
            byte[] saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }
    }


}
