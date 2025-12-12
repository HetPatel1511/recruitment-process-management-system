using AutoMapper;
using Backend.Data;
using Backend.DTOs.AuthDTOs;
using Backend.DTOs.UserDTOs;
using Backend.Services.FileHandling;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.User
{
  public class UserService : IUserService
  {
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly IFileService _fileService;

    public UserService(DataContext context, IMapper mapper, IConfiguration configuration, IFileService fileService)
    {
        _context = context;
        _mapper = mapper;
        _configuration = configuration;
        _fileService = fileService;
    }
    
    public async Task<List<UserResponseDTO>> GetUsersAsync()
    {
      var users = await _context.Users.Include(u => u.Role).OrderBy(u => u.Id).ToListAsync();
      return _mapper.Map<List<UserResponseDTO>>(users);
    }

    public async Task<UserResponseDTO> GetUserAsync(int id)
    {
      var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
      if (user == null)
      {
        throw new Exception("User not found");
      }

      return _mapper.Map<UserResponseDTO>(user);
    }

    public async Task<UserResponseDTO> UpdateUserAsync(int id, UpdateUserServiceDTO updateUserDTO)
    {
      var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
      if (user == null)
      {
        throw new Exception("User not found");
      }

      var old_image_url = user.ImageUrl;
      if (!string.IsNullOrEmpty(updateUserDTO.ImageUrl) && !updateUserDTO.ImageUrl.StartsWith("http"))
      {
        var baseUrl = _configuration["AppSettings:BaseUrl"];
        updateUserDTO.ImageUrl = $"{baseUrl}/Resources/{updateUserDTO.ImageUrl}";
      }

      _mapper.Map(updateUserDTO, user);
      user.UpdatedAt = DateTime.UtcNow;

      if (old_image_url != null && old_image_url != user.ImageUrl)
      {
        _fileService.DeleteFile(old_image_url.Replace($"{_configuration["AppSettings:BaseUrl"]}/Resources/", ""));
      }
      await _context.SaveChangesAsync();
      return _mapper.Map<UserResponseDTO>(user);
    }
  
    public async Task<UserResponseDTO> UpdateUserRoleAsync(int id, UpdateUserRoleDTO updateUserRoleDto)
    {
      var user = await _context.Users.FirstOrDefaultAsync(u => u.Id==id);
      if (user == null) {
        throw new Exception("User not found");
      }

      var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id==updateUserRoleDto.Id);
      if (role == null) {
        throw new Exception("Role not found");
      }
      user.RoleId = updateUserRoleDto.Id;
      await _context.SaveChangesAsync();
      
      // var responseUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id==id);
      return _mapper.Map<UserResponseDTO>(user);
    }
  }
}