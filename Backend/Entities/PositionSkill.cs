namespace Backend.Entities
{
  public class PositionSkill
  {
    public int Id { get; set; }
    public int PositionId { get; set; }
    public int SkillId { get; set; }
    public Position Position { get; set; }
    public Skill Skill { get; set; }
  }
}