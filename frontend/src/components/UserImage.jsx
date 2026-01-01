import React from 'react'
import userPlaceholderImage from '../user-placeholder-image.png'

export const UserImage = ({ src, alt="", className="", ...props }) => {
  return (
    <>
    {src ? 
      <img
        className={className}
        src={src}
        alt={alt}
        {...props}
      /> :
      <img
        className={className}
        src={userPlaceholderImage}
        alt={alt}
        {...props}
      />
    }
    </>
  )
}
