import { useSelector } from "react-redux"
import permissions from "../permissions/permission"
import { selectUserRole } from "../features/auth/authSlice"

const useAccess = () => {
    const userRole = useSelector(selectUserRole)

    const CanAccess = ({permission, children}) => {
        if(!permissions[userRole]) return null
        if(permissions[userRole].includes(permission)) return children
        return null
    }

    const hasRoles = (roles=[]) => {
        roles = roles.map(role => role.toLowerCase())
        if (roles.includes(userRole)) return true
        return false
    }

    const hasPermission = (permission) => {
        if (!permissions[userRole]) return false
        if (permissions[userRole].includes(permission)) return true
        return false
    }
    
    return { CanAccess, hasRoles, hasPermission }
}

export default useAccess