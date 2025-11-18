using AutoMapper;
using Backend.DTOs.AuthDTOs;
using Backend.DTOs.PositionDTOs;
using Backend.Entities;

namespace Backend.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // User mappings
            CreateMap<User, UserDTO>();
            CreateMap<User, UserResponseDTO>();
            CreateMap<UserDTO, User>();
            CreateMap<Role, RoleDTO>();
            
            // Position mappings
            CreateMap<Position, PositionResponseDTO>();
            CreateMap<CreatePositionDTO, Position>();
            CreateMap<UpdatePositionDTO, Position>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
