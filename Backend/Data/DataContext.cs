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

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Recruiter" },
                new Role { Id = 2, Name = "HR" },
                new Role { Id = 3, Name = "Interviewer" },
                new Role { Id = 4, Name = "Reviewer" },
                new Role { Id = 5, Name = "Admin" },
                new Role { Id = 6, Name = "Candidate" }
            );
        }

    }
}