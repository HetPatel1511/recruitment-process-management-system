using System;
using Backend.DTOs.AuthDTOs;

namespace Backend.DTOs.PositionDTOs
{
    public class PositionApplicationDTO
    {
        public int Id { get; set; }
        public UserResponseDTO? User { get; set; }
        public PositionResponseDTO? Position { get; set; }
        public DateTime AppliedAt { get; set; }
    }
}
