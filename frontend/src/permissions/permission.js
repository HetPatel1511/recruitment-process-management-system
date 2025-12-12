export const ROLES = {
  RECRUITER: 'recruiter',
  HR: 'hr',
  INTERVIEWER: 'interviewer',
  REVIEWER: 'reviewer',
  ADMIN: 'admin',
  CANDIDATE: 'candidate',
}

export const PERMISSIONS = {
  // Positions
  READ_POSITIONS: 'positions.read',
  READ_POSITION: 'position.read',
  CREATE_POSITIONS: 'positions.create',
  APPLY_POSITION: 'positions.apply',
  UPDATE_POSITIONS: 'positions.update',

  // Skills
  CREATE_SKILL: 'skills.create',
  LINK_SKILLS_TO_POSITION: 'skills.link.position',
  LINK_SKILLS_TO_USER: 'skills.link.user',

  // Users
  READ_USERS: 'users.read',
  READ_USER: 'user.read',
  UPDATE_USER: 'user.update',
}

export default {
  [ROLES.RECRUITER]: [
    PERMISSIONS.READ_POSITIONS,
    PERMISSIONS.READ_POSITION,
    PERMISSIONS.CREATE_POSITIONS,
    PERMISSIONS.UPDATE_POSITIONS,
    PERMISSIONS.CREATE_SKILL,
    PERMISSIONS.LINK_SKILLS_TO_POSITION,
    PERMISSIONS.UPDATE_USER,
  ],

  [ROLES.HR]: [
    PERMISSIONS.READ_POSITIONS,
    PERMISSIONS.UPDATE_USER,
  ],

  [ROLES.INTERVIEWER]: [

  ],

  [ROLES.REVIEWER]: [

  ],

  [ROLES.ADMIN]: [
    PERMISSIONS.READ_USERS,
  ],

  [ROLES.CANDIDATE]: [
    PERMISSIONS.READ_POSITIONS,
    PERMISSIONS.READ_POSITION,
    PERMISSIONS.APPLY_POSITION,
    PERMISSIONS.LINK_SKILLS_TO_USER,
    PERMISSIONS.UPDATE_USER,
  ],
}