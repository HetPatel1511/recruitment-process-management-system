using Backend.Data;
using Backend.DTOs.AuthDTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Backend.Services.HashHelper;

namespace Backend.Services.Auth
{
  public class AuthService : IAuthService
  {
    private readonly IConfiguration _configuration;
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly IHashHelperService _hashHelperService;

    public AuthService(IConfiguration configuration, DataContext context, IMapper mapper, IHashHelperService hashHelperService)
    {
      _configuration = configuration;
      _context = context;
      _mapper = mapper;
      _hashHelperService = hashHelperService;
    }

    public async Task<UserResponseDTO> RegisterAsync(UserCreateDTO userDto)
    {
      var user = new Entities.User
      {
        Name = userDto.Name,
        Email = userDto.Email,
        Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
        Status = UserStatus.Active
      };
      
      var userExists = await _context.Users
        .AnyAsync(u => u.Email == userDto.Email);

      if (userExists)
      {
        throw new Exception("User with this email already exists");
      }
      user.EmailVerifiedAt = DateTime.UtcNow;
      _context.Users.Add(user);
      await _context.SaveChangesAsync();
      user = await _context.Users
        .Include(u => u.Role)
        .FirstOrDefaultAsync(u => u.Email == userDto.Email);

      return new UserResponseDTO
      {
        Id = user.Id,
        Name = user.Name,
        Email = user.Email,
        Role = _mapper.Map<RoleDTO>(user.Role)
      };
    }

    public async Task<UserResponseDTO> LoginAsync(UserLoginDTO userDto)
    {
      var user = await _context.Users
        .Include(u => u.Role)
        .FirstOrDefaultAsync(u => u.Email == userDto.Email);
      
      if (user == null)
      {
        throw new Exception("User not found");
      }
      
      if (user.Status != UserStatus.Active)
      {
        throw new Exception("Account is inactive.");
      }

      if (!BCrypt.Net.BCrypt.Verify(userDto.Password, user.Password))
      {
        throw new Exception("Invalid password");
      }

      var jwtSettings = _configuration.GetSection("Jwt");

      var payload = new Dictionary<string, object>
      {
        { JwtRegisteredClaimNames.Sub, user.Id },
        { JwtRegisteredClaimNames.Email, user.Email },
        { "role", user.Role.Name.ToLower() },
      };
      
      var accessToken = CreateToken(payload, int.Parse(jwtSettings["ACCESS_TOKEN_EXPIRE_MINUTES"]), "access");
      var refreshToken = CreateToken(payload, int.Parse(jwtSettings["REFRESH_TOKEN_EXPIRE_MINUTES"]), "refresh");
      return new UserResponseDTO
      {
        Id = user.Id,
        Name = user.Name,
        Email = user.Email,
        Role = _mapper.Map<RoleDTO>(user.Role),
        AccessToken = accessToken,
        RefreshToken = refreshToken
      };
    }

    public async Task<RefreshDTO> RefreshAsync(RefreshDTO refreshDto)
    {
      var handler = new JwtSecurityTokenHandler();
      var jwt = handler.ReadJwtToken(refreshDto.RefreshToken);

      var userId = int.Parse(jwt.Claims.FirstOrDefault(c => c.Type == "sub")?.Value);
      if (userId == null)
      {
        throw new Exception("Invalid refresh token");
      }
      var user = await _context.Users
        .Include(u => u.Role)
        .FirstOrDefaultAsync(u => u.Id == userId);

      if (user == null)
      {
        throw new Exception("User not found");
      }

      if (user.Status != UserStatus.Active)
      {
        throw new Exception("Account is inactive.");
      }

      var payload = new Dictionary<string, object>
      {
        { JwtRegisteredClaimNames.Sub, user.Id },
        { JwtRegisteredClaimNames.Email, user.Email },
        { "role", user.Role.Name.ToLower() },
      };
      
      var jwtSettings = _configuration.GetSection("Jwt");
      var accessToken = CreateToken(payload, int.Parse(jwtSettings["ACCESS_TOKEN_EXPIRE_MINUTES"]), "access");
      var refreshToken = CreateToken(payload, int.Parse(jwtSettings["REFRESH_TOKEN_EXPIRE_MINUTES"]), "refresh");

      return new RefreshDTO
      {
        AccessToken = accessToken,
        RefreshToken = refreshToken
      };
    }

    public async Task<string> ActivateAsync(ActivateDTO activateDto)
    {
      var hashedToken = _hashHelperService.ComputeHash(activateDto.Token);
      
      var token = await _context.Tokens
          .Include(t => t.User)
          .FirstOrDefaultAsync(t => t.TokenHash == hashedToken && 
                                t.Type == TokenType.Invite && 
                                t.ExpiresAt > DateTime.UtcNow &&
                                t.UsedAt == null);

      if (token == null || token.User == null)
      {
        throw new Exception("Invalid or expired token");
      }

      var user = token.User;
      user.Password = BCrypt.Net.BCrypt.HashPassword(activateDto.Password);
      user.EmailVerifiedAt = DateTime.UtcNow;
      user.Status = UserStatus.Active;
      
      token.UsedAt = DateTime.UtcNow;
      
      await _context.SaveChangesAsync();
      return "Account activated successfully";
    }

    public string CreateToken(Dictionary<string, object> payload, int expireMinutes, string tokenUse)
    {
        var jwtSettings = _configuration.GetSection("Jwt");

        var issuer = jwtSettings["JWT_ISSUER"];
        var audience = jwtSettings["JWT_AUDIENCE"];
        var secret = jwtSettings["JWT_SECRET"];

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>();
        foreach (var kvp in payload)
        {
            claims.Add(new Claim(kvp.Key, kvp.Value.ToString()));
        }

        claims.Add(new Claim("token_use", tokenUse));

        claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expireMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}


