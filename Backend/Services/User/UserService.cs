using AutoMapper;
using Backend.Data;
using Backend.DTOs.AuthDTOs;
using Backend.DTOs.UserDTOs;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.User
{
  public class UserService : IUserService
  {
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public UserService(DataContext context, IMapper mapper, IConfiguration configuration)
    {
        _context = context;
        _mapper = mapper;
        _configuration = configuration;
    }
    
    public async Task<UserResponseDTO> GetMyUserAsync(int id)
    {
      var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
      if (user == null)
      {
        throw new Exception("User not found");
      }

      return _mapper.Map<UserResponseDTO>(user);
    }

    public async Task<UserResponseDTO> UpdateMyUserAsync(int id, UpdateUserServiceDTO updateUserDTO)
    {
      var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
      if (user == null)
      {
        throw new Exception("User not found");
      }

      if (!string.IsNullOrEmpty(updateUserDTO.ImageUrl) && !updateUserDTO.ImageUrl.StartsWith("http"))
      {
        var baseUrl = _configuration["AppSettings:BaseUrl"];
        updateUserDTO.ImageUrl = $"{baseUrl}/Resources/{updateUserDTO.ImageUrl}";
      }

      _mapper.Map(updateUserDTO, user);
      user.UpdatedAt = DateTime.UtcNow;

      await _context.SaveChangesAsync();
      return _mapper.Map<UserResponseDTO>(user);
    }
  }
}