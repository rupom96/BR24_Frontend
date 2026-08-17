import React, { useEffect } from 'react';

// type Props = {};

const CacheBuster = () => {
  useEffect(() => {
    // Check if the cache busting has already been done
    const cacheBusted = localStorage.getItem('cacheBusted');

    if (!cacheBusted) {
      // Generate a unique query string to force reload resources
      const url = window.location.href.split('?')[0]; // Get the current URL without query params
      const uniqueString = `cachebuster=${new Date().getTime()}`; // Generate unique string
      localStorage.setItem('cacheBusted', 'true'); // Set the flag in localStorage

      // Reload the page with the unique query string
      window.location.href = `${url}?${uniqueString}`;
    }
  }, []);

  return null;
};

export default CacheBuster;
