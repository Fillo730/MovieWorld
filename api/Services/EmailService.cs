using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MovieWorld.IServices;

namespace MovieWorld.Services;

public class EmailService(IConfiguration configuration, ILogger<EmailService> logger) : IEmailService
{
    private readonly IConfiguration _configuration = configuration;
    private readonly ILogger<EmailService> _logger = logger;

    public async Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody)
    {
        var host = _configuration["Email:Host"];
        var username = _configuration["Email:Username"];
        var password = _configuration["Email:Password"];

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            _logger.LogWarning("Email non inviata a {ToEmail}: configurazione SMTP mancante.", toEmail);
            return;
        }

        try
        {
            var port = int.Parse(_configuration["Email:Port"] ?? "587");
            var fromAddress = _configuration["Email:FromAddress"];
            var fromName = _configuration["Email:FromName"] ?? "MovieWorld";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, string.IsNullOrWhiteSpace(fromAddress) ? username : fromAddress));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlBody };

            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(username, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante l'invio email a {ToEmail}.", toEmail);
        }
    }
}
