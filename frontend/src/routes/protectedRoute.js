import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import useAccess from '../hooks/useAccess'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export const ProtectedRoute = ({
  children,
  permission,
  roles = []
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { hasRoles, hasPermission } = useAccess()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    if (permission && !hasPermission(permission)) {
      toast.error("You don't have access to this page")
      navigate('/', { replace: true })
    }

    if (roles.length > 0 && !hasRoles(roles)) {
      toast.error("You don't have access to this page")
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, roles, hasRoles, navigate])

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (permission && !hasPermission(permission)) {
    return null
  }

  if (roles.length > 0 && !hasRoles(roles)) {
    return null
  }

  return children
}
