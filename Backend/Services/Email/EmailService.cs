using Backend.DTOs.EmailDTOs;
using Backend.DTOs.MailSettingsDTOs;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Backend.Services.Email
{
  public class EmailService : IEmailService
  {
    private MailSettingsDTO _mailSettings;
    public EmailService(IOptions<MailSettingsDTO> mailSettings)
    {
      _mailSettings = mailSettings.Value;
    }
    public async Task<bool> SendEmailAsync(EmailDTO emailDTO)
    {
      var message = new MimeMessage();
      var emailFrom = new MailboxAddress(_mailSettings.Name, _mailSettings.EmailId);
      message.From.Add(emailFrom);
      var emailTo = new MailboxAddress(emailDTO.Name, emailDTO.Email);
      message.To.Add(emailTo);
      message.Subject = emailDTO.Subject;
      message.Body = new TextPart("html") { Text = emailDTO.Body };
      
      var MailClient = new SmtpClient();
      await MailClient.ConnectAsync(_mailSettings.Host, _mailSettings.Port, _mailSettings.UseSSL);
      await MailClient.AuthenticateAsync(_mailSettings.EmailId, _mailSettings.Password);
      await MailClient.SendAsync(message);
      await MailClient.DisconnectAsync(true);
      MailClient.Dispose();
      return true;
    }
  }
}