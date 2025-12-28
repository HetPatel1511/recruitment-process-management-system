using Backend.DTOs.EmailDTOs;

namespace Backend.Services.Email
{
  public interface IEmailService
  {
    Task<bool> SendEmailAsync(EmailDTO emailDTO);
  }
}