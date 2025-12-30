using Microsoft.EntityFrameworkCore;
using Backend.Entities;

namespace Backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<AuthPosition> AuthPositions { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<PositionSkill> PositionSkills { get; set; }
        public DbSet<UserSkill> UserSkills { get; set; }
        public DbSet<Token> Tokens { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany()
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .Property(u => u.RoleId)
                .HasDefaultValue(6);

            modelBuilder.Entity<Position>()
                .HasOne(p => p.Recruiter)
                .WithMany()
                .HasForeignKey(p => p.RecruiterId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Recruiter" },
                new Role { Id = 2, Name = "HR" },
                new Role { Id = 3, Name = "Interviewer" },
                new Role { Id = 4, Name = "Reviewer" },
                new Role { Id = 5, Name = "Admin" },
                new Role { Id = 6, Name = "Candidate" }
            );

            modelBuilder.Entity<AuthPosition>()
                .HasKey(up => new { up.UserId, up.PositionId });

            modelBuilder.Entity<AuthPosition>()
                .HasOne(p => p.User)
                .WithMany(p => p.AuthPositions)
                .HasForeignKey(ap => ap.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AuthPosition>()
                .HasOne(p => p.Position)
                .WithMany(p => p.AuthPositions)
                .HasForeignKey(ap => ap.PositionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PositionSkill>()
                .HasKey(ps => new { ps.PositionId, ps.SkillId });

            modelBuilder.Entity<PositionSkill>()
                .HasOne(ps => ps.Position)
                .WithMany(p => p.PositionSkills)
                .HasForeignKey(ps => ps.PositionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PositionSkill>()
                .HasOne(ps => ps.Skill)
                .WithMany(s => s.PositionSkills)
                .HasForeignKey(ps => ps.SkillId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserSkill>()
                .HasKey(us => new { us.UserId, us.SkillId });

            modelBuilder.Entity<UserSkill>()
                .HasOne(us => us.User)
                .WithMany(u => u.UserSkills)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserSkill>()
                .HasOne(us => us.Skill)
                .WithMany(s => s.UserSkills)
                .HasForeignKey(us => us.SkillId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Token>()
                .HasOne(t => t.User)
                .WithMany(u => u.Tokens)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}