namespace Backend.Services.HashHelper
{
    public interface IHashHelperService
    {
        string ComputeHash(string input);
        bool VerifyHash(string input, string hash);
    }
}
