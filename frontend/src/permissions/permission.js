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
}

export default {
  [ROLES.RECRUITER]: [
    PERMISSIONS.READ_POSITIONS,
    PERMISSIONS.READ_POSITION,
    PERMISSIONS.CREATE_POSITIONS,
    PERMISSIONS.UPDATE_POSITIONS,
    PERMISSIONS.CREATE_SKILL,
  ],

  [ROLES.HR]: [
    PERMISSIONS.READ_POSITIONS,
  ],

  [ROLES.INTERVIEWER]: [

  ],

  [ROLES.REVIEWER]: [

  ],

  [ROLES.ADMIN]: [

  ],

  [ROLES.CANDIDATE]: [
    PERMISSIONS.READ_POSITIONS,
    PERMISSIONS.READ_POSITION,
    PERMISSIONS.APPLY_POSITION,
  ],
}